// ==UserScript==
// @name         Wanikani Level Up Time
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Calculates what day and time you can level up if your reviews are correct.
// @author       Reeko182 - Instagram @joelabad
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381930/Wanikani%20Level%20Up%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/381930/Wanikani%20Level%20Up%20Time.meta.js
// ==/UserScript==

window.lu = {};

(function(lu_obj) {

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Wanikani Level Up Time';
    var wkof_version_needed = '1.0.27';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?'))
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        return;
    }

    wkof.include('ItemData');
    wkof.ready('document,ItemData').then(lu_startup);

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function lu_startup() {
        install_css();
        init_ui();

        wkof.ItemData.get_items({
            wk_items:{
                options:{
                    assignments:true,
                    review_statistics:true
                },
                filters:{
                    level:'+0',
                    item_type:'radical,kanji',
                }
            }
        })
        .then(lu_process_items);
    }

    //========================================================================
    // CSS Styling
    //-------------------------------------------------------------------

    var lu_css =
        '#lu_container { margin: -20px auto 32px auto; color: #555; font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif; font-weight: 300; text-shadow: 0 1px 0 #fff; font-size:13px; }'+
        '#lu_container i { padding-right:4px; font-size:14px; }';

    //========================================================================
    // Install stylesheet.
    //-------------------------------------------------------------------
    function install_css() {
        $('head').append('<style>'+lu_css+'</style>');
    }

    //========================================================================
    // Initialize the user interface.
    //-------------------------------------------------------------------
    function init_ui() {

        var html =

            "<div id='lu_container'>"+
            "<i class='icon-circle-arrow-up'></i> <b>Level Up:</b> <span id='lu_date'></span>"+
            "</div>";

        $('section.progression').after(html);

    }

    //========================================================================
    // Populate level info from API.
    //-------------------------------------------------------------------
    function lu_process_items(data) {

        lu_obj.items = wkof.ItemData.get_index(data, 'item_type');

        var guruDate;

        var lastRadical = lastItem('radical');
        //console.log(lastRadical);
        if(!lastRadical) //If all radicals are not unlocked
        {
            guruDate = getGuruDate("radical",false);
        }
        else
        {

            if(lastRadical[0] < 5) //If any radical is not gurued (stage < 5)
            {
                //Find out last radical guru date
                guruDate = getGuruDate("radical",lastRadical);
            }
            else
            {
                var lastKanji = lastItem('kanji');
                //console.log(lastKanji);
                if(!lastKanji) //If 90% of kanjis are not unlocked
                {
                    guruDate = getGuruDate("kanji",false);
                }
                else
                {
                    //Find out last kanji guru date
                    guruDate = getGuruDate("kanji",lastKanji);
                }

            }

        }

        var luDateDiv = document.getElementById('lu_date');
        luDateDiv.innerHTML += guruDate;

    }

    //========================================================================
    // Get item guru date
    //-------------------------------------------------------------------
    function getGuruDate(itype,item){

        //Calculate days to guru

        var daysToGuru = 0;

        if(!item)
        {
            daysToGuru = 4+8+23+47;
        }
        else
        {
            if(item[0] < 1) daysToGuru += 4;
            if(item[0] <= 1) daysToGuru += 8;
            if(item[0] <= 2) daysToGuru += 23;
            if(item[0] <= 3) daysToGuru += 47;
        }

        if(itype == "radical") daysToGuru += 4+8+23+47;

        //Add the days to the available or current date if item is locked

        var guruDate = (item) ? new Date(item[1]) : new Date();
        //console.log(guruDate);
        guruDate.setHours(guruDate.getHours() + daysToGuru);
        //console.log(guruDate);

        return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][guruDate.getDay()]+', '+
               ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][guruDate.getMonth()]+' '+guruDate.getDate()+', '+
               ('0'+guruDate.getHours()).slice(-2)+':'+('0'+guruDate.getMinutes()).slice(-2)+"h";

    }

    //========================================================================
    // Sort Array by multiple subarray fields.
    //-------------------------------------------------------------------
    function getSortMethod(){
        var _args = Array.prototype.slice.call(arguments);
        return function(a, b){
            for(var x in _args){
                var ax = a[_args[x].substring(1)];
                var bx = b[_args[x].substring(1)];
                var cx;

                ax = typeof ax == "string" ? ax.toLowerCase() : ax / 1;
                bx = typeof bx == "string" ? bx.toLowerCase() : bx / 1;

                if(_args[x].substring(0,1) == "-"){cx = ax; ax = bx; bx = cx;}
                if(ax != bx){return ax < bx ? -1 : 1;}
            }
        }
    }

    //========================================================================
    // returns last item info by type
    //-------------------------------------------------------------------
    function lastItem(itype) {

        var itemData = wkof.ItemData.get_index(lu_obj.items[itype], 'subject_id');
        //console.log(itemData);

        var items = [];
        var itemsCount = 0;
        for (var i in itemData) {
            if(itemData[i].assignments) items.push({slug:itemData[i].data.slug, stage:itemData[i].assignments.srs_stage, available:itemData[i].assignments.available_at});
            itemsCount++;
        }
        items = items.sort(getSortMethod('+stage','-available','+slug'));

        console.log(items);
        //console.log(itype+":"+items[0].stage+":"+items[0].available);
        //console.log(itemsCount+":"+items.length+":"+(items.length*100/itemsCount));

        switch(itype)
        {
            case "radical": return (items.length == itemsCount) ? [items[0].stage, items[0].available] : false; break;
            case "kanji":

                var kanjiRequired = Math.ceil(itemsCount*0.9);
                //console.log(kanjiRequired+" out of "+itemsCount+" kanjis required");

                if (items.length >= kanjiRequired)
                {

                    if((itemsCount-kanjiRequired) > 0) items.splice(((itemsCount-kanjiRequired)*-1), (itemsCount-kanjiRequired));
                    return [items[0].stage, items[0].available];

                }
                else
                {
                    return false;
                }

        }

    }

})(window.lu);