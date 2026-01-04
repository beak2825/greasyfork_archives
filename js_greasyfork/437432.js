// ==UserScript==
// @name         TurboLoader
// @namespace    https://lstv.ml/
// @version      2.14.1
// @description  An an UI to quickly manage plugins, addons and themes.
// @author       LSTV
// @match        *://turbowarp.org/editor*
// @match        *://packager.turbowarp.org/
// @icon         https://www.google.com/s2/favicons?domain=turbowarp.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437432/TurboLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/437432/TurboLoader.meta.js
// ==/UserScript==

// note that lstv.ml is dead and is not comming back (ml domains in general are now unavailable)
// my website is https://lstv.space


/*

    Revisit September 26 2024

    This is NOT a feature update. This code is terrible and needs major revisions.
    I am only updating the CDN URL to work again from the archive.

    Repeat, this is not an update, only a maintenance hotfix.

    This script will not receive major updates unless it is wanted by the community.
    I have shifted all work regarding Scratch modding towards QuickSand.

*/


// The code below is extremely old and made when I didnt really know what was I doing.
// I mean it works though..
// I mean just look at the poor formatting (please dont) :D
// I am kinda ashamed of this code.
// Should I release a remaster?

let isPackager = location.host.includes("packager"),
    repo = 'https://raw.githubusercontent.com/lukas-studio-tv/TurboWarpPluginUI/main/',
    resourceCDN = "https://cdn.extragon.cloud/archive/turboloader_resources",
    defaultCDN = "https://cdn.extragon.cloud/archive/tw",

    TurboLoader = {
        PublicVersion: 2.14, serverData: {}
    }
;

let Content = {
    plugins: [
        {
            name: "Utils V2",
            id: 10,
            description: `Multi-purpose plugin that fills many of the holes that
Scratch has. Adds many new operators, allows selecting
and reading files, fetching sites, executing scripts, adding
styles, changing cursors, rendering text/images and waay
more.`,
            color: "#507750",
            isRemote: true,
            mirror: "/UtilsV2/"
        },

        {
            name: "GameJolt API",
            id: 11,
            description: `GJ API wrapper made for Scratch!
Allows you to get GJ profile details, add trophies,
use scoreboards, cloud storage and more to extend your game.`,
            color: "#2F7F6F",
            isRemote: true,
            mirror: "/GameJoltAPI/",
            updated: true
        },

        {
            name: "AudioStream",
            id: 12,
            description: `Ever thought that the default sound blocks in Scratch are
just too weak? Fear no more with theese advanced!
You can now play audio from any sprite/file/URL, skip in time,
play/pause, add effects, and speed/pitch up the song.
It has everything that Scratch has and more.`,
            color: "#A832A8",
            isRemote: true,
            mirror: "/AudioStream/",
            updated: true
        },

        {
            name: "Pen+",
            id: 20,
            description: `A custom Scratch rendering pipeline that allows for higher quality 3D and neat 2D effects.<br>Author: <a href="https://gamejolt.com/@Obviousalexc">@Obviousalexc</a><br><a href="https://gamejolt.com/games/Scratch-penplus/756390">Learn more</a>`,
            color: "#00a769",
            isRemote: true,
            mirror: "/PenPlus/",
        },

        {
            name: "JSONUtils",
            id: 13,
            description: `JSON is amazing, simple, and powerfull.
Are you tired of lists in scratch and need something more?
JSONUtils got you covered!
Store better lists with keys, parse or generate JSON code,
and save game data for each user using localstorage.`,
            color: "#21C7FF",
            isRemote: true,
            mirror: ""
        },

        {
            name: "ScratchZIP",
            id: 14,
            description: `A plugin that adds full ZIP capability to scratch using
blocks.
Can create, compress & read ZIP archives using
interactive blocks.`,
            color: "#FEE75C",
            isRemote: true,
            mirror: ""
        },

        {
            name: "OverlayGL",
            id: 15,
            description: `Plugin for rendering overlays.
For example, play YouTube or local videos, draw HTML,
view some websites, use code editors, unleash your
creativity.`,
            color: "#FF6A6A",
            isRemote: true,
            mirror: ""
        },

        {
            name: "SimplyText",
            id: 16,
            description: `Ever tought of the Scratch'es lack of any proper text
rendering? This plugin is for you then!
No more slow text draw engines!
It allows you to instantly render text, in any font and style.
Extended and upgraded version of the text block from
UtilsV2.`,
            color: "#161616",
            isRemote: true,
            mirror: ""
        },

        {
            name: "QuickSand",
            id: 17,
            description: `Need precise on-time calculations or graphics?
            Or feel like your game is just way too slow?
            The QuickSand engine allows you to add components
            that run outside of the ScratchVM so they aren’t limited by
            it. Perfect for, for example, rythm games, that need precise
            movement and images drawing. `,
            color: "linear-gradient(158.04deg, #6AC1FF 14.37%, #C349D7 87.19%)",
            isRemote: true,
            mirror: ""
        },

        {
            name: "Turbocord",
            id: 18,
            description: `This plugins allows you to integrate Discord APIs with
            your Scratch project. This means webhooks,
            OAuth, and with ARC also Rich Presence and bots.
            [ preview only at this moment ]`,
            color: "linear-gradient(156.38deg, #5865F2 15.21%, #2E38A8 86.57%)",
            isRemote: true,
            mirror: ""
        },

        {
            name: "FetchAPI",
            id: 19,
            description: `Fetch client (like fetchSync, Ajax or xhr), but for Scratch.
            Allows you to download/fetch/send data over to any
            server or URL of your choice.
            COMES WITH A FREE CORS-BYPASS PROXY!
            Features: GET, POST, PUT, DELETE etc, custom headers,
            ping and more.`,
            color: "#D08900",
            isRemote: true,
            mirror: ""
        }
    ],

    themes: [
        {
            name: "AMSTheme",
            id: 0,
            description: `Minimalistic, precise theme inspired by AMS studio.`,
            iconTransparency: false,
            color: "#151F0D",
            source: ""
        },
    ],

    addons: [
        {
            name: "Horizontal sprite menu",
            description: "Converts your traditional grid menu to a compact horizontal one.",
            screenshots: [],
            main: () => {
                //:sandbox
            }
        }
    ]
}

function TurboWarp(){
    if(!O().has('#plui'))O().add(N('div',{id:'plui',className:'plmenu'}));
    window.plTab="plugins";
    window.setTab=function(t){
        S(O(".pltab_"+window.plTab),{display:"none"});
        S(O(".pltab_"+t),{display:"block"});
        window.plTab=t;
    }
    O('#plui').set([
        N('div',{className:'plheader',innerHTML:'<h4>TurboLoader</h4>'}),
        N('div',{className:'plcontent',inner:[
            N('div',{className:'pltabs',inner:[
                N('div',{className:'pltab active',innerHTML:'Plugins'}),
                N('div',{className:'pltab',innerHTML:'Addons/Themes'}),
                N('div',{className:'pltab',innerHTML:'Packager'})
            ]}),
            N('div',{className:'pltabc pltab_plugins',inner:[
                N('div',{className:'plist',inner:[
                    N('input',{style:S({width:'calc(100% - 72px)',height:"22px","margin-left":"5px"}),attr:{placeholder:"Search...",Array:["ls","fluent"]},oninput:function(){Q(".pltab_plugins .plist>div.plcard").forEach(a=>{a.style.display=(a.get("h4").innerText+a.get("span").innerText).replaceAll(" ","").toLowerCase().includes(this.value.replaceAll(" ","").toLowerCase())?"block":"none"})}}),
                ]})
            ]}),
            N('div',{className:'pltabc pltab_addonsthemes',inner:[
                N("div",{inner:[N("div",{inner:[
                    N("img",{style:"width:140px;margin-bottom:15px",src:"https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/color/tool-dynamic-color.png"}),
                    /*blur*/N("img",{style:"width:185px;position:absolute;filter:blur(40px);-webkit-filter:blur(40px);z-index:-1;left:50%;transform:translateX(-50%)",src:"https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/color/tool-dynamic-color.png"}),
                    N("h1",{style:"font-weight:900",innerHTML:"Sorry!"}),
                    N("span",{style:"color:#868686",innerHTML:"You do not have access here yet.<br>After we do some more tests, you'l get it!<br>I'll let you know when that happens."})
                ]})],style:"display:flex;align-items:center;justify-content:center;text-align:center;height:100%"})
            ]}),
            N('div',{className:'pltabc pltab_packager',inner:[
                N("iframe",{src:"https://packager.turbowarp.org/",id:"tl_packager",style:`border:0;width:100%;height:calc(100% - 55px)`})
            ]}),
            N('div',{className:'plbuttonbar',inner:[
                N('button',{attr:['tw'],onclick:()=>{O(".plmenu").classList.remove("open")},innerHTML:"Close",style:S({background:'#fff',color:'#000'})})
            ]})
        ]}),
    ])
    Q('#plui .pltab').forEach(t=>t.onclick=function(){Q('#plui .pltab').map(e=>e.classList[e==this?'add':'remove']('active'));setTab(this.innerText.trim().toLowerCase().replace(/\//g,''))})
    //O(".pltab_themes").innerHTML=O(".pltab_addons").innerHTML//temporary, and i didnt use .set() because it for some reason steals the content instead of copying
    window.PackagerSend=d=>O("#tl_packager").contentWindow.postMessage({from:"turbowarp",data:d},O("#tl_packager").src);
    try{
    (async()=>{
        Content.plugins=Content.plugins.map(p=>{p.mirror=p?.mirror?.length?p.mirror.includes("http")?p.mirror:defaultCDN+p.mirror:"";return p});
        for(const p of Content.plugins){
            O('.pltab_plugins .plist')?.add?.(N('div',{
                className:'plcard',
                inner:[
                    N('div',{
                        className:'plbanner',
                        style:S({background:p.color}),
                        inner:[
                            p.updated?N("span",{style:"position:absolute;top:9px;background:#32323280;color:#fff;padding:5px;border-radius:6px;left:9px",innerText:"Recently updated"}):"",
                            N('img',{
                                attr:{
                                    draggable:'false'
                                },
                                className:'plicon',
                                src:await getImage(resourceCDN+'/icons/'+p.id+'.svg?nc')
                            })
                        ]
                    }),
                    N('h4',p.name),
                    N('span',{innerHTML:p.description,style:S({
                        "font-size":'10px'
                    })}),
                    N('div',{className:'plbuttonbar',attr:["ch"],inner:
                        (p.mirror.length?[
                            N('button',{attr:{"ui-tooltip":"Install plugin",Array:['tw','ls','fluent']},innerHTML:"Install",onclick:function(){installPlugin(p,this)}}),
                            N('button',{style:"width:25px;height:25px;min-width:0;margin:6px 0;padding:4px",attr:{"ui-tooltip":"Force update",Array:['tw','ls','fluent']},innerHTML:'<svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" fill-rule="evenodd"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>',onclick:async function(){if(await _confirm("Force reload? This redownloads the plugin even if you have a offline copy.<br>It may help if the plugin is broken due to the copy being corrupted."))installPlugin(p,this,true)}})
                        ]:[N('span',{className:"bgrad",style:S({color:'gray'}),innerHTML:"Soon"})])
                    })
                ]
            }))
        }
    })();
    }catch(e){console.error(e)}

    async function installPlugin(plugin,ref,forceUpdate=false){
        if(typeof plugin=="string")plugin={mirror:plugin};
        plugin.updated=false;
        let url=plugin.mirror;
        var m=modal({loading:!0,title:"Installing plugin",cancelable:!1,content:forceUpdate?"Preparing reload...":"Checking for plugin updates..."}),v,success=null;
        //NOTE: some repetative code here, might need cleanup
        let _install=async d=>{
            let saved="false",outdated=true;
            if(!forceUpdate){
                saved=JSON.parse(window.localStorage["Plugin_"+btoa(url)]||"false");
                outdated=saved?.version<d;
            }
            if(saved&&(!outdated||d===!1)&&!forceUpdate){
                if(d===!1){
                    if(!await _confirm("Couldn't check for updates of this plugin, but you do have a local copy for offline use.\nDo you want to load the copy (may be outdated)?")){m?.close?.();return};
                }
                m.element.get("span>span").set("Installing plugin from local storage...");
                plugin.code=saved?.code;
                try{await addPlugin(plugin)}catch(e){console.error("[TurboLoader] Plugin error ("+url.split("/").filter(f=>f).pop()+"): "+e);success=!1}
                m.close();
                alert(success===!1?"Plugin loaded with errors.\nCheck the console for details and report the issue to the plugin developer.\n<b>Note: If the plugin works without issues, in some cases this might be ignored.</b>":"The plugin was loaded sucessfully (from memory).\nCheck out your block pallete!");
                if(success!==!1)success=!0;
            }
            if(forceUpdate||(((outdated||!saved)&&(d!==!1))||(d===!1&&!saved))){
                if(((d===!1)&&!saved)&&!await _confirm("Warning: couldn't check latest version on the server. Do you still wish to proceed?")){m?.close?.();return} //if failed to check updates & no offline version, warn user before downloading
                m.element.get("span>span").set("Downloading "+(outdated?"update":"plugin")+"...");
                let pl=await fetchAsync(url+"index.js?v="+d+"&cc="+(Math.round(Math.random()*9000)))("text");
                if(pl){
                    localStorage["Plugin_"+btoa(url)]=JSON.stringify({version:d||0,code:pl});
                    m.element.get("span>span").set("Installing "+(outdated?"update":"plugin")+"...");
                    if(outdated)plugin.updated=!0;
                    if(!saved&&!outdated)plugin.firstTime=!0;
                    plugin.code=pl;
                    try{await addPlugin(plugin)}catch(e){console.error("[TurboLoader] Plugin error ("+url.split("/").filter(f=>f).pop()+"): "+e);success=!1}
                    alert(success===!1?"Plugin loaded with errors.\nCheck the console for details and report the issue to the plugin developer.\n<b>Note: If the plugin works without issues, in some cases this might be ignored.</b>":"The plugin was loaded sucessfully.\nCheck out your block pallete!");
                    if(success!==!1)success=!0;
                    m?.close?.();
                }else{
                    m.close();
                    m=await modal({content:outdated?"Couldn't update the plugin! Check your internet connection and status of the CDN.\nAn OUTDATED version of the plugin will now be loaded.":"Couldn't download this plugin and there isn't a offline version available.\nPlease check your internet connection or the status of the CDN!",title:"Failed downloading plugin",buttons:[{text:"Close"},{text:"Retry",color:"gray",element:{onclick:()=>{installPlugin(plugin,ref)}}}]})
                }
            }
            if(success!==!1&&success!==null){
                ref.onclick=()=>{};
                ref.parentElement.innerHTML='<span style="color:#32ee5d" class=bgrad>Plugin installed</span>'
            }else{
                ref.onclick=()=>{};
                ref.parentElement.innerHTML='<span style="color:#ee3232" class=bgrad>Plugin has errors</span>'
            }
        }
        if(!forceUpdate){fetchSync(url+"@version",{bypass_cache:!0})("json")(_install)}else{_install(0)}
    }

    function addPlugin(plugin){
        if(typeof plugin!="object")plugin={code:plugin};
        //Imports the plugin.
        id=btoa(Date.now()/(Math.random()*10)).replaceAll('=','');
        window.__plugin=plugin;
        return new Promise((r,e)=>{
            O().add(N("script",{innerHTML:`window["${id}"]=((TurboLoader)=>{${plugin.code}});`}))
            try{window[id](new PLUGIN_API(plugin))}catch(er){e(er)}
            PackagerSend({plugin:plugin});
            setTimeout(r,1500)
        })
    }

    setTimeout(()=>{
        /*Adds the plugin menu button*/O("div.menu-bar_file-group_1_CHX").add(N("div",{className:"plbutton menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB",innerHTML:`<div><span>Plugins<div style=display:none class=plupdateind><h1 style=font-weight:900>NEW UPDATE</h1><span style=color:#868686>Good news! You got the<br>new version of TurboLoader!<br>Check it out!</span><img style=top:-35px;right:-45px;width:100px src="https://cdn.extragon.cloud/archive/sparkle_2.png?q2"><img style=bottom:-20px;left:-40px;width:80px src="https://cdn.extragon.cloud/archive/sparkle_1.png?q2"></div></span></div>`,onclick:()=>{O(".plmenu").classList.add("open");window.localStorage.updateChecked="true";O(".plupdateind").style.display="none"}}))
        if(!window.localStorage.updateChecked){O(".plupdateind").style.display="block"}
        setTab("plugins");
    }, 700);
    let d=()=>{
        D().documentElement.style.setProperty('--vw-scale',`${0.002*window.innerWidth}`);
    }
    d();
    window.addEventListener('resize',d);
}

function TurboWarpPackager(){
    window.isEmbeded=window.location!==(window?.top||window?.parent)?.location;
    var loadBtnSelector=".card button",plugins=[],ta_replaced=!1,btn_replaced=!1,JSExport,uuid="452defcddce14c9598ad7cdd5eb2edde";
    if(isEmbeded){
        //Only for the embeded packager
        window.importProject=()=>{
            document.body.setAttribute('load','true');
            scroll(0,0);
            (window?.top||window?.parent).postMessage({p4:{type:"ready-for-import"}},"https://turbowarp.org/");
        }
        window.switchCard=(b)=>{
            O("#c_project_select").style.display=b?'block':'none';
            O("#c_project_load").style.display=!b?'block':'none';
            try{O(".option input[type=file]").files=(new DataTransfer()).files}catch(e){}
        }
        window.Package=(preview)=>{
            document.body.setAttribute('load','true');
            //Prepare for packaging
            let build="";
            if(plugins.length){build="window.PLUGIN_API="+PLUGIN_API.toString()+";\n/*--- plugins ---*/\n"+plugins.map(p=>{
                p=JSON.parseFn(JSON.stringifyFn(p));
                let code=p.code;
                delete p.code;p.code=null;
                let c=`((TurboLoader)=>{
                    ${code}
                })(new PLUGIN_API(${JSON.stringifyFn(p)}))`;
                return c+"\n";
            })}
            StoreJS(build);
            setTimeout(()=>{
                document.body.removeAttribute('load');
                (preview?Q(".nobg button").find(e=>e.innerText.toLowerCase().includes("preview")):findExportButton()).click();
            },300)
        }
        addEventListener("message",(e)=>{
            if(e?.data?.from!=="turbowarp"&&!e?.data?.p4)return;
            if(e?.data?.p4?.type=="finish-import"){
                //On import finished event
                let t=new DataTransfer();
                t.items.add(new File([e.data.p4.data],e.data.p4.name,{type:"application/x.scratch.sb3"}));
                O(".options [value=file]").click();
                let d=t.files;
                O('.option input[type="file"]').files=d;
                setTimeout(()=>{
                    O(loadBtnSelector).click();
                    document.body.removeAttribute("load");
                    setTimeout(()=>{
                        scroll(0,375);
                    },70)
                },500)
            }else{
                let d=e.data?.data;
                console.log("[TurboLoader Packager] ",d);
                if(d?.theme)O().setAttribute("theme",d.theme);
                if(d?.ImportProject)importProject();
                if(d?.plugin){
                    plugins.push(d.plugin);
                    //... plugin added event blah blah blah ...
                }
            }
        })
        O().setAttribute("tl_embeded","true")
    }
    function findExportButton(){return Q(".nobg button").find(e=>e.innerText.toLowerCase().includes("package"))}
    function _updateUI(){
        Q(".card:not(.iterated)").map(c=>{
            c.classList.add("iterated");
            if(c.style.borderTop.replace(/\s/g,'').includes("76,76")){c.className="tl_title";if(isEmbeded){c.get("h1")?.remove();O("footer").innerHTML+="<br>"+c.innerHTML;c.innerHTML="<h1>TurboWarp Packager</h1><span class=tl_tag>EMBEDED</span>"}else{}}
            if(c.style.borderTop.replace(/\s/g,'').includes("76,151")){if(isEmbeded){c.id="c_project_select";c.style.display="none";c.parentElement.appendChild(N("div",{className:"card svelte-1qy2cex iterated",id:"c_project_load",style:"--card-color:76,151,255",innerHTML:"<h2>Load project</h2>Click below to load the current editing project to the packager.<br>Plugins you have installed in the editor will be automatically packaged!<br><b>NOTE: </b>When you make a change to your project or load a different one, click this button again to update it.<br><button ls class=svelte-16o14py onclick='importProject()'>Load project</button><br><a href=# onclick='switchCard(!0)'>Load a different project</a>"}));O(loadBtnSelector)?.parentElement?.appendChild?.(N('a',{href:"#",onclick:()=>switchCard(!1),innerHTML:"<br>Load current project"}))}}
            let color=c.style.borderTop.match(/\((.*?)\)/)?.[1];
            c.style.setProperty("--card-color",color||"0,0,0");
            if(!color){c.classList.add("nobg");c.style.padding="10px 30px"};
        })
        Q("input:not(ls),textarea:not([ls]),select:not(ls)").map(i=>{i.setAttribute("ls","1");i.setAttribute("fluent","1")});
        Q("button.svelte-16o14py:not([ls])").map(i=>i.setAttribute("ls","1"));
        Q(".nobg button.svelte-16o14py:not([fluent])").map(i=>i.setAttribute("fluent","1"));
        if(!Q("textarea")?.[2])ta_replaced=!1;
        if(!findExportButton())btn_replaced=!1;
        if(!ta_replaced&&Q("textarea")?.[2]){
            console.warn("Exchanged JS inputs");
            ta_replaced=!0;
            let JSField=Q("textarea")[2],CustomJSField=N("textarea",{style:"height:153px",id:"tl_customjs",placeholder:"Add your custom JS code here.\nPlugins are now automatically packaged, no need to do anything.",className:"svelte-1iqxbmk"});
            window.StoreJS=(js=!1)=>{
                JSField.value="/*--- API ---*/\n"+(js||JSExport)+"\n\n/*--- custom js ---*/\n/*"+uuid+"*/"+CustomJSField.value;
                JSField.dispatchEvent(new Event('input'));
                JSField.dispatchEvent(new Event('change'));
            };
            if(JSField.value.includes(uuid)){CustomJSField.value=JSField.value.substring(JSField.value.indexOf("/*"+uuid+"*/"),JSField.value.length).replace("/*"+uuid+"*/",'')}else{StoreJS(" ")};
            JSField.parentElement.appendChild(CustomJSField);
            JSField.style.display="none";
            StoreJS(" ");
            CustomJSField.oninput=()=>StoreJS(" ");
        }
        if(isEmbeded&&!btn_replaced&&findExportButton()){
            console.warn("Exchanged package buttons");
            btn_replaced=!0;
            let OG=findExportButton().parent(1),NEW=N("div",{attr:["fl"],innerHTML:"<button class=svelte-16o14py ls fluent onclick=Package()>Package</button><button onclick=Package(!0) class=svelte-16o14py ls fluent style=background:rgb(15,189,140);margin-left:3px!important>Preview</button>"});
            OG.style.display="none";
            OG.parentElement.appendChild(NEW);
        }
    }
    setInterval(_updateUI,1400);
    E(O(),_updateUI);//element observer
    O("#svelte-98renn")?.remove?.();
    O("head").add(N("style",`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700;1,800;1,900&display=swap');
    body,html{--font:Poppins,Montserrat,Rubik;scroll-behavior:smooth;background:#181818!important;color:#bbb}
    .card.svelte-1qy2cex{background:linear-gradient(180deg,rgba(var(--card-color),0.3) 0%,rgba(0, 0, 0, 0.15) 55px,rgba(0, 0, 0, 0.15) 100%)!important;box-shadow:inset 0px 1px 0px rgb(255 255 255 / 20%);border-radius:17px;padding:10px 30px 30px;border:none!important;margin-bottom:30px}
    .card h1,.card h2{text-align:center;color:rgb(var(--card-color));filter:brightness(1);margin:0;margin-bottom:35px;z-index:0;position:relative}
    footer{text-align:center;padding:10px;margin:30px 0}
    button.svelte-16o14py{display:block;margin:10px 0!important}
    select{margin:10px 0 0 0!important}
    button.svelte-zife22{position:relative;z-index:1;margin-right:-18px!important}
    body[tl_embeded]{padding-top:0!important}
    [tl_embeded] footer select{display:none}
    .tl_title h1{color:#fff;font-size:30px;font-weight:700}
    .tl_tag{background:#FF4C4C;box-shadow:inset 0px 1.33547px 0px rgba(255, 255, 255, 0.38);border-radius:9px;font-weight:900;font-size:13px;letter-spacing:0.12em;color:#181818;padding:5px 12px;display:inline-block;margin:8px 0}
    .tl_title{max-width:720px;border:0!important;margin:45px auto;margin-top:10px;box-sizing:border-box;padding:0 20px}
    .card.svelte-1qy2cex.modal{background:#181818!important;--card-color:255,255,255!important}
    .card.svelte-1qy2cex.modal h2{margin-bottom:10px!important}
    [load]:after{content:'🔄'!important}
    body[load]{overflow:hidden}`))
}

/*
    CHECKPOINT: Libraries
*/
/*TinyFramework*/var TinyFramework={Q:(e,q)=>(e?.tagName&&!q?[e]:[...(e?.tagName?e:D()).querySelectorAll(e?.tagName?!q?'*':q:typeof e=='string'?e:'*')])?.map(r=>{Object.assign(r,{isElement:!0,attr(specific=!1){let a=r.attributes,c={};Object.keys(a).map(b=>c[a[b].nodeName]=a[b].nodeValue);return specific?c[specific]:c},get:(t='*')=>O(r,t),getChildern:q=>Q(r.query()+'>'+q||'*'),child:i=>r.children[i||0],getAll:(t='*')=>Q(r,t),add:(a='')=>{if(typeof a=='string'||a?.tagName)a=[a];a.forEach(i=>r[i?.tagName?'appendChild':'append'](i));return r.self},addOnce(a){if(!O('#'+a.id))r.add(a)},setStyle:(...a)=>S(r.self,...a),getStyle:_=>S(r.self),set:(...a)=>{r.innerHTML='';return r.add(...a)},has:(...a)=>{return !!a.find(l=>r.get(l))},watch:c=>E(r,c),parent:(n=0)=>r.tagName=='BODY'?r.parentElement:(n>0?O(r.parentElement).parent(n-1):r.parentElement),self:r,path:()=>{let p=[r],i=0;while(p[p.length-1]?.tagName!='HTML'){p.push(r.parent(i));i++}return p.reverse()},query:()=>r.path().map(r=>r.tagName+(r.className?'.'+r.className.replace(/\s/g,'.'):'')+(r.id?'#'+r.id:'')).join('>'),queryPath:r.query});return r.self}),O:(...e)=>{e=e.length<1?['body']:e;return Q(...e)[0]},D:()=>document,N:(e='div',o={})=>{let n=O(Object.assign(D().createElement(e),(typeof o=='string'?{innerHTML:o}:o)));if(Array.isArray(o?.attr)){o.attr={'Array':o.attr}}if(o?.attr){Object.keys(o.attr).forEach(k=>{if(k=='Array'){o.attr[k].map(_=>n.setAttribute(_,''));return}n.setAttribute(k,o.attr[k]||'')})}if(o?.inner||o?.content){n.add(o?.inner||o?.content)}return n},S:(e,s)=>!s?!e?O():(e.id!==void 0)?getComputedStyle(e):typeof e=='string'?O(e):Object.keys(e).map(f=>f+':'+e[f]).join(';'):(Array.isArray(e)?e:!e?[O()]:[e]).forEach(m=>{m=typeof m=='string'?O(m):m;Object.assign(m.style,s)}),E:(b,c)=>{if(typeof c!='function'){let _c=c,_b=b;c=()=>{try{S(Q(_b),_c)}catch(e){}};b=O()}new (window.MutationObserver||window.WebKitMutationObserver)(r=>{c([...r[0].addedNodes].map(n=>O(n)),[...r[0].removedNodes].map(n=>O(n)))}).observe(b,{childList:!0,subtree:!0});return O(b)}}
JSON.parseFn=function(str){return JSON.parse(str,function(key,v){if("string"!=typeof v||!v.includes("("))return v;try{return eval(v.startsWith("(")||v.trim().startsWith("f")||v.trim().startsWith("c")?"({value:"+v+"}).value":"({"+v+"})[\""+key+"\"]")}catch(a){return v}})};
JSON.stringifyFn=function(a){return JSON.stringify(a,function(a,b){return"function"==typeof b?b.toString():b})};
var fetchSync=(...a)=>b=>{let d=d=>{a[0]=a[1]?.bypass_cache?(a[0]+(a[0].includes('?')?'&':'?')+'cache='+btoa(Date.now()/(Math.random()*10)).replaceAll('=','')):a[0];a[0]=a[0].includes('://')||a[1].local?a[0]:window.location.protocol+'//'+a[0];let ts=Date.now();try{fetch(...a).then(q=>q).then(async q=>{let _t="string"==typeof b?b:"text";d(_t=='ping'?(q.ok?(a[1]?.ping?(a[1]?.ping==await q.text()?Date.now()-ts:!1):Date.now()-ts):!1):await q[_t](),Date.now()-ts)}).catch(w=>d(!1))}catch(e){d(!1)}};return"string"==typeof b?a=>{d(a)}:void d(b)},fetchAsync=(...c)=>async(a)=>new Promise(b=>{fetchSync(...c)(a)(a=>{b(a)})});
/*Downloads image and forces caching by storing it in localStorage*/function getImage(b,id){return new Promise(async e=>{let f=id||"Cache_"+btoa(b.replaceAll(/[\/\\\:]/gi,"").replace("https","").replace("http","").trim()),a=localStorage[f];if(a){e(a);return};if(b.includes(".svg")){let svg="data:image/svg+xml;base64,"+btoa(await fetchAsync(b,{local:false})("text"));localStorage[f]=svg;e(svg);return};var d=new Image;d.src=b;d.crossOrigin="Anonymous",d.onload=function(){var b=document.createElement("canvas"),a=b.getContext("2d");b.height=this.naturalHeight,b.width=this.naturalWidth,a.drawImage(this,0,0);var c=b.toDataURL("image/png");localStorage[f]=c,e(c)}})}
if(!window?.Globalise){window.Globalise=(...b)=>b.map(a=>typeof(a)=='string'?(()=>window[a]=window?.[a]||null)():Array.isArray(a)?a.map(v=>window[v]=window?.[v]||null):Object.keys(a).map(v=>window[v]=a[v]))};
const {S,Q,O,D,E,N}=TinyFramework;
Globalise(TinyFramework,{modal:modal,fetchSync:fetchSync,fetchAsync:fetchAsync,getImage:getImage});
function modal(opt={}){
    opt=Object.assign({
        title:"Alert",
        content:"",
        cancelable:true,
        buttons:[
            {text:"OK"},
            {text:"Cancel",color:"gray"},
        ],
        loading:false,
        use:!1
    },opt);
    let element=N("div",{
        attr:{"ls-modal":"true"},
        className:"closed",
        style:opt.style,
        onclick:e=>{if(opt.cancelable&&O(e.target).attr("ls-modal"))close()},
        inner:[!opt.use?N('div',{
            inner:[
                N('span',{
                    inner:[N("b",opt?.title?opt.title+"<br>":""),N("span",opt.content.trim())]
                }),
                N('div',{
                    inner:opt.loading?[N("div",{attr:["ls-load"]})]:opt.buttons?.map?.((b,i)=>N('button',Object.assign({attr:["ls","fluent",b.color?"ls-"+b.color:'ls-blue'],className:"btn-index-"+i,innerHTML:b.text},(b?.element||{})))),
                    attr:["dialog_bottom"]
                })
            ],
            attr:["modal_body","dialog_body"]
        }):opt.use]
    });
    let close=function(ref){element.classList.add('closed');let id=ref?.className.includes("btn-index-")?(+ref?.className.replaceAll(/[a-z-]/g,"")):void 0;opt?.onclose?.(id);return id};
    element.getAll("button").forEach(e=>e.addEventListener("click",()=>close(e)))
    O().add(element);
    setTimeout(()=>{element.classList.remove('closed')},20);
    return {
        element:element,
        close:close,
        open:()=>element.classList.remove('closed')
    }
}
//comment following if you don't want to override default methods
Globalise({alert:(m,opt={})=>new Promise((r)=>modal(Object.assign({content:m,buttons:[{text:"OK"}],onclose:r},opt))),_confirm:(m,opt={})=>new Promise((r)=>modal(Object.assign({content:m,cancelable:false,buttons:[{text:"OK"},{text:"Cancel",color:"gray"}],onclose:(b)=>r(!b)},opt)))})

if(!O().has('#plugin_loader_styles'))O().add(N('div',{id:'plugin_loader_styles'}));
/*
    Following is just CSS for the UI
*/
O('#plugin_loader_styles').set(N('style',`
@import url('https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900');

/*Copyright (c) LSTV 2022*/
@import url('data:text/css;charset=utf-8;base64,OnJvb3R7LS1hY2NlbnQ6IzAwODVGRjstLWFjY2VudC10cjojMDA4NGZmODA7LS1hY2NlbnQtZGFyazojMDA1ZWI2Oy0tbHN0di15ZWxsb3c6I0ZGRTEwOTstLWxzdHYtcmVkOiNGRjI4Mjg7LS1sc3R2LWJsdWU6IzAwRDFGRn1he2NvbG9yOiMwMDg1RkY7dGV4dC1kZWNvcmF0aW9uOm5vbmV9aDEsaDIsaDMsaDQsaDUsaDYscCxoZWFkZXIsYm9keSxodG1se21hcmdpbjowfWgxLGgyLGgzLGg0LGg1LGg2LGhlYWRlcntmb250LXdlaWdodDo3MDB9W2xzXTpub3QoW2ZsdWVudF0saW5wdXQsdGV4dGFyZWEsc2VsZWN0KXtiYWNrZ3JvdW5kOnZhcigtLWFjY2VudCkhaW1wb3J0YW50O2NvbG9yOnZhcigtLWNvbG9yLWZsaXApfWJ1dHRvbltsc117Y3Vyc29yOnBvaW50ZXJ9W2xzXXtiYWNrZ3JvdW5kOnZhcigtLWJhY2tncm91bmQpO2JvcmRlcjowO2JvcmRlci1yYWRpdXM6OXB4O3BhZGRpbmc6NXB4IDEwcHg7bWFyZ2luOjZweCAwO291dGxpbmU6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTtjb2xvcjp2YXIoLS1jb2xvci1mbGlwKX1bbHNdOm5vdChbZmx1ZW50XSl7Ym94LXNoYWRvdzowIDNweCAwIDAgdmFyKC0tYWNjZW50LWRhcmspLGluc2V0IDAgMCAwIDFweCB2YXIoLS1hY2NlbnQpfVtsc11bZmx1ZW50XXtiYWNrZHJvcC1maWx0ZXI6Ymx1cigyNXB4KTtib3JkZXItcmFkaXVzOjdweDtvcGFjaXR5Oi45O2JveC1zaGFkb3c6MCAxNXB4IDI0cHggLTEwcHggIzAwMDAwMDU1LGluc2V0IDAgLjJweCAwIDEuMXB4ICNmZmZmZmYyOX1pbnB1dFtsc106bm90KFtmbHVlbnRdKTpmb2N1cyxbbHNdOmFjdGl2ZTpub3QoW2Rpc2FibGVkXSk6bm90KFtmbHVlbnRdKSx0ZXh0YXJlYVtsc106Zm9jdXN7Ym94LXNoYWRvdzowIDEuNXB4IDAgMCB2YXIoLS1hY2NlbnQtZGFyayksaW5zZXQgMCAwIDAgMXB4IHZhcigtLWFjY2VudCksMCAxNHB4IDIwcHggLTVweCB2YXIoLS1hY2NlbnQtdHIpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEuNXB4KX1bbnNdLFtsb2FkXSAqLFtsb2FkXXstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXRvdWNoLWNhbGxvdXQ6bm9uZX1bbnBdLFtsb2FkXSAqLFtsb2FkXXtwb2ludGVyLWV2ZW50czpub25lfVtsc11bc3dpdGNoXT4qe3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHg7ZGlzcGxheTppbmxpbmUtZmxleH1bbHNdW3N3aXRjaF0gaXttYXJnaW46MH1bbHNdW3N3aXRjaF17cGFkZGluZzowO2N1cnNvcjpwb2ludGVyfVtsc11bc3dpdGNoXSBbaGFuZGxlXXtwb2ludGVyLWV2ZW50czpub25lO2JvcmRlci1yYWRpdXM6OXB4O2JhY2tncm91bmQ6I2ZmZjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NHB4O2xlZnQ6NHB4O3RyYW5zaXRpb24tZHVyYXRpb246LjJzO3dpZHRoOjMwcHg7aGVpZ2h0OjIycHh9W2xzXVtzd2l0Y2hdLnNlbGVjdGVkIFtoYW5kbGVde2xlZnQ6MzBweH1bdWktdG9vbHRpcF17cG9zaXRpb246cmVsYXRpdmV9W2ZsdWVudF0sW3VpLXRvb2x0aXBdOjphZnRlcntiYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KTtiYWNrZ3JvdW5kOiMwMDAwMDA4YTtjb2xvcjojZmZmO2JveC1zaGFkb3c6MCAxNXB4IDIwcHggMXB4ICMwMDAwMDBhYTt0cmFuc2l0aW9uLWR1cmF0aW9uOi4yc30ubWQtYm94LFtscy1tb2RhbF0gW2RpYWxvZ19ib2R5XSxbbHMtbW9kYWwtbm9maWx0ZXJde3RyYW5zaXRpb24tZHVyYXRpb246LjJzO2JhY2tncm91bmQ6IzJCMkIyQjtib3JkZXI6LjhweCBzb2xpZCAjM0MzQzNDO2JveC1zaGFkb3c6MCA4cHggMjVweCAjMDAwO2JvcmRlci1yYWRpdXM6MTJweDttYXgtd2lkdGg6NTcwcHg7b3ZlcmZsb3c6aGlkZGVufVt1aS10b29sdGlwXTpob3Zlcjo6YWZ0ZXJ7Ym90dG9tOjM1cHg7b3BhY2l0eToxIWltcG9ydGFudH1bdWktdG9vbHRpcF06OmFmdGVye2NvbnRlbnQ6YXR0cih1aS10b29sdGlwKTt6LWluZGV4OjkwMDAwMDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKTtwb2ludGVyLWV2ZW50czpub25lO29wYWNpdHk6MDtib3R0b206MjNweDtwYWRkaW5nOjRweCA4cHg7Ym9yZGVyLXJhZGl1czo2cHg7d2lkdGg6bWF4LWNvbnRlbnQ7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE2cHg7Zm9udC1mYW1pbHk6dmFyKC0tZm9udCk7bWF4LXdpZHRoOjI1MHB4O3doaXRlLXNwYWNlOnByZS13cmFwfVt1aS10b29sdGlwXTo6YWZ0ZXI6bm90KFtmbHVlbnRdKXtiYWNrZ3JvdW5kOiMwMDB9W3VpLXRvb2x0aXBdOjphZnRlcjpub3QoW2ZsdWVudF0pOmFmdGVye2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjEwMCU7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTVweDtib3JkZXItd2lkdGg6NXB4O2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItY29sb3I6IzAwMCAjMDAwMCAjMDAwMH1bbHNdW2ZsdWVudF06aG92ZXJ7b3BhY2l0eToxfVtsc11bZmx1ZW50XTpub3QoaW5wdXQsdGV4dGFyZWEsc2VsZWN0KXtiYWNrZ3JvdW5kOnZhcigtLWFjY2VudCl9W2xzXVtmbHVlbnRdOmFjdGl2ZTpub3QoaW5wdXQsdGV4dGFyZWEsc2VsZWN0KXtiYWNrZ3JvdW5kOnZhcigtLWFjY2VudC1kYXJrKX1pbWdbbHNde3BhZGRpbmc6MH1bb3ZlcmxheV17cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7ei1pbmRleDo5OTk5O3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCV9Knstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IzAwMDA7LXdlYmtpdC1oaWdobGlnaHQ6bm9uZX1ib2R5e2JhY2tncm91bmQ6dmFyKC0tYmFja2dyb3VuZCk7b3ZlcmZsb3cteTpvdmVybGF5O3BhZGRpbmctdG9wOjQ1cHh9Ojotd2Via2l0LXNjcm9sbGJhcnt3aWR0aDozcHg7aGVpZ2h0OjNweH06Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JhY2tncm91bmQ6IzAwMDB9Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYntib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOiMyYzJjMmM4MX06Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVye2JhY2tncm91bmQ6IzBmMGYwZjU1fVtsc10sW3RyXXt0cmFuc2l0aW9uLWR1cmF0aW9uOi4yc31pbnB1dFtsc117cG9zaXRpb246cmVsYXRpdmV9Ym9keSxidXR0b24saW5wdXR7Zm9udC1mYW1pbHk6dmFyKC0tZm9udCkhaW1wb3J0YW50O2NvbG9yOnZhcigtLWNvbG9yKX1idXR0b25bZmx1ZW50XTphY3RpdmV7dHJhbnNmb3JtOnNjYWxlKDAuOSl9LmRvdHt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6Z3JheX0uaGVhZGVye2JhY2tncm91bmQ6IzQxNDE0MTtoZWlnaHQ6NDVweDt3aWR0aDoxMDAlO3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6NTt0b3A6MDttYXgtaGVpZ2h0OjQ1cHh9W2xzXSBpe2ZvbnQtc2l6ZToxZW07bWFyZ2luOjAgNHB4IDAgMnB4fVtscy1ncmVlbl17LS1hY2NlbnQ6IzRkYWY1MTstLWFjY2VudC10cjojNGRhZjUxODA7LS1hY2NlbnQtZGFyazojMzY3YzM5fVtscy1ncmF5XXstLWFjY2VudDojNDk0OTQ5Oy0tYWNjZW50LXRyOiM0OTQ5NDk4MDstLWFjY2VudC1kYXJrOiMyNzI3Mjd9W2xzLWdyYXktbGlnaHRdey0tYWNjZW50OiM2YjZiNmI7LS1hY2NlbnQtdHI6IzZiNmI2YjgwOy0tYWNjZW50LWRhcms6IzQ5NDk0OX1bbHMtcHVycGxlXXstLWFjY2VudDojOWI0ZGFmOy0tYWNjZW50LXRyOiM5YjRkYWY4MDstLWFjY2VudC1kYXJrOiM3OTJiOGZ9W2xzLWJ1cnBsZV17LS1hY2NlbnQ6IzUxNjVmNjstLWFjY2VudC10cjojNTE2NWY2ODA7LS1hY2NlbnQtZGFyazojM2I0YWJifVtscy1vcmFuZ2Vdey0tYWNjZW50OiNmZjhjMjA7LS1hY2NlbnQtdHI6I2ZmOGMyMDgwOy0tYWNjZW50LWRhcms6I2JhNjcxOH1bbHMtcmVkXXstLWFjY2VudDojZjUyZjJmOy0tYWNjZW50LXRyOiNmNTJmMmY4MDstLWFjY2VudC1kYXJrOiM5NjFiMWJ9W2xzLXdoaXRlXXstLWFjY2VudDojZmZmOy0tYWNjZW50LXRyOiNmZmZmZmY4MDstLWFjY2VudC1kYXJrOiNjY2N9W2xzLWJsYWNrXXstLWFjY2VudDojMDAwOy0tYWNjZW50LXRyOiMwMDAwMDA4MDstLWFjY2VudC1kYXJrOiMxNjE2MTY7LS1jb2xvcjojZmZmfSNsb2Fke2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9LmZsLFtmbF17ZGlzcGxheTpmbGV4fWV2YWwsW2V2YWxde2Rpc3BsYXk6bm9uZX0uY2h2LFtjaHZdLC5jdmgsW2N2aF17ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyfS5jaCxbY2hde2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5jdixbY3Zde2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXJ9QGZvbnQtZmFjZXtmb250LWRpc3BsYXk6YmxvY2s7Zm9udC1mYW1pbHk6ImxzdHYtaWNvbnMiO3NyYzp1cmwoL3N0YXRpY192Mi9mb250cy9sc3R2aWNvbnMud29mZjI/dj0wKSBmb3JtYXQoIndvZmYyIiksdXJsKC9zdGF0aWNfdjIvZm9udHMvbHN0dmljb25zLndvZmY/dj0wKSBmb3JtYXQoIndvZmYiKX0ubGk6OmJlZm9yZSxbY2xhc3NePSJsaS0iXTo6YmVmb3JlLFtjbGFzcyo9IiBsaS0iXTo6YmVmb3Jle2Rpc3BsYXk6aW5saW5lLWJsb2NrO2ZvbnQtZmFtaWx5OmxzdHYtaWNvbnMhaW1wb3J0YW50O2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0OjQwMCFpbXBvcnRhbnQ7Zm9udC12YXJpYW50Om5vcm1hbDt0ZXh0LXRyYW5zZm9ybTpub25lO2xpbmUtaGVpZ2h0OjE7dmVydGljYWwtYWxpZ246LS4xMjVlbTstd2Via2l0LWZvbnQtc21vb3RoaW5nOmFudGlhbGlhc2VkOy1tb3otb3N4LWZvbnQtc21vb3RoaW5nOmdyYXlzY2FsZX1Aa2V5ZnJhbWVzIHJvdGF0ZXswJXt0cmFuc2Zvcm06cm90YXRlKDApfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1bbG9hZF06YmVmb3Jle3otaW5kZXg6MTtjb250ZW50OicnO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtiYWNrZ3JvdW5kOnZhcigtLWJhY2tncm91bmQtdHIpO3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxOHB4KTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxOHB4KX1bbG9hZF06YWZ0ZXJ7ei1pbmRleDoyO2NvbnRlbnQ6J2U4MzAnO2ZvbnQtc2l6ZTo0ZW07Y29sb3I6dmFyKC0tYWNjZW50KTtmb250LWZhbWlseTpsc3R2LWljb25zO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6Y2FsYyg1MCUgLSAzMHB4KTt0b3A6Y2FsYyg1MCUgLSA0NXB4KX1bbHMtbG9hZF17d2lkdGg6NTZweDt3aWR0aDozNnB4O2hlaWdodDozNnB4O2JvcmRlcjo1cHggc29saWQgdmFyKC0tYWNjZW50LXRyKTtib3JkZXItdG9wLWNvbG9yOnZhcigtLWFjY2VudCk7Ym9yZGVyLXJhZGl1czo1MCV9W2xzLXJvdGF0ZV0sW2xzLWxvYWRdLFtsb2FkXTphZnRlcnthbmltYXRpb246cm90YXRlIDJzIGxpbmVhciBpbmZpbml0ZSBib3RofVtscy1tb2RhbF17cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7ei1pbmRleDo1MDAwMDtiYWNrZ3JvdW5kOiMwMDA1O2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjt0cmFuc2l0aW9uLWR1cmF0aW9uOi4yc31bZGlhbG9nX2JvZHldLFtscy1tb2RhbC1ub2ZpbHRlcl17cGFkZGluZzoyMHB4O3BhZGRpbmctYm90dG9tOjg1cHg7d2lkdGg6MzcwcHg7bWluLWhlaWdodDoxNzBweDtwb3NpdGlvbjpyZWxhdGl2ZTt0ZXh0LWFsaWduOmxlZnQ7dHJhbnNpdGlvbi1kdXJhdGlvbjouMnN9W2RpYWxvZ19ib2R5XSBzcGFuLFtscy1tb2RhbC1ub2ZpbHRlcl0gc3Bhbnt3aGl0ZS1zcGFjZTpwcmUtd3JhcH1bbHMtbW9kYWxdLmNsb3NlZCxbbHMtbW9kYWwtbm9maWx0ZXJdLmNsb3NlZHtvcGFjaXR5OjA7cG9pbnRlci1ldmVudHM6bm9uZX1bbHMtbW9kYWxdLmNsb3NlZCBbbW9kYWxfYm9keV17dHJhbnNmb3JtOnNjYWxlKDEuMil9W2RpYWxvZ19ib3R0b21de3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTowO2xlZnQ6MDtyaWdodDowO2JhY2tncm91bmQ6IzIwMjAyMDtib3JkZXItdG9wOi4xcHggc29saWQgIzFDMUMxQztwYWRkaW5nOjEwcHg7aGVpZ2h0OjY1cHg7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1hcm91bmQ7YWxpZ24taXRlbXM6Y2VudGVyfVtkaWFsb2dfYm90dG9tXSBidXR0b257d2lkdGg6MTAwJTttYXJnaW46NXB4O2hlaWdodDo4MCV9LmltZ19yb3VuZF9zZWxlY3R7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y3Vyc29yOnBvaW50ZXI7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO3dpZHRoOjkwcHg7aGVpZ2h0OjkwcHg7Ym9yZGVyLXJhZGl1czo1MCV9LmltZ19yb3VuZF9zZWxlY3QgaW1ne29iamVjdC1maXQ6Y292ZXI7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJX0uaW1nX3JvdW5kX3NlbGVjdDpob3ZlcntvdXRsaW5lOjNweCBzb2xpZCB2YXIoLS1hY2NlbnQtdHIpfS5pbWdfcm91bmRfc2VsZWN0OmFmdGVye2NvbnRlbnQ6IkYyMTkiO2JvdHRvbTotNTBweDt0cmFuc2l0aW9uLWR1cmF0aW9uOi4yc30uaW1nX3JvdW5kX3NlbGVjdDpob3ZlcjphZnRlcntmb250LWZhbWlseTpib290c3RyYXAtaWNvbnM7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjAhaW1wb3J0YW50O3BhZGRpbmc6MTBweDtsZWZ0OjA7cmlnaHQ6MDtiYWNrZ3JvdW5kOiMwMDA2fQ==');

[ls],[ls-modal]{font-family:'Rubik',sans-serif}
[dialog_body],[ls-modal-nofilter]{min-height:85px;font-size:16px}
[dialog_body] span{word-break:break-word}
[dialog_body] button{font-size:15px}
:root{
  --tw-color:#E44444;
  --accent:#E44444;--accent-tr:#E4444480;--accent-dark:#872a2a;--lstv-yellow:#FFE109;--lstv-red:#FF2828;--lstv-blue:#00D1FF
}

.plheader{display:flex;align-items:center;padding:0 12px;background:#fff1;position:absolute;top:0px;left:0px;right:0px;height:35px}
.plmenu{box-shadow:0 0 0 40vw #0006;background:#181818;color:#fff;font-family:'Rubik',sans-serif;width:765px;height:450px;display:none;position:fixed;z-index:10000;top:50%;left:50%;transform:translateX(-50%) translateY(-50%) scale(calc(max(1,min(1.3,var(--vw-scale))) - 0.2));border-radius:12px;border:3px solid #62626231;padding:0;padding-top:40px;overflow:hidden}
.plmenu h4{line-height:16px}
.plcontent{padding:15px;position:absolute;bottom:0;top:35px;right:0;left:0}
button[tw] {
    border: none;
    outline: none;
    border-radius: 7px;
    padding: 4px 15px;
    box-shadow: inset 0 0 0 2px #0006;
    font-size: 12px;
    min-width: 72px;
    background: var(--tw-color);
    color: #fff;
    cursor: pointer;
}
.plcard button[tw]{padding:8px 15px;width:calc(90% - 35px);margin-right:7px}
.pl_preset{background:#333333;color:white;padding:10px;border-radius:5px;display:inline-block;cursor:pointer;margin:5px}
.plcspan{margin-right:8px;border-radius:300px;padding:0px;width:10px;height:10px;display:inline-block;}
[theme="light"] .plmenu,[theme="light"] .plcard,[theme="light"] [dialog_body]{background:#fff!important;color:#222}
[theme="light"] .plheader{background:#0001}
[theme="light"] .pltab{background:#e6e6e6}
[theme="light"] .pltab.active{background:#ffe8e8}
[theme="light"] .plupdateind{background:#fff;color:#222;box-shadow:0px 10px 40px 0 #00000042}
[theme="light"] textarea,[theme="light"] input,[theme="light"] .pl_preset{color:#222}
[theme="light"] [dialog_bottom]{background:#e3e3e3;border-top:0.1px solid #a7a7a7}
[theme="light"] input[fluent]{background:#f7f7f7;box-shadow:0 12px 24px -10px #32323255,inset 0px 0.2px 0 1.1px #8c8c8c29}
[dialog_bottom]{height:50px}
[ls-load]{width:27px;height:27px;border:7px solid var(--accent-tr);border-top-color:var(--accent)}
.plcard span{color:#999}
[theme="light"] .plcard span{color:#777}
.plmenu.open{display:block}
h1,h2,h3,h4,h5,h6{margin:0}
.pltabs{display:flex;justify-content:center;margin-bottom:10px}
.pltab{width:120px;padding:7px 0;text-align:center;margin-right:20px;position:relative;background:#151515;border-radius:70px;transition-duration:.2s;overflow:hidden;user-select:none;cursor:pointer}
.pltab:last-child{margin-right:0}
.pltab.active{background:#1F1F1F}
.pltab:after{content:"";transition-duration:.2s;position:absolute;bottom:-5px;left:35%;right:35%;height:3px;border-radius:10px;background:var(--tw-color)}
.pltab.active:after{bottom:1px}
.plcard {
    background:#131313;
    border-radius: 11px;
    width: 213px;
    height: 115px;
    position: relative;
    margin: 5px;
    box-shadow: 0 4px 5px #0005;
    padding: 9px;
    overflow: hidden;
    padding-top: 80px;
    padding-bottom: 15px;
    transition-duration: .2s;
    box-shadow: 0 4px 8px #0005, inset 0px -1px 0 0px #ffffff12;
    line-height:8.5px;
}
.plbanner {
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    height: 70px;
    box-shadow: inset 0px -4px 17px 0 #000b, inset 0px 1px 0 0px #ffffff63;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}
.plbutton{
    position:relative;
}
.plupdateind{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 45px;
    padding: 20px 65px;
    background: #171717;
    box-shadow: inset 0 2px 0 0 #ffffff36, 0px 10px 40px 0 #000a;
    border-radius: 9px;
    font-family: Rubik;
    text-align: center;
    font-weight: 400;
    letter-spacing: 1px;
    z-index: 900;
}
.plupdateind:hover{
    outline:2px solid var(--tw-color)
}
.plupdateind img{
    position:absolute
}
.bgrad:before{content:"";position:absolute;bottom:-18px;left:0;right:0;background:currentColor;height:15px;-webkit-filter:blur(25px);filter:blur(25px)}
.bgrad{
    margin-bottom:12px;display:block;font-size:16px
}
.plist{display:flex;align-content:flex-start;width:100%;overflow:overlay;flex-wrap:wrap;bottom:35px;top:60px;position:absolute;padding-bottom:50px}
.plicon {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

/*temporary:*/
.pltab_themes,.pltab_addons{height:100%}

.pltabc{display:none;height:100%}

.plbuttonbar{position:absolute;bottom:6px;right:6px;left:0;text-align:right}
.plcard .plbuttonbar{bottom:4px;right:0;left:0;text-align:center}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:none}
::-webkit-scrollbar-thumb{background:#ffF3;border-radius:10px}
@media(max-width:800px){.plmenu{width:520px;height:85%}}
@media(min-width:1400px){.plmenu{zoom:110%}}
@media(min-width:1600px){.plmenu{zoom:118%}}
`))



/*
    CHECKPOINT: Load
*/
setTimeout(()=>{
    fetchSync(defaultCDN+"/@version",{bypass_cache:!0})("json")(async(d,p)=>{
        if(typeof d=="object"){TurboLoader.serverData=d;d=d.version};
        let outdated=TurboLoader.PublicVersion<d,_url=TurboLoader.serverData?.updateURL||"https://greasyfork.org/scripts/437432-turboloader/code/TurboLoader.user.js";
        console.debug("[TurboLoader Debug] Version check took about "+((p)||0)+"ms, server version: "+((d)||"(error)")+", local: "+TurboLoader.PublicVersion);
        if(!TurboLoader.serverData?.forcedUpdate){if(!isPackager){TurboWarp()}else{TurboWarpPackager()}};
        if(isPackager&&(window?.top||window?.parent))return;
        if(outdated&&!TurboLoader.serverData?.forcedUpdate){
            modal({title:"New update found",content:TurboLoader.serverData?.changelog?"A new version of TurboLoader ("+d+") is available!\nChanges:\n"+TurboLoader.serverData.changelog+"\n":"A new version of TurboLoader ("+d+") is available! (no release notes available)\nDo you wish to update now?",buttons:[{text:"Update"},{text:"Not now",color:"gray"}],onclose:b=>{
                if(b==0){open(_url)}
            }})
        }else if(TurboLoader.serverData?.forcedUpdate){
            modal({title:"Important update found",cancelable:false,content:"A critical update for TurboLoader has been found.\nTo continue using it, please update.\n(This update has important changes and thus isn't optional, without it the UI may not work anymore or there may be a security risk.)"+(TurboLoader.serverData?.changelog?"\nChangelog:\n"+TurboLoader.serverData.changelog:"\nNo aditional information provided"),buttons:[{text:"Update"}],onclose:b=>{
                open(_url)
            }})
        }
    })
},300)
window.PLUGIN_API=class TurboLoader{
    constructor(plugin){this.plugin=plugin;this.emptyList=["empty"]}
    extension(fun){ //the fun begins!
        if(typeof fun!="function")return;
        var plugin=this.plugin;
        fun({
            set(_class){
                try{_class=(_class)()}catch(e){}
                let i=new _class(window.vm.extensionManager.runtime,window.vm),sn=window.vm.extensionManager._registerInternalExtension(i);
                window.vm.extensionManager._loadedExtensions.set(i.getInfo().id,sn)
            },
            requires(l){
                //TODO: This should be improoved
            },
            dependency(plugin){
                //TODO: This should be improoved
            },
            window:window,
            blocks(o){},
            async imageAsset(src){
                return (location.host.includes("turbowarp.org")?await getImage(plugin?.mirror+src):"data:image/png;base64,00");
            },
            details:plugin,
            isPackaged:!location.host.includes("turbowarp.org"),
            vm:vm,
            hasUpdates:!!plugin?.hasUpdates,
            firstTime:!!plugin?.firstTime,
            updated:!!plugin?.updated,
            alert:(a)=>{alert(a,{title:plugin?.name+" says:"})},
            changelog:(n)=>{if((location.host.includes("turbowarp.org"))&&(plugin.updated||plugin.firstTime)){setTimeout(()=>alert(n,{title:plugin?.name+"'s changelog:"}),1500)}},
        })
    }
    blocksPrefix(p,b){return b.blocks.map(b=>{b.opcode=p+b.opcode;return b})}
    pickFile(accept,callback=()=>{}){
        return new Promise((r,e)=>{
            let i=document.createElement('input');
            i.type='file';
            i.accept=accept;
            i.onchange=e=>{
                if(!i.files.length){callback("empty");e()}
                let file=i.files[0],
                    reader=new FileReader();
                reader.readAsDataURL(file);
                reader.onload=_r=>{callback(_r.target.result);r(_r.target.result)}
            }
            i.click();
        })
    }
}