// ==UserScript==
// @name          WaniKani Review Asc/Desc SRS Order (Radical -> Kanji -> Vocab)
// @namespace     Mempo
// @description   Sorts WaniKani reviews by type and ascending or descending SRS level
// @version       4
// @include       https://www.wanikani.com/review/session
// @include       http://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23503/WaniKani%20Review%20AscDesc%20SRS%20Order%20%28Radical%20-%3E%20Kanji%20-%3E%20Vocab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23503/WaniKani%20Review%20AscDesc%20SRS%20Order%20%28Radical%20-%3E%20Kanji%20-%3E%20Vocab%29.meta.js
// ==/UserScript==

var indicatorRadKanVoc = true;
var indicatorPerSRSLevel = false;

function get(id) {
    if (id && typeof id === 'string') {
        id = document.getElementById(id);
    }
    return id || null;
}

function init(){
	console.log('init() start');
	var stats = $("#stats")[0];
    var t = document.createElement('div');
    t.style = "width: 20vw;"
    stats.appendChild(t);
    
    if(indicatorRadKanVoc){
        t.innerHTML = '<div id="wkroRKVStatus"><table align="right"><tbody>'+
            '<tr><td>Rad</td><td align="right"><span id="wkroRadCount"></span></td></tr>'+
            '<tr><td>Kan</td><td align="right"><span id="wkroKanCount"></span></td></tr>'+
            '<tr><td>Voc</td><td align="right"><span id="wkroVocCount"></span></td></tr>'+
            '</tbody></table></div>';
    }
    if(indicatorPerSRSLevel){
        t.innerHTML = t.innerHTML + '<div id="wkroAGMEStatus"><table align="right"><tbody>'+
            '<tr><td>Apprentice</td><td align="right"><span id="wkroApprCount"></span></td></tr>'+
            '<tr><td>Guru</td><td align="right"><span id="wkroGuruCount"></span></td></tr>'+
            '<tr><td>Master</td><td align="right"><span id="wkroMasterCount"></span></td></tr>'+
            '<tr><td>Enlightened</td><td align="right"><span id="wkroEnlCount"></span></td></tr>'+
            '</tbody></table></div>';
    }
    t.innerHTML = t.innerHTML +
        '<form>' +
        '<input type="radio" name="srs" value="asc" checked> asc  ' +
        '<input type="radio" name="srs" value="desc"> desc<br>' +
        '</form>'+
        '<button id="reorderBtn1" type="button" onclick="window.dispatchEvent(new Event(\'reorderWKBulk\'));">Bulk Mode</button>'+
        '<button id="reorderBtn2" type="button" onclick="window.dispatchEvent(new Event(\'reorderWKSingle\'));">Single Mode</button>'+
        '</div>';
    
    $.jStorage.listenKeyChange("activeQueue",displayUpdate);
	window.addEventListener('reorderWKSingle',reorderSingle); 
	window.addEventListener('reorderWKBulk',reorderBulk); 
    displayUpdate();
	console.log('init() end');
}

function reorderBulk(){
    //Reordering method following original parameters of 10 activeQueue list
    method = "BULK";
    reorder();
}

function reorderSingle(){
    //Reordering method following the 1 activeQueue list, that makes both reading/meaning coming in pairs.
    //method = "SINGLE";
    //reorder();
    try{
        unsafeWindow.Math.random = function() { return 0;  }
    }catch(e){
        Math.random = function() { return 0;  }
    }
    reorderBulk();
}

function reorder(){
    console.log('reorder() start');
    //var divSt = get("divSt");
    var reorderBtn1= get("reorderBtn1");
    var reorderBtn2= get("reorderBtn2");
    reorderBtn1.style.visibility="hidden";
    reorderBtn2.style.visibility="hidden";
    //divSt.innerHTML = 'Reordering.. please wait!';

    var cur = $.jStorage.get("currentItem");
	var qt = $.jStorage.get("questionType");
	var actList = $.jStorage.get("activeQueue");
	var revList = $.jStorage.get("reviewQueue");

    console.log('current item: ');
    console.log( cur);
    console.log('//////////////');
    var curt = cur.kan?'kan':cur.voc?'voc':'rad';
    
    var removedCount = 0;
    for(var i=0;i<actList.length;i++){
        var it = actList[i];
        var itt = cur.kan?'kan':cur.voc?'voc':'rad';
        console.log("current 'it' is: ");
        console.log(it);
        if(!(curt==itt&&cur.id==it.id)){
           actList.splice(i--,1); // post-decrement -> genius! i=0 except if current item is encountered.
           revList.push(it);
           removedCount++;
        }
    }
    console.log('Items removed from ActiveQueue: '+removedCount);

    var ord = $("input[name=srs]:checked").val() + "";
    console.log("/// checked input is: " + ord);
    var start=-1;
    var stop=-1;
    if(ord==="asc"){
      for(var srs=10; srs>=0; srs--){ //order in desc SRS
        for(var i=revList.length-1;i>=0;i--){
            var it=revList[i];
            if(it.srs==srs){
               revList.splice(i,1);

               revList.push(it); // always push decreasing srs to the end of the queue. Eventually descending order will form.
            }
        }
    }
    }else{
        
      for(var srs=0; srs<=10; srs++){ //order in asc SRS

        for(var i=revList.length-1;i>=0;i--){

            var it=revList[i];

            if(it.srs==srs){

               revList.splice(i,1);

               revList.push(it); // always push increasing srs to the end of the queue. Eventually ascending order will form.

            }

        }

    }
    }

    //all asc/desc srs done, item types still mixed

    //put all kanji at the back
    var index = 0; //actual index in list.
    for(var i=0;i>=revList.length-1;i++){ //i is absolute number of reordenings.
        var it=revList[index];
        if(it.kan){
           revList.splice(index,1);
           revList.push(it);
           //console.log('kan '+it.kan);
        }else{
            index++;
        }
    }

    index=0;
    for(var i=0;i>=revList.length-1;i++){ //put all radicals at the back
        var it=revList[index];
        if(it.rad){
           revList.splice(index,1);
           revList.push(it);
           //console.log('rad '+it.rad);
        }
    }

    //Vocab>kanji>rad with vocab at bottom of stack and index=0
    //array.pop will give rad, then kanji, then vocab

    if(method=='BULK')
        for(var i=0;i<removedCount;i++)
        	actList.push(revList.pop());

    console.log('Ordered ReviewQueue:');
    for(var i=0;i<revList.length;i++){
        var it=revList[i];
        if(it.rad)
        	console.log('rad '+it.rad);
        else if(it.kan)
           	console.log('kan '+it.kan);
        else if(it.voc)
            console.log('voc '+it.voc);
    }

    $.jStorage.set("reviewQueue",revList);
    $.jStorage.set("activeQueue",actList);

    //divSt.innerHTML = 'Done!';
    console.log('reorder() end');
}

function displayUpdate(){
    var radC = 0, kanC = 0, vocC = 0, apprC = 0, guruC = 0, masterC = 0, enlC = 0;
    var list = $.jStorage.get("reviewQueue").concat($.jStorage.get("activeQueue"));
    if(indicatorRadKanVoc){
        //console.log('ReviewQueue ('+$.jStorage.get("reviewQueue").length+') ActiveQueue ('+$.jStorage.get("activeQueue").length+')');
        for(var i=0;i<list.length;i++){
            var it=list[i];
            if(it.rad)
                radC++;
            else if(it.kan)
                kanC++;
            else if(it.voc)
                vocC++;
        }
        //console.log('Rad '+radC+' Kan '+kanC+' Voc '+vocC);
        var radSpan = $("#wkroRadCount")[0];
        var kanSpan = $("#wkroKanCount")[0];
        var vocSpan = $("#wkroVocCount")[0];
        radSpan.innerHTML = radC;
        kanSpan.innerHTML = kanC;
        vocSpan.innerHTML = vocC;
    }
    if(indicatorPerSRSLevel){
        for(var i=0;i<list.length;i++){
            var it=list[i];
            if(it.srs < 5)
                apprC++;
            else if(it.srs < 7)
                guruC++;
            else if(it.srs === 7)
                masterC++;
            else
                enlC++;
        }
        
        var apprSpan = $("#wkroApprCount")[0];
        var guruSpan = $("#wkroGuruCount")[0];
        var masterSpan = $("#wkroMasterCount")[0];
        var enlSpan = $("#wkroEnlCount")[0];
        apprSpan.innerHTML = apprC;
        guruSpan.innerHTML = guruC;
        masterSpan.innerHTML = masterC;
        enlSpan.innerHTML = enlC;
    }
}
var method = "";
init();

// Hook into App Store
try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

console.log('script load end');
