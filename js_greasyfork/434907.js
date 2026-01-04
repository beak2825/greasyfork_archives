// =======================================================
// =======================================================
// =======================================================
// ===========   Don't touch below here       ============
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ==UserScript==
// @name          D2JSP Enhancer
// @namespace     Lost
// @version       2.3.17
// @description   Enables you to search for a keyword on D2JSP and receive automated notifications
// @include       /^https:\/\/(forums.d2jsp\.org)\/(forum.php|topic.php|post.php)/
// @grant         GM_notification
// @grant         GM.getValue
// @grant         GM_getValue
// @grant         GM.setValue
// @grant         GM_setValue
// @grant         GM.deleteValue
// @grant         GM_deleteValue
// @require       https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.24.2/babel.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/434907/D2JSP%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434907/D2JSP%20Enhancer.meta.js
// ==/UserScript==
/*eslint-disable */
/* jshint esnext: false */
/* jshint esversion: 8 */


// On-page display
var searchBoxhtml = `<div id="lostContainer" style="transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position: relative;padding: 0 16px;border-radius: 4px;background:#ffffff;color:#1b1b1b;margin-bottom: 15px;margin-top: 15px;width: auto;max-width:500px;box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;display: block;">
    <div style="flex-wrap: wrap;align-items: start;justify-content: start; display: flex;">
        <div style="width: 200px;height: 50px;">
            <h5 style="
padding: 0px;
margin-bottom: 0;
padding-bottom: 0;">D2JSP Enhancer</h5>
            <div style="padding: 0;margin: 0;"><a id="lostDonate" href="https://forums.d2jsp.org/gold.php?i=821114" target="_blank" rel="noopener" style="color: #b20032;font-weight: 600;"><small>Donate</small> <div stlye="display:inline-block" class="sX s0b"></div></a> | <button id="lostDarkMode" type="button"
                        style="position: relative;display: inline-block;box-sizing: border-box;border: none;border-radius: 4px;padding: 0;min-width: 35px;height: 18px;vertical-align: middle;text-align: center;text-overflow: ellipsis;color: #1b1b1b;background: transparent;font-family: var(--pure-material-font,"
                        Roboto" , "Segoe UI" , BlinkMacSystemFont, system-ui,-apple-system);font-weight: 500;font-size:9.16667px!important;line-height: 14px;overflow: hidden;outline: none;cursor: pointer;transition: box-shadow 0.2s;"><small style="font-size:9.16667px!important">Dark Mode</small></button></div>
        </div>
        <div style="flex-grow: 1;"><label style="position: relative;
display: inline-block;
padding-top: 6px;
font-family: var(--pure-material-font, " roboto",="""segoe="" ui" ,="" blinkmacsystemfont,="" system-ui,="" -apple-system);="" font-size:="" 1rem;="" line-height:="" 1.5;="" overflow:="" hidden; "="">
<input id="lostInput" placeholder="Auto search" type="text" style="
box-sizing: border-box;
margin: 0;
border: solid 1px;
/* Safari */
border-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6);
border-radius: 4px;
padding: 7.5px 5px 7.5px;
width: 100%;
min-width: 220px;
height: inherit;
color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.87);
background-color: transparent;
box-shadow: none;
/* Firefox */
font-family: inherit;
font-size: inherit;
line-height: inherit;
caret-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
transition: border 0.2s,
box-shadow 0.2s;
display: block;
">

                <span style="
display: flex;
border-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6);
width: 100%;
max-height: 100%;
color: rgba(var(27, 27, 27), 0.6);
font-size: 75%;
line-height: 15px;
cursor: text;
transition: color 0.2s,
font-size 0.2s,
line-height 0.2s;
">Anni, Ber, Enigma, Jmod, etc.</span>

            </label></div>
        <div><button id="lostAutoButton" type="button" style="
margin-top: 9px;
position: relative;
display: inline-block;
box-sizing: border-box;
border: none;
border-radius: 4px;
padding: 0 12px;
min-width: 61px;
height: 33px;
vertical-align: middle;
text-align: center;
text-overflow: ellipsis;
background-color: #1b1b1b;
box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
0 2px 2px 0 rgba(0, 0, 0, 0.14),
0 1px 5px 0 rgba(0, 0, 0, 0.12);
font-family: var(--pure-material-font, &quot; Roboto&quot; , &quot; Segoe UI&quot; , BlinkMacSystemFont, system-ui, -apple-system);
font-size: 1em;
font-weight: 500;
line-height: 32px;
overflow: hidden;
outline: none;
cursor: pointer;
transition: box-shadow 0.2s;
flex-grow: 1;
">Search</button>
        </div>

    </div>
    <div id="lostSearchActive" style="flex-wrap: wrap;align-items: center;justify-content: center; display: flex;">
        <p style="text-align: center;"><strong>Seaching for <span id="searchingText"></span> in <span id="lostTime">--</span></strong></p>
        <button id="lostStopButton" type="button"
            style="position: relative;display: inline-block;box-sizing: border-box;border: none;border-radius: 4px;padding: 0 8px;min-width: 35px;height: 18px;vertical-align: middle;text-align: center;text-overflow: ellipsis;color: #b20032;background-color: #fdf8f8;font-family: var(--pure-material-font, &quot; Roboto&quot; , &quot; Segoe UI&quot; , BlinkMacSystemFont, system-ui,-apple-system);font-size: 1em;font-weight: 500;line-height: 14px;overflow: hidden;outline: none;cursor: pointer;transition: box-shadow 0.2s;margin-left: 10px; border: 1px solid #b20032;">Stop</button>

    </div>
</div>`;

var bumpHtml = `<div id="bumpContainer" style="
    position: relative;
    padding: 10px;
    z-index: 2;
    font-size: 0.875rem;
    border: 2px
 solid rgba(255, 255, 255, 0.04);
    background: rgb(35, 35, 35);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    margin-top:5px;
">
<img id="bumpUserPic" src="https://i.imgur.com/GvsgVco.jpeg" class="av" loading="lazy" style="max-height: 65vh;display: inline-block;height: 45px;width: auto;max-width: 100px;border-radius: 50%;">
<p id="bumpText" style="text-align:center;padding: 13px 0px;font-size: 90%;margin-top: 0;margin-bottom: 0;display: inline-flex;width: 52%;position: absolute;right: 0;justify-content: start;">Topic Bumped</p>
</div>
`

// Page Regexs

 const forumRegex= /^https:\/\/(forums.d2jsp\.org)\/(forum.php)/
 const topicRegex= /^https:\/\/(forums.d2jsp\.org)\/(topic.php)/
 const postRegex= /^https:\/\/(forums.d2jsp\.org)\/(post.php)/
 const userRegex= /^https:\/\/(forums.d2jsp\.org)\/(user.php)/

// Setting variables

 var isLoaded = false;
 var isEnabled = false;
 var desktopNotificationsEnabled = true;
 var notificationTimer = 10000;
 var quickReplyEnabled = true;
 var isDarkMode = false;
 var lastActiveTime;
 var afkTimer = 60; // 60 minutes
 var limitImgSize = true;
 var removeSignatureImg = true;
 var postEnhancer = true;

 // js vars
 const ogTitle = document.title;
 var recentAlerts = [];

 // Main trade posts

var keywords = '';

// Getting the keywords value that is stored.
// Getting enabled value

async function getSettings() {
    keywords = await GM.getValue('lostKeywords');
    recentAlerts = await GM.getValue('recentNotificaitons');
    if(recentAlerts === undefined) recentAlerts = [];
    isEnabled = await GM.getValue('lostEnabled');
    isDarkMode = await GM.getValue('lostDarkMode');
    lastActiveTime = await GM.getValue('lastActive');
    if(lastActiveTime === undefined) {
        lastActiveTime = moment();
        GM.setValue('lastActive', lastActiveTime);
    }
    //limitImgSize = await GM.getValue('limitImgSize');
    //removeSignatureImg = await GM.getValue('removeSignatureImg');
    //postEnhancer = await GM.getValue('postEnhancer');
    console.log('D2JSP Enhancer Enabled: ', isEnabled);
    console.log('D2JSP Enhancer Keywords: ', keywords);
    console.log('D2JSP Enhancer Dark Mode: ', isDarkMode);
    console.log('D2JSP Enhancer Recent Alerts: ', recentAlerts);
    console.log('D2JSP Enhancer Last Active Search: ', lastActiveTime);
    console.log('D2JSP Enhancer Quick Replay Enabled: ', quickReplyEnabled);
    console.log('D2JSP Enhancer Remove Signature Image: ', removeSignatureImg);
    console.log('D2JSP Enhancer Post Enhancer: ', postEnhancer);
    return true;
}
(async () => {


    isLoaded = await getSettings();

    // Waiting to get all the setting via Async
    if(isLoaded) {

        // Check if the user is afk.
        if(isEnabled && (moment(lastActiveTime).add(afkTimer, 'm').unix() < moment().unix())) {
            console.log('D2JSP Enhancer Afk Nudge Sent');
            GM.setValue('lostEnabled', false );
            GM.deleteValue('lastActive');
            GM_notification ( {
                title: 'AFK Check (D2JSP Enhancer)', text: '\n\nClick notification to reset afk timer.', timeout: 20000, image: 'https://www.google.com/s2/favicons?domain=forums.d2jsp.org',
                onclick: () => {
                    //window.focus ();
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    GM.setValue('lastActive', moment() );
                    GM.setValue('lostEnabled', true );
                }
            });
        }

        // Check if the oldest stored notification needs to be purged.
        if(recentAlerts.length>0 && (moment(recentAlerts[0]?.time).add(5, 'm').unix() < moment().unix())) {
            recentAlerts.shift();
            GM.setValue('recentNotificaitons', recentAlerts );
        }

        // Set dark mode
        if(isDarkMode) {
            // Override website to dark mode
            document.body.style.backgroundColor = "#161616";
        }
        // General style changes
        if(postEnhancer) {
            //console.log('pagePosts: ', pagePosts);
                var anchorContainer = document.body.getElementsByClassName("ab");
                for (var ac = 0; ac < anchorContainer.length; ac++) {
                    // Check if there is an img in the signature.
                    //console.log('anchorContainer: ', anchorContainer[ac].getElementsByTagName("a"));
                    var anchors = anchorContainer[ac].getElementsByTagName("a");

                    for (var aa = 0; aa < anchors.length; aa++) {
                        anchors[aa].style.boxSizing = 'border-box';
                        anchors[aa].style.border = 'none';
                        anchors[aa].style.borderRadius = '4px';
                        anchors[aa].style.padding = '0 12px';
                        anchors[aa].style.minWidth = '61px';
                        anchors[aa].style.height = '33px';
                        anchors[aa].style.verticalAlign = 'middle';
                        anchors[aa].style.boxShadow = '0 3px 1px -2px rgba(0, 0, 0, 0.2),0 2px 2px 0 rgba(0, 0, 0, 0.14),0 1px 5px 0 rgba(0, 0, 0, 0.12)';
                        anchors[aa].style.fontFamily = 'var(--pure-material-font, &quot; Roboto&quot; , &quot; Segoe UI&quot; , BlinkMacSystemFont, system-ui, -apple-system)';
                        anchors[aa].style.fontSize = '1em';
                        anchors[aa].style.fontWeight = '500';
                        anchors[aa].style.lineHeight = '32px';
                        anchors[aa].style.overflow = 'hidden';
                        anchors[aa].style.outline = 'none';
                        anchors[aa].style.cursor = 'pointer';
                        anchors[aa].style.transition = 'box-shadow 0.2s';
                        anchors[aa].style.flexGrow = '1';
                        anchors[aa].style.textAlign = 'center';
                        //    sigImg[im].style.display = "none";
                    }
            }
        }
        if(forumRegex.test(window.location.href)) {
            var targetDOM = document.body.getElementsByClassName('pg')[0];
            targetDOM.insertAdjacentHTML('beforebegin', searchBoxhtml);
            // Activate the buttons.
            document.getElementById ("lostAutoButton").addEventListener (
                "click", setKeyword, false
            );
            document.getElementById ("lostStopButton").addEventListener (
                "click", disable, false
            );
            document.getElementById ("lostDarkMode").addEventListener (
                "click", toggleMode, false
            );

            // Set dark mode
            if(isDarkMode) {
                document.getElementById("lostContainer").style.background = "#262626";
                document.getElementById("lostContainer").style.color = "#d5d5d5";
                document.getElementById("lostDarkMode").style.color = "#d5d5d5";
                document.getElementById("lostInput").style.color = "#d5d5d5";
                document.getElementById("lostInput").style.borderColor = "#d5d5d5";
                document.getElementById("lostAutoButton").style.backgroundColor = "#484848";
                document.getElementById("lostDonate").style.color = "#de7b84";
                document.getElementById('lostDarkMode').textContent = "Light Mode";
                document.getElementById('lostDarkMode').style.fontSize = "9.16667px";
                document.getElementById("lostStopButton").style.color = "#de7b84";
                document.getElementById("lostStopButton").style.borderColor = "#de7b84";
                document.getElementById("lostStopButton").style.backgroundColor = "#484848";
            }

            if(isEnabled && keywords != ('' || undefined)){
                document.getElementById("lostInput").value = keywords;
                document.getElementById('searchingText').textContent = keywords;
                searchDom();
            } else {
                document.getElementById("lostSearchActive").style.display = "none";
                GM.deleteValue('lostKeywords');
            }
        }


        if(topicRegex.test(window.location.href) || postRegex.test(window.location.href)) {

            if(quickReplyEnabled) {
                //document.getElementById("frb").style.display = "block";
                //document.getElementById("frb").insertAdjacentHTML('afterend', quickReplyHtml);
                //document.getElementsByClassName("c").style.display = "none";
                var link = window.location.href;
                //link = link.replace('d2jsp.org/topic.php?', 'd2jsp.org/post.php?c=2&');
                //setTimeout(function(){window.open(link, '_blank');}, 200);
                //location.href = 'dq(0);return false';
                setTimeout(function(){
                    var quickReply = document.getElementById("frb");
                    quickReply.style.display = "block";
                    quickReply.style.position = "fixed";
                    quickReply.style.zIndex = "10";
                    quickReply.style.bottom = "0";
                    quickReply.style.left = "0";
                    quickReply.style.right = "0";
                    quickReply.style.marginLeft = "13%";
                    quickReply.style.marginRight = "13%";
                    document.getElementsByClassName("crt links")[0].style.marginTop = '250px';
                }, 200);

            }
            // to test: https://forums.d2jsp.org/topic.php?t=89431944&f=268

            // Only want to change the images in the posts, no the entire page.
            // Therefore, we loop through the posts and then get <img/>
            var pagePosts = document.getElementsByTagName("dl");
            //console.log('pagePosts: ', pagePosts);
            for (var p = 0; p < pagePosts.length; p++) {
                pagePosts[p].childNodes[0].style.border = '2px solid rgba(255, 255, 255, 0.04)';
                pagePosts[p].childNodes[0].style.borderTopLeftRadius = '4px';
                pagePosts[p].childNodes[0].style.borderTopRightRadius = '4px';
                pagePosts[p].childNodes[0].style.borderBottom = 'none';
                pagePosts[p].childNodes[0].style.top = '1px';
                pagePosts[p].childNodes[0].style.zIndex = '3';
                pagePosts[p].childNodes[1].style.borderRadius = '4px';
                pagePosts[p].childNodes[1].style.zIndex = '2';
                pagePosts[p].childNodes[1].style.border = '2px solid rgba(255, 255, 255, 0.04)';
                // Get the images and loop through them replacing adding max and min width.
                if(limitImgSize) {
                    var imgEl = pagePosts[p].getElementsByTagName("img");
                    for (var i = 0; i < imgEl.length; i++) {
                        imgEl[i].style.maxHeight = "65vh";
                        imgEl[i].style.display = "inline-block";
                        //imgEl[i].style.minWidth = "500px";
                    }
                }
                // Get the signature of the user and remove the signature image.
                if(removeSignatureImg) {
                    var sig = pagePosts[p].getElementsByClassName("sig");
                    for (var s = 0; s < sig.length; s++) {
                        // Check if there is an img in the signature.
                        if(sig[s] && sig[s].getElementsByTagName("img")) {
                            var sigImg = sig[s].getElementsByTagName("img");
                            if(sigImg.length>0) {
                                for (var im = 0; im < sigImg.length; im++) {
                                    sigImg[im].style.display = "none";
                                }
                            }
                        }
                    }
                }
                if(postEnhancer) {

                    //pagePosts[p].getElementsByTagName("dl").style.marginBottom = '10px';
                    var container = pagePosts[p].getElementsByClassName("ppc")[0];
                    if(container) {
                        pagePosts[p].getElementsByClassName("ppc")[0].style.padding = '10px';
                        pagePosts[p].getElementsByClassName("ppc")[0].style.zIndex = '2';
                        pagePosts[p].getElementsByClassName("ppc")[0].style.fontSize = '0.875rem';
                    }
                    var userAvatar = pagePosts[p].getElementsByClassName("av")[0];
                    if(userAvatar) {
                        pagePosts[p].getElementsByClassName("av")[0].style.height = '100px';
                        pagePosts[p].getElementsByClassName("av")[0].style.width = '100px';
                        pagePosts[p].getElementsByClassName("av")[0].style.maxWidth = '100px';
                        pagePosts[p].getElementsByClassName("av")[0].style.borderRadius = '50%';
                        pagePosts[p].getElementsByClassName("av")[0].style.marginBottom = '15px';
                    }
                    var userContainer = pagePosts[p].getElementsByClassName("desc p3 pud")[0];
                    if(userContainer) {
                        pagePosts[p].getElementsByClassName("desc p3 pud")[0].style.textAlign = 'center';
                        if(isDarkMode) pagePosts[p].getElementsByClassName("desc p3 pud")[0].style.borderRight = '2px solid rgba(255, 255, 255, 0.04)'
                        else pagePosts[p].getElementsByClassName("desc p3 pud")[0].style.borderRight = '2px solid rgba(0, 0, 0, 0.04)'
                        pagePosts[p].getElementsByClassName("desc p3 pud")[0].style.marginRight = '15px';
                        pagePosts[p].getElementsByClassName("desc p3 pud")[0].style.paddingRight = '10px';
                        //console.log(userContainer.children[0]?.getElementsByTagName("img"))
                        // If the user does not have a profile picture, add the generic profile picture.
                        if(userContainer.children[0]?.getElementsByTagName("img").length == 0) {
                        userContainer.children[0].insertAdjacentHTML('afterbegin', `<img src="https://i.imgur.com/8f9L25D.png" class="av" loading="lazy" style="max-height: 65vh; display: inline-block; height: 80px; width: 80px; max-width:80px; border-radius: 50%; margin-bottom: 15px; opacity:0.5">`);
                        }
                    }
                    var postTime = pagePosts[p].getElementsByClassName("desc cl rc")[0];
                    if(postTime) {
                        pagePosts[p].getElementsByClassName("desc cl rc")[0].style.padding = '15px 0';
                        pagePosts[p].getElementsByClassName("desc cl rc")[0].style.marginBottom = '1.2em';
                        pagePosts[p].getElementsByClassName("desc cl rc")[0].style.textTransform = 'uppercase';
                        if(isDarkMode) pagePosts[p].getElementsByClassName("desc cl rc")[0].style.color = 'rgba(255,255,255, 0.48)';
                    }


                    // Getting the inner text content of the user's post
                    var userPost = pagePosts[p].getElementsByClassName("bts");
                    for (var up = 0; up < userPost.length; up++) {
                        var binRegex = /\b(bin)\b/gi;
                        var resRegex = /\b(res)\b/gi;
                        var bumpRegex = /^bump$/gi;
                        //console.log(userPost[up].innerHTML);
                        //console.log(userPost[up])
                        userPost[up].style.padding = '20px';
                        if(isDarkMode) userPost[up].style.color = 'rgba(255, 255, 255, 0.80)';
                        userPost[up].style.minHeight = '3em';
                        userPost[up].style.overflow = 'hidden';
                        userPost[up].style.lineHeight = '1.4em';
                        userPost[up].style.borderTop = 'none';
                        if(bumpRegex.test(userPost[up].innerHTML)) {
                            var postContainer = postContainer = userPost[up].parentNode.parentNode.parentNode.parentNode;
                            //postContainer.insertAdjacentHTML('afterend', bumpHtml);
                            //postContainer.style.display = "none";

                            if(userContainer) {
                                pagePosts[p].getElementsByClassName("desc p3 pud")[0].children[1].style.display = 'none';
                            }
                            if(pagePosts[p].getElementsByClassName("av")[0]) {
                                pagePosts[p].getElementsByClassName("av")[0].style.height = '40px';
                                pagePosts[p].getElementsByClassName("av")[0].style.width = '40px';
                                pagePosts[p].getElementsByClassName("av")[0].style.marginBottom = '0';
                            }
                            if(postTime) {
                                pagePosts[p].getElementsByClassName("desc cl rc")[0].style.padding = '5px 0';
                                pagePosts[p].getElementsByClassName("desc cl rc")[0].style.marginBottom = '0';
                            }
                            var sigContaier = pagePosts[p].getElementsByClassName("sig");
                            //console.log('sigContaier: ', sigContaier)
                            if(sigContaier) {
                                sigContaier[0].style.display = 'none';
                                userPost[up].style.lineHeight = '12px';
                                userPost[up].style.minHeight = '0';
                            }
                            userPost[up].style.padding = '5px';
                            userPost[up].style.fontSize = '90%';

                            //postContainer.getElementsByTagName()
                            //var bumpPost = userPost[up].getElementById("bumpContainer").childNodes;
                            //bumpPost[1].insertAdjacentHTML('afterend', postContainer.getElementsByTagName("dt")[0].innerHTML);
                            //console.log('bumpPost: ', bumpPost)
                        }
                        //if(actionRegex.exec(userPost[up].innerHTML)?.length>0 && !postRegex.test(window.location.href)) {
                        //    var actionReg = actionRegex.exec(userPost[up].innerHTML);
                        //    var textColor = '#ff3a7d';
                        //    console.log('actionReg?: ', actionReg);
                        //    console.log('actionReg?.length: ', actionReg?.length);
                        //    for (var aReg = 0; aReg < actionReg?.length; aReg++) {
                        //    console.log('aReg?: ', aReg);
                        //        if(actionReg[aReg] == 'res')  textColor = '#60991f';
                        //        userPost[up].innerHTML = boldString(actionReg.input, actionReg[aReg], actionRegex, textColor);
                        //    }
                        //}

                        if(binRegex.test(userPost[up].innerHTML) && !postRegex.test(window.location.href)) {
                                userPost[up].innerHTML = boldString(userPost[up].innerHTML, 'bin', binRegex, '#ff3a7d');
                        }
                        if(resRegex.test(userPost[up].innerHTML) && !postRegex.test(window.location.href)) {
                                userPost[up].innerHTML = boldString(userPost[up].innerHTML, 'res', resRegex, '#60991f');
                        }
                        for (var pc = 0; pc < pagePosts[p].childNodes.length; pc++) {
                            if(isDarkMode) {
                                pagePosts[p].childNodes[pc].style.background = '#232323';
                                pagePosts[p].childNodes[pc].style.color = 'rgba(255, 255, 255, 0.80)';
                            }
                        }
                        var userPostContainer = pagePosts[p].getElementsByClassName("upc");
                        for (var upc = 0; upc < userPostContainer.length; upc++) {
                            userPostContainer[upc].style.background = 'transparent';
                            if(isDarkMode) {
                                //console.log('userPostContainer: ',userPostContainer[upc])
                                userPostContainer[upc].style.color = 'rgba(255, 255, 255, 0.80)';
                            }
                        }
                    }
                }
            }

        }
    }
})();

function setKeyword() {
    keywords = document.getElementById('lostInput').value;
    document.getElementById('searchingText').textContent = keywords;
    GM.setValue('lostKeywords', keywords );
    GM.setValue('lastActive', moment());
    enable();
}

function enable() {
    document.getElementById("lostSearchActive").style.display = "flex";
    GM.setValue('lostEnabled', true );
    searchDom();
}

function disable() {
    document.getElementById("lostSearchActive").style.display = "none";
    GM.deleteValue(keywords);
    GM.setValue('lostEnabled', false );
    location.reload();
}

function toggleMode() {
    if(isDarkMode) {
        isDarkMode = false;
        GM.setValue('lostDarkMode', false );
        document.getElementById("lostContainer").style.background = "#ffffff";
        document.getElementById("lostContainer").style.color = "#1b1b1b";
        document.getElementById("lostDarkMode").style.color = "#1b1b1b";
        document.getElementById("lostInput").style.color = "#1b1b1b";
        document.getElementById("lostInput").style.borderColor = "rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6)";
        document.getElementById("lostAutoButton").style.backgroundColor = "#1b1b1b";
        document.getElementById("lostDonate").style.color = "#b20032";
        document.getElementById('lostDarkMode').textContent = "Dark Mode";
        document.getElementById('lostDarkMode').style.fontSize = "9.16667px";
        document.getElementById("lostStopButton").style.color = "#b20032";
        document.getElementById("lostStopButton").style.borderColor = "#b20032";
        document.getElementById("lostStopButton").style.backgroundColor = "#fdf8f8";
        // Override website to dark mode
        document.body.style.backgroundColor = "#161616";

    }
    else {
        isDarkMode = true;
        GM.setValue('lostDarkMode', true);
        document.getElementById("lostContainer").style.background = "#262626";
        document.getElementById("lostContainer").style.color = "#d5d5d5";
        document.getElementById("lostDarkMode").style.color = "#d5d5d5";
        document.getElementById("lostInput").style.color = "#d5d5d5";
        document.getElementById("lostInput").style.borderColor = "#d5d5d5";
        document.getElementById("lostAutoButton").style.backgroundColor = "#484848";
        document.getElementById("lostDonate").style.color = "#de7b84";
        document.getElementById('lostDarkMode').textContent = "Light Mode";
        document.getElementById('lostDarkMode').style.fontSize = "9.16667px";
        document.getElementById("lostStopButton").style.color = "#de7b84";
        document.getElementById("lostStopButton").style.borderColor = "#de7b84";
        document.getElementById("lostStopButton").style.backgroundColor = "#484848";
    }
}


// Searches for they keywords.
// Sends notification when a keyword is found.
function searchDom() {
    NodeList.prototype.forEach = Array.prototype.forEach
    var children = document.body.childNodes;
    if(keywords != '') {
        var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
        keywords = keywords.replace(rQuantifiers, '\\$&').split(',').join(' |');
        var pat = new RegExp('(' + keywords + ')', 'gi');
        children.forEach(function(item){
            var as = item.getElementsByTagName('a');
            for (var j = 0; j < as.length; j++) {
                var a = as[j];
                if(pat.test (a.childNodes[0].nodeValue)) {
                    // Check for which keyword was found and send it to the notification and recent alerts/notifications array.
                    var keywordFound = '';
                    keywords.match(pat).map((x) => {
                        // If a keyword was found, check which keyword it was before moving forward.
                        if(a.childNodes[0].nodeValue.toLowerCase().includes(x.toLowerCase())) {
                            if(recentAlerts.length>0) {
                                recentAlerts.map((n, index) => {
                                    if(n.title.toLowerCase() == a.childNodes[0].nodeValue.toLowerCase()) return;
                                    index = index++;
                                    // Check if we have shown this notifcation already.
                                    if((index + 1) === recentAlerts.length) {
                                        keywordFound = capitalizeFirstLetter(x);
                                        // change the page title to show a notification.
                                        document.title = '🟢 ' + keywordFound + ' found!';
                                        //If desktop notifications are on and the keyword is not found in the user's d2jsp profile name, send a notification.
                                        if(desktopNotificationsEnabled && !userRegex.test(a.childNodes[0].parentElement.href)) {
                                            console.log("Notification: We found a new post, send notification. (", n.title + ')');
                                            sendNotification(a, keywordFound);
                                        }
                                        // Add the notificaiton to to the recent alerts array.
                                        recentAlerts.push({title: a.childNodes[0].nodeValue.toLowerCase(), time: moment()});
                                        GM.setValue('recentNotificaitons', recentAlerts );
                                    }
                                    else {
                                    console.log("Notification: We've already sent you this notifcation. (", n.title + ')');
                                     return;
                                    }
                                });
                            }
                            // else send the notifications, this is would be the first notifcation sent.
                            else {
                                keywordFound = capitalizeFirstLetter(x);
                                // change the page title to show a notification.
                                document.title = '🟢 ' + keywordFound + ' found!';
                                //If desktop notifications are on and the keyword is not found in the user's d2jsp profile name, send a notification.
                                if(desktopNotificationsEnabled && !userRegex.test(a.childNodes[0].parentElement.href)) sendNotification(a, keywordFound);
                                // Add the notificaiton to to the recent alerts array.
                                recentAlerts.push({title: a.childNodes[0].nodeValue.toLowerCase(), time: moment()});
                                GM.setValue('recentNotificaitons', recentAlerts );
                            }
                            return;
                        };
                        return;
                    });
                    return;
                }
            }
        });
    }
    // Only auto refresh if we are on a trade page.
    if(forumRegex.test(window.location.href)) {
        var numSec = 10;
        startTimer(numSec);
        setTimeout(function(){
            location.reload();
        }, numSec*1000);
    }
}

function sendNotification(a, keywordFound) {
    var timeAgo = 'unknown';
    if(a.childNodes[0].parentNode.parentNode.parentNode.getElementsByClassName('desc cl')[0] && a.childNodes[0].parentNode.parentNode.parentNode.getElementsByClassName('desc cl')[0].innerText) timeAgo = a.childNodes[0].parentNode.parentNode.parentNode.getElementsByClassName('desc cl')[0].innerText;
    var link = a.childNodes[0].parentElement.href;
    link = link.replace('d2jsp.org/topic.php?', 'd2jsp.org/post.php?c=2&');
    GM_notification ( {
        title: keywordFound + ' found on D2JSP', text: a.childNodes[0].nodeValue + '\nPosted ' + timeAgo + '\n\nClick notification to go to the post.', timeout: notificationTimer, image: 'https://www.google.com/s2/favicons?domain=forums.d2jsp.org',
        onclick: () => {
            document.title = ogTitle;
            //window.focus ();
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(a.childNodes[0].parentElement.href, '_blank');
            GM.setValue('lastActive', moment() );

        }
    });
}

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if(minutes>0) document.getElementById('lostTime').textContent = minutes + ":" + seconds;
        else document.getElementById('lostTime').textContent = seconds + 's';

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}


function capitalizeFirstLetter(string) {
  // Need to get rid of any existing spaces at the start of the string, due to the multi search functionality and regex.
  string = string.split(/[ ,]+/).join('');
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function boldString(str, substr, actionRegex, color) {
  //console.log('str: ', str);
  //console.log('substr: ', substr);
  var strRegExp = new RegExp(substr, 'gi');
  return str.replace(actionRegex, '<b style="color:'+color+';font-weight:600;text-transformation:uppercase">'+substr+'</b>');
}