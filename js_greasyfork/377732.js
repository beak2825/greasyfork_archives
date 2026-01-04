// ==UserScript==
// @name i,o,pでXPath生成ツール
// @description i:生成　o:除外条件付き生成　p:除外条件＋１つの要素のみを生成　Shift+i:除外条件変更　Shift+o:要求条件入力　Shift+p:要求Hits数変更
// @match *://*/*
// @match file:///*.html
// @version     0.4.4
// @grant GM_setClipboard
// @run-at document-end
// @noframes
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @require https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/377732/i%2Co%2Cp%E3%81%A7XPath%E7%94%9F%E6%88%90%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/377732/i%2Co%2Cp%E3%81%A7XPath%E7%94%9F%E6%88%90%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {

  const SITEINFO_UAP = 1; // -> [] で「AutoPagerize」用のSITEINFOを出力
  const SITEINFO_WCA = 1; // -> [] で「web漫画にショートカットキーを追加」用のSITEINFOの雛形を出力
  const SITEINFO_YHM = 1; // -> [] で「ヤフオクで非表示とメモ」用のSITEINFOの雛形を出力
  const TEXT_MAX = 150; // @text等の文字列指定をする最大の長さ　これ以上の長さの@text=""やcontains(text(),"")の指定はしない
  const tips = "\n\nTips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR\n\n";

  const genNoboruRitsu = 0.1; // 0.5　遡る確率　初期値は５０％
  const genNoboruRitsuCSS = 0.5; // 0.5　遡る確率　初期値は５０％
  const XPATH_CSS_RATIO = 0.66; // XPATH:CSS のCSSの割合
  const maxLines = 60; // 一度に提案する最大数調整　大きいほど少ない（maxLines/縦解像度）
  const TryMulti = 1; // 一度に生成する試行回数調整　増やすと沢山試す＝遅い代わりに結果が増える
  var excludeRE = "href=|text\\(\\)|title=|alt=|src="; // o,pキーではこれを含むXPath式は除外する　Shift+iで変更可
  var requireRE = ""; // o,pキーではこれを含むXPath式を残す　Shift+oで変更可
  const SHIFT_O_SUGGEST = "@id=|\\#|@class|\\.|\\[class\\*\\=";
  var requireHits = 1; // pキーではこのhits数のXPath式を残す　Shift+pで変更可
  let GF = {};

  const autoNextLinkDecision = /page.*last\(\)|nav|next|right|>|＞|»|次/gmi;
  const autoNextLinkDecisionNot = /href/gmi;
  const autoPageElementDecision = /main|list|content/gmi;
  const verbose = 0; // 詳細をconsole.log()

  let addstyle = {
    added: new Set(),
    add: function(str) {
      if (this.added.has(str)) return;
      end(document.head, `<style>${str}</style>`);
      this.added.add(str);
    },
  }

  addstyle.add(`#ioptable table,#ioptable tr,#ioptable td {padding:0 !important;}`)

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  let inYOUTUBE = location.hostname.match0(/^www\.youtube\.com|^youtu\.be/);
  var mousex = 0;
  var mousey = 0;
  var shiftYenText = "";
  var bubparent = 0;
  var EscToHidePanel;
  var BrightStyle = "0px 0px 6px 6px rgba(0, 250, 0, 0.5), inset 0 0 12px rgba(0, 250, 0, 0.2)";
  var panel;
  const CancelStyle = /box-shadow: none;|\@style=\"\"|(\sand\s)\sand\s|\[\]|\sand\s(\])/gmi;
  const cancelrep = "$1$2";

  var testxpold = [];
  var testxpoldstyle = [];
  var frameOldEle, frameOldStyle, frameOldTimer;
  var ap1, ap2;
  GF.ancestor = 0;

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') !== null || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.keyCode == 73) {
      $(panel).remove();
      mark(9);
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //i 7
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.keyCode == 79) {
      $(panel).remove();
      mark(7);
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //o
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && e.keyCode == 80) {
      $(panel).remove();
      mark(0);
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //p
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && e.getModifierState("Shift") && e.keyCode == 73) {
      excludeRE = window.prompt("Enter exclude word(s) RegExp\n\ncurrent:\n" + excludeRE + tips, excludeRE || "") || null;
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && e.getModifierState("Shift") && e.keyCode == 79) {
      requireRE = window.prompt("Enter require word(s) RegExp\n\ncurrent:\n" + requireRE + tips, requireRE || SHIFT_O_SUGGEST) || null;
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && e.getModifierState("Shift") && e.keyCode == 80) {
      requireHits = proInput("Enter required hits", requireHits, 0) || 1;
      e.preventDefault();
      e.stopPropagation();
      return false;
    } //
    //    }
    //  }, false);
  }, true);
  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  GF.ancestor = 0;
  GF.buttons = e => {
    if (e?.target?.matches("#iopancesplus")) GF.ancestor++;
    else if (e?.target?.matches("#iopancesminus") && GF.ancestor > 0) GF.ancestor--;
    mark(GF?.lastmode ?? 7, GF?.lastMark)
  }

  return;

  function storetest(xpath) {
    writebacktest();
    testxpold = [];
    //    cl(xpath)
    if (xpath) {
      for (let ele of elegeta(xpath)) {
        testxpold.push(ele);
        testxpoldstyle.push(ele.style.boxShadow);
        if (ele) ele.style.boxShadow = BrightStyle;
      }
    }
    return;
  }

  function writebacktest() {
    if (testxpold) {
      for (let ele of testxpold) {
        if (ele) ele.style.boxShadow = testxpoldstyle.shift();
      }
      testxpold = [];
    }
    return;
  }

  function mark(mode = 0, ele = null) {
    GF.lastmode = mode;
    if (ele && !document.contains(ele)) { $(panel).remove(); return; }
    if (eleget0("#iopzerokey")) {
      writebacktest();
      GF.panelLeft = eleget0("#iopzerokey")?.getBoundingClientRect()?.left
      GF.panelTop = eleget0("#iopzerokey")?.getBoundingClientRect()?.top
      $(panel).remove();
      panel = null;
      testxpold = null;
    } else {
      GF.panelLeft = undefined;
      GF.panelTop = null;
    }

    if (frameOldEle) {
      frameOldEle.style.outline = frameOldStyle;
      frameOldEle = null;
      clearTimeout(frameOldTimer);
    }

    if (!ele) {
      ele = document.elementFromPoint(mousex, mousey);
    }
    GF.lastMark = ele
    for (let i = 0; i < GF.ancestor && ele != document.body; i++) { ele = ele?.parentNode; }
    popup(makecontent(mode, ele), /$^/, ele, mode);

    let classlist = (ele?.className || "")?.trim()?.split(" ").filter(v => v).filter(v => !v.match(/\:/)).map(v => "." + v.trim()).join("")
    //    let csssel = `${ele.tagName?.toLowerCase()}${typeof ele.id=="string"&&ele.id>""?"#"+ele.id:""}${typeof ele.className=="string"&&ele.className>""?"."+ele.className.trim().replace(/\s+/g,".").trim():""}`
    let csssel = `${ele.tagName?.toLowerCase()}${typeof ele.id=="string"&&ele.id>""?"#"+ele.id:""}${classlist.trim()}`
    //    let csssel = `${ele.tagName?.toLowerCase()}${typeof ele.id=="string"&&ele.id>""?"#"+ele.id:""}${typeof ele.className=="string"&&ele.className>""?"."+ele.className.trim().replace(/\s+/g,".").trim():""}`
    var editableArea = eleget0('textarea#testXPath')
    if (csssel && editableArea) {
      editableArea.value = csssel;
      putResult(csssel, "noflash")
    }


    frameOldStyle = ele.style.outline;
    frameOldEle = ele;
    ele.style.outline = "red dotted 4px";
    //ele?.animate([{ outline: `1em solid #0f4c` }, { outline: `3px dashed #f008` }], {  duration: 333 })
    frameOldTimer = setTimeout(function() {
      if (frameOldEle) {
        frameOldEle.style.outline = frameOldStyle;
        frameOldEle = null;
      }
    }, 4000);
    //GF.hold=0
  }

  function putResult(xpath, command = "") { // エディットエリアが書き換えられたら
    writebacktest();
    let elealen = elegeta(xpath)?.length;

    let target = document?.getElementById("testXPath");
    if (!target) return;
    let lineHeight = 1;
    target.setAttribute("rows", lineHeight);
    for (let t = 0; t < 9; t++) { if ((target.scrollHeight) >= target.offsetHeight) { target.setAttribute("rows", lineHeight++); } }

    $(eleget1('//th[@id="testXPathResult"]')).text("Err");
    $('#testXPathPossibly span').remove()
    var ele = eleget1(xpath);
    if (ele == "Err") { $(eleget1('//th[@id="testXPathResult"]')).text(ele); } else {
      $(eleget0('//th[@id="testXPathResult"]')).text((elegeta(xpath, document, "visible").length != elealen ? elegeta(xpath, document, "visible").length + " | " : "") + elealen);
      if (elealen > 0) {
        let [col, esti] = maybe(xpath)
        end(eleget0('#testXPathPossibly'), `<span style="${col}">${ esti }</span>`)
      }
    }
    if (command.match0(/noflash/) == false) storetest(xpath);
    return;
  }

  // バルーン表示
  function popup(txt, unRCtxt = null, posele, mode) {
    addstyle.add('#iopzerokey,#iopzerokey table,#iopzerokey tr,#iopzerokey td,#iopzerokey th,#iopzerokey textarea{all:revert;}')

    cl(mousey + "\n" + document.documentElement.clientHeight + "\n" + window.innerHeight)
    let eler = posele.getBoundingClientRect();

    let boxPos = "top:0; left:0;"

    let ele = eleget0("//table[@id='iopzerokey']");
    if (ele) ele.parentElement.removeChild(ele);

    // 表ヘッダ
    let lists = document.createElement('table');
    var line = document.createElement('tr');
    line.id = "header"
    line.addEventListener("dblclick", () => { $("#iopzerokey").hide(400, function() { setTimeout(function() { $("#iopzerokey").remove() }, 100) }) });

    addstyle.add(`#iopancesplus,#iopancesminus,#iopregenarate{cursor:pointer; } #iopregenarate{float:left; color:#26c;}`)
    begin(line,
      `<th style='text-align:center; min-width:5em; max-width:5em !important; padding:0 2px; white-space: nowrap;'>Hits</th>
      <th style='text-align:center; min-width:7em; max-width:7em !important; padding:0 2px; white-space: nowrap;'>Possibly</th>
      <th style='text-align:center; padding:0 8px;'><span style='color:#80f; float:left;'　 title="iopキーで生成する要素を親に遡る世代数\nパネル上でShift+ホイール上下で変更"">trace ancestor=${GF.ancestor} <span id="iopancesplus">[+]</span>/<span id="iopancesminus">[-]</span></span><span id="iopregenarate" title="クリックで再生成">　[Regenerate]</span>XPath/CSS Selector${ mode != 9 && excludeRE ? "<span style='color:red;float:right;padding:0 4px;'>-" + excludeRE+"</span>" : "" }${ requireRE ? "<span style='color:blue;float:right;padding:0 4px;'>+" + requireRE + "</span>" : "" }${(mode == 0 ? "<span style='color:darkgreen;float:right;padding:0 4px;'>n=" + requireHits + "</span>" : "") }</th>`)

    $(line).on("mousedown", "#iopancesplus,#iopancesminus,#iopregenarate", GF.buttons)

    lists.appendChild(line);

    // エディットエリア
    var editableline = document.createElement('tr');
    lists.appendChild(editableline);
    begin(editableline, "<th style='text-align:center; vertical-align:middle; padding:0 8px; white-space: nowrap;' id='testXPathResult'>test</th><th style='text-align:center; vertical-align:middle; padding:0 8px; white-space: nowrap;' id='testXPathPossibly'> </th><th><textarea rows='2' style='width:95%; min-height:2em; min-rowsline-height:1.0; overflow-x:hidden;' id='testXPath'>" + /* txt[txt.length - 1] */ "" + "</textarea></th>")
    editableline.onclick = function() { arguments[0].stopPropagation(); return false; }
    editableline.onmouseover = function(e) {
      putResult(eleget0('//textarea[@id="testXPath"]')?.value?.replace(/\\\"/gmi, "\""));

      if (eleget1(eleget0('//textarea[@id="testXPath"]')?.value) != "Err") {
        storetest(eleget0('//textarea[@id="testXPath"]')?.value);
        this.style.backgroundColor = '#ffffff';
      }
    }
    editableline.onmouseout = function() {
      if (eleget1(eleget0('//textarea[@id="testXPath"]')?.value) != "Err") {
        writebacktest();
        this.style.backgroundColor = '';
      }
    }
    editableline.addEventListener('input', function(e) { // エディットエリアが書き換えられた
      putResult(e.target.value.replace(/\\\"/gmi, "\""));
      if (eleget1(e.target.value.replace(/\\\"/gmi, "\"")) != "Err")
        storetest(e.target.value.replace(/\\\"/gmi, "\""));
    }, false);

    function appendAPb(place, text, matchLv) {
      var ele3 = place.appendChild(document.createElement('td'));
      $(ele3).hover(function() { $(this).css('cursor', 'pointer'); }, function() { $(this).css('cursor', 'default'); });
      begin(ele3, text)
      ele3.title = text == "->" ? "set this as nextLink/uAutoPagerize" : "set this as pageElement/uAutoPagerize";
      ele3.style.whiteSpace = "nowrap";
      ele3.style.opacity = 0.5;
      ele3.style.backgroundColor = matchLv ? "#ffaaaa" : "";
      ele3.style.verticalAlign = "middle";
      return ele3;
    }

    var ele3 = appendAPb(editableline, "->");
    ele3.onclick = function(e) {
      let xpath = eleget0('//textarea[@id="testXPath"]').value;
      let origXpath = xpath;
      if (eleget1(xpath) != "Err") {
        for (var sa = 0; sa < 10; sa++) {
          if (eleget1(xpath) != "Err" && eleget0(xpath).tagName == "A") {
            apc();
            ap1 = xpath;
            writeClipboard(xpath);
            if (ap2) { apmake(ap1, ap2); }
            break;
          } else {
            writebacktest();
            xpath += "/..";
            storetest();
          }
        }
        if (sa == 10) {
          //alert("Went back to the parent element for 10 generations, but A tag was not found.");
          xpath = origXpath;
          apc();
          ap1 = xpath;
          writeClipboard(xpath);
          if (ap2) { apmake(ap1, ap2); }
          //          alert("Went back to the parent element for 10 generations, but <A> tag was not found.");
          //          apc();
          e.stopPropagation();
        }
      }
    }
    var ele3 = appendAPb(editableline, "[]");
    ele3.onclick = function(e) {
      let xpath = eleget0('//textarea[@id="testXPath"]').value;
      if (eleget1(xpath) !== "Err" && eleget0(xpath).nodeType === 1) {
        apc();
        ap2 = xpath;
        writeClipboard(xpath);
        if (ap1) { apmake(ap1, ap2); }
      }
    }

    // 表
    for (let xpath of txt) {
      if (xpath) {
        let ele2 = eleget0(xpath);
        let elea = elegeta(xpath);
        let elealen = elea?.length
        var line = document.createElement('tr');

        // maybe タイプ判定
        let [col, esti] = maybe(xpath)
        var xpathDisp = xpath.replace(/(@id=|@class)/gmi, '<font style="color:magenta;"><b>$1</b></font>'); //.replace(requireRE?RegExp("("+requireRE+")","gmi"):/\0/, '<font style="background-color:#f0f0ff;">$1</font>');
        begin(line, "<td nowrap data-hits='" + elegeta(xpath, document, "visible").length + "' title=\"クリックでこのヒット数指定に変更（Shift+P）\" style=\"cursor:pointer; text-align:center;" + col + "padding:0 8px;\">" + (elegeta(xpath, document, "visible").length != elegeta(xpath).length ? elegeta(xpath, document, "visible").length + " | " : "") + elegeta(xpath).length + "</td><td style='" + col + "text-align:center; padding:0 8px; '>" + esti + "</td><td style=\"" + col + " text-align:left;\">" + xpathDisp + "</td>")
        line.onmouseover = function() {
          storetest(xpath);
          this.style.backgroundColor = '#ffffff';
        }
        line.onmouseout = function() {
          writebacktest();
          this.style.backgroundColor = '';
        }
        line.onclick = function(e) {
          if (e?.target?.dataset?.hits) {
            requireHits = Number(e?.target?.dataset?.hits)
            e.stopPropagation()
            e.preventDefault()
            setTimeout(() => {
              //GF.hold = 1;
              mark(0, GF?.lastMark);
              //GF.hold = 0;
            }, 111)
            return false;
          }
          var txt = e?.ctrlKey ? xpath.replace(/\"/gm, "\\\"") : xpath;
          eleget0('//textarea[@id="testXPath"]').value = txt;
          putResult(txt.replace(/\\\"/gmi, "\""));
          e.stopPropagation()
          e.preventDefault()
          return false;
        }
        line.ondblclick = function(e) {
          var txt = e?.ctrlKey ? xpath.replace(/\"/gm, "\\\"") : xpath;
          writeClipboard(txt);
          eleget0('//textarea[@id="testXPath"]').value = txt; //a.value;
          eleget0('//th[@id="testXPathResult"]').innerText = elegeta(txt).length;
          writebacktest();
          $("#testXPath").remove();
          $(panel).hide(400, function() { setTimeout(function() { $(panel).remove() }, 100) });
          //          panel = null;
          e.stopPropagation()
          e.preventDefault()
          return false;
        }

        // uAutoPagerize用ボタン
        var ele3 = appendAPb(line, "->", (elegeta(xpath).length < 3) && !!(xpath.match(autoNextLinkDecision)) && !(xpath.match(autoNextLinkDecisionNot)));
        ele3.onclick = function(e) {
          let origXpath = xpath;
          if (eleget1(xpath) != "Err") {
            for (var sa = 0; sa < 10; sa++) {
              if (eleget1(xpath) != "Err" && eleget0(xpath)?.tagName == "A") {
                apc();
                ap1 = xpath;
                writeClipboard(xpath);
                if (ap2) { apmake(ap1, ap2); }
                break;
              } else {
                writebacktest();
                xpath += "/..";
                storetest();
              }
            }
            if (sa == 10) {
              //alert("Went back to the parent element for 10 generations, but A tag was not found.");
              xpath = origXpath;
              apc();
              ap1 = xpath;
              writeClipboard(xpath);
              if (ap2) { apmake(ap1, ap2); }
            }
          }
        }
        var ele3 = appendAPb(line, "[]", (elegeta(xpath).length == 1) && !!xpath.match(autoPageElementDecision));
        ele3.onclick = function(e) {
          if (eleget1(xpath) != "Err") {
            apc();
            ap2 = xpath;
            writeClipboard(xpath);
            if (ap1) { apmake(ap1, ap2); }
          }
        }

        function apmake(ap1, ap2) {
          var msi = "";
          let domain = location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
          if (SITEINFO_UAP) { msi += "{\n  url         : '^https?://" + domain.replace(/\./g, "\\\\.") + "',\n  nextLink    : '" + ap1 + "',\n  pageElement : '" + ap2 + "',\n},\n"; }
          if (SITEINFO_WCA) { msi += `\n// @match *://${ domain }/*\n{\n  url: '//${ domain }/',\n  firstEpisode: '${ap1}',\n  lastEpisode: '${ ap2}',\n},\n`; }
          //          if (SITEINFO_YHM) { msi += "\n// @match *://" + domain + "/*\n{\n  id:'" + domain + "',\n  urlRE: '//" + domain + "/',\n  listTitleXP: '" + ap1 + "',\n  listTitleSearchXP: '" + ap1 + "[+++]/../../..',\n  listTitleMemoSearchXP: '" + ap1 + "[+++]',\n  listGen:3,\n  detailURLRE:/$^/,\n  detailTitleXP:'',\n  detailTitleSearchXP:'',\n},\n"; }
          if (SITEINFO_YHM && ap2.match0(/^\/\//)) { msi += "\n// @match *://" + domain + "/*\n{\n  id:'" + domain + "',\n  urlRE: '//" + domain + "/',\n  listTitleXP: '" + ap1 + "',\n  listTitleSearchXP: '" + ap1 + "[+++]/../../..',\n  listTitleMemoSearchXP: '" + ap1 + "[+++]',\n  listGen:3,\n  detailURLRE:/$^/,\n  detailTitleXP:'',\n  detailTitleSearchXP:'',\n},\n"; }
          if (SITEINFO_YHM && !ap2.match0(/^\/\//)) { msi += "\n// @match *://" + domain + "/*\n{\n  id:'" + domain + "',\n  urlRE: '//" + domain + "/',\n  title: '" + ap1 + "',\n  box: '" + ap2 + "',\n  detailURLRE:/$^/,\n  detailTitleXP:'',\n  detailTitleSearchXP:'',\n},\n"; }

          writeClipboard(msi);
          alert("The following has been copied to the clipboard.\n" + msi);
          return;
        }

        function apc() {
          writebacktest();
          $(eleget0('//*[@id="iopzerokey"]')).fadeOut(400, function() { setTimeout(function() { $(panel).remove() }, 100) });
        }

        lists.appendChild(line);
      }
    }
    let opa = 0.9;

    panel = document.createElement("div");
    panel.appendChild(lists)
    panel.setAttribute("style", "all:initial; resize:both; overflow: auto; font-family:sans-serif; max-width:60%;" + boxPos + " z-index:2147483647; opacity:" + opa + "; text-align:left; line-height:1.1em; position:fixed; font-size:12px; margin:0px;  text-decoration:none; padding:0.5em; outline-radius:7px; background-color:#d0e8ff; color:#000000;  box-shadow:5px 5px 8px #0003; outline:2px solid #fff;");
    panel.id = "iopzerokey";

    // Escでパネルを消す
    EscToHidePanel = document.addEventListener('keydown', function closePanel(e) {
      if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && (e.key == "Escape")) {
        if (eleget1(eleget0('//textarea[@id="testXPath"]')?.value) != "Err") { writebacktest(); }
        $("#testXPath").remove();
        $(panel).hide(400, function() { setTimeout(function() { $(panel).remove() }, 100) });
        this.removeEventListener('keydown', closePanel, false);
        e.stopPropagation()
        e.preventDefault()
        return false;
      }
    }, true);

    //GF.panelX=null
    //GF.panelY=null
    panel.addEventListener("wheel", e => {
      if (!e?.shiftKey) return;
      if (e?.deltaY < 0) GF.ancestor++;
      else GF.ancestor > 0 && GF.ancestor--;
      //GF.hold = 1;
      //GF.panelLeft=`${eleget0("#iopzerokey")?.getBoundingClientRect()?.left}px`
      //GF.panelTop=`${eleget0("#iopzerokey")?.getBoundingClientRect()?.top}px`
      //console.log(GF.panelX)
      mark(GF?.lastmode ?? 7, GF?.lastMark)
      //GF.hold = 0;
      e.preventDefault()
      e.stopPropagation()
      return false;
    })


    document.body.appendChild(panel);

    //    if (!GF?.hold&&GF?.panelX&&GF?.panelY) {
    //console.log(GF.panelLeft,GF.panelTop)
    if (GF.panelLeft !== null && GF.panelTop !== null) {
      panel.style.left = `${GF.panelLeft}px`;
      panel.style.top = `${GF.panelTop}px`;
      //    GF.left =`${GF?.panelX}px`// `${(mousex < document.documentElement.clientWidth / 2)?clientWidth()-$("#iopzerokey").width()-50:0 }px`
      //      GF.top =`${GF?.panelY}px`// `${(mousey < clientHeight() / 2) ? clientHeight()-$("#iopzerokey").height()-50:0}px`
    } else {
      panel.style.left = `${(mousex < document.documentElement.clientWidth / 2)?clientWidth()-$("#iopzerokey").width()-50:0 }px`
      panel.style.top = `${(mousey < clientHeight() / 2) ? clientHeight()-$("#iopzerokey").height()-10:0}px`
    }
    /*panel.style.left = GF.left
    panel.style.top = GF.top
    */
    //$(panel).draggable({ handle: "tr#header th,#iopancesplus,#iopancesminus" });
    //$(panel).draggable({ cancel: "td,textarea" });
    dragElement2(panel, "*", "td , textarea")
  }

  function dragElement2(ele, handleSel = "*", cancelSel = "", zindexcss = "") { // 2025.04 resizeでmax-width変化版
    let x, y;
    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e => e.onmousedown = dragMouseDown)

    function dragMouseDown(e) {
      if (e.target.closest(cancelSel) || e.button != 0) return;
      if (window.getComputedStyle(e?.target)?.resize == "both" && mousex > ele.offsetLeft + $(ele).width() - 12 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 12) {
        ele.style.width = `${ele.getBoundingClientRect().width - elePadding(ele).left - elePadding(ele).right}px`;
        ele.style.maxWidth = "";
        return; // resize:bothだったら右下の角は掴めない判定にする
      }
      //if (e?.target?.style?.resize && mousex > ele.getBoundingClientRect().left + $(ele).width() - 8 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 8) return; // resize:bothだったら右下の角は掴めない判定にする
      e = e || window.event;
      e.preventDefault();
      var w = w || ele.getBoundingClientRect().width - elePadding(ele).left - elePadding(ele).right;
      //ele.style.minWidth = `${w}px`;
      //ele.style.maxWidth = `${w}px`;
      [x, y] = [e.clientX, e.clientY];
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "none" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "none" })
      if (zindexcss) e.target.style.zIndex = elegeta(zindexcss).reduce((a, b) => Math.max(a, b.style.zIndex), 0) + 1
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elePadding(ele) {
      const style = window.getComputedStyle(ele);
      return {
        top: parseInt(style.paddingTop, 10),
        right: parseInt(style.paddingRight, 10),
        bottom: parseInt(style.paddingBottom, 10),
        left: parseInt(style.paddingLeft, 10)
      };
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      if (window.getComputedStyle(ele).position != "fixed") {
        let l = `${ele.getBoundingClientRect().left}px`;
        let t = `${ele.getBoundingClientRect().top}px`;
        ele.style.position = "fixed";
        ele.style.left = l;
        ele.style.top = t;
      }
      ele.dataset.moved = 1;
      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.left = `${ele.offsetLeft}px`
        ele.style.right = ""
      }
      if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.top = `${ele.offsetTop}px`
        ele.style.bottom = ""
      }

      /*      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
            ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;
      */
      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
      ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;

      [x, y] = [e.clientX, e.clientY];

    }

    function closeDragElement(e) {
      document.onmouseup = null;
      document.onmousemove = null;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "auto" })
    }
  }

  function maybe(xpath) {
    let lc = (xpath.match(/last\(\)|\:last-child|\:last-of-type/g));
    let elealen = elegeta(xpath)?.length
    if (lc) lc = lc.length;
    let esti = []
    if (xpath.match(/href=/)) esti.push(`<span style= "color:red;">href</span>`)
    if (lc >= 1) esti.push(`<span style="color:blue;">last</span>`)
    if ((xpath.match(/\[1\]|\:nth-child\(1\)|\(1 of |\:nth-of-type\(1\)/) && elealen === 1)) esti.push(`<span style= "color:green;">1st</span>`)
    let [ids, classes] = [xpath.match(/@id=|\#/g)?.length, xpath.indexOf('"http') == -1 ? xpath.match(/@class|\.|\[class\*\=\"/g)?.length : 0]
    if (ids) esti.push(`<span style="color:magenta;">${ids}id</span>`)
    if (classes) esti.push(`<span style="color:magenta;">${classes}class</span>`)
    let col = xpath.match(/href=/) ? "color:red;" : lc > 1 ? "color:blue; font-weight:bold;" : lc == 1 ? "color:blue;" : (xpath.match(/\[1\]|\:nth-child\(1\)|\(1 of |\:nth-of-type\(1\)/) && elealen === 1) ? "color:green;" : xpath.match(/@id=|@class|\#|\.|\[class\*\=\"/) ? "color:magenta;" : "";
    esti = esti.join(" ")
    return [col, esti?.trim()]
  }

  function writeClipboard(txt) {
    GM_setClipboard(txt);
  }

  function makecontent(mode, ele) {
    var retStr = [];
    var maxline = window.innerHeight / maxLines;
    var maxtrial = maxline * TryMulti * (mode != 9 ? 32 : 3) * (requireRE > "\0" ? 3 : 1) * ((mode == 0 && requireHits == 1) ? 3 : 1);
    var retStrl = 0;
    hajime();
    let stime = Date.now()
    //    for (var i = 0; i < maxtrial && retStrl < maxline; i++) {
    for (var i = 0; Date.now() - stime < 1000 && retStrl < maxline; i++) {
      var xp = Math.random() > XPATH_CSS_RATIO ? getElementXPath(mode, ele) : getElementXPathCSS(mode, ele)
      if (xp && !(mode !== 9 && RegExp((excludeRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(xp))) {
        retStr.push(xp);
        var retStr = retStr.sort().reduce(function(previous, current) { if (previous[previous.length - 1] !== current) { previous.push(current); } return previous; }, []).sort(function(a, b) { return a.length - b.length < 0 ? -1 : 1; }); // 重複を削除＆ソート
        retStrl = retStr.length;
      }
    }
    owari();
    cl("trymax:" + maxtrial + "\nmakemax:" + maxline + "\ntried:" + i + "\nmake:" + retStr.length);
    // 1つは全属性を記述しただけのもの
    if (getAttrOfEle(mode, ele, true)) {
      var path = "//" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + "";
      retStr.push(path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
    }
    // 1つはフルパスを辿っただけのもの
    retStr.push(getElementXPathFullPath(ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
    // 1つはフルパス全属性を辿っただけのもの
    retStr.push(getElementXPathFullpathAndFullproperty(mode, ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));

    return retStr;
  }

  function getElementXPath(mode, ele) {
    var path = "";
    var origele = ele;
    for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > genNoboruRitsu); ele = ele.parentNode, i++) {

      //兄弟番号を調べる
      var ps = getPrevSib(ele);
      var ns = getNextSib(ele);

      var idx = 0;
      var arg = "";
      if (!ns && ps && Math.random() > 0.2) {
        var arg = "[last()]";
      } else
      if (!ps && ns && Math.random() > 0.2) {
        var arg = "[1]";
      } else {
        for (var idx = 1, sib = getPrevSib(ele); sib; sib = getPrevSib(sib)) { idx++; }
      }
      //属性を調べる
      var att = getAttrOfEle(mode, ele);
      if (att) att = "[" + att;
      //背番号かfirst/lastか属性か何も付けないかを32,32,32,4％ずつ
      var rnd = Math.random();
      if ((rnd > 0.68) && arg) var opt = arg;
      else if ((rnd > 0.36) && idx > 1) var opt = "[" + idx + "]";
      else if ((rnd > 0.04) && att) var opt = att;
      else var opt = "";
      path = "/" + ele.tagName.toLowerCase() + (opt) + path;
    }
    if (!path) return "";

    path = "/" + path;
    path = path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep);
    if (requireRE > "" && !(RegExp((requireRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(path))) return "";

    let hits = elegeta(path).length; // 検算
    let hitsVisible = elegeta(path).filter(e => e?.offsetHeight).length; // 検算
    if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && (requireHits != hits && requireHits != hitsVisible))) return false;
    return path;
  }

  function getAttrOfEle(mode, ele, allFlag = false) {
    if (ele.tagName.match(/html|body/gmi)) return "";
    let attrs = ele.attributes;
    let xp = "";
    let att2 = [];
    for (let att of attrs) {
      if (att.value === "") continue;
      if (att.value.length < TEXT_MAX) {
        if (att.name == "class" && Math.random() > 0.2 && !allFlag) {
          att2.push({ name: "contains(@class,", value: "\"" + att.value + "\")" })
        } else {
          att2.push({ name: "@" + att.name + "=", value: "\"" + att.value + "\"" })
        }
      }
    }

    //text
    if (!allFlag) {
      if (Math.random() > (0.5)) {
        if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "text()=", value: "\"" + ele.innerText + "\"" }) }
      } else {
        if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "contains(text(),", value: "\"" + ele.innerText + "\")" }) }
      }
    }

    for (let j = 0; j < att2.length; j++) {
      if ((Math.random() > (allFlag ? 0 : att2[j].name.match(/href/) ? 0.7 : 0.5))) {
        xp += att2[j].name + att2[j].value + " and ";
      }
    }
    xp = xp.replace(/ and $/, "]").replace(/^(.*)\[$/, "$1");
    return xp;
  }

  function getElementXPathCSS(mode, ele) {
    var path = "";
    var origele = ele;
    for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > genNoboruRitsuCSS); ele = ele.parentNode, i++) {

      //兄弟番号を調べる
      var ps = getPrevSib(ele);
      var ns = getNextSib(ele);

      let cla = [...ele.classList].filter(v => v !== "")
      let classes = (cla.length) ? cla.filter(v => Math.random() > 0.5).map(v =>
        Math.random() > (v.match(/[0-9\_\-]+/) ? 0.66 : 0.9) ? `[class*="${v}"]` :
        `.${v}`).join("") : "";
      let idname = `${ele?.id>""&&Math.random()>0.66&&ele?.id?("#"+ele?.id) : ""}`;

      //属性を調べる
      var att = getAttrOfEleCSS(mode, ele);
      if (att) att = "[" + att;

      var idx = 0;
      var arg = "";
      if (!ns && ps && Math.random() > 0.2) {
        var arg = Math.random() > 0.5 ? ":last-of-type" : ":last-child";
      } else
      if (!ps && ns && Math.random() > 0.2) {
        var arg = [`:nth-child(1 of ${ele.tagName.toLowerCase()}${idname}${classes})`, `:nth-of-type(1)`, `:nth-child(1)`][~~(Math.random() * 3)]
      } else {
        for (var idx = 1, sib = getPrevSib(ele); sib; sib = getPrevSib(sib)) { idx++; }
      }

      //背番号かfirst/lastか属性か何も付けないかを32,32,32,4％ずつ
      var rnd = Math.random();
      if ((rnd > 0.68) && arg) var opt = arg;
      //      else if ((rnd > 0.5) && idx > 1) var opt = ":nth-child(" + idx + ")";
      else if ((rnd > 0.5) && idx > 1) var opt = Math.random() > 0.5 ? `:nth-child(${idx} of ${ele.tagName.toLowerCase()}${idname}${classes})` : `:nth-child(${idx})`;
      else if ((rnd > 0.04) && att) var opt = att;
      else var opt = "";

      path = ` > ${ele.tagName.toLowerCase()}${idname}${classes}${opt}${path}`;

    }
    if (!path) return "";

    path = path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep);
    path = path.trim()?.replace(/^\>\s/, "");

    if (requireRE > "" && !(RegExp((requireRE || "$^").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i").test(path))) return "";

    let hits = elegeta(path).length; // 検算
    let hitsVisible = elegeta(path).filter(e => e?.offsetHeight).length; // 検算
    if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && (requireHits != hits && requireHits != hitsVisible))) return false;
    //if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && requireHits != hits)) return false;
    return path;
  }

  function getAttrOfEleCSS(mode, ele, allFlag = false) {
    if (ele.tagName.match(/html|body/gmi)) return "";
    let attrs = ele.attributes;
    let xp = "";
    let att2 = [];
    for (let att of attrs) {
      if (att.value.length < TEXT_MAX && att.value !== "") {
        if (att.name != "class" && att.name != "id" && Math.random() > 0.5) {
          att2.push({ name: "" + att.name + "=", value: "\"" + att.value + "\"" })
        }
      }
    }
    for (let j = 0; j < att2.length; j++) {
      if ((Math.random() > (allFlag ? 0 : att2[j].name.match(/href/) ? 0.7 : 0.5))) {
        xp += att2[j].name + att2[j].value + "][";
      }
    }
    xp = xp.replace(/\[$/, "").replace(/^(.*)\[$/, "$1");
    return xp;
  }


  function getElementXPathFullPath(ele) {
    var path = "";
    for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
      for (var idx = 1, sib = ele.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType == 1 && sib.tagName == ele.tagName) idx++
      }
      path = "/" + ele.tagName + (!ele.tagName.match(/html|body/gi) ? "[" + idx + "]" : "") + path;
    }
    return path;
  }

  function getElementXPathFullpathAndFullproperty(mode, ele) {
    var path = "";
    for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
      if (getAttrOfEle(mode, ele, true)) { path = "/" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + path; } else { path = "/" + ele.tagName + path; }
    }
    path = "/" + path;
    return path;
  }

  function str2numMinMax(str, min, max) {
    var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, ""));
    if (ans > max) ans = max;
    if (ans < min) ans = min;
    return ans;
  }

  function elegeta(xpath, node = document, command = "") {
    if (!xpath || !node) return [];
    let inscreen = command === "inscreen" ? 1 : 0
    let visible = command === "visible" ? 1 : 0
    let text
    if (/:inscreen/.test(xpath)) {
      inscreen = 1;
      xpath = xpath.replace(/:inscreen/, "")
    }
    if (/:visible/.test(xpath)) {
      visible = 1;
      xpath = xpath.replace(/:visible/, "")
    }
    if (/:text\*=/.test(xpath)) {
      text = xpath.replace(/^.*:text\*=(.*)$/, "$1");
      xpath = xpath.replace(/:text.+$/, "")
    }
    try {
      if (!/^\.?\//.test(xpath)) { var array = [...node.querySelectorAll(xpath)] } else {
        var array = [];
        var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        let l = ele.snapshotLength;
        for (var i = 0; i < l; i++) array[i] = ele.snapshotItem(i);
      }
      if (inscreen) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に１ピクセルでも入っている
      if (visible) array = array.filter(e => e.offsetHeight)
      if (text) array = array.filter(e => new RegExp(text).test(e.innerText))

      if (command !== "check") {
        let inpanel = document.body.querySelector('#iopzerokey')
        if (inpanel && Array.isArray(array)) array = array.filter(v => !inpanel.contains(v))
      }

      return array
    } catch (e) { /*alert(e + "\n" + xpath + "\n" + JSON.stringify(node));*/ return command === "check" ? "Err" : []; }
  }

  function eleget1(xpath) {
    if (!xpath) return "";
    let ret = elegeta(xpath, document, "check")
    if (ret === "Err") return ret
    if (ret.length) return ret[0];
    else return [];
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    let inscreen = 0
    let visible = 0
    if (/:inscreen/.test(xpath)) {
      inscreen = 1;
      xpath = xpath.replace(/:inscreen/, "")
    }
    if (/:visible/.test(xpath)) {
      visible = 1;
      xpath = xpath.replace(/:visible/, "")
    }
    if (!/^\.?\//.test(xpath)) var ele = node.querySelector(xpath)
    else try {
      var eles = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      if (eles.snapshotLength > 0) var ele = eles.snapshotItem(0);
      else return null;
    } catch (e) { /* alert(e + "\n" + xpath + "\n" + JSON.stringify(node));*/ return null; }
    if (inscreen) { var eler = ele.getBoundingClientRect(); if (!(eler.top > 0 && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < document.documentElement.clientHeight)) return null }
    if (visible) { if (!ele.offsetHeight) return null }
    return ele
  }

  function getNextSib(ele) { // 同じタグの弟ノードを走査
    if (!ele.nextElementSibling) return null;
    let orgtag = ele.tagName;
    do {
      ele = ele.nextElementSibling;
      if (!ele) return null;
      if (ele.tagName == orgtag) return ele;
    } while (1)
    return null;
  }

  function getPrevSib(ele) { // 同じタグの兄ノードを走査
    if (!ele.previousElementSibling) return null;
    let orgtag = ele.tagName;
    do {
      ele = ele.previousElementSibling;
      if (!ele) return null;
      if (ele.tagName == orgtag) return ele;
    } while (1)
    return null;
  }

  function proInput(prom, defaultval, min, max = Number.MAX_SAFE_INTEGER) {
    return Math.min(Math.max(
      Number(window.prompt(prom, defaultval).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  var start_ms;

  function hajime() { start_ms = new Date().getTime(); }

  function owari() {
    var elapsed_ms = new Date().getTime() - start_ms;
    cl('処理時間:' + elapsed_ms / 1000 + "秒");
  }

  function cl(...args) {
    if (verbose) console.log(...args)
  }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

})();