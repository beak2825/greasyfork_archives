// ==UserScript==
// @name         ucr cs141 grader helper script
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  automaticly fetch codeforce submissions and verify it.
// @author       BugParty
// @match        https://www.gradescope.com/courses/873565/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gradescope.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/decimal.js/9.0.0/decimal.min.js
// @home-url        https://github.com/bugparty/ucr_cs141_gradescope_helper
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512425/ucr%20cs141%20grader%20helper%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/512425/ucr%20cs141%20grader%20helper%20script.meta.js
// ==/UserScript==


(function() {
    'use strict';
    /*
    you need to apply for codeforce api key and secret
    */
    const apiKey = '123';
    const apiSecret = '123';
    console.log("inject started");
    async function signCodeforcesUrl(apiKey, apiSecret, methodName, params) {
        // Generate a random 6-character string
        const rand = [...window.crypto.getRandomValues(new Uint8Array(3))].map(b => b.toString(16).padStart(2, '0')).join('');

        // Current time in UNIX timestamp format
        const currentTime = Math.floor(Date.now() / 1000);

        // Adding apiKey and time to params
        params.apiKey = apiKey;
        params.time = currentTime;

        // Sort the parameters lexicographically by keys and values
        const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
            acc.push(`${key}=${params[key]}`);
            return acc;
        }, []).join('&');

        // Concatenating the string as per the documentation
        const stringToHash = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;
        //console.log("api string", stringToHash);
        // Encoding the string to a Uint8Array
        const encoder = new TextEncoder();
        const dataToHash = encoder.encode(stringToHash);

        // Hashing the string using SHA-512
        const hashBuffer = await window.crypto.subtle.digest('SHA-512', dataToHash);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string

        // Forming the apiSig
        const apiSig = `${rand}${hashHex}`;

        // Creating the signed URL
        const signedUrl = `https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`;

        return signedUrl;
    }
    async function fetchData(url) {
        try {
            // Sending the HTTP request to the specified URL
            const response = await fetch(url);

            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parsing the JSON response into an object
            const data = await response.json();

            // Use the data object as needed
            console.log(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    function isValidInteger(str) {
        const invalid_val = {valid: false, val: -1};
        const regex = /^\s*\d+\s*$/;
        if(!regex.test(str)){
            return invalid_val;
        }
        const num = Number(str);
        return {valid: true, val: num};
    }
    $(document).ready(function(){
        
        const answers_id_queries = ["#question_41404944 > div:nth-child(3) > div:nth-child(4) > div > div > span",
                                    "#question_41404944 > div:nth-child(3) > div:nth-child(6) > div > div > span",
                                    "#question_41404944 > div:nth-child(3) > div:nth-child(8) > div > div > span",
                                    "#question_41404944 > div:nth-child(3) > div:nth-child(10) > div > div > span",
                                    "#question_41404944 > div:nth-child(3) > div:nth-child(12) > div > div > span"
                                   ];
        const report_title_selector = '#question_41404944_text_12';
        const anwers_titles = ["Lost in the Shuffle","Juice Box", "The Stairs", "Chocolate Frogs", "Wizard Chess"];
        const methodName = 'contest.status';
        const params = { contestId: '551192', asManager: true };
        const points_html_template = '<div id="bowman-total-points" class="form--textInput form--textInput-prominent form--textInput-med form--textInput-readOnly u-preserveWhitespace"><span> %points% </span></div>';

        let endOfTitle = $("#question_41404944 > div:nth-child(2)");
        console.log(endOfTitle);
        const button_title = " Fetch Status from codeforce";
        endOfTitle.before('<button type="button" id="bowman_super_btn" class="tiiBtn tiiBtn-secondary actionBar--action" tabindex="0"   style="display: inline-block;"><span><i class="fa" role="img" aria-hidden="true"></i><span> Fetch Status from codeforce</span></span></button>');
        $("#bowman_super_btn").click(function() {
            console.log("super button clicked, starting working");
            $(this).prop('disabled', true);  // Disable the button
            $(this).text('Please wait... if not resepond for 10seconds, refresh the page');  // Change button text
            signCodeforcesUrl(apiKey, apiSecret, methodName, params)
                .then(signedUrl => {
                console.log('Signed URL:', signedUrl)
                let submissions;
                fetchData(signedUrl)
                    .then(data => {
                    if (data.status === 'OK')
                        submissions = data.result;
                    else{
                        $("#bowman_super_btn").text("codeforce return an invalid response:"+ data.status)
                        return;
                    }
                    const user_cf_id = $("#question_41404944 > div:nth-child(3) > div:nth-child(2) > div > div > span").text().trim()
                    console.log("user codeforce handle is ", user_cf_id);

                    let answers_ids = [];
                    let total_points = new Decimal(0);
                    for(let i=0;i<answers_id_queries.length;i++){
                        let element = $(answers_id_queries[i]);
                        let the_id = element.text();
                        console.log("problem ", anwers_titles[i], " id: ", the_id);
                        let num_id = isValidInteger(the_id);
                        answers_ids.push(num_id.val);
                        if (num_id.valid){
                            let found_submission = submissions.find(obj => obj.id === num_id.val);
                            console.log(found_submission);
                            let isSameUser = found_submission.author.members[0].handle === user_cf_id;
                            if (!isSameUser) {
                                element.append("❌ different user handle found: ", found_submission.author.members[0].handle);
                                continue;
                            }
                            let problem_name = found_submission.problem.name;
                            if (problem_name != anwers_titles[i]){
                                element.append("❌ wrong problem: ", problem_name);
                                continue;
                            }
                            if (found_submission.points == undefined){
                                element.append("❌ no score found, verdict: ", found_submission.verdict);
                                continue;
                            }

                            element.append(" ✅ point: ", found_submission.points, " handle:", found_submission.author.members[0].handle, " problem: ", problem_name);
                            total_points = total_points.plus(found_submission.points);


                        }else{//invalid submission
                            element.text(the_id + " ❌ invalid submission id");
                        }
                    }
                    //insert total score before Report

                    let points_text = "total points: " + total_points + " subtract 5 by " + (Decimal.sub(5,total_points));
                    let points_html = points_html_template.replace("%points%", points_text);

                    if($('#bowman-total-points').length==0){
                        $(report_title_selector).before(points_html);
                    }else{
                        $('#bowman-total-points > span').text(points_text);
                    }
                    $("#bowman_super_btn").text(button_title);
                    $("#bowman_super_btn").prop('disabled', false);


                })
                    .catch(error => {
                    console.log(error);
                    $("#bowman_super_btn").text(error + ' ' + button_title);
                    $("#bowman_super_btn").prop('disabled', false);
                    //reset scores
                    if($('#bowman-total-points').length!=0){
                        $('#bowman-total-points > span').text("no points available");
                    }
                }

                          );
            }
                     )
                .catch(error => console.error('Error signing URL:', error));
        });
    });
})();