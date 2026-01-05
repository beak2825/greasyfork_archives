// ==UserScript==
// @name         WME El Nombre Norm
// @namespace    https://greasyfork.org/en/scripts/21374-wme-el-nombre-norm-ca
// @version      2025.08.10.1.tm
// @description  Standardize street names according to local and national convention
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @author       sketch,bgodette
// @copyright    2015-24 sketch,bgodette,davielde,TheLastTaterTot,justins83,SkiDooGuy,fuji2086,tonestertm
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/21374/WME%20El%20Nombre%20Norm.user.js
// @updateURL https://update.greasyfork.org/scripts/21374/WME%20El%20Nombre%20Norm.meta.js
// ==/UserScript==
// based on Norm Name 2024.09.25.01

function initNormNotice(){
    var panelHeight=350, panelWidth=540;

    $("<style>")
    .prop("type", "text/css")
    .html('.NormPG { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);' +
          '          width: ' + panelWidth + 'px; ' + //height: ' +    // + panelHeight + 'px; '
          '          padding: 10px 20px; margin: 0; overflow-y: auto; overflow-x: auto; word-wrap: break-word;' +
          '          background-color: white; box-shadow: 0px 5px 20px #555555;' +
          '          border: 1px solid #858585; border-radius: 10px; }\n' +
          ".NormPG h2  { margin-top:10px; margin-bottom: 10px; font-size: 20pt; font-weight: bold; text-align: left; color: #C0C0C0 }\n" +
          '.NormPG-hr  { display: block; border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1);' +
          '             border-bottom: 1pxi solid rgba(255, 255, 255, 0.3);' +
          '             margin-top: 8px; margin-bottom: 12px; }\n' +
          '.NormPG-btn-container { position: relative; display: table; margin: 15px auto 10px; vertical-align: middle; padding: 0}\n' +
          '.NormPG-btn { margin: 0px 5px; padding: 0px 15px; display: inline-block; height: 32px; }\n'
    )
    .appendTo("head");


    var NormNoticeDiv= '<div id="NormNoticePanel" class="NormPG" >' +
        '<h2>Norm Name</h2>' +
        '<div id="NormNotice">Test</div>' +
        '<div class="NormPG-btn-container">' +
                '       <button id="btnNormOK" class="btn btn-default NormPG-btn">OK</button></div>' +
        "</div>";
    ($('#map').append(NormNoticeDiv));

    $('#NormNoticePanel').hide();

    $('#btnNormOK').click (function() {
        $('#NormNoticePanel').hide();
    });
}

function NormNotice(NormNoticeText){
    $("#NormNotice").html(NormNoticeText);
    $("#NormNoticePanel").show();
}

function initNormName(){
    //Alert on update
    const updateMessage = `
<p>¡Hola! Soy Norm. Soy nuevo hoy.</p>
<p>I'm only as good as my regex, and I've been known to make serious mistakes, especially when segment names are mangled in unexpected ways. So watch the alerts!</p>
<p>Or, if you're scared, you can just select a couple segments and I'll ignore the rest.</p>
<p>Check out all my cool new stuff. ¡Disfruta!<ul>
       <li>Script:<ul>
       <li> NEWEREST!! Now converts standalone Highway/Hwy and Route/Rte to CA, only when followed by up to three numbers. This might be dangerous, please watch out and supply feedback</li>      
       <li>NEWEST - Upped HN segments limit to 20 (I hope). Just BE CAREFUL! This will only be for the duration of our CA- updating</li>	
       <li>NEW - Now with more CA- and less SR- !  A few other fixes and bug squashes</li>
       <li> As always, please let tonestertm know of any inadvertent changes/behavior</li>
       <li> Known Issue: the string, "vista" probably won't be capitalized when it's part of a longer word (if it wasn't already)</li>
            </ul></li>
       <li>National:<ul>
       		<li>∅</li>
       		</ul></li>
       <li>New states: ∅</li>
       <li>Updated states:<ul>
       		<li><b>California</b>: Changing SR- to CA-</li>
       </ul></li>
       <li>ø</li>
</ul></p>`;

    //Get stored keyboard shortcut
    if (localStorage.NormName) {
        var nnShortcut = JSON.parse(localStorage.NormName);
    }
    else{
        var nnShortcut = '';
    }
    // Save keyboard shortcut
    function saveNNShortcut(){
        nnShortcut = W.accelerators.Actions.normName.shortcut.keyCode;
        localStorage.NormName = JSON.stringify(nnShortcut);
    }
    window.addEventListener("beforeunload", saveNNShortcut, false);

    // Only allow if rank 4 or higher
        var rankCheck = W.loginManager.user.getRank() + 1;
    if(rankCheck >= 4){
            // Add icon to toolbar
        $('<div class="NormNameIcon toolbar-separator toolbar-button" style="margin-top:7px;">').prependTo($('.toolbar').children('div').first());
        //$('#edit-buttons')[0].style.width = ($('#edit-buttons')[0].offsetWidth+62)+'px';

        var normCss = '#toolbar .NormNameIcon { display: block; position: relative; width: 62px; float: right; margin: 0px; background-color: transparent; background-size: initial; background-position: 50% 50%; background-repeat: no-repeat; background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBsRXhpZgAASUkqAAgAAAADADEBAgAHAAAAMgAAABICAwACAAAAAQABAGmHBAABAAAAOgAAAAAAAABHb29nbGUAAAMAAJAHAAQAAAAwMjIwAqAEAAEAAAAkAAAAA6AEAAEAAAAkAAAAAAAAAP/bAEMAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AAAsIACQAJAEBEQD/xAAZAAACAwEAAAAAAAAAAAAAAAAJCgYHCwj/xAA6EAABAwMCAgUICAcAAAAAAAAFAQIGAwQHCBEJFQASExYhChQXJSYxMkEiNkJRYXGRsSMkNVZlwdH/2gAIAQEAAD8AID5TTqcrAr7Cum+nKbKwi1cGQyvMgg24beHLyQUyaBYkhEQiI7sWh+cpTWoiOXnDlbvTcxyprHMoQOlcdtV7evW+XnJ4XYIv7fv8vd90Vt8yQmrU7C1/gece718L8/8Ad+Gy/wDPf8vFhTyeHWW3FmtSKYspyNL+H6hlI46OBrpEV1hIla4rjoq1V3VrudC3RzdNl6ptyfC5UXQ26ZjfF8DXmqDj4Ze0+X88W8jlxJo5z6RQu5beko3D8d4ZDmDEDFoXRaaTdqiS0ecjV6qSpU6u7UVUIHoDXR9c5MhWmmL8MEVQkl/J4+MustS219Kh68IF9zHrYvNIL/W+R7yD+1v9QrWhj7vRLPR7f8PHBAOLB5R3NKm43gcWclvMBAv1uULFufRrkoSScpT2gjkZ/SYdF89cOn+YcOvPGJpVj69mOPwOTrTvTGAkiJkWkIHLQpIOrxrZX1mHg4ZjSgiQxQ9v3rjK7rvuiu6alnDd1fwbWro8w9nKKyqlJ7++jYqK5Ev6NnfWzaGWImGFisjj+1uERSPmsnZfI0lSV9G7Y9itVrmvpsTz1GaJ8maReP1j3UXMRokrjLM+UMv5FCViM0FSw+PxiYIhYiXJGBTVU+FCoayI1UWRLs5jjr296mRyTOVmXMGoDR1oXARHMeSR4uFiLqTx8VzWNCm35+6PmSmwkYHEORTptyJ7QSpY81zUjAZFc17UVq11pO4kWi7XA+dzXENcHcWo6TkBQy3m1pFwU8vVTblBUSH3WQGYTJF8YlIN1VPvVfDotH5SViZdRlWBy6+LisdxvEMDy/OyksNiksgd6QDuhogPAmKpxytOyRURIkAb47KrfhVUd0/5P1xpMHac+Gzj3CWc7rJt7KsfT7JIwOwXbRO4G2ERIHGHgw6yqHiQ0l2FvVLX7kbWt1RHVHdWq7dUbc/lTul3PEhyDox1daa8N54y1kKCrL8Xk0wHFJWbPxxeZg5fj1smWG05CfqgZEcMFgbQqRrs37yFiPRZGjFHjqgiWsDPvEBx7Rz7A8jYdgcHxzi+edyQncM5PIHIZdAw5hYHExPPZKACzaNnCxaQL3j/AMB+fSH5o4cM2xcQA5U0+yrKmD+Xnh5S69O13A7G+MetA5gvJ+U4x+pfu9k4/wDVZP02nvFXrxzXTphI3x0be3A7G0pjxWLkY60S45eyBFQRLUFscitcnIyvi1yK1dvFFRdunD2C9IFOKQlRmGT+O7+E1ybi1C5zTZRepN3EjAoSRIpWr8i/mhqVbhq2Vx9ty12/Z6ai9T4Hfl0zwuNBmnJ2PeKvqZJRKXFBFWjj+IvZQoVES16wMfHI+OVaOyKvZDLirRX6adZVR3h4oo9BmXMtZSnAqNZByfOJWBv74fTuxZY3Vr2ldqr9tiMau/4oqdCR5IiVnNQeG4SpI5EwlmPvjFq2Dk3xu6okrlTqVbtlegyqiVV7nC9lWmqJ25LwXztOyOvhCP41tcRwKzIYXw9JbiyDVrXnEngg4wbuqdEsSbTW9IVnNfXeieHWVrU+5E6f/9k=)}' +
            '.col-offset-330 #toolbar .NormNameIcon:hover, #toolbar .NormNameIcon:focus, #toolbar .NormNameIcon:active { background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBsRXhpZgAASUkqAAgAAAADADEBAgAHAAAAMgAAABICAwACAAAAAQABAGmHBAABAAAAOgAAAAAAAABHb29nbGUAAAMAAJAHAAQAAAAwMjIwAqAEAAEAAAAkAAAAA6AEAAEAAAAkAAAAAAAAAP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIACQAJAMBIgACEQEDEQH/xAAbAAADAQEAAwAAAAAAAAAAAAAABgcIBAMFCf/EAC8QAAEDAwMCBQMDBQAAAAAAAAECAwQABREGEiEHMQgTQVFhFBWhFoGRMkJicaL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AUfDHYA83crwWFKfCxGaWoYSE4yrB/wB4/itEsW+UU4GAPhBNJXR91On+gVvuyIu14Nq2NvDAWtbpAWcf28g0qa//AFAm2SbzI1qsspbUoRWj5KQBxwEq7Z496CzqtckDKucf4HFSbxEaW+46KfnFnbIt2H0LHqnssfwc/tXh0XN+nifVo1bcXH1t+alDkwpRgngAYOSM9ifxVY0NeY+uLDPYmpYkuxT5bi20jDqCDzt7E8EEdjQfPmimjqPpiTpTWNxtkljyUJcLjCSQcsqJKD8cY4ooNB6b1ZC1N0Al2iKtaJsKOywsJaKEl0AqAB7E4R6fHbIqM2iy6h1e/It0Ba33A2pW1xWEhIHJJ7D2GfU1Q/CtqG1s2/Udgv1xt0KI/skJ+ucSlK+Cle3dgZAAOc+3tTfpeTp+zdP5Zs0qLOlPvus+cvelt1KVkb1HAJSQAOPmgjOrNC6j0kIsa5hwKU2FKLJUpse4J7BQ9RVl8Nly+xiVHQ2uU9MeZZS0hWVAHcSvt2Hqa6LLrmNcG3YN6Yh3DcgpH0QWQnggJyv+r5PeubpSHtIaoQllaQuS2pLiXM7QnunP7ig9J4g+lVyvnUuXcrSqI2xIZaUrduypYGCTgEegoqgXzU6pE7fc25iJITtIhBRbwCQPXg0UGJh3rWfRa2Qp3SuyNyY6FhT6xk9+Son8iiigb12yBAgqehQo7LoSSFIRyKTrZJVFducrY2872PnJ3ggY4/6P4oooJdqN+YLzJLdxmthRCtqHSlIyB2FFFFB//9k=) }';
            $("<style>")
                .prop("type", "text/css")
                .html(normCss)
                .appendTo('head');

            // Click event
            $('.NormNameIcon').click(mainNormName);

            // Keyboard shortcut
            addKeyboardShortcutToEditor(nnShortcut);

            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, updateMessage, "https://greasyfork.org/en/scripts/374292-wme-norm-name", "https://www.waze.com/forum/viewtopic.php?f=1286&t=171825");
        }
}

function addKeyboardShortcutToEditor(nnShortcut){
    W.accelerators.Groups['normname']=[];
    W.accelerators.Groups['normname'].members=[];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'] = [];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'].description = 'Norm Name';
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups['normname'].members = [];
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups.normname.members['normName'] = 'Normalize street names';
    W.accelerators.addAction('normName', {group: 'normname'});
    W.accelerators.events.register('normName', null, mainNormName);
    W.accelerators._registerShortcuts({nnShortcut: "normName"});
}

function mainNormName(){
  var UpdateObject, AddOrGetCity, AddOrGetStreet;
    if (typeof(require) !== "undefined") {
        UpdateObject = require("Waze/Action/UpdateObject");
        AddOrGetCity = require("Waze/Action/AddOrGetCity");
        AddOrGetStreet = require("Waze/Action/AddOrGetStreet");
    } else {
        UpdateObject = W.Action.UpdateObject;
        AddOrGetCity = W.Action.AddOrGetCity;
        AddOrGetStreet = W.Action.AddOrGetStreet;
    }
  function to_decimal(name) {
    var newname = name;
    var newnum = newname.match(/^(([NSEW] )?I|US|SR|SH|CR)-\d+ \d+\s?\/\s?\d+/);
    if (newnum) {
      var orig = newnum[0];
      var deci = orig.split("-");
      var repl = deci[0] + "-";
      deci = deci[1].split(" ");
      if (deci.length == 2) {
        bits = deci[1].split("/");
      } else {
        bits = [deci[1], deci[3]];
      }
      deci = deci[0];
      var numer = parseInt(bits[0],10);
      var denom = parseInt(bits[1],10);
      if (denom !== 0) {
        numer = numer + (denom * deci);
        var frac = numer / denom;
        repl = repl.concat(frac);
        newname = newname.replace(orig, repl);
      }
    }
    return (newname);
  }

  function state_transforms(name, state) {
    var newname = name;
    switch(state) {
      case "Alabama":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\b(State|Al(abama?)) H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL (\d+)/ig, "SR-$1");
        break;
      case "Arkansas":
      	newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bAr(kansas)? H(igh)?wa?y /ig, "AR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "AR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "AR-");
        newname = newname.replace(/\bState Spur (\d+)/ig, "AR-$1 SPUR");
        newname = newname.replace(/\bHwy (\d+(\-\d)?) Spu?r/ig, "AR-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/g, "AR$1");
        newname = newname.replace(/(\s|^)AR-\s?(\d+)/ig, "$1AR-$2");
        newname = newname.replace(/(\s|^)AR (\d+)/ig, "$1AR-$2");
      	break;
      case "California":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
                newname = newname.replace(/\b(H(igh)?wa?y|R(ou)?te)[- ](\d+)/i, "CA-$4");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bSt(ate|\.)? (H(igh)?wa?y|R(ou)?te) /i, "CA-");
        newname = newname.replace(/\bS[HR] *-* *(\d+)/ig, "CA-$1");
        newname = newname.replace(/\bCA (\d+)/ig, "CA-$1");
//        newname = newname.replace(/\bS[HR] (\d+)/ig, "CA-$1");
//        newname = newname.replace(/\bCA-\s?(\d+)/ig, "SR-$1");
//        newname = newname.replace(/\bCA (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAve\. /i, "Ave ");
//        newname = newname.replace(/( [!-] north| n)$/i, " N");
//        newname = newname.replace(/(!- south| s)$/, " S");
//        newname = newname.replace(/( west| w)$/i, " W");
//        newname = newname.replace(/( east| e)$/i, " E");
        newname = newname.replace(/( [nsew])$/, function(v) { return v.toUpperCase(); });
        newname = newname.replace(/'/,"");
        break;
      case "Colorado":
        newname = newname.replace(/^Alley$/, "");
        newname = newname.replace(/^([NSEW] )?Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?C ?R ?(\d+)/i, "$1CR-$2");
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?Cty Rd /i, "$1CR-");
        newname = newname.replace(/^(\w+) Co Rd (\d+)/i, "$1 CR-$2");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/^([NSEW] )?Hwy /i, "$1SH-");
        newname = newname.replace(/State Hwy /i, "SH-");
        newname = newname.replace(/State Rte /i, "SH-");
        newname = newname.replace(/State Route /i, "SH-");
        newname = newname.replace(/(^|\s)S[RH]-\s?(\d+)/ig, "$1SH-$2");
        /* convert fractional notation to decimal notation */
        newname = to_decimal(newname);
        break;
      case "Florida":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL (\d+)/ig, "SR-$1");
        break;
      case "Georgia":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA (\d+)/ig, "SR-$1");
        break;
      case "Illinois":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bCty H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bC(oun)?ty (\d+)$/ig, "CR-$2");
        newname = newname.replace(/\bCTH-/, "CR-");
        newname = newname.replace(/\bCR-([A-Z]?\d{1,2}$)/ig, "CH-$1");
        newname = newname.replace(/\bCH-(0{1,4})\b/ig, "CR-$1");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL (\d+)/ig, "SR-$1");
        break;
      case "Indiana":
        newname = newname.replace(/In(diana)? H(igh)?wa?y /ig, "IN-");
        newname = newname.replace(/State H(igh)?wa?y /ig, "IN-");
        newname = newname.replace(/State R(ou)?te /ig, "IN-");
        newname = newname.replace(/State R(oa)?d /ig, "IN-");
        newname = newname.replace(/State Spur (\d+)/ig, "IN-$1 SPUR");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "IN-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "IN-$1");
        newname = newname.replace(/(\s|^)IN-\s?(\d+)/ig, "$1IN-$2");
        newname = newname.replace(/(\s|^)IN (\d+)/ig, "$1IN-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
        newname = newname.replace(/\bCounty (\d+)/ig, "CH-($1)");
        newname = newname.replace(/\bI-164\b/, "I-69");
        break;
      case "Iowa":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bI(ow)?a H(igh)?wa?y /ig, "IA-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "IA-");
        newname = newname.replace(/\bState R(ou)?te /ig, "IA-");
        newname = newname.replace(/\bS[HR](-\d+)/, "IA$1");
        newname = newname.replace(/\bIA-\s?(\d+)/ig, "IA-$1");
        newname = newname.replace(/\bIA (\d+)/ig, "IA-$1");
        break;
      case "Kansas":
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "K-");
        newname = newname.replace(/\bState R(ou)?te /ig, "K-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1K-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1K-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bKS-\s?(\d+)/ig, "K-$1");
        newname = newname.replace(/\bKS? (\d+)\b/ig, "K-$1");
        break;
      case "Louisiana":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "Parish Rd ");
        newname = newname.replace(/\bCR-? ?(\d)/i, "Parish Rd $1");
        newname = newname.replace(/\bL(ouisian)?a H(igh)?wa?y /ig, "LA-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "LA-");
        newname = newname.replace(/\bState R((ou)?te|d) /ig, "LA-");
        newname = newname.replace(/\bState Spu?r (\d+)/i, "LA-$1 SPUR");
        newname = newname.replace(/\bHwy (\d+(\-\d)?) Spu?r/i, "LA-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/g, "LA$1");
        newname = newname.replace(/\bS\s?R\s(\d+)\b/g, "LA-$1");
        newname = newname.replace(/\bLA-\s?(\d+)/ig, "LA-$1");
        newname = newname.replace(/\bLA ?(\d+)\b/ig, "LA-$1");
        newname = newname.replace(/\bLA-(71|79|80|167)\b/ig, "US-$1");
        newname = newname.replace(/^(?!Old )Hwy (\d)\b/ig,"LA-$1");
        newname = newname.replace(/^(?!Old )Hwy (11|51|61|65|71|79|80|84|90|165|167|171|190|371|425)\b/ig, "US-$1");
        newname = newname.replace(/^(?!Old )Hwy (?!63)(\d\d)\b/ig, "LA-$1");
        newname = newname.replace(/^(?!Old )Hwy (\d{3,4})\b/ig, "LA-$1");
        newname = newname.replace(/\bU(\s|-)turn/i, "U turn");
        newname = newname.replace(/\bExpy\b/ig, "Expwy");
        newname = newname.replace(/\bBrg\b/g, 'Br');
        newname = newname.replace(/^([NSWE] )?Ave( [NSEW])$/g, '$1Avenue$2.');
        newname = newname.replace(/^([NSEW] )?Ave( [A-DF-MO-RT-VX-Z])$/g, '$1Avenue$2');
        newname = newname.replace(/^LA-7\b/, 'US-371');
        newname = newname.replace(/\bLsu\b/ig, 'LSU');
        newname = newname.replace(/\bLeo Kerner ?\/ ?Lafitte Pkwy\b/g, 'Leo Kerner Lafitte Pkwy');
        newname = newname.replace(/^Forest Rd (\d+)$/i, 'FS-$1');
        break;
      case "Maine":
    	newname = newname.replace(/\bState H(igh)?wa?y /ig, "SR-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bME-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bME (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bRte (1A?|2|201A?|202|302)\b/ig, "US-$1");
        newname = newname.replace(/\bRte (?![12])(\d[AB]?)\b/ig, "SR-$1");
        newname = newname.replace(/\bRte (\d\d[AB]?)\b/ig, "SR-$1");
        newname = newname.replace(/\bRte (?!(?:20[12]|301))(\d{3}[AB]?)\b/ig, "SR-$1");
      	break;
      case "Michigan":
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/State Hwy /ig, "M-");
        newname = newname.replace(/State Rte /ig, "M-");
        newname = newname.replace(/State Route /ig, "M-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "M$1");
        newname = newname.replace(/(\s)M-\s?(\d+)/ig, "$1M-$2");
        break;
      case "Minnesota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
        newname = newname.replace(/\bMinn(esota)? H(igh)?wa?y /ig, "MN-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "MN-");
        newname = newname.replace(/\bState R(ou)?te /ig, "MN-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "MN$1");
        newname = newname.replace(/\bMN-\s?(\d+)/ig, "MN-$1");
        newname = newname.replace(/\bMN (\d+)/ig, "MN-$1");
        break;
      case "Mississippi":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState Hwy /ig, "MS-");
        newname = newname.replace(/\bState Rte /ig, "MS-");
        newname = newname.replace(/\bState Route /ig, "MS-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/g, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS-\s?(\d+)/ig, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS (\d+)/ig, "$1MS-$2");
        break;
      case "Missouri":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/^(?:Adair|Andrew|Atchison|Audrain|Bar(?:ry|ton)|Bates|Benton|Bollinger|Boone|Buchanan|Butler|Cal(?:dwell|laway)|Cape Girardeau|Car(?:roll|ter)|Cass|Cedar|Ch(?:ariton|ristian)|Cla(?:rk|y)|Clinton|Co(?:le|oper)|Crawford|Da(?:de|llas|viess)|DeKalb|Dent|Douglas|Dunklin|Franklin|Gasconade|Gentry|Greene|Grundy|Harrison|Henry|Hickory|Holt|Howard|Howell|Iron|Jackson|Jasper|J(?:effer|ohn)son|Knox|La(?:cled|fayett|wrenc)e|Lewis|Lin(?:col)?n|Livingston|Ma(?:c|dis)on|Mari(?:es|on)|McDonald|M(?:erc|ill)er|Mississippi|Mon(?:iteau|roe|tgomery)|Morgan|New(?: Madrid|ton)|Nodaway|Oregon|Osage|Ozark|Pe(?:miscot|rry|ttis)|Phelps|Pike|Platte|Polk|Pu(?:laski|tnam)|Ra(?:lls|ndolph|y)|Reynolds|Ripley|Saline|Schuyler|Scot(?:land|t)|Sh(?:annon|elby)|S(?:ain)?t\.? (?:Charles|Clair|Francois|Louis)|Ste\.? Genevieve|Sto(?:ddard|ne)|Sullivan|Taney|Texas|Vernon|Wa(?:rren|shington|yne)|Webster|Worth|Wright)(?:(?: Co(?:unty)?)? R(?:oa)?d)? (\d+)/i, "CR-$1");
        newname = newname.replace(/\bState H(igh)?wa?y (\d+)\b/ig, "MO-$2");
        newname = newname.replace(/\bState R(ou)?te (\d+)\b/ig, "MO-$2");
        newname = newname.replace(/\bState H(igh)?wa?y ([A-Z]{1,2})\b/ig, "SH-$2");
        newname = newname.replace(/\bState R(ou)?te ([A-Z]{1,2})\b/ig, "SH-$2");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/g, "MO-$1");
        newname = newname.replace(/\bMO-\s?(\d+)/ig, "MO-$1");
        newname = newname.replace(/\bMO (\d+)/ig, "MO-$1");
        newname = newname.replace(/\bMO ([A-Z]{1,2})/ig, "SH-$1");
        newname = newname.replace(/\bHwy (24|36|40|50|54|56|60|61|62|63|65|67|69|71|136|159|160|166|169|275|400|412)\b/ig, "US-$1");
        newname = newname.replace(/\bHwy (?!59)(\d\d)\b/ig, "MO-$1");
        newname = newname.replace(/\bHwy (\d(\d\d)?)\b/ig, "MO-$1");
        newname = newname.replace(/\bSH-[A-Z]{1,2}\b/ig, function(v) { return v.toUpperCase(); });
      	break;
      case "Nebraska":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "N-");
        newname = newname.replace(/\bState R(ou)?te /ig, "N-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "N$1");
        newname = newname.replace(/\b(?:N-|Hwy )S-?(\d{1,2}[A-Ma-m])/ig, "S-$1");
        newname = newname.replace(/\b(?:N-|Hwy )(\d{1,2}[A-Ma-m]) \(?Spur\)?/ig, "S-$1");
        newname = newname.replace(/(?:N-|State )?Spur (\d{1,2}[A-Ma-m])/ig, "S-$1");
        newname = newname.replace(/Hwy (\d{1,2}[A-Ma-m]) Spu?r/ig, "S-$1");
        newname = newname.replace(/\b(?:N-|Hwy )L-?(\d{1,2}[A-Xa-x])/ig, "L-$1");
        newname = newname.replace(/\b(?:N-|Hwy )(\d{1,2}[A-Xa-x]) \(?Link\)?/ig, "L-$1");
        newname = newname.replace(/(?:N-|State )?Link (\d{1,2}[A-Xa-x])/ig, "L-$1");
        newname = newname.replace(/\b(N|L|S)-\d{1,2}[a-x]\b/ig, function(v) { return v.toUpperCase(); });
        break;
      case "New York":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te?) /ig, "CR-");
        newname = newname.replace(/NY (Hwy|Ro?u?te?) /ig, "NY-");
        newname = newname.replace(/State Hwy /ig, "NY-");
        newname = newname.replace(/State Rte? /ig, "NY-");
        newname = newname.replace(/State Route /ig, "NY-");
        newname = newname.replace(/State Spur (\d+)/ig, "NY-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/ig, "NY$1");
        newname = newname.replace(/(\s|^)NY-\s?(\d+)/ig, "$1NY-$2");
        newname = newname.replace(/(\s|^)NY (\d+)/ig, "$1NY-$2");
        newname = newname.replace(/\bEx(p|w)y\b/ig, "Expwy");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(1|4|6|9W?|11|20|44|62|202|209|219|220|20A|62 BUS)\b/ig, "US-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!2)(\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!15)(\d\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(\d{3})\b/ig, "NY-$2");
        newname = newname.replace(/\bTunl\b/ig, "Tun");
        newname = newname.replace(/\bLong Is\b/ig, "Long Island");
        break;
      case "New Jersey":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\bState Route /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ (\d+)/ig, "SR-$1");
        break;
      case "North Dakota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? (\d+)/ig, "CR-$2");
        newname = newname.replace(/\bN(orth)? ?D(akota)? H(igh)?wa?y /ig, "ND-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "ND-");
        newname = newname.replace(/\bState R(ou)?te /ig, "ND-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "ND$1");
        newname = newname.replace(/\bND-\s?(\d+)/ig, "ND-$1");
        newname = newname.replace(/\bND (\d+)/ig, "ND-$1");
        break;
      case "Ohio":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\b(Twp|Township) R((oa)?d|(ou)?te) /ig, "TR-");
        newname = newname.replace(/\bTo?w(nshi)?p H(igh)?wa?y /ig, "TR-");
        newname = newname.replace(/\bC-?(\d)/ig, "CR-$1");
        newname = newname.replace(/\bT-?(\d)/ig, "TR-$1");
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\bState Route /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH (\d+)/ig, "SR-$1");
        break;
      case "Oklahoma":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SH-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SH-");
        newname = newname.replace(/\b(State|Ok(lahoma?)) H(igh)?wa?y /ig, "SH-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SH-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SH-$2");
        newname = newname.replace(/\bOK-\s?(\d+)/ig, "SH-$1");
        newname = newname.replace(/\bOK (\d+)/ig, "SH-$1");
        newname = newname.replace(/(N|S) (\d{1,3})(st|nd|rd|th) East (Ave|Pl|Cir|Ct)/ig, "$1 $2$3 E $4");
        newname = newname.replace(/(N|S) (\d{1,3})(st|nd|rd|th) West (Ave|Pl|Cir|Ct)/ig, "$1 $2$3 W $4");
        break;
      case "Pennsylvania":
        newname = newname.replace(/\bState Hwy /ig, "SR-");
        newname = newname.replace(/\bState Rte /ig, "SR-");
        newname = newname.replace(/\b(PA|State) Route /ig, "SR-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SR-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SR-$2");
        newname = newname.replace(/\bP(enn(sylvani)?)?a Tpke?\b/ig, "Penna. Tpk");
        break;
      case "South Carolina":
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SC-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SC-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SC-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SC-$2");
        newname = newname.replace(/.+(S-\d\d?-\d+)/i, "$1");
        break;
      case "South Dakota":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CR-");
        newname = newname.replace(/\bS(outh)? ?D(akota)? H(igh)?wa?y /ig, "SD-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "SD-");
        newname = newname.replace(/\bState R(ou)?te /ig, "SD-");
        newname = newname.replace(/\bS[HR](-\d+)/g, "SD$1");
        newname = newname.replace(/\bSD-\s?(\d+)/ig, "SD-$1");
        newname = newname.replace(/\bSD (\d+)/ig, "SD-$1");
        break;
      case "Texas":
        newname = newname.replace(/\bState Hwy /ig, "SH-");
        newname = newname.replace(/\bState Rte /ig, "SH-");
        newname = newname.replace(/\bState Route /ig, "SH-");
        newname = newname.replace(/\bState Highway /ig, "SH-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SH-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "SH-$1");
        newname = newname.replace(/\b([FR])M (\d+)/g, "$1M-$2");
        newname = newname.replace(/\bFarm(\s|-)to(\s|-)market \b/ig, "FM-");
        newname = newname.replace(/^Farm R(oa)?d (\d{2,}\b)/i, "FM-$2");
        newname = newname.replace(/\bRanch(\s|-)to(\s|-)market \b/ig, "RM-");
        newname = newname.replace(/^Ranch R(oa)?d (\d{2,}\b)/i, "RM-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\b([NS][EW])CR\s?(\d{2,4})\b/ig, "$1 CR-$2");
        newname = newname.replace(/\b([NS][EW])\s?(\d{4})\b/ig, "$1 CR-$2");
        newname = newname.replace(/\b(CR-\d+) Rd\b/ig, "$1");
        newname = newname.replace(/\b([NS])E CR-\b/ig, "$1E CR-");
        newname = newname.replace(/\b([NS])W CR-\b/ig, "$1W CR-");
        newname = newname.replace(/^Pvt Rd (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/^Pr (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/^U(\s|-)turn/i, "Turnaround");
        newname = newname.replace(/\bState Loop /ig, "Loop ");
        newname = newname.replace(/\bState Spur /ig, "Spur ");
        newname = newname.replace(/\bPark Road /ig, "Park Rd ");
        break;
      case "Utah":
        newname = newname.replace(/\bState (Hwy|Rte) /ig, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "SR-$1");
        break;
      case "West Virginia":
        newname = newname.replace(/\bW(est)? ?V(irginia)? H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState R(ou)?te /ig, "WV-");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WV-$1");
        newname = newname.replace(/\bWV-\s?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bWV (\d+)/ig, "WV-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?(\d{1,3}\b)/ig, "CR-$5");
        newname = newname.replace(/\bCounty (\d+)/ig, "CR-$1");
        newname = newname.replace(/\bCTH-/ig, "CR-");
        newname = newname.replace(/\bCH-/ig, "CR-");
        newname = newname.replace(/ \(ALT\)( |$)/ig, " ALT$1");
        newname = newname.replace(/\bCR-(\d{1,3}) \/ (\d{1,2})\b/ig, "CR-$1/$2");
        break;
      case "Wisconsin":
        newname = newname.replace(/\bWis?(consin)? Hwy /ig, "WIS-");
        newname = newname.replace(/\bState Hwy /ig, "WIS-");
        newname = newname.replace(/\bState R((ou)?te|d) /ig, "WIS-");
        newname = newname.replace(/\bState Spur (\d+)/ig, "WIS-$1 SPUR");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WIS-$1");
        newname = newname.replace(/\bWIS?-\s?(\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bWIS? (\d+)/ig, "WIS-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CH-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?([A-Z]{1,3}\b)/ig, "CH-$5");
        newname = newname.replace(/\bCounty (\d+)\b/ig, "CH-($1)");
        newname = newname.replace(/\bCTH-/ig, "CH-");
        newname = newname.replace(/\bCR-/ig, "CH-");
        newname = newname.replace(/^Forest Rd /i, 'FR-');
        newname = newname.replace(/\bCH-[A-Za-z]{1,4}\b/ig, function(v) { return v.toUpperCase(); });
        break;
      case "Wyoming":
        newname = newname.replace(/\bWyo(ming)? H(igh)?wa?y /ig, "WY-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "WY-");
        newname = newname.replace(/\bState R(ou)?te /ig, "WY-");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WY-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WY-$1");
        newname = newname.replace(/\bWYO?-\s?(\d+)/ig, "WY-$1");
        newname = newname.replace(/\bWYO? (\d+)/ig, "WY-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /ig, "CH-");
    }
    return(newname);
  }

  function transform_name(street, city) {
    var newname = street.attributes.name;

    /* Noobody expects the Spanish Inquisition! */
    newname = newname.replace(/(^|\/ |: | )\b(cam(ino)?|cmn?o?) /i, '$1Camino ');
    newname = newname.replace(/(^|\/ |: | )\bca?mi?to?\b/i, "$1Caminito ");
    newname = newname.replace(/(^|\/ |: | )\bpso\b/i, "$1Paseo");
    newname = newname.replace(/(^|\/ |: | )\bvis(ta)?\b/i, "$1Vista");
    newname = newname.replace(/(^|\/ |: | )\bca?ll?e?\b/i, "$1Calle ");
//    newname = newname.replace(/(^|\/ |: )\bave\s(?!(\d|of|in|by|at|on|to|west|east|north|south|\/ |\-|[A-Z]{1}\b))/i, '$1Avenida ');
    newname = newname.replace(/(^|\/ |: | )\bcte\b/i, "$1Corte ");
    newname = newname.replace(/(^|\/ |: )\bent /i, "$1Entrada ");
//    newname = newname.replace(/(\w) La /, "$1 la ");
//    newname = newname.replace(/(\w) El /, "$1 el ");
//    newname = newname.replace(/(\w) Del /, "$1 del ");
//    newname = newname.replace(/(\w) Los /, "$1 los ");
//    newname = newname.replace(/(\w) Las /, "$1 las ");
//    newname = newname.replace(/(\w) Al /, "$1 al ");
//    newname = newname.replace(/(\w) De /, "$1 de ");

    /* A few things left out of elsewhere - tm */

    newname = newname.replace(/\bpoint$/i, "Pt");
    newname = newname.replace(/\bterrace$/i, "Ter");
    newname = newname.replace(/\bt(rai)?l$/i, "Trl");
    newname = newname.replace(/\bplz\b/i, "Plaza");

    /* remove leading/trailing whitespace */
    newname = newname.replace(/^(.*)\s+$/, "$1");
    newname = newname.replace(/^\s+(.*)$/, "$1");

    /* convert two or more whitespaces into a single ' ' */
    newname = newname.replace(/\s{2,}/g, ' ');

    /* replace ',' with '/', adding any necessary spaces around it is done later */
    newname = newname.replace(/,/g, "/");

    /* make sure there's spaces around '/' */
    newname = newname.replace(/(.)\s?\/\s?(.)/g, "$1 / $2");

    /* fix fractions - hamfisted second attempt */
    newname = newname.replace(/(\s\d) \/ (\d{1,2}\s)/g, "$1/$2");

    /* fix runways */
    newname = newname.replace(/\b((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\s\/\s((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\b/i, "$1/$3");

    /* no "Left Exit" */
    newname = newname.replace(/^Left Exit\b/i, "Exit");

    newname = newname.replace(/^To:? /i, "to ");
    newname = newname.replace(/ To /, " to ");
    newname = newname.replace(/^US ?FS (\d+) R(oa)?d\b/i, "FS-$1");
    newname = newname.replace(/^US ?FS (\d+)$/i, "FS-$1");
    newname = newname.replace(/^US Hwy Fs Rd /i, "FS-");
    newname = newname.replace(/^U S F S Rd /i, "FS-");
    newname = newname.replace(/^US-Fs Rd /i, "FS-");
    newname = newname.replace(/^US ?FS Rd /i, "FS-");
    newname = newname.replace(/^Fs? Rd? /i, "FS-");
    newname = newname.replace(/^F[sr] (\d)/i, "FS-$1");
    newname = newname.replace(/^F S /i, "FS-");

    /* convert Interstate and US Highway formats anywhere in the name to short-form */
    newname = newname.replace(/(^| )US Highway /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Route /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy /ig, "$1US-");
    newname = newname.replace(/(^| )US Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Route /ig, "$1US-");
    newname = newname.replace(/(^| )US-\s?/ig, "$1US-");
    newname = newname.replace(/(^| )US\s?(\d+)/ig, "$1US-$2");
    newname = newname.replace(/US-9\s+([EW])/ig, "US-9$1");
    newname = newname.replace(/US-\d+\s?[NSEW]/ig, function(v) { return v.toUpperCase(); });

    newname = newname.replace(/(^| )I-\s?/ig, "$1I-");
    newname = newname.replace(/(^| )I\s?(\d+)/g, "$1I-$2");

    newname = newname.replace(/(^| )SR-\s?/ig, "$1SR-");
    newname = newname.replace(/(^| )SR\s?(\d+)/ig, "$1SR-$2");
    newname = newname.replace(/(^| )SH-\s?/ig, "$1SH-");
    newname = newname.replace(/(^| )SH\s?(\d+)/ig, "$1SH-$2");
    newname = newname.replace(/(^| )CR-\s?/ig, "$1CR-");
    newname = newname.replace(/(^| )CR\s?(\d+)/ig, "$1CR-$2");

    newname = newname.replace(/(\d+\w? ([NSEW] )?)(Busn?|BL|BS|Business)\b/ig, "$1BUS");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)BUS\.? (Loop|Lp|Spur)\b/ig, "$1BUS");
    /* \d matches '.' so the above replace doesn't consume '.' after BUS, so consume it here */
    newname = newname.replace(/\bBUS\./g, "BUS");

    /* bannered routes */
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Spu?r\b/i, "$1SPUR");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Alt\b/i, "$1ALT");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)By-?p(ass)?\b/i, "$1BYP");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Conn(ector)?\b/i, "$1CONN");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)Tru?c?k\b/i, "$1TRUCK");

    /* new unnumbered exit standard */
    newname = newname.replace(/^Exit:? to:?/i, "to");
    newname = newname.replace(/^Exit: /i, "to ");
    newname = newname.replace(/^Exit/i, "Exit");

    /* convert all ':' after the first ':' to a ' / ' */
    newname = newname.replace(/^([^:]+:)([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^((?!Exit[^:]+))([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^(to [^:]+):(.*)$/i, "$1 /$2"); /* redundant? */

    newname = newname.replace(/^(Exit \d+[\w\-]*)( \/ | \- | )/i, "$1: ");
    newname = newname.replace(/^(Exit \d+[\w\-]*):(\w)/i, "$1: $2");
    newname = newname.replace(/^Exit (\w+ )/i, "to $1");

    /* don't want Exit 70: S: right? */
    newname = newname.replace(/^(Exit \d+[\w\-]*): ?(\w)(:| \/)/i, "$1$2:");

    /* saint */
    newname = newname.replace(/((^|\/ |\bto )(([NEWS]{1,2}|Rue|Place|Old) )?)S(ain)?t /g, '$1St. ');
/*    newname = newname.replace(/\bSaint\b/, 'St.'); */

	/* doctor */
    newname = newname.replace(/((^|\/ |\bto )([NEWS]{1,2} )?)Dr /g, '$1Dr. ');

    /* bridge */
    newname = newname.replace(/\bBrg\b/, "Br");

    /* "Doctor" & "Saint" not likely at string end â€“Â probably "Drive" */
    newname = newname.replace(/\b(Dr|St)\.$/, "$1");

    /* bye bye nasty old 'N' 'S' 'E' 'W' format */
    newname = newname.replace(/( |^|-)'([NSEW])'( |$)/g, '$1$2.$3');

    /* deprecated too-short forms */
    newname = newname.replace(/\bPke\b/g, 'Pike');
    newname = newname.replace(/\bRdg\b/g, 'Ridge');
    newname = newname.replace(/\bTrce\b/g, 'Trace');
    newname = newname.replace(/\bWy\b/g, 'Way');

    /* suffix fixes */
    newname = newname.replace(/^(?!The )(.* )Avenue( [NSEW]{1,2})?$/ig, '$1Ave$2');
    newname = newname.replace(/^(?!The )(.* )Boulevard( [NSEW]{1,2})?$/ig, '$1Blvd$2');
 //   newname = newname.replace(/^(?!The )(.* )Bridge( [NSEW]{1,2})?$/ig, '$1Br$2');
    newname = newname.replace(/^(?!The )(.* )Circle( [NSEW]{1,2})?$/ig, '$1Cir$2');
    newname = newname.replace(/^(?!The )(.* )Court( [NSEW]{1,2})?$/ig, '$1Ct$2');
    newname = newname.replace(/^(?!The )(.* )Drive( [NSEW]{1,2})?$/ig, '$1Dr$2');
    newname = newname.replace(/^(?!The )(.* )Expressway( [NSEW]{1,2})?$/ig, '$1Expwy$2');
    newname = newname.replace(/^(?!The )(.* )Expy( [NSEW]{1,2})?$/ig, '$1Expwy$2');
    newname = newname.replace(/^(?!The )(.* )Parkway( [NSEW]{1,2})?$/ig, '$1Pkwy$2');
    newname = newname.replace(/^(?!The )(.* )Place( [NSEW]{1,2})?$/ig, '$1Pl$2');
    newname = newname.replace(/^(?!The )(.* )Road( [NSEW]{1,2})?$/ig, '$1Rd$2');
/*    newname = newname.replace(/^(?!The )(.* )Spur( [NSEW]{1,2})?$/ig, '$1Spur$2');*/
    newname = newname.replace(/^(?!The )(.* )Strav( [NSEW]{1,2})?$/ig, '$1Stravenue$2');
    newname = newname.replace(/^(?!The )(.* )Street( [NSEW]{1,2})?$/ig, '$1St$2');
    newname = newname.replace(/\bSvc Rd\b/ig, 'Service Rd');
    newname = newname.replace(/^(?!The )(.* )Thruway( [NSEW]{1,2})?$/ig, '$1Thwy$2');
    newname = newname.replace(/^(?!The )(.* )Tpke( [NSEW]{1,2})?$/ig, '$1Tpk$2');

    /* State specific name transformations */
    var state = W.model.states.getObjectById(city.attributes.stateID);
    newname = state_transforms(newname, state.attributes.name);

    return(newname);
  }

  function remove_city(v, name, city)
  {
    var newcity = city.getID();
    var state = W.model.states.getObjectById(city.attributes.stateID);
    if (state.attributes.name.match(/^(Upper Franconia)$/)) { /* states that remove city name from Fway */
      if (name.match(/^I-\d+ [NSEW]$/) || v.attributes.roadType == 18) { /* Interstates and Railroads */
        var oldcity = W.model.cities.getObjectById(strt.attributes.cityID);
        var oldstate = W.model.states.getObjectById(oldcity.attributes.stateID);
        var oldcnt = W.model.countries.getObjectById(oldcity.attributes.countryID);
        newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
        if (!newobj[0]) {
          var t = W.model.states.getObjectById(oldcity.attributes.stateID);
          var e = W.model.countries.getObjectById(oldcity.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
        }
        if (newobj[0]) {
          newcity = newobj[0].getID();
          oldstate = W.model.states.getObjectById(newobj[0].attributes.stateID);
          oldcnt = W.model.countries.getObjectById(newobj[0].attributes.countryID);
        }
       /* if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    else if (state.attributes.name.match(/^(Colorado|Illinois|Indiana|Iowa|Kansas|Louisiana|Michigan|Minnesota|Mississippi|Missouri|New York|(North|South) Dakota|Ohio|Oklahoma|Pennsylvania|Wisconsin)$/)) /* states that don't remove city name from Fway */
    {
      if (v.attributes.roadType === 18) { /* Railroads */
        var oldcity = W.model.cities.getObjectById(strt.attributes.cityID);
        var oldstate = W.model.states.getObjectById(oldcity.attributes.stateID);
        var oldcnt = W.model.countries.getObjectById(oldcity.attributes.countryID);
        //newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
        newobj = find_empty_city(oldcity.attributes.stateID, oldcity.attributes.countryID);
        if (!newobj) {
          var t = W.model.states.getObjectById(oldcity.attributes.stateID);
          var e = W.model.countries.getObjectById(oldcity.attributes.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          //newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.attributes.stateID, countryID: oldcity.attributes.countryID});
          newobj = find_empty_city(oldcity.attributes.stateID, oldcity.attributes.countryID);
        }
        if (newobj) {
          newcity = newobj.attributes.id;
          oldstate = W.model.states.getObjectById(newobj.attributes.stateID);
          oldcnt = W.model.countries.getObjectById(newobj.attributes.countryID);
        }
      /*  if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    return(newcity);
  }

    function find_empty_city(stateID, countryID)
    {
        var newobj;
        W.model.cities.getObjectArray().some(function(city){
            if (city.attributes.stateID === stateID && city.attributes.countryID === countryID && city.attributes.isEmpty){
                newobj = city;
                return true;
            }
            return false;
        });
        return newobj;
    }

  function get_new_sid(newname, newcity)
  {
    let newobj = []
    if (newname === "" || newname === null) {
      newobj = W.model.streets.getObjectArray().filter( elem => elem.attributes.isEmpty == true && elem.attributes.cityID == newcity )
      // newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity});
    } else {
      newobj = W.model.streets.getObjectArray().filter( elem => elem.attributes.isEmpty == false && elem.attributes.cityID == newcity && elem.attributes.name == newname )
      // newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
    }
    if (!newobj[0]) {
      if (newname === "" || newname === null) {
        W.model.actionManager.add(new AddOrGetStreet(newname, newcity, true));
        // newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity, name: newname});
        newobj = W.model.streets.getObjectArray().filter( elem => elem.attributes.isEmpty == true && elem.attributes.cityID == newcity && name == newname)
      } else {
        W.model.actionManager.add(new AddOrGetStreet(newname, newcity, false));
        // newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
        newobj = W.model.streets.getObjectArray().filter( elem => elem.attributes.isEmpty == false && elem.attributes.cityID == newcity && elem.attributes.name == newname)
      }
      if (newobj[0]) {
        return(newobj[0].getID());
      }
    } else {
      return(newobj[0].getID());
    }
  }

  function onScreen(obj) {
  if ('getIsInBbox' in obj) {
    return(obj.getIsInBbox( W.map.getExtent()));
    }
    return(false);
  }

  // Verifies whether the segment should have the alt names checked/updated
  // Segments that are in one of the listed states and types with Hwy or Highway in their name will return true
  function verifyExemption(priID, segType) {
    let strtName = WazeWrap.Model.getStreetName(priID);
    let isExempt = false
    switch(WazeWrap.Model.getStateName(priID)) {
      case "Louisiana":
          isExempt = true;
          break;
      case "Maine":
          isExempt = true;
          break;
      case "Missouri":
          isExempt = true;
          break;
      case "New York":
          isExempt = true;
          break;
      default:
          isExempt = false;
          break;
    }

    if (isExempt && (strtName.startsWith('Hwy') || strtName.startsWith('Highway') || strtName.startsWith('Rte'))) {
        if (segType == 1 || segType == 2 || segType == 6 || segType == 7) {
            isExempt = true;
        } else isExempt = false;
    } else isExempt = false;

    return isExempt;
}

var primary_hn_count = 0;

let segments = [];
var logMessage = "";
  if(W.selectionManager.getSelectedFeatures().length > 0)
        segments = W.model.segments.getByIds(W.selectionManager.getSelectedDataModelObjects().map(function(seg){
            if(seg.type === "segment")
                return seg.getID();
      }));
  if(segments.length === 0)
       segments = W.model.segments.objects
_.each(segments, function(v, k) {
  if (v.attributes.junctionID === null && onScreen(v) && v.isGeometryEditable()) {
      if (v.attributes.primaryStreetID) {
        strt = W.model.streets.getObjectById(v.attributes.primaryStreetID);
        if (strt) {
          var newname = strt.attributes.name;
          var newcity = strt.attributes.cityID;
          var city = W.model.cities.getObjectById(strt.attributes.cityID);

          if (strt.attributes.name && (primary_hn_count < 20 || v.attributes.hasHNs === false) && !strt.attributes.name.match(/http:\/\//i)) {
            /* don't change names on railroads and runways */
            if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
              newname = transform_name(strt, city);
            }
            newcity = remove_city(v, newname, city);
          }
          var newcname = W.model.cities.getObjectById(newcity);
          if (newname != strt.attributes.name || newcity != strt.attributes.cityID) {
          	logMessage += "sid " + v.getID() + ": Prim was «" + strt.attributes.name + ", " + city.attributes.name + "», now «" + newname + ", " + newcname.attributes.name + "».\n";
            /*console.log("sid: " + v.getID() + " Pri: old: " + strt.name + ", " + city.attributes.name + " new: " + newname + ", " + newcname.attributes.name);*/
            var newid = get_new_sid(newname, newcity);
            W.model.actionManager.add(new UpdateObject(v, {primaryStreetID: newid, separator: false}));
            if (v.attributes.hasHNs) {
              primary_hn_count++;
              if (primary_hn_count == 20) {
                logMessage += "<b>Norm changed the primary street name on 20 segments with house numbers, not changing more, consider saving now.</b>\n"
                /*console.log("Changed the primary street name on 10 segments with house numbers, not changing more, consider saving now.");*/
              }
            }
          }
        }
      }
      if (v.attributes.streetIDs) {
        var i;
        var newsid = [];
        var updated = false;
        for (i = 0; i < v.attributes.streetIDs.length; i++) {
           let segExempt = false;
           strt = W.model.streets.getObjectById(v.attributes.streetIDs[i]);
          if (strt) {
            var newname = strt.attributes.name;
            var newcity = strt.attributes.cityID;
            var city = W.model.cities.getObjectById(strt.attributes.cityID);
         // Call to check exempt status based on name and type for alt name changing
         segExempt = verifyExemption(v.attributes.streetIDs[i], v.attributes.roadType);
            if (strt.attributes.name && !strt.attributes.name.match(/http:\/\//i) && !segExempt) {
              /* don't change names on railroads and runways */
              if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
                newname = transform_name(strt, city);
              }
              newcity = remove_city(v, newname, city);
            }
            var newcname = W.model.cities.getObjectById(newcity);
            if (newname != strt.attributes.name || newcity != strt.attributes.cityID) {
              logMessage += "sid " + v.getID() + ": Alt(" + (i + 1) + ") was «" + strt.attributes.name + ", " + city.attributes.name + "», now «" + newname + ", " + newcname.attributes.name + "».\n";
                /*console.log("sid: " + v.getID() + " Alt[" + i + "] old: " + strt.name + ", " + city.attributes.name + " new: " + newname + ", " + newcname.attributes.name);*/
                updated = true;
              newsid.push(get_new_sid(newname, newcity));
            } else {
              newsid.push(strt.getID());
            }
          }
        }
        if (updated) {
          W.model.actionManager.add(new UpdateObject(v, {streetIDs: newsid, separator: false}));
        }
      }
    }
  });
  WazeWrap.Alerts.debug(GM_info.script.name, logMessage);
}

function onWmeReady() {
  if (WazeWrap && WazeWrap.Ready) {
      console.log('Initializing Normito...');
        initNormName();
        var normQuoteNum = Math.floor(Math.random() * 11);
        var normQuote = ["I think, ah, I think my buzzer's broken.", "Ah, tough luck there, buddy, huh?", "Yeah, that was 'Footloose.' Good flick, Footloose.", "Yeah, it's a rectangle.", "Why don't you let me buy a vowel?", "Yeah, that's right. Turd Ferguson. It's a funny name.", "Yeah, well, that's your opinion.", "That was a funny dog, Scooby Doo. He drove around in a van and, ah, solved mysteries.", "Ha ha. Yeah. I found this backstage. An oversized hat. It's funny.", "It's funny. It's funny because it's ah, bigger than, ah... you know, a normal hat."];
        console.log('Norm Name:', 'Initialized.', normQuote[normQuoteNum]);
      } else {
        console.log('WazeWrap not ready. Trying again...');
        setTimeout(onWmeReady, 1000);
    }
}

function bootstrap() {
    if (W?.userscripts?.state.isReady) {
        onWmeReady();
    } else {
        document.addEventListener('wme-ready', onWmeReady, { once: true });
    }
}

bootstrap();