// ==UserScript==
// @name         Minecraft Curseforge Modpack Comparison
// @namespace    MCCurseModpackComparison
// @version      0.2.6
// @description  Script for webpage https://akeeru.gitlab.io/ and MC Curse modpacks (file page like https://legacy.curseforge.com/minecraft/modpacks/<modpack_name>/files/<file_id>)
// @author       Akeeru
// @license      Copyright Akeeru
// @match        https://legacy.curseforge.com/minecraft/modpacks/*/files/*
// @match        https://akeeru.gitlab.io/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @noframes
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/411904/Minecraft%20Curseforge%20Modpack%20Comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/411904/Minecraft%20Curseforge%20Modpack%20Comparison.meta.js
// ==/UserScript==

/*global $*/

const cfPatt = /https?:\/\/legacy\.curseforge\.com\/minecraft\/modpacks\/.*?\/files\/([0-9]*)\/?/;
const cmcPatt = /https:\/\/akeeru\.gitlab\.io\/?/;

const style = `
#cmc_applet{--color-back: #0e0d11;--color-front: #fff;--color-pri-0: #133175;--color-pri-1: #3b5798;--color-pri-2: #20418e;--color-pri-3: #092461;--color-pri-4: #041948;--color-sec-1-0: #2b9509;--color-sec-1-1: #5dc03d;--color-sec-1-2: #3db318;--color-sec-1-3: #1e7b00;--color-sec-1-4: #165b00;--color-sec-2-0: #5b0b74;--color-sec-2-1: #7e3496;--color-sec-2-2: #70178c;--color-sec-2-3: #490360;--color-sec-2-4: #360147;--color-com-0: #af780b;--color-com-1: #e3af48;--color-com-2: #d4961c;--color-com-3: #916000;--color-com-4: #6b4700}#cmc_applet{position:fixed;top:2em;right:0;z-index:999999;background-color:var(--color-pri-0);color:var(--color-front);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-transition:all 1s;transition:all 1s;font-size:initial;--size: -10em;max-height:80vh}#cmc_applet.off{right:var(--size)}#cmc_applet.off #cmc_applet_controls>:nth-child(1){-webkit-transform:rotateY(180deg);transform:rotateY(180deg)}#cmc_applet.off-trans,#cmc_applet.off-trans *{-webkit-transition:none !important;transition:none !important}#cmc_applet a{color:var(--color-com-1);text-decoration:none}#cmc_applet a:hover{color:var(--color-com-3)}#cmc_applet_controls{display:-webkit-box;display:-ms-flexbox;display:flex;background-color:var(--color-sec-2-0)}#cmc_applet_controls_btn-toggle{all:unset;cursor:pointer;-webkit-transition:all 0.5s;transition:all 0.5s;padding:0.5em 0.25em;background-color:var(--color-sec-2-1);color:white;font-size:2em;text-align:center;width:1em}#cmc_applet_controls_btn-toggle:hover{background-color:var(--color-sec-2-3)}#cmc_applet_controls_buttons{width:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:left;-ms-flex-pack:left;justify-content:left;-webkit-box-align:center;-ms-flex-align:center;align-items:center}#cmc_applet_controls_buttons div{all:unset;cursor:pointer;overflow:hidden;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:var(--color-pri-1);border-radius:0.5em;margin:0 0.1em;padding:0 0.5em;min-width:0.5em;height:1.5em;font-size:2em;-webkit-transition:background-color 0.5s;transition:background-color 0.5s}#cmc_applet_controls_buttons div:hover{background-color:var(--color-pri-4)}#cmc_applet_data{overflow:hidden;overflow-y:auto}#cmc_applet_data ol{margin:0;padding:0;list-style:none}#cmc_applet_data ol li{display:-ms-grid;display:grid;counter-increment:list-pos;padding:0.5em 0;padding-right:0.5em;-ms-grid-rows:auto auto;-ms-grid-columns:3em auto;grid-template:auto auto / 3em auto;grid-template-areas:"marker name" "remove desc "}#cmc_applet_data ol li:nth-of-type(even){background-color:var(--color-pri-1)}#cmc_applet_data ol li::before{font-weight:bold;-ms-grid-column-align:center;justify-self:center;-ms-grid-row:1;-ms-grid-column:1;grid-area:marker;content:counter(list-pos)}#cmc_applet_data ol li :nth-child(1){font-weight:bold;-ms-grid-row:1;-ms-grid-column:2;grid-area:name}#cmc_applet_data ol li :nth-child(2){justify-self:center;-ms-grid-row:2;-ms-grid-column:1;grid-area:remove;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:1em;height:1em;font-size:1.5em;border-radius:0.25em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;background-color:var(--color-com-1);-webkit-transition:background-color 0.5s;transition:background-color 0.5s}#cmc_applet_data ol li :nth-child(2):hover{background-color:var(--color-com-4)}#cmc_applet_data ol li :nth-child(3){-ms-grid-row:2;-ms-grid-column:2;grid-area:desc;font-size:0.8em;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:left;-ms-flex-pack:left;justify-content:left;-webkit-box-align:center;-ms-flex-align:center;align-items:center}
`;

function getModpacks()
{
    return GM_getValue("modpacks", {});
}

function setModpacks(modpacks)
{
    GM_setValue("modpacks", modpacks);
}

function getMods()
{
  return GM_getValue("mods", {});
}

function setMods(mods)
{
   GM_setValue("mods",mods);
}

function getAuto()
{
    return GM_getValue("auto", false);
}

function setAuto(auto)
{
    GM_setValue("auto", auto);
}

function toggleHide()
{
    GM_setValue("hide", !GM_getValue("hide", false));
}

function setHide(hide)
{
    GM_setValue("hide", hide);
}

function isHide()
{
    return GM_getValue("hide", false);
}

function createModpack()
{
    let projectIcon = $(".project-avatar a img", $("header"))[0].src;
    let projectName = $("div div h2", $("header"))[0].innerText;
    let projectFile = $("section > article > div > div > a > h3")[0].innerText;

    let mods = {};
    let cmods = getMods();
    Array.from($("section .items-start div")[0].children).forEach(el => {
        let name = $("div div p a", el)[0].innerText;
        if (!(name in cmods))
        {
            let mod = {};
            mod.name = name;
            if ($("figure div a img", el)[0]) mod.img = $("figure div a img", el)[0].src;
            else
            {
                let url = $("figure div", el[0]).css("background-image").substr(5);
                mod.img = url.substr(0,url.length-2);
            }

            let urldiv = $("div div p a", el)[0];
            if(urldiv)
            {
                mod.url = urldiv.href;
            }
            cmods[name] = mod;
        }
        mods[name] = cmods[name];
    });

    setMods(cmods);

    return {icon: projectIcon, name: projectName, file: projectFile, mods: mods};
}


class CMCApplet
{
    construction()
    {
        this.buttons = [];
    }

    setButtons(btns)
    {
        this.buttons = btns;

        this.buttons.forEach(btn => {
            if(btn.onUpdate) btn.onUpdate();
        });
    }

    create()
    {
        let app = document.createElement("div");
            app.setAttribute("hidden", true);
            app.id = "cmc_applet";
            app.classList.add("off-trans");

        let controls = document.createElement("div");
            controls.id = "cmc_applet_controls";

        let bToggle = document.createElement("div");
            bToggle.id = "cmc_applet_controls_btn-toggle";
            bToggle.innerHTML = "&RightTriangle;";
            bToggle.onclick = bToggle_onclick;

        let divButtons = document.createElement("div");
            divButtons.id = "cmc_applet_controls_buttons";

        controls.appendChild(bToggle);
        controls.appendChild(divButtons);

        let divData = document.createElement("div");
            divData.id = "cmc_applet_data";

        app.appendChild(controls);
        app.appendChild(divData);

        document.body.appendChild(app);

        return this;
    }

    createListEntry(id, modpack)
    {
        let li = document.createElement("li");

        let divName = document.createElement("div");
        let   aName = document.createElement("a");
              aName.href = id;
              aName.innerHTML = modpack.name;
        divName.appendChild(aName);

        let divDesc = document.createElement("div");
            divDesc.innerHTML = modpack.file;

        let btnRemove = document.createElement("div");
            btnRemove.setAttribute("modpackID", id);
            btnRemove.onclick = btnRemove_onclick;
            btnRemove.innerHTML = "-";

        li.appendChild(divName);
        li.appendChild(btnRemove);
        li.appendChild(divDesc);

        return li;
    }

    render()
    {
        let btns = document.getElementById("cmc_applet_controls_buttons");
        this.buttons.forEach(btn => btns.appendChild(btn));

        let data = document.getElementById("cmc_applet_data");

        let ol = document.createElement("ol");
        let modpacks = getModpacks();
        for (let modID in modpacks)
        {
            ol.appendChild(this.createListEntry(modID, modpacks[modID]));
        }

        data.appendChild(ol);


        document.getElementById("cmc_applet").removeAttribute("hidden");

        let size = btns.clientWidth;
        document.getElementById("cmc_applet").style.setProperty('--size', `-${size}px`);
        if(isHide()) document.getElementById("cmc_applet").classList.add("off");
        else document.getElementById("cmc_applet").classList.remove("off");
    }

    update()
    {
        $("#cmc_applet_control_buttons").empty();
        $("#cmc_applet_data").empty();

        this.buttons.forEach(btn => {
            if(btn.onUpdate) btn.onUpdate();
        });

        this.render();
    }
}

function bToggle_onclick()
{
    $("#cmc_applet")[0].classList.remove("off-trans");
    toggleHide();
    applet.update();

}

function bSelect_onclick()
{
    let mps = getModpacks();

    if (Object.keys(mps).length >= 5) return;

    if (mps[window.location.href]) delete mps[window.location.href];
    else
    {
        mps[window.location.href] = createModpack();
    }
    setModpacks(mps);

    applet.update();
}

function bClear_onclick()
{
    setModpacks({});
    applet.update();
}

function bComp_onclick()
{
    if (Object.keys(getModpacks()).length <= 0) return;
    setAuto(true);
    GM_openInTab("https://akeeru.gitlab.io/", {active: true});
    applet.update();
}

function bCompare_onclick()
{
    unsafeWindow.scriptTryLoad(true);
}

function btnRemove_onclick()
{
    let modpackID = this.getAttribute("modpackID");

    let mps = getModpacks();

    if (mps[modpackID]) delete mps[modpackID];

    setModpacks(mps);

    applet.update();
}

var applet;

function createApplet()
{
    GM_addStyle(style);

    if(!applet) applet = new CMCApplet().create();

    if(window.location.href.match(cfPatt))
    {
        createCurseApplet();
    }
    else if (window.location.href.match(cmcPatt))
    {
        createPageApplet();
    }
}

function createCurseApplet()
{
    let bSelect = document.createElement("div");
        bSelect.onUpdate = function () {
            if (getModpacks()[window.location.href]) this.innerHTML = "-";
            else this.innerHTML = "+";
        };
        bSelect.onclick = bSelect_onclick;

    var bClear = document.createElement("div");
        bClear.innerHTML = "Clear";
        bClear.onclick = bClear_onclick;

    var bComp = document.createElement("div");
        bComp.innerHTML = "Compare";
        bComp.onclick = bComp_onclick;


    applet.setButtons([bSelect, bClear, bComp]);

    applet.render();
}

function createPageApplet()
{
    unsafeWindow.getModpacks = () => { var mps = getModpacks(); return mps; };
    unsafeWindow.cmcAutoCompare = getAuto();

    if (getAuto()) setAuto(false);

    var bClear = document.createElement("div");
        bClear.innerHTML = "Clear";
        bClear.onclick = bClear_onclick;

    var bCompare = document.createElement("div");
        bCompare.innerHTML = "Compare";
        bCompare.onclick = bCompare_onclick;

    applet.setButtons([bClear, bCompare]);

    applet.render();
}

function createComparatorApllet()
{
    unsafeWindow.getModpacks = () => { var mps = getModpacks(); return mps; };
    unsafeWindow.cmcAutoCompare = getAuto();
}

(function() {
    'use strict';

    createApplet();

    $(unsafeWindow).on("focus", () => {
        if(applet) applet.update();
        else createApplet();
    });
})();
