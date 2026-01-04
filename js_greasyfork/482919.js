// ==UserScript==
// @name         Console-Side Project Manager
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  allows you to control all of your projects from the command line!
// @author       DragonFireGames
// @match        https://studio.code.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=code.org
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482919/Console-Side%20Project%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/482919/Console-Side%20Project%20Manager.meta.js
// ==/UserScript==

if (!window.unsafeWindow) window.unsafeWindow = window;
window.wait=(t)=>new Promise((r)=>setInterval(r,t));

var projectList;
var frameDiv;
var projectMap = {};
var isProject = !!window.location.href.match(/https:\/\/studio\.code\.org\/projects\/\w+\//);

function randomId(len) {
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_/+."
    var str = "";
    for (var i = 0; i < len; i++) {
          str += alphabet[Math.floor(Math.random()*alphabet.length)];
    }
    return str;
}
async function uploadJSON() {
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json';
    inp.click();
    while (!inp.files[0]) await wait(100);
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.onload = event => resolve({
            name: inp.files[0].name,
            size: inp.files[0].size,
            type: inp.files[0].type,
            lastModified: inp.files[0].lastModified,
            data: JSON.parse(event.target.result)
        });
        fileReader.onerror = error => reject(error);
        fileReader.readAsText(inp.files[0]);
    });
}
async function downloadFile(url,name) {
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
}
async function setupInspect(win) {
    //win.prompt = ()=>{return "1";};
    win.wait=(t)=>new Promise((r)=>setInterval(r,t));
    while (true) {
        await wait(200);
        try {
            win.document.body.lastChild.lastChild.lastChild.lastChild.lastChild.lastChild.click();
        } catch(e) {}
        if (!win.__mostRecentGameLabInstance) continue;
        if (!win.__mostRecentGameLabInstance.apiJS) continue;
        if (!win.__mostRecentGameLabInstance.JSInterpreter) continue;
        break;
    }
    await wait(1000);

    var logo = win.document.getElementById("main-logo");
    if (logo) logo.outerHTML = "";

    var inst = win.__mostRecentGameLabInstance;

    win.sourceCode = inst.JSInterpreter.codeInfo.code;

    win.setKeyValue = inst.apiJS.setKeyValue;
    win.setKey = function(name,value) {
        return new Promise(function(res,rej) {
            win.setKeyValue(name,value,res,rej);
        });
    }
    win.getKeyValue = inst.apiJS.getKeyValue;
    win.getKey = function(name) {
        return new Promise(function(res,rej) {
            win.getKeyValue(name,res,rej);
        });
    }
    win.logKey = function(name) {
        win.getKeyValue(name,console.log);
    }
    win.deleteKeyValue = inst.studioApp_.storage.deleteKeyValue;
    win.deleteKey = function(name) {
        return new Promise(function(res,rej) {
            win.deleteKeyValue(name,res,rej);
        });
    }
    win.wipeKeyValues = await inst.studioApp_.storage.clearAllData;
    win.wipeKeys = function(name) {
        return new Promise(function(res,rej) {
            win.wipeKeyValues(res,rej);
        });
    }

    win.getUserId = inst.apiJS.getUserId;
    /*win.getLocal = function(e) {
        inst.JSInterpreter.evauluateWatchExpression(e);
    }*/
    win.evalExp = function(e) {
        return inst.JSInterpreter.evalInCurrentScope(e);
    }

    //win.ownerName = inst.studioApp_.config.codeOwnersName;

    win.reset = function() {
	inst.reset();
    }
    win.run = function() {
	inst.runButtonClick();
    }
    win.pause = function(set) {
        if (set !== undefined) inst.JSInterpreter.paused = set;
        else inst.JSInterpreter.paused = !inst.JSInterpreter.paused;
    }

    win.allowWritable = function(v) {
        var scope = inst.JSInterpreter.globalScope;
        delete scope.notConfigurable[v];
        delete scope.notEnumerable[v];
        delete scope.notWritable[v];
    }

    win.injectGamelab = function(script) {
        var code = script.toString();
        return win.evalExp("("+code+")();");
    }

}

async function setupProject(ID,type) {
    if (projectMap[ID]) return projectMap[ID];
    var project = new Project(ID,type);
    return project;
}
class Project {
    constructor(ID,type) {
        this.id = ID;
        this.type = type;
        this.name = "Unnamed Project";
        projectMap[ID] = this;
    }
    async from(data) {
        this.type = data.projectType || this.type;
        this.published = !!data.publishedAt;
        this.publishedAt = data.publishedAt;
        this.thumbnailUrl = data.thumbnailUrl;
        this.studentName = data.studentName;
        this.studentAgeRange = data.studentAgeRange;
        this.isLibrary = data.publishLibrary;
        this.name = data.name || this.name;
    }
    async get() {
        var data = await fetch("https://studio.code.org/v3/channels/"+this.id).then(v=>v.json())
        this.from(data);
        return data;
    }
    async set(data) {
        await fetch("https://studio.code.org/v3/channels/"+this.id,{
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        this.from(data);
        return this.data;
    }
    async update(callback) {
        var data = await this.get();
        data = await callback(data);
        await this.set(data);
        return data;
    }
    async thumbnail(thumbID) {
        return await this.update((data)=>{
            data.thumbnailUrl = "/v3/files/"+thumbID+"/.metadata/thumbnail.png";
            return data;
        });
    }
    /*async thumbImage(url) { // I can’t get the encoding to work
        await this.thumbnail(this.id);
        var img = await fetch(url).then(v=>v.text(''));
        return await fetch("/v3/files/"+this.id+"/.metadata/thumbnail.png",{
            method:'PUT',
            body: img,
            headers: {
                'Content-Type': 'image/png'
            }
        });
    }*/
    async abuse() {
        var abuse = await fetch("https://studio.code.org/v3/channels/"+this.id+"/abuse").then(v=>v.json());
        console.log(this.name+" has an abuse score of "+abuse.abuse_score+"\n("+this.id+")");
        return abuse.abuse_score;
    }
    async sharing_disabled() {
        var data = await fetch("https://studio.code.org/v3/channels/"+this.id+"/sharing_disabled").then(v=>v.json());
        console.log(this.name+" sharing disabled is "+data.sharing_disabled+"\n("+this.id+")");
        return data.sharing_disabled;
    }
    async report(reason,msg,email) {
        var cwin = openFrame("https://studio.code.org/report_abuse");

        while (!cwin.document.getElementById("logo_home_link")) await wait(100);
        cwin.document.getElementById("logo_home_link").innerHTML = "";

        await wait(1000);
        var captcha = cwin.document.getElementsByClassName("g-recaptcha")[0].firstChild;
        captcha.style.top = "0px";
        captcha.style.left = "0px";
        captcha.style.width = "100vw";
        captcha.style.height = "100vh";
        captcha.style.position = "absolute";

        var emailForm = cwin.document.getElementById("uitest-email");
        emailForm.value = email || "projectr3d@gmail.com";
        await wait(100);

        var abuseUrl = cwin.document.getElementById("uitest-abuse-url");
        abuseUrl.value = "https://studio.code.org/projects/gamelab/"+this.id;
        await wait(100);

        var abuseType = cwin.document.getElementById("uitest-abuse-type");
        abuseType.value = reason || "other";
        await wait(100);

        var abuseDetails = cwin.document.getElementById("uitest-abuse-detail");
        abuseDetails.value = msg || "This project harmed me.";
        await wait(100);

        var response = cwin.document.getElementById("g-recaptcha-response");
        while (!response.value) await wait(100);


        var submit = cwin.document.getElementById("uitest-submit-report-abuse");
        submit.click();
        await wait(500);

        closeFrame();
    }
    async unpublish() {
        console.log("Unpublishing "+this.name+"\n("+this.id+")");
        var data = await fetch("https://studio.code.org/v3/channels/"+this.id+"/unpublish",{ method:'POST' }).then(v=>v.json());
        this.from(data);
        await wait(100);
        return data;
    }
    async publish() {
        var type = this.type;
        console.log("Publishing "+this.name+" to "+type+"\n("+this.id+")");
        var data = await fetch("https://studio.code.org/v3/channels/"+this.id+"/publish/"+type,{method:'POST'});
        this.from(await data.json());
        await wait(100);
        return data;
    }
    async remix() {
        var type = this.type;
        var remix = await fetch("https://studio.code.org/projects/"+type+"/"+this.id+"/remix");
        var newID = remix.url.match(/https:\/\/studio\.code\.org\/projects\/\w+\/([^]+)\/edit/)[1];
        console.log("Remixed "+this.name+"\n("+this.id+" -> "+newID+")");
        await wait(100);
        var newproject = new Project(newID,type);
        newproject.owned = true;
        await newproject.rename(n=>n.replace("Remix: ",""));
        return newproject;
    }
    async delete() {
        await fetch("https://studio.code.org/v3/channels/"+this.id,{method:"DELETE"});
        console.log("Deleted "+this.name+"\n("+this.id+")");
        delete projectMap[this.id];
        for (var i in this) delete this[i];
    }
    async getMain() {
        var data = await fetch("https://studio.code.org/v3/sources/"+this.id+"/main.json");
        if (data.ok) {
            data = await data.json();
        } else {
            if (this.type == "gamelab") data = {
                source: "function draw() {\n  \n}\n",
                animations: {
                    orderedKeys: [],
                    propsByKey: {}
                },
                inRestrictedShareMode: false,
                teacherHasConfirmedUploadWarning: false
            };
            else if (this.type == "applab") data = {
                source: "",
                html: "<div id=\"designModeViz\" class=\"appModern\" tabindex=\"1\" data-radium=\"true\" style=\"display: none; width: 320px; height: 450px;\"><div class=\"screen\" tabindex=\"1\" data-theme=\"default\" id=\"screen1\" style=\"display: block; height: 450px; width: 320px; left: 0px; top: 0px; position: absolute; z-index: 0; background-color: rgb(255, 255, 255);\"></div></div>",
                animations: {},
                inRestrictedShareMode: false,
                teacherHasConfirmedUploadWarning: false
            }
        }
        this.main = data;
        return data;
    }
    async setMain(data) {
        return await fetch("https://studio.code.org/v3/sources/"+this.id+"/main.json",{
            method:'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(v=>v.json());
    }
    async updateMain(callback) {
        var data = await this.getMain();
        data = await callback(data);
        if (!data) return;
        return await this.setMain(data);
    }
    downloadMain() {
        downloadFile("https://studio.code.org/v3/sources/"+this.id+"/main.json", this.name+".json");
    }
    async rename(callback) {
        return await this.update(async (data)=>{
            if (typeof callback == 'string') data.name = callback;
            if (typeof callback == 'function') data.name = await callback(data.name);
            return data;
        });
    }
    async uploadMain() {
        var body = await uploadJSON();
        await this.setMain(body.data);
        return body;
    }
    async code(callback) {
        return await this.updateMain(async (body) => {
            body.source = await callback(body.source);
            return body;
        });
    }
    async html(callback) {
        return await this.updateMain(async (body) => {
            body.html = await callback(body.html);
            return body;
        });
    }
    async getLibrary() {
        return await fetch("https://studio.code.org/v3/libraries/"+this.id+"/library.json").then(v=>v.json());
    }
    async publishLibrary(desc,funcs) {
        console.log("Publishing "+this.name+" as a Library\n("+this.id+")");
        var body = await this.get();
        var main = await this.getMain();
        body.libraryName = body.name.replace(/[^\w\d]/g,"");
        body.libraryDescription = desc || "No description provided";
        funcs = funcs || {};
        var fnames = Object.keys(funcs);
        var data = await fetch("https://studio.code.org/v3/libraries/"+this.id+"/library.json",{
            method:'PUT',
            body: JSON.stringify(JSON.stringify({
                name: body.libraryName,
                description: body.libraryDescription,
                functions: fnames,
                dropletConfig: fnames.map(v=>{
                    return {"func":v,"category":"Functions","comment":funcs[v],"type":"either"};
                }),
                source: main.source
            })),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(v=>v.json());
        body.latestLibraryVersion = data.versionId;
        body.libraryPublishedAt = data.timestamp;
        body.publishLibrary = true;
        await this.set(body);
        this.isLibrary = true;
        return data;
    }
    async unpublishLibrary() {
        console.log("Unpublishing "+this.name+"as a Library\n("+this.id+")");
        await fetch("https://studio.code.org/v3/libraries/"+this.id+"/library.json",{ method:'DELETE' });
        this.update(function(body){
            body.latestLibraryVersion = null;
            body.libraryDescription = null;
            body.libraryName = null;
            body.libraryPublishedAt = null;
            body.publishLibrary = false;
            return body;
        });
        this.isLibrary = false;
    }
    async addLibrary(ID) {
        var lib = await setupProject(ID,"gamelab");
        if (!lib.name) await lib.get();
        var data = JSON.parse(await lib.getLibrary());
        data.channelId = ID;
        data.originalName = lib.name;
        data.dropletConfig = data.dropletConfig.map((v) => {
            v.func = data.name+"."+v.func
            return v;
        });
        console.log("Adding "+lib.name+" Library to "+this.name+"\n("+this.id+" +=  "+ID+")");
        return await this.updateMain((main)=>{
            main.libraries = main.libraries || [];
            for (var i = 0; i < main.libraries.length; i++) {
                if (main.libraries[i].channelId != ID) break;
                main.libraries[i] = data;
                return main;
            }
            main.libraries.push(data);
            return main;
        });
    }
    async removeLibrary(ID) {
        var lib = await setupProject(ID,"gamelab");
        if (!lib.name) await lib.get();
        console.log("Removing "+lib.name+" Library from "+this.name+"\n("+this.id+" -=  "+ID+")");
        return await this.updateMain((main)=>{
            main.libraries = main.libraries || [];
            for (var i = main.libraries.length-1; i >= 0; i--) {
                if (main.libraries[i].channelId != ID) break;
                main.libraries.splice(i,1);
            }
            return main;
        });
    }
    show(append) {
        if (this.shown) return;
        var elem = document.createElement('div');
        var html = `
        <div id="${this.id}" class="gamelab">
            <img src="https://studio.code.org/${this.thumbnailUrl}" alt="Project thumbnail image." class="thumbnail" id="thumb_${this.id}">
            <div class="description">
                <a href="https://studio.code.org/projects/gamelab/${this.id}">${this.name}</a>
                <p>By: ${this.studentName}, ${this.studentAgeRange}</p>
                <p>Published on ${this.publishedAt}</p>
            </div>
        </div>
        `;
        if (append) projectList.appendChild(elem);
        else projectList.prepend(elem);
        elem.outerHTML = html;
        this.shown = true;
    }
    async inspect(append) {
        console.log("Showing inspect!");
        if (this.inspected) return;
        this.show(append);
        //var project = document.getElementById(this.id);
        var project = document.getElementById("thumb_"+this.id);
        //project.innerHTML = `
        project.outerHTML = `
        <div class="hackdiv">
            <iframe id="frame_${this.id}" class="hackframe" src="https://studio.code.org/projects/gamelab/${this.id}"></iframe>
        </div>
        `;
        this.frame = document.getElementById("frame_"+this.id);

        this.inspected = true;
        //setup
        var cwindow = this.frame.contentWindow;
        await setupInspect(cwindow);
        //this.ownerName = cwindow.ownerName;
        cwindow.project = this;
        cwindow.parent = window;
    }
    async inject(script) {
        await this.inspect();
        var code = script.toString();
        return this.frame.contentWindow.eval("("+code+")();");
    }
    async injectGamelab(script) {
        return this.frame.contentWindow.injectGamelab(script);
    }
    async reloadframe(script) {
        return await this.inject(async function() {
            location.reload();
            await window.parent.setupInspect(window);
        });
    }
    async getUserId() {
        await this.inspect();
        return this.frame.contentWindow.getUserId();
    }
    async setKey(name,value,callback) {
        await this.inspect();
        return await this.frame.contentWindow.setKey(name,value,callback);
    }
    async getKey(name,value,callback) {
        await this.inspect();
        return await this.frame.contentWindow.getKey(name,callback);
    }
    async disableKeyValues() {
        await this.inspect();
        if (this.disabled) return;
        this.disabled = setInterval(this.frame.contentWindow.wipeKeyValues,1000);
    }
    async enableKeyValues() {
        if (!this.disabled) return;
        clearInterval(this.disabled);
    }
    edit() {
        window.open("https://studio.code.org/projects/gamelab/"+this.id+"/edit");
    }
    open() {
        window.open("https://studio.code.org/projects/gamelab/"+this.id+"/");
    }
}

// Account Management
async function signIn(email,password) {
    var cwin = openFrame("https://studio.code.org/users/sign_in");

    while (!cwin.document.getElementById("logo_home_link")) await wait(100);
    cwin.document.getElementById("logo_home_link").innerHTML = "";

    await wait(1000);
    /*var captcha = cwin.document.getElementsByClassName("g-recaptcha")[0].firstChild;
    captcha.style.top = "0px";
    captcha.style.left = "0px";
    captcha.style.width = "100vw";
    captcha.style.height = "100vh";
    captcha.style.position = "absolute";*/

    var emailForm = cwin.document.getElementById("user_login");
    emailForm.value = email || "dragonfirealta@gmail.com";
    await wait(100);

    var passwordForm = cwin.document.getElementById("user_password");
    passwordForm.value = password || "dragon";
    await wait(100);

    /*var response = cwin.document.getElementById("g-recaptcha-response");
    while (!response.value) await wait(100);*/

    var signin = cwin.document.getElementById("signin-button");
    signin.click();
    await wait(500);

    closeFrame();
}
async function signOut() {
    var cwin = openFrame("https://studio.code.org/users/sign_out");
    await wait(500);
    closeFrame();
}
async function signUp(name,email,password,userdata) {
    var cwin = openFrame("https://studio.code.org/users/sign_up");

    while (!cwin.document.getElementById("logo_home_link")) await wait(100);
    cwin.document.getElementById("logo_home_link").innerHTML = "";

    await wait(3000);
    /*var captcha = cwin.document.getElementsByClassName("g-recaptcha")[0].firstChild;
    captcha.style.top = "0px";
    captcha.style.left = "0px";
    captcha.style.width = "100vw";
    captcha.style.height = "100vh";
    captcha.style.position = "absolute";*/

    var emailForm = cwin.document.getElementById("user_email");
    emailForm.value = email || "codedotorgbot@gmail.com";
    await wait(100);

    var passwordForm = cwin.document.getElementById("user_password");
    passwordForm.value = password || "password";
    await wait(100);

    var passwordConfirmForm = cwin.document.getElementById("user_password_confirmation");
    passwordConfirmForm.value = password || "password";
    await wait(100);

    /*var response = cwin.document.getElementById("g-recaptcha-response");
    while (!response.value) await wait(100);*/

    var submit = cwin.document.getElementById("signup_form_submit");
    submit.click();
    await wait(3000);

    userdata = userdata || {};

    var typeForm = cwin.document.getElementById("select-user-type-"+(userdata.type||"student"));
    typeForm.click();
    await wait(100);

    var nameForm = cwin.document.getElementById("user_name");
    nameForm.value = name || "CodeDotOrgBot";
    await wait(100);

    var ageForm = cwin.document.getElementById("user_age");
    ageForm.value = userdata.age || "16";
    await wait(100);

    var stateForm = cwin.document.getElementById("user_us_state");
    stateForm.value = userdata.state || "CA";
    await wait(100);

    var genderForm = cwin.document.getElementById("user_gender_student_input");
    genderForm.value = userdata.gender || "Bot";
    await wait(100);

    var submit2 = cwin.document.getElementsByClassName("submit")[0]
    submit2.click();
    await wait(5000);

    closeFrame();
}

// Getting
var userData;
async function getPersonal() {
    if (!userData) userData = await fetch("https://studio.code.org/api/v1/users/current").then(v=>v.json());
    var personal = await fetch("https://studio.code.org/api/v1/projects/personal").then(v=>v.json());
    var list = [];
    for (var i = 0; i < personal.length; i++) {
        var p = await setupProject(personal[i].channel,personal[i].type);
        p.from(personal[i]);
        p.owned = true;
        p.studentName = userData.short_name;
        p.studentAgeRange = userData.under_13 ? "8+" : (userData.over_21 ? "18+" : "13+");
        list.push(p);
    }
    return list;
}
/*async function getSectionLibraries() {
    var libs = await fetch("https://studio.code.org/api/v1/section_libraries/").then(v=>v.json());
    var list = [];
    for (var i = 0; i < libs.length; i++) {
        var p = await setupProject(libs[i].channel,"gamelab");
        p.from(libs[i]);
        p.owned = true;
        p.isLibrary = true;
        list.push(p);
    }
    return list;
}*/
async function getPublic(type, amount, date) {
    var list = [];
    while (amount > 0) {
        var sub = Math.min(100,amount);
        var public = await fetch("https://studio.code.org/api/v1/projects/gallery/public/"+type+"/"+sub+"/"+(date||"")).then(v=>v.json());
        public = public[type];
        if (public.length == 0) return list;
        for (var i = 0; i < public.length; i++) {
            var p = await setupProject(public[i].channel,type);
            p.from(public[i]);
            p.owned = false;
            list.push(p);
        }
        date = list[list.length-1].publishedAt;
        amount -= public.length;
    }
    return list;
}
async function getFromURL(url) {
    var matches = url.match(/https:\/\/studio\.code\.org\/projects\/(\w+)\/([^\/]+)\/?\w*$/);
    var proj = await setupProject(matches[2],matches[1]);
    await proj.get();
    return proj;
}
async function getFromID(id,type) {
    var proj = await setupProject(id,type);
    await proj.get();
    return proj;
}

// Create
async function createProject(type,name) {
    if (!userData) userData = await fetch("https://studio.code.org/api/v1/users/current").then(v=>v.json());
    var remix = await fetch("https://studio.code.org/projects/"+type+"/new");
    var newID = remix.url.match(/https:\/\/studio\.code\.org\/projects\/\w+\/([^]+)\/edit/)[1];
    name = name || "Untitled Project";
    console.log("Created "+name+"\n("+newID+")");

    var cwin = openFrame(remix.url);
    while (!cwin.document.getElementById("runButton")) await wait(100);
    cwin.document.getElementById("runButton").click();
    await wait(500);
    closeFrame();

    var newproject = new Project(newID,type);
    newproject.owned = true;
    newproject.studentName = userData.short_name;
    newproject.studentAgeRange = userData.under_13 ? "8+" : (userData.over_21 ? "18+" : "13+");
    if (name != "Untitled Project") await newproject.rename(name);
    return newproject;
}
async function createThumbnail(url,name) {
    var t = await createProject("gamelab","Thumbnail-"+(name||url));
    await t.code(v=>`
var img = loadImage("${url}");
function setup() {
  background(0);
  image(img,0,0,400,400);
}
`);
    var cwin = openFrame("https://studio.code.org/projects/gamelab/"+t.id+"/edit");
    while (!cwin.document.getElementById("runButton")) await wait(100);
    while (true) {
        await wait(1000);
        cwin.document.getElementById("runButton").click();
        await wait(1000);
        cwin.document.getElementById("resetButton").click();
        if (Date.now()-new Date(cwin.document.getElementsByClassName("project_updated_at header_text")[0].children[0].children[0].dateTime).valueOf() < 3000) break;
    }
    closeFrame();
    return t.id;
}

// Frames
function openFrame(url) {
    frameDiv.style.width = "500px";
    frameDiv.style.height = "500px";
    frameDiv.innerHTML = `
        <iframe id="reportframe" src="${url}"></iframe>
    `;
    var iframe = frameDiv.children[0];
    var cwin = iframe.contentWindow;
    return cwin;
}
function closeFrame() {
    frameDiv.innerHTML = "";
    frameDiv.style.width = "0px";
    frameDiv.style.height = "0px";
}

(async function() {
    'use strict';

    if (isProject) {
        projectList = document.createElement("div");
        setupInspect(unsafeWindow);
        project = await getFromURL(unsafeWindow.location.href);
        await wait(500);
        loadModules();
        return;
    }

    await wait(500);
    var addon = document.createElement("div");
    document.body.appendChild(addon);
    addon.outerHTML = `
    <style>

    .gamelab {
      width: 200px;
      height: 320px;
      display: inline-block;
    }
    .thumbnail, .hackdiv {
      width: 200px;
      height: 200px;
    }
    .hackframe {
      --scale: 0.45;
      width: calc(200px / var(--scale));
      height: calc(200px / var(--scale));
      -webkit-transform: scale(var(--scale));
      -webkit-transform-origin: -10px -10px;
    }
    #reportframe {
      width: 700px;
      height: 700px;
    }
    #reporter {
      position: absolute;
      top: 0px;
      left: 0px;
      overflow: clip;
    }
    .description {
      width: 200px;
      height: 120px;
    }

    </style>
    <div id="reporter"></div>
    <span id="list"></span>
    `;

    projectList = document.getElementById("list");
    projectList.innerHTML = "";
    frameDiv = document.getElementById("reporter");
    closeFrame();

    await wait(500);
    loadModules();
})();

function loadModules() {
    console.log(`
----------------------------------------------------
Console-Side Project Manager Has Sucessfully Loaded!
----------------------------------------------------
`);
    unsafeWindow.ProjectManager = window.ProjectManager;
}

// Exports
window.ProjectManager = function(win,name) {
    win.wait = unsafeWindow.wait;
    win.isProject = unsafeWindow.isProject;
    win.userData = unsafeWindow.userData;
    win.project = unsafeWindow.project;
    win.getPersonal = unsafeWindow.getPersonal;
    win.getSectionLibraries = unsafeWindow.getSectionLibraries;
    win.getPublic = unsafeWindow.getPublic;
    win.getFromURL = unsafeWindow.getFromURL;
    win.createProject = unsafeWindow.createProject;
    win.createThumbnail = unsafeWindow.createThumbnail;
    win.signIn = unsafeWindow.signIn;
    win.signOut = unsafeWindow.signOut;
    win.signUp = unsafeWindow.signUp;
    win.projectMap = unsafeWindow.projectMap;
    win.openFrame = unsafeWindow.openFrame;
    win.closeFrame = unsafeWindow.closeFrame;
    win.Export = function(list) {
        console.log("Successfully Loaded: "+name)
        for (var i in list) {
            unsafeWindow[i] = list[i]
        }
    }
}

unsafeWindow.wait = window.wait;
unsafeWindow.isProject = isProject;
unsafeWindow.userData = userData;
unsafeWindow.project = window.project;
unsafeWindow.getPersonal = getPersonal;
//unsafeWindow.getSectionLibraries = getSectionLibraries;
unsafeWindow.getPublic = getPublic;
unsafeWindow.getFromURL = getFromURL;
unsafeWindow.getFromID = getFromID;
unsafeWindow.createProject = createProject;
unsafeWindow.createThumbnail = createThumbnail;
unsafeWindow.signIn = signIn;
unsafeWindow.signOut = signOut;
unsafeWindow.signUp = signUp;
unsafeWindow.projectMap = projectMap;
unsafeWindow.openFrame = openFrame;
unsafeWindow.closeFrame = closeFrame;
