// ==UserScript==
// @name         AO3 Filter Bookmarks By Length
// @namespace    https://greasyfork.org/en/users/296127-doleful-shades
// @version      0.2
// @description  Script to filter bookmarks based on word and chapter count.
// @author       dolefulshades
// @match      http://archiveofourown.org/*bookmarks*
// @match      https://archiveofourown.org/*bookmarks*
// @grant    none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/490082/AO3%20Filter%20Bookmarks%20By%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/490082/AO3%20Filter%20Bookmarks%20By%20Length.meta.js
// ==/UserScript==

// minimum and maximum word counts
var min_len = 0;
var max_len = Infinity;

// minimum and maximum chapter counts
var min_chap = 0;
var max_chap = 50;



(function($) {
    addButtons('word'); //add HTML element for word count
    addButtons('chapter'); //add HTML element for chapter count
    configureLocalStorage(); //edit HTML values and localstorage to reflect current min/max vars
    filter();
    addListeners('word');
    addListeners('chapter');

    function filter(){
        var words = $(".bookmarks-index .blurb .stats dt:contains('Words:')"); //all "Words:" descriptors before word count
        for(var i=0;i<$(words).length;i++){
            //loop through all 'word' descriptor html objs
            var len = parseInt($($(words)[i].nextElementSibling).text().replace(',','')); //get word count for each work as number
            var chap = $($(words)[i]).siblings("dt:contains('Chapters:')"); // get 'Chapters:" html object
            var numchaps = parseInt($(chap).next('dd').text().split('/')[0].replace(',','')); //get chapter count as number

            if (true && len < localStorage.getItem('work_search_words_from')||len > localStorage.getItem('work_search_words_to')) {
                //if the word count does not fall between min_len and max_len, hide the work
                console.log(len);
                $($(words)[i]).closest('.bookmarks-index .blurb').hide();
            }
            else if(numchaps
                    && numchaps < localStorage.getItem('work_search_chapters_from')
                    || numchaps > localStorage.getItem('work_search_chapters_to')){
                //if chapter count does not fall btwn min and max chaps, hide the work
                console.log(numchaps);
                $($(words)[i]).closest('.bookmarks-index .blurb').hide();
            }
        }
    }

    function addButtons(str){
        //create and append title obj
        var more_obj = document.getElementsByClassName('more group')[0].children[0];
        var title_obj = document.createElement( 'dt' );
        var button_obj = document.createElement( 'button' );
        title_obj.append(button_obj);
        more_obj.append(title_obj);

        title_obj.id = "toggle_work_"+str+"s";
        title_obj.setAttribute('class', 'filter-toggle '+str+'s collapsed');
        var button_str = '<button type="button" id="'+str+'s_button" class="expander" aria-expanded="false" aria-controls="work_'+str+'s">'+ str.charAt(0).toUpperCase() + str.slice(1)+' Count</button>';
        button_obj.outerHTML = button_str;
        $('#'+str+'s_button').on('click', showInfo);
        //document.getElementsByClassName('more group')[0].style.color="blue";

        //create and append filter obj
        var filter_obj = document.createElement('dd');
        var filter_str = '<dd id="work_'+str+'s" class="expandable hidden"> <dl class="range"> <dt><label for="work_search_'+str+'s_from">From</label></dt> <dd><input type="text" name="work_search['+str+'s_from]" id="work_search_'+str+'s_from"></dd> <dt><label for="work_search_'+str+'s_to">To</label></dt> <dd><input type="text" name="work_search['+str+'s_to]" id="work_search_'+str+'s_to"></dd> </dl> </dd>';
        more_obj.append(filter_obj);
        filter_obj.outerHTML = filter_str;
    }

    function addListeners(str){
       $('#work_'+str+'s').on('change', '#work_search_'+str+'s_from', function(){localStorage.setItem('work_search_'+str+'s_from',parseInt($('#work_search_'+str+'s_from').val()));});
       $('#work_'+str+'s').on('change', '#work_search_'+str+'s_to', function(){localStorage.setItem('work_search_'+str+'s_to',parseInt($('#work_search_'+str+'s_to').val()));});
    }

    function showInfo(e) {
        var x = e.currentTarget.getAttribute("aria-expanded");
        var expandable = e.currentTarget.getAttribute("aria-controls");

        if (x == "true"){
            x = "false";
            e.currentTarget.parentNode.classList.add('collapsed');
            e.currentTarget.parentNode.classList.remove('expanded');
            document.getElementById(expandable).classList.add('hidden');

        }
        else {
            x = "true";
            e.currentTarget.parentNode.classList.add('expanded');
            e.currentTarget.parentNode.classList.remove('collapsed');
            document.getElementById(expandable).classList.remove('hidden');
        }
        e.currentTarget.setAttribute("aria-expanded", x);
    }
    function configureLocalStorage(){
        var work_search_words_from = localStorage.getItem('work_search_words_from');
        var work_search_words_to = localStorage.getItem('work_search_words_to');
        var work_search_chapters_from = localStorage.getItem('work_search_chapters_from');
        var work_search_chapters_to = localStorage.getItem('work_search_chapters_to');

        if(work_search_words_from==null){localStorage.setItem("work_search_words_from", min_len);}
        if(work_search_words_to==null){localStorage.setItem("work_search_words_to", max_len);}
        if(work_search_chapters_from==null){localStorage.setItem("work_search_chapters_from", min_chap);}
        if(work_search_chapters_to==null){localStorage.setItem("work_search_chapters_to", max_chap);}

        $("#work_search_words_from").val(work_search_words_from);
        $("#work_search_words_to").val(work_search_words_to);
        $("#work_search_chapters_from").val(work_search_chapters_from);
        $("#work_search_chapters_to").val(work_search_chapters_to);
    }

    function updateLocalStorage(str){
        console.log(str+$("#"+str).val());
        //localStorage.setItem(str,$("#"+str).val());
    }
})(window.jQuery);
