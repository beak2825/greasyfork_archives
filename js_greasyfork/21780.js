// ==UserScript==
// @name         BetterLM
// @namespace    https://blm.hades.lt
// @version      1.8.4
// @description  make Linkomanija great again
// @author       Krupp
// @match        https://www.linkomanija.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21780/BetterLM.user.js
// @updateURL https://update.greasyfork.org/scripts/21780/BetterLM.meta.js
// ==/UserScript==

//--- utils.js
class Utils {
        static InsertAfter(element, newNode) {
                return element.parentElement.insertBefore(newNode, element.nextSibling);
        }

        static InsertBefore(element, newNode) {
                return element.parentElement.insertBefore(newNode, element.previousSibling);
        }

        static GetSelectedValues(element) {
                let res = [];

                if (element.options) {
                        for (let i = 0; i < element.options.length; i++) {
                                let opt = element.options[i];
                                if (opt.selected)
                                        res.push(opt.value);
                        }
                }

                return res;
        }

        static async FetchJSON(url, method = 'GET', data = null) {
                let reqObj = {method};
                if (data) {
                        reqObj.body = JSON.stringify(data);
                        reqObj.headers = {'content-type': 'application/json'};
                }

                return await fetch(Settings.ApiUrl + url, reqObj).then(resp => resp.json());
        }

        static PrintDate(dateStr) {
                if (!dateStr) return '';

                // do not convert to UTC
                dateStr = dateStr.replace('T', ' ');
                let date = new Date(dateStr);

                return `${date.getFullYear()}-${Utils._WZero(date.getMonth() + 1)}-${Utils._WZero(date.getDate())}
${Utils._WZero(date.getHours())}:${Utils._WZero(date.getMinutes())}:${Utils._WZero(date.getSeconds())}`;
        }

        // with zero, so it outputs 09 minutes instead of 9 -.-
        static _WZero(inp) {
                return inp < 10 ? '0' + inp : '' + inp; // so that it always returns String, not Number sometimes
        }

        // Null or Undefined
        static NU(obj) {
                return obj === null || obj === undefined;
        }

        static GetPosts() {
                return document.querySelectorAll('div[id^="post_"]');
        }

        static GetPostId(postEl) {
                if (!postEl) return null;

                let postIdAttr = postEl.getAttribute('id');

                if (postIdAttr) {
                        postIdAttr = postIdAttr.replace('post_', '');
                        let postId = Number(postIdAttr);

                        if (Number.isNaN(postId)) return null;
                        else return postId;
                }

                return null;
        }

        static get _postDateRegex() {
                return /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
        }

        static GetPostDate(postEl) {
                let infoTextEl = postEl.querySelector('span:first-child');
                if (infoTextEl) {
                        let regexResult = Utils._postDateRegex.exec(infoTextEl.textContent);
                        if (regexResult) return new Date(regexResult[0]);
                }

                return null;
        }
}

//--- options.js
class Options {
        constructor(obj = null) {
                if (obj) {
                        this.notifyOnUserMention = obj.notifyOnUserMention;
                        this.showLastPosts = obj.showLastPosts;
                        this.ignoreHideTopics = obj.ignoreHideTopics;
                        this.ignoreReplaceMessages = obj.ignoreReplaceMessages;
                        this.ignoreReplaceString = obj.ignoreReplaceString;
                }
        }

        validate() {
                if (Utils.NU(this.notifyOnUserMention) || Utils.NU(this.showLastPosts)
                        || Utils.NU(this.ignoreReplaceMessages) || Utils.NU(this.ignoreHideTopics))
                        throw "options aren't valid";
        }

        setDefaults() {
                this.notifyOnUserMention = true;
                this.showLastPosts = false;
                this.ignoreHideTopics = false;
                this.ignoreReplaceMessages = true;
                this.ignoreReplaceString = 'Vartotojas ignoruotas.';
        }
}

//--- settings.js
class Settings {
        static get KeyOptions() {
                return 'blm_options';
        }

        static get KeyIgnored() {
                // for backwards compatibility with 'LMRetard' script
                return 'retards';
        }

        static get ApiUrl() {
                return 'https://blm.hades.lt';
        }

        static Instance() {
                if (this._instance)
                        return this._instance;

                this._instance = new Settings();
                this._instance._load();
                return this._instance;
        }

        save() {
                let optionsJson = JSON.stringify(this.options);
                localStorage.setItem(Settings.KeyOptions, optionsJson);

                let ignoredJson = JSON.stringify(this.ignored);
                localStorage.setItem(Settings.KeyIgnored, ignoredJson);
        }

        _load() {
                // load options
                try {
                        let optionsJson = localStorage.getItem(Settings.KeyOptions);
                        let options = JSON.parse(optionsJson);

                        this.options = new Options(options);
                        this.options.validate();
                }
                catch (ex) {
                        // oh well...
                        this._resetOptions();
                        this.save();
                }

                // load ignored users
                try {
                        let ignoredJson = localStorage.getItem(Settings.KeyIgnored);
                        let ignored = JSON.parse(ignoredJson);

                        if (!Array.isArray(ignored))
                                throw 'do not swear';

                        ignored.forEach(x => {
                                if (typeof x !== 'string')
                                        throw 'fuck, I told a swear word';
                        });

                        this.ignored = ignored;
                }
                catch (ex) {
                        // well shitballs...
                        this._resetIgnored();
                        this.save();
                }

                // set own name
                let username = document.querySelector('#username');
                if (username)
                        this.ownName = username.innerText;

                // set own id
                let userHref = username.querySelector('a');
                if (userHref)
                        this.ownUserId = Number(userHref.href.split('?id=')[1]); // 99% of the time never throws
        }

        isIgnored(name) {
                if (name === this.ownName)
                        return false;

                return this.ignored.indexOf(name) !== -1;
        }

        addIgnored(name) {
                if (name === this.ownName)
                        return;

                if (!this.isIgnored(name)) {
                        this.ignored.push(name);
                        this.save();
                } else {
                        // todo: something better than alert would be nice
                        alert(`${name} is already ignored, refresh the page.`);
                }
        }

        getIgnored() {
                return this.ignored;
        }

        removeIgnored(name, save = true) {
                let idx = this.ignored.indexOf(name);

                if (idx !== -1) {
                        this.ignored.splice(idx, 1);
                        if (save)
                                this.save();
                }
        }

        _resetOptions() {
                this.options = new Options();
                this.options.setDefaults();
        }

        _resetIgnored() {
                this.ignored = [];
        }
}

//--- base.js
class Base {
        constructor() {
                this.settings = Settings.Instance();
        }
}

//--- templates/templateEngine.js
// "Holy Mashed Potatoes, Batman!" -Robin
// update: fuck this shit, shoulda used handlebars
class TemplateEngine {
        static get _ForeachEnd() {
                return '@{/foreach}';
        }

        static get _ForeachStart() {
                return /@{foreach x in (.*)}/;
        }

        static get _IfStart() {
                return /@{if\((.*)\)}/;
        }

        static get _IfEnd() {
                return '@{/if}';
        }

        static get _ExecStart() {
                return '@{exec}';
        }

        static get _ExecEnd() {
                return '@{/exec}';
        }

        static get _ForStart() {
                return /@{for\((.*)\)}/;
        }

        static get _ForEnd() {
                return '@{/for}';
        }

        static get Template() {
                throw 'must override Template';
        }

        static Render(model, html = this.Template, x = null) {
                let exprArr;

                while ((exprArr = /@{.*?}/.exec(html)) !== null) {
                        let exprRaw = exprArr[0];
                        let expr = exprRaw.replace(/(^@{)|(}$)/g, '');

                        // code is repeating itself a lot QQ
                        // todo: refactor (or fucking use handlebars for reals)
                        // handle FOREACHs
                        if (TemplateEngine._ForeachStart.test(exprRaw)) {
                                let foreachExpArr = TemplateEngine._ForeachStart.exec(exprRaw);

                                let endIdx = html.indexOf(TemplateEngine._ForeachEnd, foreachExpArr.index);

                                let templateRaw = html.substring(exprArr.index, endIdx + TemplateEngine._ForeachEnd.length);
                                let template = templateRaw.substr(foreachExpArr[0].length,
                                        templateRaw.length - TemplateEngine._ForeachEnd.length - foreachExpArr[0].length);

                                let expressedTemplate = TemplateEngine._ApplyForeach(template, model, foreachExpArr[1]);

                                html = html.replace(templateRaw, expressedTemplate);
                        }
                        // handle IFs
                        else if (TemplateEngine._IfStart.test(exprRaw)) {
                                let ifExprArr = TemplateEngine._IfStart.exec(exprRaw);

                                let endIdx = html.indexOf(TemplateEngine._IfEnd, ifExprArr.index);

                                let templateRaw = html.substring(exprArr.index, endIdx + TemplateEngine._IfEnd.length);
                                let template = templateRaw.substr(ifExprArr[0].length,
                                        templateRaw.length - TemplateEngine._IfEnd.length - ifExprArr[0].length);

                                let expressedTemplate = TemplateEngine._ApplyIf(template, model, ifExprArr[1]);

                                html = html.replace(templateRaw, expressedTemplate);
                        }
                        // handle exec
                        else if (exprRaw === TemplateEngine._ExecStart) {
                                let endIdx = html.indexOf(TemplateEngine._ExecEnd, exprArr.index);

                                let templateRaw = html.substring(exprArr.index, endIdx + TemplateEngine._ExecEnd.length);
                                let template = templateRaw.substr(TemplateEngine._ExecStart.length,
                                        templateRaw.length - TemplateEngine._ExecEnd.length - TemplateEngine._ExecStart.length);

                                let expressedTemplate = TemplateEngine._ApplyExec(template, model);

                                html = html.replace(templateRaw, expressedTemplate);
                        }
                        // handle FORs
                        else if (TemplateEngine._ForStart.test(exprRaw)) {
                                let forExprArr = TemplateEngine._ForStart.exec(exprRaw);

                                let endIdx = html.indexOf(TemplateEngine._ForEnd, forExprArr.index);

                                let templateRaw = html.substring(exprArr.index, endIdx + TemplateEngine._ForEnd.length);
                                let template = templateRaw.substr(forExprArr[0].length,
                                        templateRaw.length - TemplateEngine._ForEnd.length - forExprArr[0].length);

                                let expressedTemplate = TemplateEngine._ApplyFor(template, model, x, forExprArr[1]);

                                html = html.replace(templateRaw, expressedTemplate);
                        }
                        // handle the stuff
                        else {
                                let expressed;
                                try {
                                        expressed = eval(expr);
                                }
                                catch (ex) {
                                        expressed = ex;
                                }
                                html = html.replace(exprRaw, expressed);
                        }
                }

                return html;
        }

        // does not support attributes with spaces in them, huehuehue
        static RenderElement(model, html = this.Template) {
                html = TemplateEngine.Render(model, html);

                // it's a Kirby!
                let rootElTagRes = /<(.*)>/.exec(html);

                let split = rootElTagRes[1].split(' ');

                // strip out parent el tags, replace replace replace REPLACE
                html = html.replace(rootElTagRes[0], '').replace(rootElTagRes[0].replace('<', '</'), '');

                let element = document.createElement(split[0]);

                // set attributes
                for (let i = 1; i < split.length; i++) {
                        let attr = split[i].split('=');
                        if (attr.length === 2)
                                element.setAttribute(attr[0], attr[1].replace(/"/g, ''));
                }

                element.innerHTML = html;

                return element;
        }

        // does not handle foreach inside foreach, huehuehue
        // also foreach x syntax is set in stone, cannot override x, huehuehue
        static _ApplyForeach(template, model, forEachStr) {
                let html = '';

                eval(forEachStr).forEach((x, i) => {
                        if (typeof x === 'object') x._INDEX = i;
                        html += TemplateEngine.Render(null, template, x);
                });

                return html;
        }

        // does not handle if inside if, might work with foreach though?
        // else is too hard, huehuehuehue (and saturation)
        static _ApplyIf(template, model, conditionStr) {
                if (!eval(conditionStr)) return '';

                return TemplateEngine.Render(model, template);
        }

        static _ApplyExec(execStr, model) {
                eval(execStr);

                return '';
        }

        static _ApplyFor(template, model, x, expr) {
                let html = '';

                // I'll admit - JavaScript is quite fun lawl
                expr = `for(${expr}) { html += TemplateEngine.Render(model, template, x); }`;
                eval(expr);

                return html;
        }
}

//--- templates/loaderTemplate.js
class LoaderTemplate extends TemplateEngine {

        static _loadStyle() {
                if (LoaderTemplate._styleLoaded) return;

                LoaderTemplate._styleLoaded = true;
                document.head.innerHTML += `<style>
.spinner {
  margin: 100px auto;
  width: 40px;
  height: 40px;
  position: relative;
}

.cube1, .cube2 {
  background-color: royalblue;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
  animation: sk-cubemove 1.8s infinite ease-in-out;
}

.cube2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes sk-cubemove {
  25% { -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5) }
  50% { -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg) }
  75% { -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5) }
  100% { -webkit-transform: rotate(-360deg) }
}

@keyframes sk-cubemove {
  25% {
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  } 50% {
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  } 50.1% {
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  } 75% {
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
  } 100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>`;
        }

        // from https://github.com/tobiasahlin/SpinKit
        static get Template() {
                LoaderTemplate._loadStyle();
                return `
<div class="spinner">
  <div class="cube1"></div>
  <div class="cube2"></div>
</div>
`;
        }
}
LoaderTemplate._styleLoaded = false; // wow javascript, no other way to use static fields, good job!

//--- templates/lastPostsTemplate.js
class LastPostsTemplate extends TemplateEngine {
        static get Template() {
                return `
<h1>Paskutiniai pranešimai</h1>
<table border="1" cellspacing="0" cellpadding="5" id="last-posts">
        <tbody>
        <tr class="colhead">
                <td class="tcenter">Autorius</td>
                <td class="tcenter">Žinutė</td>
                <td class="tcenter">Laikas</td>
        </tr>
                @{foreach x in model}
                <tr>
                        <td><a href="userdetails.php?id=@{x.UserId}">@{x.Username}</a></td>
                        <td class="hover last-post-content" data-post-id="@{x.Id}" data-thread-id="@{x.ThreadId}">
                                @{x.Content}
                        </td>
                        <td class="tcenter" style="min-width: 70px;">@{Utils.PrintDate(x.Date)}</td>
                </tr>
                @{/foreach}
        </tbody>
</table>

<style>
        .last-post-content {
                cursor: pointer;
        }
</style>
`;
        }
}

//--- templates/topUserTableTemplate.js
class TopUserTableTemplate extends TemplateEngine {
        static get Template() {
                return `
<table class="top-table">
        <tbody>
        <tr class="colhead">
                <td class="tcenter">#</td>
                <td class="tcenter">Vartotojas</td>
                <td class="tcenter">Žinutės</td>
        </tr>
        </tbody>
                @{foreach x in model}
                <tr>
                        <td class="tright">@{x._INDEX + 1}</td>
                        <td><a href="/userdetails.php?id=@{x.Id}">@{x.Username}</a></td>
                        <td class="tright">@{x.PostCount}</td>
                </tr>
                @{/foreach}
</table>`;
        }
}

//--- templates/topPostersTemplate.js
class TopPostersTemplate extends TemplateEngine {
        static get Template() {
                return `
<div id="top-container">
        <div class="top-item">
                <h2>All time</h2>
                @{TopUserTableTemplate.Render(model.All)}
        </div>

        <div class="top-item">
                <h2>Paskutiniai metai</h2>
                @{TopUserTableTemplate.Render(model.Year)}
        </div>

        <div class="top-item">
                <h2>Paskutinis mėnesis</h2>
                @{TopUserTableTemplate.Render(model.Month)}
        </div>
</div>

<style>
        #top-container {
                display: flex;
                justify-content: center;
        }

        .top-item {
                width: auto;
                padding: 20px;
        }

        .top-table td {
                padding-top: 7px;
                padding-bottom: 7px;
                padding-left: 6px;
                padding-right: 6px;
        }
</style>
`;
        }
}

//--- templates/userInfoTemplate.js
class UserInfoTemplate extends TemplateEngine {
        static get Template() {
                return `
<tr>
        <td class="rowhead">Žinutės:</td>
        <td align="left">
                ~ <a href="/userhistory.php?action=viewposts&id=@{model.Id}">@{model.PostCount}</a>
        </td>
</tr>

<tr>
        <td class="rowhead">Paskutinė:</td>
        <td align="left">@{Utils.PrintDate(model.LastPostDate)}</td>
</tr>
`;
        }

        // override, returns array with two tr elements
        static RenderElement(model) {
                let trs = [];

                let splitTemplate = this.Template.split('\n\n');

                trs.push(super.RenderElement(model, splitTemplate[0]));
                trs.push(super.RenderElement(model, splitTemplate[1]));

                return trs;
        }
}

//--- templates/userPostsTemplate.js
class UserPostsTemplate extends TemplateEngine {
        static get Template() {
                return `
<h1>
        <a href="/userdetails.php?id=@{model.UserId}"><b>@{model.Username}</b></a> postų istorija
</h1>
@{UserPostsPaginationTemplate.Render(model)}

<table class="main" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
                <td class="embedded">
                        <table width="98%" border="1" cellspacing="0" cellpadding="10">
                                <tbody>
                                <tr>
                                        <td>
                                                @{foreach x in model.Posts}
                                                        <p class="sub"></p>
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                <tr>
                                                                        <td class="embedded">
                                                                               @{Utils.PrintDate(x.Date)} -- <b>Tema:</b> <a href="/forums.php?action=viewtopic&topicid=@{x.ThreadId}">@{x.ThreadTitle}</a>
                                                                               -- <b>Posto ID: </b>#<a href="/forums.php?action=viewtopic&topicid=@{x.ThreadId}&page=p@{x.Id}#@{x.Id}">@{x.Id}</a>
                                                                        </td>
                                                                </tr>
                                                                </tbody>
                                                        </table>
                                                        <p></p>
                                                        <table class="main" width="97%" border="1" cellspacing="0" cellpadding="5">
                                                                <tbody>
                                                                <tr valign="top">
                                                                        <td class="comment">
                                                                               @{x.Content}
                                                                        </td>
                                                                </tr>
                                                                </tbody>
                                                        </table>
                                                @{/foreach}
                                        </td>
                                </tr>
                                </tbody>
                        </table>
                </td>
        </tr>
        </tbody>
</table>

@{UserPostsPaginationTemplate.Render(model)}
`;
        }
}

//--- templates/userPostsPaginationTemplate.js
class UserPostsPaginationTemplate extends TemplateEngine {
        // fuck me
        static get Template() {
                return `
@{exec}
model.totalPages = Math.ceil(model.TotalPosts / 25);
model.pagination = [];
if (model.Page > model.totalPages) model.Page = model.totalPages;

for (let i = 0; i < model.totalPages; i++) {
        let lowerBound = i * 25 + 1;
        var upperBound = Math.min(lowerBound + 24, model.TotalPosts);
        model.pagination[i] = [lowerBound, upperBound];
}

model.j = 0;
@{/exec}
<p align="center">
<!-- prev and first sticky -->
@{if(model.Page === 1)}
        <span class="pageinactive">«&nbsp;Ankstesnis</span>
        <span class="pageinactive">1&nbsp;-&nbsp;@{model.pagination[0][1]}</span>
@{/if}
@{if(model.Page !== 1)}
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=@{model.Page - 1}">«&nbsp;Ankstesnis</a>
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=1">1&nbsp;-&nbsp;@{model.pagination[0][1]}</a>
@{/if}
<!-- render dots if needed -->
@{if(model.Page > 4)}
 ...
@{/if}
<!-- render 2 previous buttons -->
@{for(model.j = Math.max(model.Page - 3, 1); model.j < model.Page - 1; model.j++)}
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=@{model.j + 1}">@{model.pagination[model.j][0]}&nbsp;-&nbsp;@{model.pagination[model.j][1]}</a>
@{/for}
<!-- render current button -->
@{exec}
if (model.Page === 1) model.j = 0;
@{/exec}
@{if(model.j !== 0 && model.j !== model.totalPages - 1)}
        <span class="pageinactive">@{model.pagination[model.j][0]}&nbsp;-&nbsp;@{model.pagination[model.j][1]}</span>
@{/if}
<!-- render 2 next buttons -->
@{for(model.j = model.j + 1; model.j < Math.min(model.totalPages - 1, model.Page + 2); model.j++)}
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=@{model.j + 1}">@{model.pagination[model.j][0]}&nbsp;-&nbsp;@{model.pagination[model.j][1]}</a>
@{/for}
<!-- dooooots -->
@{if(model.Page < model.totalPages - 3)}
 ...
@{/if}
<!-- next and last sticky -->
@{if(model.Page === model.totalPages && model.totalPages !== 1)}
        <span class="pageinactive">@{model.pagination[model.totalPages-1][0]}&nbsp;-&nbsp;@{model.pagination[model.totalPages - 1][1]}</span>
@{/if}
@{if(model.Page === model.totalPages)}
        <span class="pageinactive">Kitas&nbsp;»</span>
@{/if}
@{if(model.Page !== model.totalPages && model.totalPages !== 1)}
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=@{model.totalPages}">@{model.pagination[model.totalPages - 1][0]}&nbsp;-&nbsp;@{model.pagination[model.totalPages - 1][1]}</a>
@{/if}
@{if(model.Page !== model.totalPages)}
        <a class="pagelink" href="/userhistory.php?action=viewposts&id=@{model.UserId}&page=@{model.Page + 1}">Kitas&nbsp;»</a>
@{/if}
</p>
`;
        }
}

//--- templates/showOriginalPostTemplate.js
class ShowOriginalPostTemplate extends TemplateEngine {
        static get Template() {
                return `<p class="small">
<span style="cursor: pointer;">Rodyti originalų pranešimą?</span>
</p>`;
        }

        static get TemplateOriginalPost() {
                return `
<p class="sub">
   Originalus postas:
</p>
<table class="main" border="1" cellspacing="0" cellpadding="10">
   <tbody>
      <tr>
         <td style="border: 1px black dotted">@{model.Content}</td>
      </tr>
   </tbody>
</table>`;
        }

        static RenderOriginalPost(model) {
                return this.Render(model, this.TemplateOriginalPost);
        }
}

//--- templates/userSettingsTemplate.js
class UserSettingsTemplate extends TemplateEngine {
        static get HeaderTemplate() {
                return `<h1>
        BetterLM nustatymai
</h1>`;
        }

        static RenderHeaderElement() {
                return this.RenderElement(null, this.HeaderTemplate);
        }

        static get Template() {
                return `
<table border="1" cellspacing="0" cellpadding="10" align="center" width="100%">
<!-- I don't even this html structure -->
<tbody><tr><td colspan="7"><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody>

<tr>
        <td class="rowhead" valign="top" align="right">Rodyti paskutinius pranešimus</td>
        <td valign="top" align="left">
                <label><input type="checkbox" id="showLastPosts">Rodyti paskutinius pranešimus</label>
        </td>
</tr>

<tr>
        <td class="rowhead" valign="top" align="right">Ignoravimo nustatymai</td>
        <td valign="top" align="left">
                <label><input type="checkbox" id="hideTopics">Slėpti sukurtas temas forume</label><br>
                <label><input type="checkbox" id="replaceMessages">Pakeisti žinutės tekstą vietoje pašalinimo:</label><br>
                <input type="text" id="replaceString">
        </td>
</tr>

<tr>
        <td class="rowhead" valign="top" align="right">Ignoruotieji</td>
        <td valign="top" align="left">
                @{if(model.ignored.length > 0)}
                <select size="@{Math.min(12, model.ignored.length)}" multiple id="ignoredList">
                        @{foreach x in model.ignored}
                        <option value="@{x}">@{x}</option>
                        @{/foreach}
                </select><br/>
                <button id="blmRemoveIgnoredBtn" type="button">Pašalinti</button>
                @{/if}
                @{if(model.ignored.length <= 0)}
                <div>Nieko neignoruoji, sugyveni draugiškai</div>
                @{/if}
        </td>
</tr>

<tr>
        <td colspan="2" class="center">
                <input type="button" id="blmSaveBtn" value="Patvirtinti!!1" style="height: 25px">
        </td>
</tr>

</tbody></table></td></tr></tbody>
</table>
`;
        }
}

//--- templates/userMentionTemplate.js

//--- modules/userIgnore.js
class UserIgnore extends Base {
        static get _QuoteRegex() {
                return /\[quote=\w*\]/g;
        }

        static get _AuthorRegex() {
                return /(?:\[quote=)(\w*)(?:\])/;
        }

        static get _EndQuoteRegex() {
                return /\[\/quote\]/g;
        }

        init() {
        }

        hideTopics() {
                if (!this.settings.options.ignoreHideTopics) return;

                let tables = document.querySelectorAll('table');
                if (tables.length < 1) return;

                let rows = tables[0].querySelectorAll('tr:not(.colhead)');
                [...rows].forEach(row => {
                        let authorLink = row.querySelector('td:nth-child(4) > a');
                        if (authorLink) {
                                let author = authorLink.textContent;
                                if (author && this.settings.isIgnored(author))
                                        row.remove();
                        }
                });
        }

        clearTorrentDetails() {
                let comments = document.querySelectorAll('#comments > div.comment');
                if (!comments) return;

                [...comments].forEach(comment => {
                        let authorEl = comments.querySelector('div.comment-user > a');
                        if (!authorEl) return;

                        let author = authorEl.textContent;
                        if (!author || !this.settings.isIgnored(author)) return;

                        if (this.settings.options.ignoreReplaceMessages) {
                                let commentText = comment.querySelector('div.comment-text');
                                if (commentText)
                                        commentText.textContent = this.settings.options.ignoreReplaceString;
                        } else {
                                comment.remove();
                        }
                });
        }

        clearReplyQuote() {
                this.clearReply();

                let textArea = document.querySelector('textarea#body');
                if (!textArea) return;

                let text = textArea.value;
                let quotes = text.match(UserIgnore._QuoteRegex);
                if (!quotes) return;

                for (let i = 0; i < quotes.length; i++) {
                        let quote = quotes[i];
                        let authorMatch = quote.match(UserIgnore._AuthorRegex);
                        if (!authorMatch || authorMatch.length !== 2) continue;

                        let author = authorMatch[1];
                        if (this.settings.isIgnored(author)) {
                                try {
                                        let idxStart = text.indexOf(quote) + quote.length;
                                        if (idxStart === (-1 + quote.length)) throw 'mangled markup';

                                        let idxEnd;

                                        /* [quote] and [/quote] count should equal, otherwise formatting
                                         is mangled and there's fuck I can do and the fuck I care lel */
                                        for (let j = 0; j < quotes.length; j++) {
                                                let match = UserIgnore._EndQuoteRegex.exec(text);
                                                // black box logic go figure
                                                if (quotes.length - 1 - j !== i) continue;
                                                idxEnd = match.index;
                                                break;
                                        }

                                        let toReplace = text.substring(idxStart, idxEnd);
                                        text = text.replace(toReplace, this.settings.options.ignoreReplaceString);
                                        textArea.value = text;
                                        return;
                                }
                                catch (ex) { /* noop */
                                }
                        }
                }
        }

        clearReply() {
                let replies = document.querySelectorAll('p.sub');

                for (let i = 0; i < replies.length; i++) {
                        let reply = replies[i];

                        let authorParts = reply.textContent.split(' ');
                        if (authorParts.length < 2) return;

                        let author = authorParts[1];
                        let contentEl = reply.nextElementSibling;

                        if (this.settings.isIgnored(author)) {
                                if (this.settings.options.ignoreReplaceMessages) {
                                        let textEl = contentEl.querySelector('tbody > tr > td:last-child');
                                        if (textEl)
                                                textEl.textContent = this.settings.options.ignoreReplaceString;
                                } else {
                                        contentEl.remove();
                                        reply.remove();
                                }
                        } else {
                                this.clearQuote(contentEl);
                        }
                }
        }

        clearQuote(el) {
                try {
                        let quoteHeaders = el.querySelectorAll('p.sub');

                        for (let j = 0; j < quoteHeaders.length; j++) {
                                let quoteHeader = quoteHeaders[j];
                                let quoteAuthorArr = quoteHeader.textContent.split(' ');
                                if (!quoteAuthorArr || quoteAuthorArr.length !== 2)    continue;

                                let quoteAuthor = quoteAuthorArr[0];
                                if (this.settings.isIgnored(quoteAuthor)) {
                                        let quoteContent = quoteHeader.nextElementSibling.querySelector('td');
                                        quoteContent.innerHTML = this.settings.options.ignoreReplaceString;
                                }
                        }
                }
                catch (ex) { /* do not expect a comment in every empty catch block */
                }
        }

        clearTopic() {
                let posts = Utils.GetPosts();
                this._clearTopic();

                // todo: move to separate function, come on...
                for (let i = 0; i < posts.length; i++) {
                        let post = posts[i];
                        let authorLink = post.querySelector('p > span > a');
                        if (!authorLink || !authorLink.href) continue;

                        let author = authorLink.textContent;
                        if (author === this.settings.ownName || !author) continue;

                        let ignored = this.settings.isIgnored(author);

                        // render ignore/unignore button
                        let link = document.createElement('a');
                        link.textContent = ignored ? 'Nebeignoruoti' : 'Ignoruoti';
                        link.dataset.author = author;
                        link.dataset.ignored = ignored;
                        link.href = '#';
                        link.onclick = evt => {
                                let link = evt.target;
                                let author = link.dataset.author;
                                let ignored = link.dataset.ignored;

                                if (ignored === 'false') {
                                        if (confirm(`Ar tikrai norite ignoruoti ${author}?`)) {
                                                this.settings.addIgnored(author);
                                                location.reload(); // too much to change
                                        }
                                } else {
                                        if (confirm(`Ar tikrai nebenorite ignoruoti ${author}?`)) {
                                                this.settings.removeIgnored(author, true);
                                                location.reload();
                                        }
                                }

                                evt.preventDefault();
                        };

                        let span = post.querySelector('p > span');

                        let el = Utils.InsertAfter(span, document.createTextNode('['));
                        el = Utils.InsertAfter(el, link);
                        Utils.InsertAfter(el, document.createTextNode('] '));
                }
        }

        _clearTopic() {
                let posts = Utils.GetPosts();

                for (let i = 0; i < posts.length; i++) {
                        let post = posts[i];
                        let authorLink = post.querySelector('p > span > a');

                        if (authorLink) {
                                let author = authorLink.textContent;
                                let content = post.querySelector('td.forumpost[id^="post_"]');

                                // re-retardify posts
                                if (author && this.settings.isIgnored(author)) {
                                        if (this.settings.options.ignoreReplaceMessages) {
                                                content.innerHTML = this.settings.options.ignoreReplaceString;
                                                let signatureEl = post.querySelector('p.sig');
                                                if (signatureEl)
                                                        signatureEl.remove();
                                        } else
                                                post.remove();
                                }
                        }
                }
        }

        renderUserDetails() {
                let authorEl = document.querySelector('td.embedded > h1');
                if (!authorEl) return;

                let author = authorEl.innerText;
                let ignored = this.settings.isIgnored(author);
                let blockEl = document.querySelector('a[href^="friends.php?action=add&type=block&"]');
                let insertEl = document.createElement('a');

                insertEl.innerText = ignored ? 'pašalinti iš ignoravimo' : 'ignoruoti';
                insertEl.href = '#';

                let inserted = Utils.InsertAfter(blockEl.nextSibling, document.createTextNode(' - ('));
                Utils.InsertAfter(inserted, insertEl);
                Utils.InsertAfter(insertEl, document.createTextNode(')'));

                insertEl.onclick = () => {
                        if (ignored)
                                this.settings.removeIgnored(author, true);
                        else
                                this.settings.addIgnored(author);
                        location.reload();
                };
        }
}

//--- modules/lastPosts.js
class LastPosts extends Base {
        async init() {
                if (!this.settings.options.showLastPosts) return Promise.resolve();

                let bottomEl = document.querySelector('p.tcenter:last-child');
                let lastPostsEl = document.createElement('p');
                lastPostsEl.innerHTML = LoaderTemplate.Render();

                Utils.InsertAfter(bottomEl, lastPostsEl);

                let posts = await Utils.FetchJSON('/forums/lastposts', 'POST', this.settings.getIgnored());
                lastPostsEl.innerHTML = LastPostsTemplate.Render(posts);

                // set width (fuck css, this hack is awesome)
                let forumTable = document.querySelector('#forum');
                let lastPostTable = document.querySelector('#last-posts');
                lastPostTable.width = forumTable.offsetWidth;

                let contentLinks = lastPostTable.querySelectorAll('td[data-post-id]');

                for (let i = 0; i < contentLinks.length; i++) {
                        let postId = contentLinks[i].getAttribute('data-post-id');
                        let threadId = contentLinks[i].getAttribute('data-thread-id');

                        contentLinks[i].addEventListener('click', () => {
                                location.href = `/forums.php?action=viewtopic&topicid=${threadId}&page=p${postId}#${postId}`;
                        });
                }
        }
}

//--- modules/topPosters.js
class TopPosters {
        async renderTable() {
                document.querySelector('#content > table.main').remove();
                let contentEl = document.querySelector('#content');
                contentEl.innerHTML = LoaderTemplate.Render();

                let top = await Utils.FetchJSON('/forums/top');

                contentEl.innerHTML = TopPostersTemplate.Render(top);
        }

        renderTopLinks() {
                let searchAnchors = document.querySelectorAll('a[href="?action=search"]');

                [...searchAnchors].forEach(searchAnchor => {
                        let anchor = document.createElement('a');
                        anchor.href = '/forums.php?action=top';
                        anchor.innerText = 'Top';

                        Utils.InsertBefore(searchAnchor, anchor);
                        Utils.InsertAfter(anchor, document.createTextNode(' | '));
                });
        }
}

//--- modules/userInfo.js
class UserInfo {
        constructor(userId) {
                this._userId = userId;
        }

        async renderPostCount() {
                let userInfo = await Utils.FetchJSON(`/users/info/${this._userId}`);
                if (!userInfo) return;

                let rowToAppendAfter = document.querySelector('table.main tr:nth-child(4)');

                let rows = UserInfoTemplate.RenderElement(userInfo);

                rowToAppendAfter = Utils.InsertAfter(rowToAppendAfter, rows[0]);
                Utils.InsertAfter(rowToAppendAfter, rows[1]);
        }
}

//--- modules/userPosts.js
class UserPosts {
        constructor(userId, page) {
                this._userId = userId;
                this._page = page;
        }

        async init() {
                document.querySelector('#content > table.main').remove();
                let contentEl = document.querySelector('#content');
                contentEl.innerHTML = LoaderTemplate.Render();

                let userPosts = await Utils.FetchJSON(`/users/${this._userId}/posts/${this._page > 1 ? this._page : ''}`);

                contentEl.innerHTML = UserPostsTemplate.Render(userPosts);
        }
}

//--- modules/originalPost.js
class OriginalPost {
        constructor() {
                this.dateSince = new Date('2017-05-21');
        }

        init() {
                Utils.GetPosts().forEach(post => {
                        if (Utils.GetPostDate(post) < this.dateSince) return;

                        let postEditedEl = post.querySelector('.forumpost p.small');

                        if (postEditedEl && postEditedEl.textContent.startsWith('Paskutinį kartą redagavo:')) {
                                // render 'show original button'
                                let postId = Utils.GetPostId(post);

                                let showOriginalEl = ShowOriginalPostTemplate.RenderElement(postId);
                                Utils.InsertAfter(postEditedEl, showOriginalEl);

                                showOriginalEl.onclick = async () => {
                                        showOriginalEl.onclick = null;

                                        // too fast to show loader
                                        // showOriginalEl.innerHTML = LoaderTemplate.Render();

                                        let origPost = await Utils.FetchJSON(`/forums/post/${postId}`);
                                        showOriginalEl.innerHTML = ShowOriginalPostTemplate.RenderOriginalPost(origPost);
                                };
                        }
                });
        }
}

//--- modules/userSettings.js
class UserSettings extends Base {
        init() {
                let self = this;
                let contentEl = document.querySelector('#content');

                let headerEl = UserSettingsTemplate.RenderHeaderElement();
                let settingsEl = UserSettingsTemplate.RenderElement(this.settings);

                Utils.InsertAfter(contentEl.querySelector('table'), headerEl);
                Utils.InsertAfter(headerEl, settingsEl);

                // button remove ignored
                let btnRemoveIgnored = settingsEl.querySelector('#blmRemoveIgnoredBtn');
                if (btnRemoveIgnored)
                        btnRemoveIgnored.onclick = () => {
                                let healedPlebs = Utils.GetSelectedValues(settingsEl.querySelector('#ignoredList'));

                                healedPlebs.forEach(pleb => this.settings.removeIgnored(pleb, false));

                                let removeOptions = settingsEl.querySelectorAll('#ignoredList > option:checked');
                                removeOptions.forEach(opt => opt.remove());
                        };

                // button save settings
                let btnSave = settingsEl.querySelector('#blmSaveBtn');
                btnSave.onclick = () => {
                        this.settings.save();
                        location.reload();
                };

                // checkbox last posts
                let lastPostsEl = settingsEl.querySelector('#showLastPosts');
                lastPostsEl.checked = self.settings.options.showLastPosts;
                lastPostsEl.onchange = () => self.settings.options.showLastPosts = lastPostsEl.checked;

                // checkbox hide topics
                let hideTopicEl = settingsEl.querySelector('#hideTopics');
                hideTopicEl.checked = self.settings.options.ignoreHideTopics;
                hideTopicEl.onchange = () => self.settings.options.ignoreHideTopics = hideTopicEl.checked;

                // checkbox replace messages
                let replaceMessagesEl = settingsEl.querySelector('#replaceMessages');
                replaceMessagesEl.checked = self.settings.options.ignoreReplaceMessages;
                replaceMessagesEl.onchange = () => self.settings.options.ignoreReplaceMessages = replaceMessagesEl.checked;

                // input replace string
                let replaceStringEl = settingsEl.querySelector('#replaceString');
                replaceStringEl.value = self.settings.options.ignoreReplaceString;
                replaceStringEl.onchange = () => self.settings.options.ignoreReplaceString = replaceStringEl.value;
        }
}

//--- modules/userMention.js
// class UserMention {
//      constructor(textArea) {
//              this._textArea = textArea;
//              textArea.oninput = evt => {
//                      let entered = textArea.value[textArea.selectionStart - 1];
//                      if (entered === '@') {
//                              let prevSymbol = textArea.value[textArea.selectionStart - 2];
//                              // check for conditions to display autocomplete
//                              if (prevSymbol === undefined || prevSymbol === ' ' || prevSymbol === '\n'
//                                      || prevSymbol === ']' || prevSymbol === ':' || prevSymbol === '>') {
//                              }
//                      }
//              };
//      }
// }

//--- modules/deletedUsernames.js
class DeletedUsernames {
        async init() {
                let anchorIdMap = new Map();

                let posts = Utils.GetPosts();

                [...posts].forEach(posts => {
                        let anchor = posts.querySelector('p > span > a');
                        if (anchor && anchor.text === '') {
                                let id = Number(anchor.href.split('?id=')[1]);

                                if (anchorIdMap.has(id))
                                        anchorIdMap.get(id).push(anchor);
                                else
                                        anchorIdMap.set(id, [anchor]);
                        }
                });

                if (anchorIdMap.size === 0) return;

                let usernames = await Utils.FetchJSON('/users/usernames', 'POST', [...anchorIdMap.keys()]);

                if (!usernames) return; // yeah time to start defensive programming in case service is unreachable?

                usernames.forEach(u => {
                        let anchors = anchorIdMap.get(u.Id);

                        anchors.forEach(a => {
                                a.text = `~ ${u.Username}`;
                                a.removeAttribute('href');
                        });
                });
        }
}

//--- modules/twitchEmotes.js
class TwitchEmotes extends Base {
        init() {
                // intercept editMessageSubmit function
                let origSubmitFn = window.editMessageSubmit;
                if (origSubmitFn) {
                        window.editMessageSubmit = (form, id) => {
                                this.handleSubmit(form);
                                origSubmitFn.apply(this, [form, id]);
                        };
                }

                document.addEventListener('submit', evt => this.handleSubmit(evt.target));
        }

        handleSubmit(form) {
                let textArea = form.querySelector('textarea');

                textArea.value = textArea.value.replace(TwitchEmotes._EmotesRegex, (match, s1, s2, s3) => `${s1}${this.formImgEl(s2)}${s3}`);
        }

        formEmoteUrl(emote) {
                return `${Settings.ApiUrl}/assets/images/twitch/${emote}.png`;
        }

        formImgEl(emote) {
                return `[img]${this.formEmoteUrl(emote)}[/img]`;
        }

        // generated by tools/RipTwitchEmotes
        static get _EmotesRegex() {
                return new RegExp(`(\\.|\\n|^|,| |$)(4Head|AMPTropPunch|ANELE|ArgieB8|ArigatoNas|ArsonNoSexy|AsianGlow|BabyRage|BatChest|BCWarrior|BegWan|BibleThump|BigBrother|BigPhish|BJBlazkowicz|BlargNaut|bleedPurple|BlessRNG|BloodTrail|BrainSlug|BrokeBack|BuddhaBar|BudStar|CarlSmile|ChefFrank|cmonBruh|CoolCat|CoolStoryBob|copyThis|CorgiDerp|CrreamAwk|CurseLit|DAESuppy|DansGame|DatSheffy|DBstyle|DendiFace|DogFace|DoritosChip|duDudu|DxCat|EagleEye|EleGiggle|FailFish|FrankerZ|FreakinStinkin|FUNgineer|FunRun|FutureMan|GingerPower|GivePLZ|GOWSkull|GrammarKing|HassaanChop|HassanChop|HeyGuys|HotPokket|HumbleLife|imGlitch|InuyoFace|ItsBoshyTime|Jebaited|JKanStyle|JonCarnage|KAPOW|Kappa|KappaClaus|KappaPride|KappaRoss|KappaWealth|Kappu|Keepo|KevinTurtle|Kippa|KonCha|Kreygasm|Mau5|mcaT|MikeHogu|MingLee|MorphinTime|MrDestructoid|MVGame|NinjaGrumpy|NomNom|NotATK|NotLikeThis|OhMyDog|OneHand|OpieOP|OptimizePrime|OSblob|OSfrog|OSkomodo|OSsloth|panicBasket|PanicVis|PartyTime|pastaThat|PeoplesChamp|PermaSmug|PicoMause|PipeHype|PJSalt|PJSugar|PMSTwin|PogChamp|Poooound|PraiseIt|PRChase|PrimeMe|PunchTrees|PunOko|QuadDamage|RaccAttack|RalpherZ|RedCoat|ResidentSleeper|riPepperonis|RitzMitz|RlyTho|RuleFive|SabaPing|SeemsGood|ShadyLulu|ShazBotstix|SmoocherZ|SMOrc|SoBayed|SoonerLater|SPKFace|SPKWave|Squid1|Squid2|Squid3|Squid4|SSSsss|StinkyCheese|StoneLightning|StrawBeary|SuperVinlin|SwiftRage|TakeNRG|TBAngel|TBCrunchy|TBTacoBag|TBTacoProps|TearGlove|TehePelo|TF2John|ThankEgg|TheIlluminati|TheRinger|TheTarFu|TheThing|ThunBeast|TinyFace|TooSpicy|TriHard|TTours|TwitchLit|twitchRaid|TwitchRPG|TwitchUnity|UncleNox|UnSane|UWot|VaultBoy|VoHiYo|VoteNay|VoteYea|WholeWheat|WTRuck|WutFace|YouDontSay|YouWHY)(\\b)`, 'g');
        }
}

//--- pages/forumPage.js
class ForumPage {
        init() {
                let lastPosts = new LastPosts();
                lastPosts.init();

                let topPosters = new TopPosters();
                topPosters.renderTopLinks();
        }
}

//--- pages/forumViewPage.js
class ForumViewPage {
        init() {
                // let forumId = Number(location.href.match(/forumid=(\d+)/)[1]);
                //
                let userIgnore = new UserIgnore();
                userIgnore.hideTopics();
        }
}

//--- pages/profilePage.js
class ProfilePage {
        init() {
                let userSettings = new UserSettings();
                userSettings.init();
        }
}

//--- pages/replyPage.js
class ReplyPage {
        init() {
                // let replyTextArea = document.querySelector('textarea') as HTMLTextAreaElement;
                // let userMention = new UserMention(replyTextArea);
                //
                let userIgnore = new UserIgnore();
                userIgnore.clearReply();

                let twitchEmotes = new TwitchEmotes();
                twitchEmotes.init();
        }
}

//--- pages/replyQuotePage.js
class ReplyQuotePage {
        init() {
                // let replyTextArea = document.querySelector('textarea') as HTMLTextAreaElement;
                // let userMention = new UserMention(replyTextArea);
                //
                let userIgnore = new UserIgnore();
                userIgnore.clearReplyQuote();

                let twitchEmotes = new TwitchEmotes();
                twitchEmotes.init();
        }
}

//--- pages/topPage.js
class TopPage {
        init() {
                let topPosters = new TopPosters();
                topPosters.renderTable();
        }
}

//--- pages/torrentDetailPage.js
class TorrentDetailPage {
        init() {
                let userIgnore = new UserIgnore();
                userIgnore.clearTorrentDetails();
        }
}

//--- pages/userDetailsPage.js
class UserDetailsPage extends Base {
        init() {
                let userDetailsId = Number(location.href.match(new RegExp(/\.php\?id=(\d+)/))[1]);

                if (userDetailsId !== this.settings.ownUserId) {
                        let userInfo = new UserInfo(userDetailsId);
                        userInfo.renderPostCount();

                        let userIgnore = new UserIgnore();
                        userIgnore.renderUserDetails();
                }
        }
}

//--- pages/userHistoryPage.js
class UserHistoryPage extends Base {
        init() {
                let userId = Number(location.href.match(/\/userhistory\.php\?action=viewposts&id=(\d+)/)[1]);

                if (this.settings.ownUserId === userId) return;

                let pageNumber;
                // and right about here I went 'fuck it'
                try {
                        pageNumber = Number(location.href.match(/page=(\d+)/)[1]);
                }
                catch (ex) {
                        pageNumber = 1;
                }

                let userPosts = new UserPosts(userId, pageNumber);
                userPosts.init();
        }
}

//--- pages/viewTopicPage.js
class ViewTopicPage {
        init() {
                // let replyTextArea = document.querySelector('textarea') as HTMLTextAreaElement;
                // let userMention = new UserMention(replyTextArea);
                //
                let userIgnore = new UserIgnore();
                userIgnore.clearTopic();

                let originalPost = new OriginalPost();
                originalPost.init();

                let deletedUsernames = new DeletedUsernames();
                deletedUsernames.init(); // yep ignore async we don't care, the train is rolling

                let twitchEmotes = new TwitchEmotes();
                twitchEmotes.init();
        }
}

//--- pages/editPage.js
class EditPage {
        init () {
                // let replyTextArea = document.querySelector('textarea') as HTMLTextAreaElement;
                // let userMention = new UserMention(replyTextArea);
                //
                let userIgnore = new UserIgnore();
                userIgnore.clearReply();

                let twitchEmotes = new TwitchEmotes();
                twitchEmotes.init();
        }
}

//--- main.js
class BetterLM {
        static Init() {
                if (BetterLM.IsReply)
                        new ReplyPage().init();

                else if (BetterLM.IsReplyQuote)
                        new ReplyQuotePage().init();

                else if (BetterLM.IsViewTopic)
                        new ViewTopicPage().init();

                else if (BetterLM.IsForum)
                        new ForumPage().init();

                else if (BetterLM.IsForumView)
                        new ForumViewPage().init();

                else if (BetterLM.IsUserDetails)
                        new UserDetailsPage().init();

                else if (BetterLM.IsUserHistory)
                        new UserHistoryPage().init();

                else if (BetterLM.IsTorrentDetail)
                        new TorrentDetailPage().init();

                else if (BetterLM.IsProfile)
                        new ProfilePage().init();

                else if (BetterLM.IsTop)
                        new TopPage().init();

                else if (BetterLM.IsEdit)
                        new EditPage().init();
        }

        static get IsReply() {
                return BetterLM._test(/\/forums\.php\?action=reply&topicid=/);
        }

        static get IsViewTopic() {
                return BetterLM._test(/\/forums\.php\?action=viewtopic/);
        }

        static get IsReplyQuote() {
                return BetterLM._test(/\/forums\.php\?action=quotepost&topicid=/);
        }

        static get IsForum() {
                return BetterLM._test(/\/forums\.php$/);
        }

        static get IsForumView() {
                return BetterLM._test(/\/forums\.php\?action=viewforum/);
        }

        static get IsUserDetails() {
                return BetterLM._test(/\/userdetails\.php\?id=/);
        }

        static get IsUserHistory() {
                return BetterLM._test(/\/userhistory\.php\?action=viewposts&id=/);
        }

        static get IsTorrentDetail() {
                return BetterLM._test(/\/details?/) || BetterLM._test(/\/torrent?/);
        }

        static get IsProfile() {
                return BetterLM._test(/\/my.php(?:(\?edited=1)?)$/);
        }

        static get IsTop() {
                return BetterLM._test(/\/forums\.php\?action=top$/);
        }

        static get IsEdit() {
                return BetterLM._test(/\/forums\.php\?action=editpost/);
        }

        static _test(expr) {
                return expr.test(location.href);
        }
}

// here we go for the brighter tomorrow
BetterLM.Init();
