// ==UserScript==
// @name         Webwork Autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  send a POST request based on the fetch text in the input box
// @author       You
// @match        webwork.math.ust.hk/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490352/Webwork%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/490352/Webwork%20Autofill.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var dodebug = false;
    var Advanced_Recursion = false;

    // Create the input box
    var inputBox = document.createElement('textarea');
    inputBox.id = 'fetchText';
    inputBox.rows = 1;
    inputBox.cols = 200;


    var inputBoxMin = document.createElement('textarea');
    inputBoxMin.id = 'boxMin';
    inputBoxMin.rows = 1;
    inputBoxMin.cols = 4;
    inputBoxMin.textContent = '-7';

    var inputBoxMax = document.createElement('textarea');
    inputBoxMax.id = 'boxMax';
    inputBoxMax.rows = 1;
    inputBoxMax.cols = 4;
    inputBoxMax.textContent = '7';

    var inputInterval = document.createElement('textarea');
    inputInterval.id = 'boxInterval';
    inputInterval.rows = 1;
    inputInterval.cols = 4;
    inputInterval.textContent = '50';

    var CorrectAns = document.createElement('div');
    CorrectAns.id = 'CorrectAns';
    CorrectAns.style.border = '1px solid black';
    CorrectAns.textContent = 'Correct Answers: ';
    CorrectAns.onclick =  function() {
        resultList = {};
        CorrectAns.textContent = 'Correct Answers: ';
        localStorage.setItem('resultList',JSON.stringify(resultList));
    };


    // Create the button
    var button = document.createElement('button');
    button.textContent = 'Send POST request';
    button.onclick = function () {
        // Get the fetch text from the input box
        var fetchText = document.getElementById('fetchText').value;
        executeFetchCommand(fetchText);
    };

    // Add the input box and the button after the specified element
    var element = document.getElementById('problem-nav');
    element.parentNode.insertBefore(inputBox, element.nextSibling);
    element.parentNode.insertBefore(button, inputBox.nextSibling);
    element.parentNode.insertBefore(inputBoxMin, button.nextSibling);
    element.parentNode.insertBefore(inputBoxMax, inputBoxMin.nextSibling);
    element.parentNode.insertBefore(inputInterval, inputBoxMax.nextSibling);
    element.parentNode.insertBefore(CorrectAns, inputInterval.nextSibling);


    var resultList = {};


    var localItems = ['fetchText', 'boxMin', 'boxMax', 'boxInterval'];

    function getLocalItem(localItems){
        localItems.forEach(function (item){
            if (localStorage.getItem(item) !== null) {
                document.getElementById(item).value = localStorage.getItem(item);
            }
        })
        if (localStorage.getItem('resultList') !== null){
            resultList = JSON.parse(localStorage.getItem('resultList'));
            CorrectAns.textContent = 'Correct Answers: '+JSON.stringify(resultList);
        }
    }
    getLocalItem(localItems);


    function debugoutput(text){
        if (dodebug){
            console.log(text);
        }
    }


    var executed = 0;
    var submitted = 0;

    function executeFetchCommand(fetchCommand) {
        // Remove semicolon from the end of the command
        fetchCommand = fetchCommand.trim();
        if (fetchCommand.endsWith(';')) {
            fetchCommand = fetchCommand.slice(0, -1);
        }

        // Get all answer input boxes
        var answerInputs = document.querySelectorAll('input.codeshard');
        var answerIds = [];
        answerInputs.forEach(function(input) {
            if (input.previousSibling && input.previousSibling.checked) {
                answerIds.push(input.id);
            }
        });
        answerIds = answerIds;

        var min = Number(document.getElementById('boxMin').value);
        var max = Number(document.getElementById('boxMax').value);
        var interval = Number(document.getElementById('boxInterval').value);


        var current_empty_answers = (answerIds.length-Object.keys(resultList).length);
        var current_filled_answers = Object.keys(resultList).length;
        var max_cases = Advanced_Recursion ? (max-min+1)**current_empty_answers : (max-min+1)*current_empty_answers;
        console.log("current empty answers: "+current_empty_answers);

        var progress = document.createElement('progress');
        progress.id = 'ProgressBar'
        progress.value = 0;
        progress.max = (max-min+1)**current_empty_answers;


        var progtxt = document.createElement('div');
        progtxt.id = 'progresstext';
        progtxt.style.border = '1px solid black';
        progtxt.textContent = `${submitted} (submitted) / ${executed} (executed) / ${max_cases} (max)`;
        element.parentNode.insertBefore(progress, CorrectAns.nextSibling);
        element.parentNode.insertBefore(progtxt, progress.nextSibling);

        function replaceAnswerInFetchCommand(fetchCommand, answerId, answerValue) {
            //console.log("received AnsID/Ans: "+ answerId+"/"+answerValue)
            // Create a regular expression to find the answer in the fetch command
            var regex = new RegExp('(?<=name=\\\\"'+answerId+'\\\\"\\\\r\\\\n\\\\r\\\\n).*?(?=\\\\r\\\\n)', 'g');
            // Replace the answer in the fetch command
            var newFetchCommand = fetchCommand.replace(regex, answerValue);
            return newFetchCommand;
        };
        // Try all combinations of answers

        console.log('answerIds:');
        console.log(answerIds);

        function recurseFor(recurseCommand, ansIndex){
            debugoutput('ansIndex = ' + ansIndex);
            if (ansIndex>=0) {
                if (('Box'+(ansIndex+1)) in resultList){
                    var value = resultList['Box'+(ansIndex+1)];
                    debugoutput('skipping with '+ value + ' in Box'+ (ansIndex+1));
                    document.getElementById(answerIds[ansIndex]).value = value;
                    recurseCommand = replaceAnswerInFetchCommand(recurseCommand, answerIds[ansIndex], value);
                    recurseFor(recurseCommand, ansIndex-1);
                }else{
                    for (var i = min; i<=max; i++) {
                        debugoutput('For Delay: ansIndex = ' + ansIndex+' Power='+Math.max(ansIndex-current_filled_answers,0));
                        var timeout = (max-min+1)**(Math.max(ansIndex-current_filled_answers,0))*(i-min)*interval;
                        debugoutput('setting delay for Depth '+ (ansIndex-1) + ' with '+ timeout+'ms');
                        setTimeout(function (recurseCommand,ansIndex,i){
                            document.getElementById(answerIds[ansIndex]).value = i;
                            recurseCommand = replaceAnswerInFetchCommand(recurseCommand, answerIds[ansIndex], i);
                            recurseFor(recurseCommand, ansIndex-1);
                        },timeout, recurseCommand, ansIndex, i);
                        // to set time interval for each fetch
                        // numBranch**(maxDepth-Depth)*Branch_i*TARGET_INTERVAL
                    }
                }
            }else{
                submitted+=1;
                progtxt.textContent = `${submitted} (submitted) / ${executed} (executed) / ${max_cases} (max)`;
                if (!dodebug){
                    eval(recurseCommand);
                }
            }
        };

        var answer_list = [];
        answerIds.forEach(function(item,index){
            answer_list[index] = max;
        });
        debugoutput('initial answer_list: '+JSON.stringify(answer_list));


        //TODOOO: ALL TOGETHER, NO SEPERATION
        function recurse(ansIndex, ansValue){
            debugoutput(`ansIndex = ${ansIndex}, ansValue = ${ansValue}`);
            debugoutput(answer_list);
            if (ansIndex<0){
                return;
            }
            else if(ansValue<min){
                recurse(ansIndex-1, max);
            }
            else{
                if (('Box'+(ansIndex+1)) in resultList){
                    ansValue = resultList['Box'+(ansIndex+1)];
                    answer_list[ansIndex] = ansValue;

                    document.getElementById(answerIds[ansIndex]).value = ansValue;

                    recurse(ansIndex-1, max);
                }else{
                    answer_list[ansIndex] = ansValue;

                    document.getElementById(answerIds[ansIndex]).value = ansValue; //Fill to the textbox

                    answer_list.forEach(function (item,index){
                        recurseCommand = replaceAnswerInFetchCommand(recurseCommand, answerIds[index], item);
                    });
                    if (!dodebug){
                        submitted+=1;
                        progtxt.textContent = `${submitted} (submitted) / ${executed} (executed) / ${max_cases} (max)`;
                        eval(recurseCommand);
                    }
                    debugoutput(`sleep ${interval}ms for next call`);
                    setTimeout(recurse, interval, ansIndex, ansValue-1);
                }
            }
        };

        function AdvancedRecurse(ansIndex, ansValue){
            debugoutput(`ansIndex = ${ansIndex}, ansValue = ${ansValue}`);
            debugoutput(`start:`+answer_list.join());
            if (ansIndex<0){
                return;
            }
            else if(ansValue<min){
                return;
            }
            else{
                /*if (('Box'+(ansIndex+1)) in resultList){
                    ansValue = resultList['Box'+(ansIndex+1)];
                    answer_list[ansIndex] = ansValue;

                    document.getElementById(answerIds[ansIndex]).value = ansValue;

                    AdvancedRecurse(ansIndex-1, max);
                }else{*/
                    AdvancedRecurse(ansIndex -1, ansValue);
                    answer_list[ansIndex] = ansValue;
                    debugoutput(`Added: `+answer_list);
                    document.getElementById(answerIds[ansIndex]).value = ansValue; //Fill to the textbox

                    answer_list.forEach(function (item,index){
                        recurseCommand = replaceAnswerInFetchCommand(recurseCommand, answerIds[index], item);
                    });

                    if (!dodebug){
                        submitted+=1;
                        progtxt.textContent = `${submitted} (submitted) / ${executed} (executed) / ${max_cases} (max)`;
                        eval(recurseCommand);
                    }

                    debugoutput(`sleep ${interval}ms for next call`);
                    setTimeout(AdvancedRecurse, interval, ansIndex , ansValue -1);


                //}
            }
        };

        fetchCommand = `function fetchWithRetry(retryCount = 5) {
            return ` + fetchCommand + `.then(response => response.text())
            .then(data => {
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(data, 'text/html');
            let rows = htmlDoc.querySelectorAll('.attemptResults tr');
            let enteredArray = [];
            let resultArray = [];
            for(let i = 1; i < rows.length; i++) { // skip the header row
                let entered = rows[i].children[0].textContent;
                let result = rows[i].children[2].textContent;
                if (result === 'correct') {
                    resultList['Box'+i] = entered;
                    CorrectAns.textContent = 'Correct Answers (click to reset) : '+JSON.stringify(resultList);
                    localStorage.setItem('resultList',JSON.stringify(resultList));
                }
                enteredArray.push(entered);
                resultArray.push(result);
            }
            console.log('Entered: ' + enteredArray.join(', '));
            console.log('Result: ' + resultArray.join(', '));
            executed+=1;
            progtxt.textContent = \`\${submitted} (submitted) / \${executed} (executed) / \${max_cases} (max)\`;
            progress.value = executed;
            })
            .catch((error) => {
            var delay = 1000;
            delay+= Math.random()*2000;
            console.error('Unable to fetch! Retry remaining: ' + retryCount + ' in '+ delay+'ms ');
            if (retryCount >= 1) {
                return setTimeout(delay,fetchWithRetry,retryCount - 1);
            }
            });
            }
            fetchWithRetry();`;
        var recurseCommand = fetchCommand;

        if (Advanced_Recursion) {
            AdvancedRecurse(answerIds.length-1, max);
        }else {
            recurse(answerIds.length-1, max);
        }



    }

    // Add checkboxes to all answer input boxes
    var answerInputs = document.querySelectorAll('input.codeshard');
    answerInputs.forEach(function(input,index) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        input.parentNode.insertBefore(checkbox, input);
        checkbox.checked = true;
    });



    function setLocalItem(localItems){
        localItems.forEach(function (item){
            document.getElementById(item).addEventListener('change', function() {
            localStorage.setItem(item, this.value);
            });
        });
        document.getElementById('CorrectAns').addEventListener('change', function() {
            localStorage.setItem('resultList',JSON.stringify(resultList));
        });
    }
    setLocalItem(localItems);

})();

