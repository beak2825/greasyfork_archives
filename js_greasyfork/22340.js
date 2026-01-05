// ==UserScript==
// @name         Em-8ER Forums Dashboard
// @namespace    https://jadex.eu
// @version      2.2.1
// @description  Tune-up for em8er.com forums
// @author       Liam "Xeevis" Aqil
// @icon         https://en.gravatar.com/userimage/18934912/675229e8cc8aa43609d290393fcb84b9.png
// @match        https://forums.em8er.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22340/Em-8ER%20Forums%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/22340/Em-8ER%20Forums%20Dashboard.meta.js
// ==/UserScript==

uw = unsafeWindow;

uw.bg = GM_getValue("bg", "on") == "on" ? true : false;
uw.bg_type = GM_getValue("bg_type", "slideshow");
uw.collapse_sigs = GM_getValue("collapse_sigs", "off") == "on" ? true : false;
uw.msg_color = GM_getValue("msg_color", "#010203");
uw.msg_bg_color = GM_getValue("msg_bg_color", "#010203");
uw.msg_bg_color_transparent = GM_getValue("msg_bg_color_transparent", "off") == "on" ? true : false;
uw.tweaks = GM_getValue("tweaks", "off") == "on" ? true : false;

var styles = "";

if (uw.msg_color != "#010203") {
    styles += `body { color: ${uw.msg_color} !important }\n`;
}

if (uw.msg_bg_color_transparent) {
    uw.msg_bg_color = "transparent";
}

if (uw.msg_bg_color != "#010203") {
    styles += `.messageList .message { background-color: ${uw.msg_bg_color} !important }\n`;
}

if (uw.collapse_sigs) {
    styles += `.efd_quoteContainer { background-color: transparent !important } .efd_quoteContainer.expanded .efd_quote { max-height: none !important } .efd_quote { max-height: 95px !important } .efd_quoteExpand { top: 30px !important }\n`;
}

GM_addStyle(styles);

document.addEventListener("DOMContentLoaded",
    function () {
        registerMenuCommand(Configuration);
        uw.$("#AccountMenu ul.col2:first").append("<li><a class='efd_configuration' href='#'><i class='fa fa-cog' aria-hidden='true'></i> EF Dashboard</a></li>");
        uw.$("#copyright").append("<a class='efd_configuration' href='#'><i class='fa fa-cog' aria-hidden='true'></i> Ember Forums Dashboard</a>");

        var bs = uw.$.backstretch;

        if (!uw.bg) {
            bs("destroy");
        }

        switch (uw.bg_type) {
            case 'static':
                bs("show", 1);
                bs("pause");
                break;
            case 'random':
                bs("show", Math.floor(Math.random() * ($('body').data("backstretch").images.length + 1)));
                bs("pause");
                break;
        }

        if (uw.collapse_sigs) {
            GM_addStyle(`.efd_quoteExpand { background: linear-gradient(to bottom, rgba(32, 32, 32, 0) 0%, ${$(".messageList .message").css("background-color")} 80%) !important }`);
            $(".signature > aside").wrapAll(function () {
                return `<div class ="bbCodeQuote efd_bbCodeQuote"><blockquote class ="quoteContainer efd_quoteContainer"><div class ="quote efd_quote"></div><div class ="quoteExpand quoteCut efd_quoteExpand">Expand signature...</div></blockquote></div>`;
            });
        }

        if (tweaks)
        {
            // Home should link to Em8er.com main site
            uw.$("li.navTab.home > a").attr("href", "https://em8er.com/");

            // Fix logo width and replace with better image
            uw.$("li.navTab.xbNavLogo img").width(189).attr("src", "https://i.imgur.com/75GrQ0Z.png");

            // Fix pager appearance on DevTracker and add one to the bottom
            var pager = uw.$(".pageContent > .PageNav").wrapAll(function () {
                return `<div class="pageNavLinkGroup"></div>`;
            }).parent().clone().insertAfter('ol.messageList');
        }

    });

function Configuration() {
    var efd_overlay = XenForo.createOverlay(null, $(`
<div class="xenOverlay">
    <form id="efd_form">
        <div class="section">
            <h2 class="heading h1">Ember Forums Dashboard</h2>
            <h3 class="primaryContent">Settings</h3>
            <div class="secondaryContent">
                <dl class="ctrlUnit sectionLink">
                    <dd>
                        <ul>
                            <li>
                                <label for="bg">
                                    <input type="checkbox" name="bg" id="bg">
                                    Show background as...
                                </label>
                                <ul>
                                    <li>
                                        <select name="bg_type" id="bg_type" class="textCtrl autoSize">
                                            <option value="slideshow">Fading Slideshow</option>
                                            <option value="static">Static Image</option>
                                            <option value="random">Random Image</option>
                                        </select>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <label for="collapse_sigs">
                                    <input type="checkbox" name="collapse_sigs" id="collapse_sigs">
                                    Collapse signatures
                                </label>
                                <p class="hint">This setting will collapse large signatures under expander which needs to be clicked.</p>
                            </li>
                            <li>
                                <label for="tweaks">
                                    <input type="checkbox" name="tweaks" id="tweaks">
                                    Enable UI tweaks
                                </label>
                                <p class="hint">Cumulative collection of popular suggestions that change certain aspects of the forums.</p>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>
            <h3 class="primaryContent">Theme</h3>
            <div class="secondaryContent">
                <dl class="ctrlUnit sectionLink">
                    <dd>
                        <ul>
                            <li>
                                Message font color: <input class ="textCtrl" name="msg_color" type="color" value="${msg_color}" />
                            </li>
                            <li>
                                Message background color: <input class ="textCtrl" name="msg_bg_color" type="color" value="${msg_bg_color}" />
                                <label for="msg_bg_color_transparent">
                                    <input type="checkbox" name="msg_bg_color_transparent" id="msg_bg_color_transparent">
                                    Translucent
                                </label>
                            </li>
                            <li class ="presets">Presets:
                            <button type="button" class ="button" data-msg_color="#010203" data-msg_bg_color="#010203">Default</button>
                            <button type="button" class ="button" data-msg_color="#b9babc" data-msg_bg_color="#36393e">Discord</button>
                            <button type="button" class ="button" data-msg_color="#dcdcdc" data-msg_bg_color="#161c1c">Firefall</button>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>
            <div class="sectionFooter overlayOnly">
                <div class="muted" style="float: left">
                    <a class="concealed">Developed by Xeevis<span></span></a>
                </div>
                <button class ="button primary">Save and reload</button>
                <button type="button" id="reset_efd" class="button secondary">Reset to defaults</button>
            </div>
        </div>
    </form>
</div>`), { noCache: false });

    $(".efd_configuration").click(function () { efd_overlay.load(); return false; });
    $("#bg").prop("checked", bg);
    $("#collapse_sigs").prop("checked", collapse_sigs);
    $("#tweaks").prop("checked", tweaks);
    $("#msg_bg_color_transparent").prop("checked", msg_bg_color_transparent);
    $(`#bg_type option[value="${bg_type}"]`).prop("selected", true);

    $(".presets > button").click(function () {
        $("input[name='msg_color']").val($(this).data("msg_color"));
        $("input[name='msg_bg_color']").val($(this).data("msg_bg_color"));
    });

    $("#reset_efd").click(function () {
        window.postMessage("efd_reset", "https://forums.em8er.com");
        location.reload();
    });

    $("#efd_form").submit(function (e) {
        e.preventDefault();

        var fields = $(this).serializeArray();

        fields = fields.concat(
            $("#efd_form input[type=checkbox]:not(:checked)").map(
                function () {
                    return {
                        "name": this.name,
                        "value": "off"
                    };
                }).get());

        window.postMessage(fields, "https://forums.em8er.com");
        location.reload();
    });
}

window.addEventListener("message", parseData, false);

function parseData(event) {
    var data = event.data;

    if (data.includes("efd_reset")) {
        var keys = GM_listValues();

        for (var i = 0; i < keys.length; i++) {
            GM_deleteValue(keys[i]);
        }
        return;
    }

    if (event.origin == "https://forums.em8er.com") {
        for (var j = 0; j < data.length; j++) {
            var field = data[j];
            GM_setValue(field.name, field.value);
        }
    }
}

function registerMenuCommand(Configuration) {
    var funcText = Configuration.toString();
    var funcName = funcText.replace(/^function\s+(\w+)\s*\((.|\n|\r)+$/, "$1");
    var script = document.createElement("script");
    script.textContent = funcText + "\n\n";
    script.textContent += "jQuery(document).ready(function() {" + funcName + "(jQuery);});";
    document.body.appendChild(script);
}