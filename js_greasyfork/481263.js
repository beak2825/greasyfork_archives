// ==UserScript==
// @name         Brickarcadium +
// @version      1.4
// @description  Extends the features available on brickarcadium.xyz.
// @author       sfhefo#3251
// @match        *://*.brickarcadium.xyz/*
// @match        *://*.brickarcadium.xyz/*/*
// @match        *://*.brickarcadium.xyz/*/*/*
// @match        *://*.brickarcadium.xyz/*/*/*/*
// @license MIT
// @icon         http://images.thecoolwebsite.com/favicon.png
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1227048
// @downloadURL https://update.greasyfork.org/scripts/481263/Brickarcadium%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/481263/Brickarcadium%20%2B.meta.js
// ==/UserScript==

// colors and other stuff

function addGlass(bool) {
     var glass = "background: rgba( 255, 255, 255, 0.25 ) !important; \
     box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ) !important; \
     backdrop-filter: blur( 8px ) !important; \
     -webkit-backdrop-filter: blur( 8px ) !important; \
     border-radius: 10px !important; \
     border: 1px solid rgba( 255, 255, 255, 0.18 ) !important;";
     if (bool == "true") {
          return glass;
     } else {
          return;
     }
}

function addGlass2(bool) {
     var glass2 = "background: rgba( 255, 255, 255, 0.25 ) !important; \
     box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ) !important; \
     backdrop-filter: blur( 8px ) !important; \
     border: 1px solid rgba( 255, 255, 255, 0.18 ) !important;"
     if (bool == "true") {
          return glass2;
     } else {
          return;
     }
}

var ImageLink = "image: url('https://images.thecoolwebsite.com/wn95.jpg')";
var ImageLinkInput = "https://images.thecoolwebsite.com/wn95.jpg"
var MainColor = "#96B7D7";
var MainColor2 = "#6798C8";
var MainColor3 = "#3796F2";
var MainColor4 = "#FFFFFF";
var NavBarColor = "#282828";
var feedHeight = "2202px";
var rsizeType = "none";
var glassCheck = "false";

if (localStorage.getItem("rsize") !== null) {
    if (JSON.parse(localStorage.rsize) === true) {
        rsizeType = "vertical";
        console.log(rsizeType);
    }
}

if (localStorage.getItem("themeColor") === null) { // if there's no theme data
    ImageLink = "image: url('https://images.thecoolwebsite.com/wn95.jpg')"
    ImageLinkInput = "https://images.thecoolwebsite.com/wn95.jpg"
    MainColor = "#96B7D7";
    MainColor2 = "#6798C8";
    MainColor3 = "#3796F2";
    MainColor4 = "#FFFFFF";
    NavBarColor = "#282828";
    feedHeight = "2202px";
    glassCheck = "false";
} else { // else if there's theme data, get it all
    ImageLink = "image: url('" + localStorage.getItem("imageLink") + "')";
    ImageLinkInput = localStorage.getItem("imageLink")
    MainColor = localStorage.getItem("themeColor");
    MainColor2 = localStorage.getItem("fgColor1");
    MainColor3 = localStorage.getItem("fgColor2");
    MainColor4 = localStorage.getItem("txtcolor");
    NavBarColor = localStorage.getItem("nvbr");
    feedHeight = localStorage.getItem("feedHeight");
    glassCheck = localStorage.getItem("glassCheck");
}

if (localStorage.isBgUrl === "false") {
    ImageLink = "color:" + localStorage.bgColor;
    console.log(ImageLink);
} else {
    ImageLink = "image: url('" + localStorage.getItem("imageLink") + "')";
}

// css stuff

GM_addStyle ( `
    body {
        background-${ImageLink} !important;
        background-size: cover !important;
    }
    #platform {
        background-color: ${MainColor} !important;
        ${addGlass(glassCheck)}
    }
    #AvatarSpace {
         background-color: ${MainColor2} !important;
         ${addGlass(glassCheck)}
    }
    #AvatarSpace div {
         background-color: ${MainColor3} !important;
         ${addGlass2(glassCheck)}
    }
    #Mind > div > div {
         background-color: ${MainColor3} !important;
         width: 97% !important;
         ${addGlass(glassCheck)}
    }
    #Mind > div {
         background-color: ${MainColor2} !important;
         resize: ${rsizeType};
         overflow: auto;
         height: ${feedHeight};
         ${addGlass(glassCheck)}
    }
    div[style*="width:99.9%;"] {
         z-index: 2 !important;
    }
    #navbar {
         z-index: 3 !important;
         background-color: ${NavBarColor} !important;
    }
    #gearBox {
         background-color: ${NavBarColor} !important;
    }
    name {
        color: ${MainColor4} !important;
    }
    text {
        color: ${MainColor4} !important;
    }
    a {
        color: ${MainColor4} !important;
    }
    i {
        color: ${MainColor4} !important;
    }
    h3 {
        color: ${MainColor4} !important;
    }
    b {
        color: ${MainColor4} !important;
    }
    p {
        color: ${MainColor4} !important;
    }
    button:hover {
        cursor: pointer;
    }
    button:disabled {
        opacity: 50%;
        cursor: auto;
    }
    .rainbow {
        animation: rainbow 5s infinite !important;
    }
    .favcolor {
        border: none !important;
        border-radius: 0px !important;
        padding: 2px !important;
    }
    @keyframes  rainbow {
	  	0%{color: red;}
		17%{color: orange;}
		33%{color: yellow;}
		50%{color: green;}
		67%{color: blue;}
		84%{color: purple;}
	 	100%{color: red;}
	}
    .imglnk {
        width: 373px;
    }
` );

var navbar = document.getElementById("navbar");
navbar.innerHTML = navbar.innerHTML + " | <span class='rainbow'> Running Brickarcadium + </span>" // adds rainbow text that says "Running Brickarcadium +"

if (document.URL == "https://www.brickarcadium.xyz/Dashboard/") { // checks if the user is on the dashboard
    var avatarSpace = document.getElementById('AvatarSpace');
    var info = avatarSpace.querySelector('center');

    info.innerHTML = info.innerHTML + '<br> <b>User Count: <span id="count">Loading...</span></b>'; // registered user counter

    fetch('https://thecoolwebsite.com/usrcounter.php')
        .then(response => response.json())
        .then(data => {
        document.getElementById('count').textContent = data.count;
    });
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const targetElement = entry.target;

            const { width, height } = entry.contentRect;
            localStorage.setItem("feedHeight", Number(Math.round(height)) + "px");
        }
    });
    const targetElement = document.getElementById('Mind').querySelector('div');
    resizeObserver.observe(targetElement);
} else if (document.URL == "https://www.brickarcadium.xyz/Settings/") { // else if the user is in the settings
    var platform = document.getElementById("platform")
    platform.innerHTML = platform.innerHTML + "<br> \
    <br> \
    <div style='settingsBlock'> \
    <img src='http://images.thecoolwebsite.com/favicon.png'></img><br> \
    <text>Image as background:</text> \
    <input type='checkbox' id='b'> \
    <br> \
    <text id='btext' style='display: none;'>Background color:</text> \
    <input style='display: none;' type='color' id='bcolor' class='favcolor' name='favcolor' value='" + localStorage.bgColor + "'> \
    <text class='imgtext'>Background Image Link:</text> \
    <input value=" + ImageLinkInput + " class='imglnk' id='imglnk'> \
    <br> \
    <text>Background 2 color:</text> \
    <input type='color' id='favcolor' class='favcolor' name='favcolor' value='" + MainColor + "'> \
    <br> \
    <text>Foreground 1 color:</text> \
    <input type='color' id='favcolor2' class='favcolor' name='favcolor' value='" + MainColor2 + "'> \
    <br> \
    <text>Foreground 2 color:</text> \
    <input type='color' id='favcolor3' class='favcolor' name='favcolor' value='" + MainColor3 + "'> \
    <br> \
    <text>Text color:</text> \
    <input type='color' id='favcolor4' class='favcolor' name='favcolor' value='" + MainColor4 + "'> \
    <br> \
    <text>Navbar color:</text> \
    <input type='color' id='favcolor5' class='favcolor' name='favcolor' value='" + NavBarColor + "'> \
    <br> \
    <text>Resizable feed:</text>\
    <input type='checkbox' id='rsizeCheck'> \
    <br> \
    <text>Glass Panels:</text>\
    <input type='checkbox' id='glassCheck'> \
    <br> \
    <br> \
    <button id='submitChanges'>Apply Changes</button> \
    <br> \
    <button id='resetChanges' style='background-color:red !important;'>Reset Changes</button> \
    </div>" // adds the brickarcadium + settings
    var submitButton = document.getElementById("submitChanges");
    var resetButton = document.getElementById("resetChanges");

    var color = document.getElementById("favcolor");
    var fgcolor = document.getElementById("favcolor2");
    var fgcolor2 = document.getElementById("favcolor3");
    var textcolor = document.getElementById("favcolor4");
    var imgLink = document.getElementById("imglnk");
    var nvbr = document.getElementById("favcolor5");
    var resFeed = document.getElementById("rsizeCheck");
    var b = document.getElementById("b");
    var g = document.getElementById("glassCheck");
    var btext = document.getElementById("btext");
    var bcolor = document.getElementById("bcolor")

    function removeGMStyleRule(styleRuleToRemove) {
        var styleElements = document.querySelectorAll('style');
        for (var i = 0; i < styleElements.length; i++) {
            var styleContent = styleElements[i].textContent || styleElements[i].innerText;
            if (styleContent.includes(styleRuleToRemove)) {
                styleElements[i].parentNode.removeChild(styleElements[i]);
                return true;
            }
        }
        return false;
    }
    if (localStorage.getItem("isBgUrl") !== null) {
        if (JSON.parse(localStorage.isBgUrl) == true) {
            GM_addStyle('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
            removeGMStyleRule('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
            document.getElementById("b").checked = true
        } else {
            GM_addStyle('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
            removeGMStyleRule('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
            document.getElementById("b").checked = false
        }
    }
    if (localStorage.getItem("glassCheck") !== null) {
        if (JSON.parse(localStorage.glassCheck) == true) {
            document.getElementById("glassCheck").checked = true
        } else {
            document.getElementById("glassCheck").checked = false
        }
    }

    submitButton.addEventListener('click', function handleClick(event) { // if the submit button is clicked, store all of the data the user entered
        setTheme(color.value, 'themeColor');
        setTheme(fgcolor.value, 'fgColor1');
        setTheme(fgcolor2.value, 'fgColor2');
        setTheme(textcolor.value, 'txtcolor');
        setTheme(imgLink.value, 'imageLink');
        setTheme(nvbr.value, 'nvbr');
        setTheme(bcolor.value, 'bgColor');
        setTheme(b.checked.toString(), "isBgUrl");
    });

    resetButton.addEventListener('click', function handleClick(event) { // if the reset button is clicked, delete all of the data the user entered before
        resetTheme();
    });
    b.addEventListener('click', function handleClick(event) { // when the checkbox is clicked, check if the checkbox is ticked or not
        localStorage.setItem("isBgUrl", b.checked);
        if (b.checked == true) { // if the checkbox is ticked, remove all of the background color stuff and replace it with background link stuff
            GM_addStyle('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
            removeGMStyleRule('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
        } else { // if the checkbox is not ticked, remove all of the background link stuff and replace it with the background color stuff
            GM_addStyle('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
            removeGMStyleRule('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
        }
    });
    g.addEventListener('click', function handleClick(event) {
        localStorage.setItem("glassCheck", g.checked);
    });
    resFeed.addEventListener('click', function handleClick(event) {
        localStorage.setItem("rsize", resFeed.checked);
        console.log(resFeed.checked);
    });
    resFeed.checked = JSON.parse(localStorage.rsize);
    console.log(localStorage.getItem("rsize"))

    function setTheme(color, name) {
        localStorage.setItem(name, color);
        window.location = window.location;
    }
    function checkCheckbox() {
        GM_addStyle('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
        removeGMStyleRule('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
    }

    function resetTheme() {
        delete localStorage.themeColor;
        delete localStorage.isBgUrl;
        window.location = window.location;
    }
    if (localStorage.getItem("isBgUrl") == null || localStorage.isBgUrl === "true") {
        b.checked = true
        console.log(true)
        GM_addStyle('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
        removeGMStyleRule('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
    } else {
        b.checked = false
        GM_addStyle('#imglnk {display: none !important;} #btext {display: inline !important;} #bcolor {display: inline !important;} .imgtext {display: none !important;} imglnk {display: none !important;}')
        removeGMStyleRule('#imglnk {display: inline !important;} #btext {display: none !important;} #bcolor {display: none !important;} .imgtext {display: inline !important;} imglnk {display: inline !important;}')
    }

} else if (document.URL == "https://www.brickarcadium.xyz/Emporium/") { // adds a face category
    document.getElementById("platform").querySelector("div").innerHTML = "<br><a style='color:grey;font-size:22.5px;' href='?type=HEAD'>Hats</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=HEAD_2'>Second Hat</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=HAIR'>Hair</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=FACE'>Mouths</a><br> \
		                        <br><a style='color:grey;font-size:22.5px;' href='?type=FACE'>Faces</a></div> \
                                <br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=MASK'>Face Wear</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=BODY'>Body</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=TOOL'>Tools</a><br><br><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=SHIRT'>Shirts</a><br> \
								<br><a style='color:grey;font-size:22.5px;' href='?type=TROU'>Pants</a><br> \
								<br><a style='color:grey;font-size:22.5px;font-weight:bold;' href='upload'>Upload</a><br>"
}
