// ==UserScript==
// @namespace TV Guide program masker
// @name YourTV Australian TV guide program masker
// @description Mask unwanted or already-watched programs in Australia's YourTV (NineMSN) TV guide
// @icon http://www.yourtv.com.au/favicon.ico
// @include /^(?:file|unmht)://.*/(?:MON|TUE|WED|THU|THUR|FRI|SAT|SUN|TV)\d*\.(?:MHT|HTML?)/?$/
// @include /^http://www\.yourtv\.com\.au/guide/(?:yesterday|today|tomorrow|mon|tue|wed|thu|fri|sat|sun)/(?:fullday|early|morning|afternoon|night)/$/
// @include /^http://www\.yourtv\.com\.au/guide/(?:tonight|early|morning|afternoon|night|restofday)/$/
// @include http://www.yourtv.com.au/guide/event.aspx?*
// @include http://www.yourtv.com.au/guide/
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @version 0.0.1.20141009135337
// @downloadURL https://update.greasyfork.org/scripts/5360/YourTV%20Australian%20TV%20guide%20program%20masker.user.js
// @updateURL https://update.greasyfork.org/scripts/5360/YourTV%20Australian%20TV%20guide%20program%20masker.meta.js
// ==/UserScript==


var rxHideAlways = /\bgenre-33\b|\bgenre-42\b/;   // "genre-33" = news, "genre-42" = sport;
var id2channel = {"92843":"2","284792":"2.2","411324":"2.3","273191":"28","284887":"28.2","96100":"7","410799":"7.2","388547":"7mate","252342":"9","391132":"9.Gem","407657":"9.Go","388610":"1","250185":"10","403767":"11","251882":"31"};
var el, el2, s, rows, maskBtn, hoverEl, listForm, listTA, maskList = {}, validChannels = {"MOVIE":true};


if (window.location.pathname==="/guide/event.aspx")  // program detail page
{

  (el = document.getElementById("rightcol")).parentNode.removeChild(el);
  GM_addStyle("html, html body {height:100%;oveflow:hidden;background:white !important}\n"
            + "#frmForm {height:100%;oveflow:hidden}\n"
            + "#sglmain {height:100%;oveflow:auto}\n"
            + "#sglmain #event {position:relative;margin:0;min-width:750px;min-height:100%;background:transparent}\n"
            + "#event #leftcol {margin:0;padding:10px 10px 410px}\n"
            + "#leftcol a:hover {text-decoration:underline}\n"
            + "#leftcol .other-links li {display:inline-block;padding:8px 16px 8px 0;font-size:larger}\n"
            + "#leftcol .other-links li.divider {padding:11px 16px 13px 0}\n"
            + "#leftcol .other-links a {display:inline-block;padding:4px 0;margin:0}\n"
            + "#leftcol #EventPopup_OtherLinks_ImdbLink {display:inline-block;padding:4px 8px;margin:0;border-radius:3px;background:#DBA506 radial-gradient(80% 120%, #FCF4AB 0%, #DBA506 100%);text-decoration:none}\n"
            + "#leftcol #EventPopup_OtherLinks_RottenTomatoesLink {display:inline-block;padding:4px 16px;0;border-radius:13px;background:#FF0000 radial-gradient(80px 50px at 25% 10%, #FFC0C0 0%, #FF4040 10%, #FF0000 50%, #E00000 80%, #3A4A12 90%, #3A9425 90%);color:#F3EC1A;text-decoration:none}\n"
            + "#footer {position:absolute;left:0;right:0;bottom:0}\n"
            + "noscript {display:none}");
  if (el = document.getElementById("leftcol")) for(s = (el = el.getElementsByTagName("a")).length; s--;) el[s].target = "_self";
  if ((el = document.getElementById("EventPopup_OtherLinks_BingSearchLink"))&&(s = el.href.match(/(?:\?|&)q=([^&]*)(?:&|$)/)))
    el.parentNode.innerHTML += ' or <a id="EventPopup_OtherLinks_GoogleLink" href="https://www.google.com.au/search?q='+s[1]+'">Google</a>';

}
else  // main TV guide page
{

  GM_addStyle("#main {padding-bottom:800px}\n"
            + "#grid #show-mask-list {cursor:pointer}\n#grid #show-mask-list:hover {background-position:6px -14px}\n"
            + "#grid td .event-highlight {background-color:#DEFECC;background-image:none}\n"
            + "#grid td .event-dim .ptime, #grid td .event-dim .episode, #grid td .event-dim .pinfo, #grid td .event-dim .episode-divider, #grid td .event-dim .pname a {color:#DDD}\n"
            + "#grid div#GM_maskerButton {display:block;position:absolute;color:red;border:2px solid red;background:white;font-family:Arial;font-weight:normal;font-size:12px;line-height:14.5px;text-align:center;margin:0;padding:0;width:14px;height:14px;border-radius:9px;top:0;right:0;cursor:pointer}\n"
            + "#grid .pinfo div#GM_maskerButton {border-color:#FF8000;color:#FF8000}\n"
            + "#grid .event-dim div#GM_maskerButton {border-color:#999;color:#999;font-size:14px;line-height:14px}\n"
            + "noscript {display:none}");

  for (s in id2channel) if (id2channel.hasOwnProperty(s)) validChannels[id2channel[s]] = true;

  document.body.id = "guide-body";
  if (el = document.getElementById("ninemsn-global-header")) el.parentNode.removeChild(el);
  if (el = document.getElementById("ninemsn-global-footer")) el.parentNode.removeChild(el);
  if (el = document.getElementById("ninemsn-global-header")) el.parentNode.removeChild(el);
  if (el = document.getElementById("ninemsn-global-header")) el.parentNode.removeChild(el);
  if (el = document.getElementById("TVFIX_HEADER")) el.parentNode.removeChild(el);
  if (el = document.getElementById("THEFIX_footer")) el.parentNode.removeChild(el);
  if (el = document.getElementById("guide-regions-menu")) el.parentNode.removeChild(el);
  if ((el = document.getElementById("day-nav"))&&(el = el.firstElementChild)) while (el) { if ((el2 = el.children[1])&&(el2 = el2.firstElementChild)&&(s = el2.href)) el2.href += ((s==="http://www.yourtv.com.au/guide/")?"today/":"")+"fullday/"; el = el.nextElementSibling; }
  if ((el = document.getElementById("day-nav-footer"))&&(el = el.firstElementChild)) while (el) { if ((el2 = el.children[1])&&(el2 = el2.firstElementChild)&&(s = el2.href)) el2.href += ((s==="http://www.yourtv.com.au/guide/")?"today/":"")+"fullday/"; el = el.nextElementSibling; }
  if (el = document.getElementById("edit-channels-link"))
  {
    el2 = el.parentNode; while (el.nextSibling) el2.removeChild(el.nextSibling);
    if (el2.nextElementSibling) el2.parentNode.removeChild(el2.nextElementSibling);
    el2.innerHTML += '<span class="divider text-small"> </span> <a id="show-mask-list" class="btn-dark-green rounded-corners">SHOW PROGRAM MASK LIST</a>';
    el2.lastChild.addEventListener("click",showList,false);
  }
  if ((el = document.getElementById("pay-region-add"))&&(el = el.parentNode)) el.parentNode.removeChild(el);
  if (el = document.getElementById("frmForm")) while (el2 = el.previousSibling) el2.parentNode.removeChild(el2);
  el = el2 = null;

  s = (listForm = document.body.appendChild(document.createElement("FORM"))).style;
  (s = listForm.style).display = "none"; s.position = "fixed"; s.top = s.bottom = s.left = s.right = "0"; s.backgroundColor = "#202020"; s.fontFamily = "Arial"; s.fontSize = "12px"; s = null;
  listForm.innerHTML =
      '<h1 style="color:white;background-color:#000080;margin:10px;padding:10px"><u>YourTV Masked Shows</u></h1>'
    + '<div style="position:absolute;top:80px;bottom:80px;left:10px;right:10px;width:auto;height:auto"><textarea autocomplete="off" spellcheck="false" style="width:100%;height:100%;font-size:10px;overflow:auto"></textarea></div>'
    + '<div style="position:absolute;bottom:0;left:10px;height:50px"><input type="button" value="  Save  "> &nbsp; <input type="reset" value="  Undo  "> &nbsp; '
    + '<input type="button" value="  Copy  "> &nbsp; <input type="reset" value="  Close  "></div>"';
  listForm.elements.item(1).addEventListener("click",saveList,false);
  listForm.elements.item(3).addEventListener("click",copyList,false);
  listForm.elements.item(4).addEventListener("click",closeList,false);
  listTA = listForm.elements.item(0);
  parseList(listTA.value = listTA.defaultValue = GM_getValue("maskedShows",""));

  maskBtn = document.createElement("div");
  maskBtn.id = "GM_maskerButton";
  maskBtn.addEventListener("click",maskToggle,false);
  (rows = document.getElementById("FTA-header").nextElementSibling).addEventListener("mouseover",doMouseOver,false);
  rows = rows.rows;

  filterAllTVShows();

}


function filterAllTVShows()
{
  var row, channel, cells, td, i, j;
  for (i = rows.length; i--;) if (channel = id2channel[(row = rows[i]).id])
    for (j = (cells = row.cells).length; j--;)
      if ((!(el = (td = cells[j])).className)&&(el = el.firstElementChild)) while (el) { filterTVshow(channel,el); el = el.nextElementSibling; }
}


function filterTVshow(channel,div0)
{
  var pname = "", pinfo = "", maskClass, div, el, cn, url;
  maskClass = ((/\bmovie\b/.test(div0.className)) ? 2 : ((rxHideAlways.test(div0.className)) ? 1 : 0));
  div = div0.firstElementChild;
  while (div&&(cn = div.className)) if (cn==="catch-up-link") { el = div; div = div.nextElementSibling; el.parentNode.removeChild(el); } else div = div.nextElementSibling;
  if (!div) return;
  div = div.lastElementChild;
  while (div)
  {
    if ((cn = div.className)==="pinfo") pinfo = div.textContent.replace(/\bPremiere\s*$/i,"").replace(/\s+/g," ").trim();
    else if (cn==="pname")
    {
      pname = div.textContent.replace(/\s+/g," ").trim();
      if ((el = div.firstElementChild)&&el.href) { el.target = "margin"; el.href = el.href.replace(/^javascript:TvFix\.Util\.ShowPopup\((\d+),(?: |%20)*(\d+),(?: |%20)*(\d+)\);?$/i, "/guide/event.aspx?program_id=$1&event_id=$2&region_id=$3"); }
    }
    div = div.previousElementSibling;
  }
  if ((maskClass!==1) && pname && ((maskInfo = maskList["["+((maskClass===2)?"MOVIE":channel)+"]\t"+pname])!=null) && ((maskInfo===true)||(maskInfo["\t "+pinfo]))) maskClass = 1;
  setProgramStyle(div0,maskClass);
}


function setProgramStyle(div0,maskClass)  // maskClass:  0 - normal,  1 - dimmed out,  2 - movie highlight
{
  var cn, styleEl, newCls = [], i, l, c
  cn = (styleEl = ((div0.nextElementSibling||div0.previousElementSibling) ? div0 : div0.parentNode)).className.split(" ");
  for (i = 0, l = cn.length; i<l; i++) if ((c = cn[i])&&(c!=="event-dim")&&(c!=="event-highlight")) newCls.push(c);
  if (maskClass) newCls.push("event-"+((maskClass===1)?"dim":"highlight"));
  styleEl.className = newCls.join(" ");
}


function showList()
{
  if (maskBtn.parentNode) doMouseLeave();
  listTA.defaultValue = listTA.value = listTA.defaultValue.split("\n").sort().join("\n");
  document.body.style.overflow = "hidden";
  listForm.style.display = "";
  return false;
}


function saveList()
{
  var list = [], s, eps, ep;
  parseList(listTA.value.replace(/\r/g,""));
  for (s in maskList) if (maskList.hasOwnProperty(s))
  {
    if ((eps = maskList[s])!==true) for (ep in eps) if (eps.hasOwnProperty(ep)) s += ep;
    list.push(s)
  }
  GM_setValue("maskedShows", listTA.value = listTA.defaultValue = list.sort().join("\n"));
  filterAllTVShows();
}


function copyList() { GM_setClipboard(listTA.value); }

function closeList() { this.form.style.display = "none"; document.body.style.overflow = ""; }


function parseList(s)
{
  var i, m, ch, prog, info;
  maskList = {};
  s = s.split("\n");
  for (var i = s.length; i--;)
    if ((m = s[i].match(/^\[([^\]]+)\]\t+([^\t]+)((?:\t+[^\t]+)*)$/))&&validChannels[ch = m[1]]&&(prog = m[2].trim())) maskList["["+ch+"]\t"+prog] = toInfoMap(m[3]);
}


function toInfoMap(info)
{
  var map, i, l, s, filled;
  if (!info) return true;
  info = info.replace(/\t{2,}/g,"\t").split("\t");
  for (i = 0, l = info.length, map = {}, filled = false; i<l; i++) if (s = info[i].trim()) map["\t "+s] = filled = true;
  return (filled ? map : true);
}


function getProgramInfo(div)
{
  var ch, pname = false, pinfo = "", cn, btnHTML;
  if (!(div&&(ch = div.parentNode)&&((/\bmovie\b/.test(ch.className)?(ch = "MOVIE"):false)||((ch = ch.parentNode)&&(ch = ch.parentNode)&&(ch = ch.id)&&(ch = id2channel[ch]))))) return false;
  div = div.lastElementChild;
  btnHTML = maskBtn.innerHTML; maskBtn.innerHTML = "";
  while (div)
  {
    if ((cn = div.className)==="pinfo") pinfo = div.textContent.replace(/\bPremiere\s*$/i,"").replace(/\s+/g," ").trim();
    else if (cn==="pname") pname = div.textContent.replace(/\s+/g," ").trim();
    div = div.previousElementSibling;
  }
  maskBtn.innerHTML = btnHTML;
  if (!pname) return false;
  return [ch,pname,pinfo];
}


function doMouseOver(e)
{
  var t = e.target, tp, cn, prog, ch, maskInfo, maskType, dimmed;
  while (t&&(t.tagName!=="DIV")||(((cn = t.className)!=="pname")&&(cn!=="pinfo"))) t = t.parentNode;
  if ((!(t&&(prog = getProgramInfo(tp = t.parentNode))))||(!(tp = tp.parentNode))||rxHideAlways.test(tp.className)) return;
  ch = prog[0]; pinfo = prog[2];
  dimmed = (((maskInfo = maskList["["+ch+"]\t"+prog[1]])===true)||(maskInfo&&maskInfo["\t "+pinfo]));
  setProgramStyle(tp,(dimmed ? 1 : ((ch==="MOVIE")? 2 : 0)));
  if (!dimmed) maskType = "\u2796"; else if (cn==="pinfo") { if ((maskInfo===true)||!pinfo) return; else maskType = "\u271A"; } else maskType = ((maskInfo===true) ? "\u271A" : "\u2731");  // \u2796 = -   \u271A = +   \u2731 = *
  (hoverEl = t).style.position = "relative";
  maskBtn.innerHTML = maskType;
  t.appendChild(maskBtn);
  t.addEventListener("mouseleave", doMouseLeave, false);
}


function doMouseLeave()
{
  maskBtn.parentNode.removeChild(maskBtn);
  hoverEl.removeEventListener("mouseleave", doMouseLeave, false);
  hoverEl.style.position = "";
  hoverEl = null;
}


function RXesc(s) { return s.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&"); }


function maskToggle()
{
  var s, t, isInfo, prog, pinfo, mask, nonempty, k;
  if ((listForm.style.display!=="none")||!((t = maskBtn.parentNode)&&((isInfo = (t.className==="pinfo"))||(t.className==="pname"))&&(prog = getProgramInfo(t = t.parentNode)))) return;
  pinfo = prog[2];  if (isInfo) { if (!pinfo) { doMouseLeave(); return; } pinfo = "\t "+pinfo; }
  mask = maskList[prog = "["+prog[0]+"]\t"+prog[1]];
  s = listTA.defaultValue;
  if (maskBtn.innerHTML==="\u2796") // APPLY MASK
  {
    applyMask(t.parentNode,true);
    if (isInfo)  // episode only
    {
      if (mask===true) { doMouseLeave(); return; }
      if (!mask) { (maskList[prog] = {})[pinfo] = true; s += (s?"\n":"")+prog+pinfo; } else
      {
        if (mask[pinfo]) return;
        mask[pinfo] = true;
        s = s.replace(new RegExp("((?:\n|^)"+RXesc(prog)+"\t[^\n]*)(\n|$)"),"$1"+pinfo.replace(/\$/g,"$$$$")+"$2");  // insert ep
      }
    }
    else  // entire prog
    {
      if (mask===true) return;
      maskList[prog] = true;
      if (!mask) s += (s?"\n":"")+prog;
      else s = s.replace(new RegExp("((?:\n|^)"+RXesc(prog)+")(\t[^\n]*)(\n|$)"),"$1$3");  // remove ep list
    }
  }
  else  // REMOVE MASK
  {
    if ((mask===true)&&isInfo) { doMouseLeave(); return; }  // can't remove entire prog mask by toggling episode!
    applyMask(t.parentNode,false);
    if (!mask) return;
    if (isInfo)  // episode only
    {
      delete mask[pinfo];
      nonempty = false;
      for (k in mask) if (nonempty = mask.hasOwnProperty(k)) break;
      if (isInfo = nonempty) s = s.replace(new RegExp("((?:\n|^)"+RXesc(prog)+"(?:\t[^\n\t]*)*)("+RXesc(pinfo)+")(\t|\n|$)"),"$1$3");  // remove specified ep from list
    }
    if (!isInfo)  // entire prog (or last ep mask removed)
    {
      delete maskList[prog];
      s = s.replace(new RegExp("(?:\n|^)"+RXesc(prog)+"(?:\t[^\n]*)?(\n|$)"),"$1");  // remove prog row
      if (s.charAt(0)==="\n") s = s.substring(1);
    }
  }
  GM_setValue("maskedShows", listTA.defaultValue = s);
}


function applyMask(div0, masked)
{
  maskBtn.innerHTML = (masked ? "\u271A" : "\u2796");
  if (!div0) return;
  var maskClass, styleEl, cn, newCls = [], l, i, c;
  if (!(styleEl = ((div0.nextElementSibling||div0.previousElementSibling) ? div0 : div0.parentNode))) return;
  maskClass = (masked ? 1 : (/\bmovie\b/.test(div0.className) ? 2 : 0));
  cn = styleEl.className.split(" ");
  for (i = 0, l = cn.length; i<l; i++) if ((c = cn[i])&&(c!=="event-dim")&&(c!=="event-highlight")) newCls.push(c);
  if (maskClass) newCls.push("event-"+((maskClass===1)?"dim":"highlight"));
  styleEl.className = newCls.join(" ");
}