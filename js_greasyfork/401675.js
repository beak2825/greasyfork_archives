// ==UserScript==
// @name         WAZEPT Test TTS
// @version      0.5
// @description  Test TTS sound!
// @author       J0N4S13 (jonathanserrario@gmail.com)
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/401675/WAZEPT%20Test%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/401675/WAZEPT%20Test%20TTS.meta.js
// ==/UserScript==

(function() {

    setTimeout(function() {test();}, 2000);

    function test() {
        var label = document.createElement("label");
        label.innerHTML = 'Teste TTS:';
        label.className = 'control-label';
        var input = document.createElement("input");
        input.id = 'inputTestTTS';
        input.style.cssText = 'width:85%;';
        var btn = document.createElement("button");
        btn.innerHTML = '▶';
        btn.id = 'btn';
        btn.style.cssText = 'height: 25px;width:9%;';
        var audio = document.createElement("AUDIO");
        audio.id = 'testTTS';
        var divinput = document.createElement("div");
        divinput.appendChild(label);
        divinput.appendChild(input);
        divinput.appendChild(btn);
        divinput.appendChild(audio);
        divinput.style.cssText = 'padding-top: 0px;';
        $("#edit-panel").prepend(divinput);

        btn.onclick = function() {
            var teste = document.getElementById('inputTestTTS').value;
            if(teste != "")
            {
                var res = teste.replace(" ", "+");
                let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                document.getElementById('testTTS').src = "https://ttsgw.world.waze.com/TTSGateway/Text2SpeechServlet?text=+" + res + "+&lang=" + W.model.topCountry.ttsLocales[0].tts + "&lon=" + center.lon + "&lat=" + center.lat + "&version=" + W.Config.tts.options.version + "&protocol=" + W.Config.tts.options.protocol + "&sessionid=" + W.Config.tts.options.sessionid + "&content_type=" + W.Config.tts.options.content_type + "&type=" + W.Config.tts.options.type + "&validate_data=" + W.Config.tts.options.validate_data + "&skipCache=" + W.Config.tts.options.skipCache;
                document.getElementById('testTTS').play();
            }
        }
    }
})();