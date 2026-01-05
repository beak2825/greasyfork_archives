// ==UserScript==
// @name         HF postChar
// @namespace    http://hackforums.net/member.php?action=profile&uid=2525478
// @version      0.4
// @description  Displays the number of characters in any post.
// @author       TyrantKingBen
// @include      *hackforums.net/showthread.php?tid=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/21445/HF%20postChar.user.js
// @updateURL https://update.greasyfork.org/scripts/21445/HF%20postChar.meta.js
// ==/UserScript==

var wheel = {
    radius: 50,
    thickness: 2,
    color: "#000000",
    dim: null,
    center: null,
    canvas: null,
    context: null
};
var cursor = {
    radius: 3,
    thickness: 1,
    color: "#000000",
    dim: null,
    canvas: null,
    context: null
};
var mouseDown = false;
var color_good = GM_getValue("color_good", "#32CD32");
var color_caution = GM_getValue("color_caution", "#F3611B");
var color_bad = GM_getValue("color_bad", "#CC3333");
var current_color = "#FFFFFF";

wheel.dim = (wheel.radius + wheel.thickness) * 2;
cursor.dim = wheel.dim;
wheel.center = wheel.radius + wheel.thickness;

wheel.canvas = document.createElement("canvas");
wheel.canvas.style.position = "absolute";
wheel.canvas.style.top = "0px";
wheel.canvas.style.left = "0px";
wheel.canvas.width = wheel.dim;
wheel.canvas.height = wheel.dim;
wheel.context = wheel.canvas.getContext("2d");

cursor.canvas = document.createElement("canvas");
cursor.canvas.style.position = "absolute";
cursor.canvas.style.top = "0px";
cursor.canvas.style.left = "0px";
cursor.canvas.width = wheel.dim;
cursor.canvas.height = wheel.dim;
cursor.context = cursor.canvas.getContext("2d");

var post_body = document.getElementsByClassName("post_body");
var post_author_info = document.getElementsByClassName("post_author_info");

for (var i = 0; i < post_body.length; i++) {
    (function() {
        var post = post_body[i].cloneNode(true); // Clone the node so quotes can be removed without affecting the page

        // Remove quotes
        var quote = post.getElementsByTagName("blockquote");
        for (var j = quote.length - 1; j >= 0; j--) {
            quote[j].parentNode.removeChild(quote[j]); // Remove the quote
        }

        // Check for code blocks
        var code_block = post.innerHTML.match(/class="codeblock"/g);
        if (code_block === null) code_block = 0; // There are no code tags used
        else code_block = code_block.length; // There are code tags used

        // Check for spoilers
        var spoiler = post.innerHTML.match(/class="spoiler_header"/g);
        if (spoiler === null) spoiler = 0; // There are no spoiler tags used
        else spoiler = spoiler.length; // There are spoiler tags used

        // Get the characters and calculate the number of characters
        var characters = post.textContent; // Get the post text
        characters = characters.replace(/\t/g, ""); // Remove tabs
        characters = characters.split(/\n/); // Split characters by paragraph
        for (var j = 0; j < characters.length; j++) { // Trim whitespace from each paragraph
            characters[j] = characters[j].trim();
        }
        characters = characters.join(""); // Rejoin as a string
        characters = characters.replace(/ {2,}/g, " "); // Replace multiple spaces with single spaces
        var num_characters = characters.length - 5 * code_block - 20 * spoiler; // "Code:" and "Spoiler: (Click to View)" are 5 and 20 characters each, respectively

        // Create character count
        var span = document.createElement("span");
        span.style.color = (num_characters < 25) ? color_bad : color_good; // Assign color based on number of characters
        span.className = (num_characters < 25) ? "color_bad" : "color_good"; // Assign class based on number of characters
        span.appendChild(document.createTextNode(num_characters));

        // Check for spam posting
        var spam_word = ["25char", "tooshort", "252525", "bump", "msg2short"]; // Spam words
        characters = characters.toLowerCase(); // Convert to lowercase for spam checking
        for (var j = 0; j < spam_word.length; j++) {
            if (characters.indexOf(spam_word[j]) != -1 && num_characters - spam_word[j].length < 25) { // Spam word was detected and was needed to reach 25 characters
                span.style.color = color_caution;
                span.className = "color_caution";
                break;
            }
        }

        // Add character count
        var info = post_author_info[i];
        if (info.innerHTML.indexOf("award") != -1) { // User has awards
            info.insertBefore(document.createElement("br"), info.children[info.children.length - 2]);
            info.insertBefore(document.createTextNode("Characters: "), info.children[info.children.length - 2]);
            info.insertBefore(span, info.children[info.children.length - 2]);
        } else { // User has no awards
            info.appendChild(document.createTextNode("Characters: "));
            info.appendChild(span);
        }

        // Settings]
        span.addEventListener("click", function() { displaySettings(info); });
    }());
}

function displaySettings(info) {
    var position = getOffset(info);

    var old_container = document.getElementById("colorWheel");
    if (old_container !== null) document.body.removeChild(old_container);

    var container = document.createElement("div");
    container.id = "colorWheel";
    container.style.position = "absolute";
    container.style.top = position.top + "px";
    container.style.left = (position.left - wheel.dim - 10) + "px";
    container.style.width = wheel.dim + "px";
    container.style.height = wheel.dim + "px";

    var input_good = document.createElement("input");
    input_good.type = "button";
    input_good.value = "\u2713";
    input_good.style.position = "relative";
    input_good.style.top = (wheel.dim + 5) + "px";
    input_good.style.width = "30px";
    input_good.style.float = "left";
    input_good.style.borderColor = color_good;
    input_good.style.outline = "none";

    var input_caution = document.createElement("input");
    input_caution.type = "button";
    input_caution.value = "\u26A0";
    input_caution.style.position = "relative";
    input_caution.style.top = (wheel.dim + 5) + "px";
    input_caution.style.width = "30px";
    input_caution.style.borderColor = color_caution;
    input_caution.style.outline = "none";

    var input_bad = document.createElement("input");
    input_bad.type = "button";
    input_bad.value = "\u2717";
    input_bad.style.position = "relative";
    input_bad.style.top = (wheel.dim + 5) + "px";
    input_bad.style.width = "30px";
    input_bad.style.float = "right";
    input_bad.style.borderColor = color_bad;
    input_bad.style.outline = "none";

    input_good.addEventListener("click", function() {
        input_good.style.borderColor = current_color;
        color_good = current_color;
        GM_setValue("color_good", color_good);

        updateColors("color_good");
    });

    input_caution.addEventListener("click", function() {
        input_caution.style.borderColor = current_color;
        color_caution = current_color;
        GM_setValue("color_caution", color_caution);

        updateColors("color_caution");
    });

    input_bad.addEventListener("click", function() {
        input_bad.style.borderColor = current_color;
        color_bad = current_color;
        GM_setValue("color_bad", color_bad);

        updateColors("color_bad");
    });

    input_good.addEventListener("dblclick", function() {
        input_good.style.borderColor = "#32CD32";
        color_good = "#32CD32";
        GM_setValue("color_good", color_good);

        updateColors("color_good");
    });

    input_caution.addEventListener("dblclick", function() {
        input_caution.style.borderColor = "#F3611B";
        color_caution = "#F3611B";
        GM_setValue("color_caution", color_caution);

        updateColors("color_caution");
    });

    input_bad.addEventListener("dblclick", function() {
        input_bad.style.borderColor = "#CC3333";
        color_bad = "#CC3333";
        GM_setValue("color_bad", color_bad);

        updateColors("color_bad");
    });

    drawColorWheel(wheel);
    container.appendChild(wheel.canvas);
    container.appendChild(cursor.canvas);
    container.appendChild(input_good);
    container.appendChild(input_caution);
    container.appendChild(input_bad);
    document.body.appendChild(container);

    cursor.canvas.addEventListener("mousemove", cursorEvent);
    cursor.canvas.addEventListener("mousedown", cursorEvent);
    cursor.canvas.addEventListener("dblclick", cleanup);
    document.addEventListener("mouseup", cursorEvent);
}

function drawColorWheel() {
    wheel.context.beginPath();
    wheel.context.arc(wheel.center, wheel.center, wheel.radius + wheel.thickness / 2, 0, 2 * Math.PI, false);
    wheel.context.closePath();
    wheel.context.strokeStyle = wheel.color;
    wheel.context.lineWidth = wheel.thickness;
    wheel.context.stroke();

    for (var angle = 0; angle <= 360; angle++) {
        var startAngle = (angle - 2) * Math.PI / 180;
        var endAngle = angle * Math.PI / 180;
        wheel.context.beginPath();
        wheel.context.moveTo(wheel.center, wheel.center);
        wheel.context.arc(wheel.center, wheel.center, wheel.radius, startAngle, endAngle, false);
        wheel.context.closePath();
        var gradient = wheel.context.createRadialGradient(wheel.center, wheel.center, 0, wheel.center, wheel.center, wheel.radius);
        //gradient.addColorStop(0, "hsl(" + angle + ", 10%, 100%)");
        gradient.addColorStop(1, "hsl(" + angle + ", 100%, 50%)");
        wheel.context.fillStyle = gradient;
        wheel.context.fill();
    }
}

function drawCursor(x, y) {
    cursor.context.clearRect(0, 0, cursor.dim, cursor.dim);
    cursor.context.beginPath();
    cursor.context.arc(x, y, cursor.radius, 0, 2 * Math.PI, false);
    cursor.context.closePath();
    cursor.context.strokeStyle = cursor.color;
    cursor.context.lineWidth = cursor.thickness;
    cursor.context.stroke();
}

function cursorEvent(e) {
    e.preventDefault();

    if (e.type == "mousedown") chooseColor(e.pageX, e.pageY, true);
    else if (e.type == "mouseup") mouseDown = false;
    else chooseColor(e.pageX, e.pageY, false);
}

function chooseColor(x, y, click) {
    if (click) mouseDown = true;

    if (mouseDown) {
        var position = getOffset(wheel.canvas);
        x = Math.floor(x - position.left);
        y = Math.floor(y - position.top);
        if ((wheel.center - x) * (wheel.center - x) + (wheel.center - y) * (wheel.center - y) < wheel.radius * wheel.radius) {
            var pixel = wheel.context.getImageData(x, y, 1, 1).data;
            current_color = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
            document.getElementById("colorWheel").style.backgroundColor = current_color;

            drawCursor(x, y);
        }
    }
}

function getOffset(element) {
    var x = element.getBoundingClientRect().left + window.scrollX;
    var y = element.getBoundingClientRect().top + window.scrollY;
    return { top: y, left: x };
}

function cleanup() {
    document.body.removeChild(document.getElementById("colorWheel"));
    cursor.canvas.removeEventListener("mousemove", cursorEvent);
    cursor.canvas.removeEventListener("mousedown", cursorEvent);
    cursor.canvas.removeEventListener("dblclick", cleanup);
    document.removeEventListener("mouseup", cursorEvent);
}

function updateColors(color) {
    var updatee = document.getElementsByClassName(color);

    switch (color) {
        case "color_good":
            color = color_good;
            break;
        case "color_caution":
            color = color_caution;
            break;
        case "color_bad":
            color = color_bad;
            break;
    }

    for (var i = 0; i < updatee.length; i++) {
        updatee[i].style.color = color;
    }
}