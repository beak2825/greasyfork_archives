// ==UserScript==
// @name         GMetrixBetterScore
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gives Better Random Score for G-Metrix Tests
// @author       TheGuy920
// @match        *://*.gmetrix.net/Tests/Results.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420929/GMetrixBetterScore.user.js
// @updateURL https://update.greasyfork.org/scripts/420929/GMetrixBetterScore.meta.js
// ==/UserScript==

var randomScore = (Math.floor(Math.random() * 20) + 80) * 10;

var randomMinutes = (Math.floor(Math.random() * 10) + 30);

var randomSeconds = (Math.floor(Math.random() * 50)) + 10;

document.getElementById("studentArrow").style.left = (randomScore/10) + "%";

document.getElementById("stats-container").childNodes[1].childNodes[9].innerHTML = `You scored
`+randomScore+`/ 1000
on this test.`;

document.getElementById("stats-container").childNodes[1].childNodes[11].innerHTML = `#studentArrow:before {
  content: "You(`+randomScore+`)"
}`;

document.getElementById("reportsBorderlessTable").childNodes[1].childNodes[10].childNodes[3].innerHTML = "00:" + randomMinutes + ":" + randomSeconds;

var questions = parseInt(document.getElementById("reportsBorderlessTable").childNodes[1].childNodes[12].childNodes[3].innerHTML.split("/")[1]);

var correctQuestions = Math.floor(questions * (randomScore/1000));

document.getElementById("reportsBorderlessTable").childNodes[1].childNodes[12].childNodes[3].innerHTML = correctQuestions + "/" + questions;

UpdateScore();

function UpdateScore()
{
    var userScore = randomScore;
    var maxScore = "1000";
    var convertedUserScore = randomScore;
    var convertedMaxScore = "1000";

    var passed = "Passed";

    var themeColor = "green";

    var minPassingScore = parseInt("0");

    var message = "";

    var messages = {
        yellow2: "Amazing!",
        Green2: "Amazing!",
        Green3: "You're a Superstar!",
        Green1: "Excellent"
    }

    if (userScore >= 0.85 * minPassingScore && userScore < minPassingScore) {
        message = messages.yellow2;
    }
    if (userScore >= minPassingScore && userScore < 900) {
        message = messages.Green1;
    }
    if (userScore >= minPassingScore && userScore >= 900) {
        message = messages.Green2;
    }
    if (userScore == 1000) {
        message = messages.Green3;
    }

    if (userScore >= minPassingScore) {
        passed = "Passed";
    }

    if (passed === "Passed") {
        themeColor = "green";
    }

    function draw(domNode) {

        document.getElementById("render").innerHTML = "";

        var width = 350;
        var height = 250;

        var outerRadius = Math.min(width / 2, (2 / 3) * height);
        var innerRadius = outerRadius * .95;

        var svg = d3.select("#render")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + width + " " + height)
        .append("g")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle((-2 / 3) * Math.PI)
        .endAngle((2 / 3) * Math.PI);

        svg.append("path")
            .attr("class", "arc-background")
            .attr("d", arc);

        var progress = userScore / maxScore;
        var endAngle = (progress * (4 / 3) * Math.PI) + ((-2 / 3) * Math.PI)

        arc = arc.endAngle(endAngle);
        svg.append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .attr("fill", themeColor);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -10)
            .attr("id", "t1")
            .attr("font-size", 10)
            .attr("fill", "#444649")
            .text(convertedUserScore);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 40)
            .attr("id", "t2")
            .attr("font-size", 10)
            .attr("fill", "#444649")
            .text(message);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -115)
            .attr("y", 80)
            .attr("id", "t3")
            .attr("font-size", 10)
            .attr("fill", "#444649")
            .text(convertedUserScore);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 105)
            .attr("y", 80)
            .attr("id", "t4")
            .attr("font-size", 10)
            .attr("fill", "#444649")
            .text(convertedMaxScore);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("y", -80)
            .attr("id", "t5")
            .attr("font-size", 10)
            .attr("fill", themeColor)
            .text(passed);



        function doResize() {
            var textNode = document.getElementById("t1");
            var bb = textNode.getBBox();
            var widthTransform = (innerRadius * 2 * .9) / bb.width;
            var heightTransform = (innerRadius * 2 / 3 * .9) / bb.height;
            var value = widthTransform < heightTransform ? widthTransform : heightTransform;
            var translate = value * 10; //10 px font
            textNode.setAttribute("transform", "matrix(" + value + ", 0, 0, " + value + ", 0, " + translate + ")");
        }

        doResize();
    }

    draw();
    $(window).resize(draw);
}