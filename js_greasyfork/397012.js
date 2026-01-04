// ==UserScript==
// @name         Moodle++
// @namespace    http://e-cfisd.hcde-texas.org/
// @version      1.2
// @description  Adds new features to moodle
// @author       Archer Calder
// @match        http://e-cfisd.hcde-texas.org/mod/quiz/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://cdn.jsdelivr.net/npm/chart.js@2.8.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397012/Moodle%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/397012/Moodle%2B%2B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //init variables
    var numOfTwenties = 0;
    var numOfFourties = 0;
    var numOfSixties = 0;
    var numOfEighties = 0;
    var numOfHundreds = 0;
    var allQuizzes = $(".cell.c0");

    //init arrays
    var quizzes = [];
    var quizzesLabels = [];

    //creating data for hoz. bar graph
    $("td").each(function(index) {
        if ($(this).hasClass("cell c3")) {
            if ($(this).text() == "20" || $(this).text() == "20.00") {
                numOfTwenties++;
            }
            if ($(this).text() == "40" || $(this).text() == "40.00") {
                numOfFourties++;
            }
            if ($(this).text() == "60" || $(this).text() == "60.00") {
                numOfSixties++;
            }
            if ($(this).text() == "80" || $(this).text() == "80.00") {
                numOfEighties++;
            }
            if ($(this).text() == "100" || $(this).text() == "100.00") {
                numOfHundreds++;
            }
        }
    });

    //ignore
    $("span").each(function(index) {
        if ($(this).text() == "212 Quizzes! (Spring 2021)") {
            $(this).addClass("clickableTT");
        }
    });

    //ignore
    $(".clickableTT").click(function() {
        $("td").each(function(index) {
            if ($(this).hasClass("cell c2")) {
                $(this).html("5");
            }
            if ($(this).hasClass("cell c3")) {
                $(this).html("100");
            }
        });

        $("tr").each(function(index) {
            $(this).addClass("bestrow");
        });
    });

    //init variables for line graph
    var date = "";
    var quizGrade = 0;

    //filling variables for line graph
    $("td").each(function(index) {
        if ($(this).hasClass("cell c3")) {
            if ($(this).text() == "20" || $(this).text() == "20.00") {
                quizGrade += 1;
            }
            if ($(this).text() == "40" || $(this).text() == "40.00") {
                quizGrade += 2;
            }
            if ($(this).text() == "60" || $(this).text() == "60.00") {
                quizGrade += 3;
            }
            if ($(this).text() == "80" || $(this).text() == "80.00") {
                quizGrade += 4;
            }
            if ($(this).text() == "100" || $(this).text() == "100.00") {
                quizGrade += 5;
            }

            if (date != $(this).parent().find(".statedetails").text().split(", ")[1]) {
                date = $(this).parent().find(".statedetails").text().split(", ")[1];
                quizzes.push(quizGrade);
                quizzesLabels.push($(this).parent().find(".statedetails").text().split(", ")[1]);
            }
        }
    });


    //appending necessary charts
    $("#intro").append('<center><h3><b>'.concat(allQuizzes.length, '</b> Total Quizzes</h3></center><center><p style="padding-bottom: 10px;">Average grade: ', Math.ceil((numOfTwenties + numOfFourties * 2 + numOfSixties * 3 + numOfEighties * 4 + numOfHundreds * 5) / (numOfTwenties + numOfFourties + numOfSixties + numOfEighties + numOfHundreds)), '</p><button class="btn btn-light" id="tbtn">Toggle raw/cumulative</button></center><center><canvas id="mGrades" height="75%"></canvas></center><center><canvas id="mGradesC" height="75%"></canvas></center><center><canvas id="progress" height="75%"></center></canvas>'));

    //appending the re-attempt button
    var aq = $(".box.quizattempt").clone();
    aq.appendTo("#intro");
    aq.find("input[type='submit']").addClass("btn-lg");

    //appending credit
    $("#intro").append("<center>Moodle++ made by Archer Calder</center>");

    //making hoz. bar graph 1
    var ctx = document.getElementById('mGrades');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Ones', 'Twos', 'Threes', 'Fours', 'Fives'],
            datasets: [{
                label: 'Amount of quizzes',
                data: [numOfTwenties, numOfFourties, numOfSixties, numOfEighties, numOfHundreds],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 3
            }]
        }
    });

    //making hoz. bar graph 2
    ctx = document.getElementById('mGradesC');
    myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Ones', 'Twos', 'Threes', 'Fours', 'Fives'],
            datasets: [{
                label: 'Amount of quizzes (cumulative)',
                data: [numOfTwenties + numOfFourties + numOfSixties + numOfEighties + numOfHundreds, numOfFourties + numOfSixties + numOfEighties + numOfHundreds, numOfSixties + numOfEighties + numOfHundreds, numOfEighties + numOfHundreds, numOfHundreds],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 3
            }]
        }
    });

    //toggling hoz. bar graph 2
    $("#mGradesC").toggle();

    //making progress graph
    ctx = document.getElementById('progress');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: quizzesLabels,
            datasets: [{
                label: 'Total Points',
                data: quizzes,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    //ignore
    var clickz = 0;

    //stats for nerds
    var key = $("input[name='sesskey']").prop("value");
    $("body").append("<center><h6>Current session key: ".concat(key,"</h6></center>"));

    $("#tbtn").click(function() {

        if (clickz == 25) {
            $('body').attr('contenteditable', 'true');
        }

        $("#mGradesC").toggle();
        $("#mGrades").toggle();

        clickz++;

    });



})();