// ==UserScript==
// @name         DiscordVMSG
// @namespace    None
// @version      0.2
// @language     English
// @description  Voice Message using Discord liek snapchat. Hold the microphone button next to the chat bar to create a voice chat.
// @author       xPythh
// @match        https://discord.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424962/DiscordVMSG.user.js
// @updateURL https://update.greasyfork.org/scripts/424962/DiscordVMSG.meta.js
// ==/UserScript==
    var checkIfReadyInterval;
    var microphonePicture;
    var startedAt;
    var isTalking = false;

    var leftchannel = [];
    var rightchannel = [];
    var recorder = null;
    var recordingLength = 0;
    var volume = null;
    var mediaStream = null;
    var sampleRate = 48000; // voice pitch need to be edited according to microphone, increase if its too dark, or decrease it if too hight
    var context = null;
    var voiceBlob;

    var localStorage;
    // Chat Bar is dynamic and "reinitialised" between each browsing page, so we need to constantly insert it, if doesn't exist
    function attachMicrophoneButton()
    {
        if (!document.getElementById("chatTalkButton"))
        {
            var mainDiv = document.createElement('div');// Main Button Div
            mainDiv.id = "chatTalkButton";
            mainDiv.classList.add('button-3AYNKb');
            mainDiv.classList.add('button-318s1X');

            var mainButton = document.createElement('button');// Button itself
            mainButton.type = "button";
            mainButton.classList.add('button-14-BFJ');
            mainButton.classList.add('enabled-2cQ-u7');
            mainButton.classList.add('lookBlank-3eh9lL');

            var secondDiv = document.createElement('div');// Div containing the Logo
            secondDiv.classList.add('contents-18-Yxp');

            var buttonLogo = new Image(); // Microphone Logo
            var cantTalk = document.querySelector(".channelTextAreaDisabled-8rmlrp");
            var canSendFiles = document.querySelector(".attachButton-2WznTc");
            if (!cantTalk && canSendFiles) {
                buttonLogo.src = "https://i.imgur.com/FdJV697.png"; // Can send files and talk in chat
            } else {
                buttonLogo.src = "https://i.imgur.com/2o7DvgF.png"; // Can't send messages / Files
            }
            buttonLogo.setAttribute('draggable', false);
            microphonePicture = buttonLogo;
            secondDiv.appendChild(buttonLogo);
            mainButton.appendChild(secondDiv);
            mainDiv.appendChild(mainButton);

            // Check if the chatbox exists before creating any element (Else will break up Discord Interface)
            var chatTools = document.querySelector(".buttons-3JBrkn");
            if (chatTools)
            {
                var microphoneButton = document.body.appendChild(mainDiv);
                chatTools.insertBefore(microphoneButton, chatTools.firstChild);
                if (!cantTalk) microphoneButton.addEventListener('mousedown', function(event)
                {
                  isTalking = true;
                  startedAt = Date.now();
                  microphonePicture.src = "https://i.imgur.com/bx2hCl3.gif";
                  startRecording();
                });
                // Passing trought document, then user can leave the button rectangle
                document.addEventListener('mouseup', function(event)
                {
                    if (!isTalking) return;
                    microphonePicture.src = "https://i.imgur.com/FdJV697.png";
                    stopRecording();
                    if (Date.now() - startedAt < 500) return; // Message too short, let's not send that

                    var xhr = new XMLHttpRequest();
                    var fd = new FormData();
                    fd.append("audio_data", voiceBlob , `VMSG_${Date.now() / 1000}.wav`);
                    var channelsData = location.href.match(/channels\/([\w@]+)\/(\d+)/);
                    var channelId = channelsData[2]
                    xhr.open("POST",`https://discord.com/api/v8/channels/${channelId}/messages`, true);
                    xhr.setRequestHeader("Authorization", JSON.parse(localStorage.token));
                    xhr.send(fd);

                    // Reinitialise Every vocal variables
                    isTalking = false;
                    voiceBlob = null;
                    leftchannel = [];
                    rightchannel = [];
                    recordingLength = 0;
                });
            }
        }
    }


    function flattenArray(channelBuffer, recordingLength) {
            var result = new Float32Array(recordingLength);
            var offset = 0;
            for (var i = 0; i < channelBuffer.length; i++) {
                var buffer = channelBuffer[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        }
    function interleave(leftChannel, rightChannel) {
            var length = leftChannel.length + rightChannel.length;
            var result = new Float32Array(length);
            var inputIndex = 0;
            for (var index = 0; index < length;) {
                result[index++] = leftChannel[inputIndex];
                result[index++] = rightChannel[inputIndex];
                inputIndex++;
            }
            return result;
        }
    function writeUTFBytes(view, offset, string) {
        for (var i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    }
    function startRecording() {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({audio: true},
            function (e) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();
                mediaStream = context.createMediaStreamSource(e);
                var bufferSize = 2048;
                var numberOfInputChannels = 2;
                var numberOfOutputChannels = 2;
                if (context.createScriptProcessor) {
                    recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
                } else {
                    recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
                }

                recorder.onaudioprocess = function (e) {
                    leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
                    rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
                    recordingLength += bufferSize;
                }
                mediaStream.connect(recorder);
                recorder.connect(context.destination);
            },function (e) {});
    }
    function stopRecording() {
        if (!recorder) return;
         recorder.disconnect(context.destination);
         mediaStream.disconnect(recorder);
         var leftBuffer = flattenArray(leftchannel, recordingLength);
         var rightBuffer = flattenArray(rightchannel, recordingLength);
         var interleaved = interleave(leftBuffer, rightBuffer);
         var buffer = new ArrayBuffer(44 + interleaved.length * 2);
         var view = new DataView(buffer);
         writeUTFBytes(view, 0, 'RIFF');
         view.setUint32(4, 44 + interleaved.length * 2, true);
         writeUTFBytes(view, 8, 'WAVE');
         writeUTFBytes(view, 12, 'fmt ');
         view.setUint32(16, 16, true); // chunkSize
         view.setUint16(20, 1, true); // wFormatTag
         view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
         view.setUint32(24, sampleRate, true); // dwSamplesPerSec
         view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
         view.setUint16(32, 4, true); // wBlockAlign
         view.setUint16(34, 16, true); // wBitsPerSample
         writeUTFBytes(view, 36, 'data');
         view.setUint32(40, interleaved.length * 2, true);
         var index = 44;
         var volume = 1;
         for (var i = 0; i < interleaved.length; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
         }
            voiceBlob = new Blob([view], { type: 'audio/wav' });
        }
    function checkIfReady() {
        if (document.querySelector(".buttons-3JBrkn"))
        {
          window.dispatchEvent(new Event('beforeunload'));
          localStorage = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
          clearInterval(checkIfReadyInterval)
          setInterval(attachMicrophoneButton,125);
        }
    }
    checkIfReadyInterval = setInterval(checkIfReady,1000);
