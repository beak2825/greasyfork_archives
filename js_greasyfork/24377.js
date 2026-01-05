// ==UserScript==
// @name         Wanikani Review Info Page Link
// @namespace    Mempo
// @version      1.0
// @description  Add a link to the info page of an item
// @author       Mempo
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24377/Wanikani%20Review%20Info%20Page%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/24377/Wanikani%20Review%20Info%20Page%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('/// WKRIPL start');
    
    var style = "span.vocabulary { " +
                     "width: auto !important;" +
                     "padding-left: 0.45em;" +
                     "padding-right: 0.45em;" +
                     "background-color: #a100f1;" +
                     "background-image: -moz-linear-gradient(top, #a0f, #9300dd);" +
                     "background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#a0f), to(#9300dd));" +
                     "background-image: -webkit-linear-gradient(top, #a0f, #9300dd);" +
                     "background-image: -o-linear-gradient(top, #a0f, #9300dd);" +
                     "background-image: linear-gradient(to bottom, #a0f, #9300dd);" +
                     "background-repeat: repeat-x;" +
                     "}" ;
    
    addStyle(style);
    
    /*DISCLAIMER: full credit for the magic below goes to Thaos. I don't even know how or why it really works */
    // hook jQuery.fn.show() - for review sections of /lesson and /review
    $.fn._ripl_show = $.fn.show;
    $.fn.show = function(a,b,c){
        var res = $.fn._ripl_show.call(this,a,b,c);

        // detect when Wanikani has loaded additional item information
        // ("#all-info").show() seems to correspond with this.
        if(typeof this[0] !== 'undefined' && this[0].id === 'information'){
            // start of wanikani ajax request

        } else if(typeof this[0] !== 'undefined' && this[0].id === 'all-info'){
            // wanikani ajax request returns - does not fire with radicals
            
                insertInfoLink();
            
        } else if (typeof this[0] === 'undefined'){
            console.log(this); // i'm curious
        }

        return res;
    };
    /* end of Thaos code */
    
    function insertInfoLink() {
        //sorry
        var jisho_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAYCAMAAACP1l7TAAADAFBMVEVW2SZEREWRkZK276J1dHZJSUrZ2dn6+vrBwcL4+Pje3t7GxsZ44FL8/PyUlJXR0dKmpqe6ubqtra7MzMzU9ciqqarJyclpaWq8vL2CgYKb6X+2tbbs7OyZmZnq6updXF2ioaLo6Oh8fH2NjI7u7u7g4OCysbLm5ubW1tdWVldsbG7C8bH+/v6JiIni+Nn09PRhYWJycXLq+uT4/fWP5m+enp6FhYZ5eHlUVFXy8vL3/fRSUlRMTE5YWFrk5OTi4uJPTlBGRkdQ2B7U1NU70wNbWlxmZmdYWFlK1hZKSkuI5GZOTk9WVVbc3N1G1hK/vr9RUFJwb3Hc99Ly/O5D1Q1UVFRSUlNQUFH6/vhA1ApY2Snv/OpS2CHOzs6dnJ14d3icnJ5ubm+WlpdlZGZeXl+SkpPg99eK5GlWVFefnqBbW1xiYmN0c3S7urtmZmhMTE1oZ2hBQUJkZGXm+eCHhohLS0yDgoNZWlpXV1jX19hNTU5SUVOLiotDQkRV2CX9//16entZWVp3dnejo6RzcnOgn6Campu9vb5XWFl8e3yAf4Gsq61TVFWop6lQT1Fsa2xramtjY2SIh4hgX2BPT1BLTExDQ0RRUVLw8PD39vbh4eL39/f29vbx8fHh99jDw8NHR0iMi4xTU1SEg4Tf39/My8xlZWb6+fqvr6/Nzc7T09Pv7+/t7e3d3d7b29u7u7z5+fn19fWPjo/29faH5GTLy8v49/ikpKRVVVb7+/v9/f3+/v3p6emnp6js6+v39/hNTk/j4+Pl5ubg3+CdnZ7q6unW1dbm5uW4uLjQ0NC7u7ugn5/AwMDz9PTz8/Pn5+f08/TExMXo6OfExMS3t7f6+fk8PD24t7j19vaQkJH29fWM5Wzy8vHz9POwsLGrqqusrK1W2if8+/z+/f3+/f7u7e6zs7Tq6emD41/q6ere3d5P1x6+vb3V1dXr6+vW1dXs6+zo5+jk4+TOzc5+fn/l5eU/P0BDRETb3Nzc29yXl5j29vf29/b39/ZaWlv///+govqVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AocCQEPDJpW+wAAAV1JREFUOMutkr1KA0EQgDeFot2RQhRJZSVpFAuPayRViliKAWttFmwCwhFSePgABgzkGkEOrURiYXG9j6AP4AtYarnjzP7d7RrFBQf25ve73dkdBnDA2BEwxuCPwiTC2j5yEUVRIFIKIf4VSZLkqb2TJAHIXPkd+eT8GTJeoDfbxEqxb5EYv+uqMKNMSyM3aM9kRV9oUcibctawbNdkri2ySnUL+HmFh5TsUhak+gcjUsO+cuoIrgHtTKchZIL2JeoXisQ6k/oI/9Y+6nHLOHtk1JGuPMbk3Ed6eL4pGG9UR+DQNHnrIrgaFjlzEICTQjGLPtKxSOEhJE3qyUGmNovGkte+jHfQcJA742z47dcueeggILQnb76OrMgHi4V5ygoBIarBcHo51WEOPgJcZXrVjD3meU4F71dpd+sDjVwHyLgnvXycZmMzyfznOZ8//HK/RjgCQUgsyu0gAr4Afg80eYrLcaoAAAAASUVORK5CYII=";
        
        var $html = ' <section id="related-items"> ' +
                    '     <h2>Link To Info Page</h2>' +
                   '      <ul class="placeholder_item_type">' +
                   '           <li>' +
                   '               <a title="View information page" target="_blank" href="placeholder_href">' +
                   '                   <span class="placeholder_item_type" lang="ja">placeholder_item_jp</span>' +
                   '                   placeholder_item_meaning' +
                   '               </a>' +
                   '            </li>' +
                   '        </ul>' +
                   '        <ul class="placeholder_item_type">' +
                   '           <li>' +
                   '               <a title="View Jisho information page" target="_blank" href="placeholder_jisho_href">' +
                   '               <img alt="Embedded Image" src="placeholder_jisho_image"/>' +
                   '               </a>' +
                   '            </li>' +
                   '        </ul>' +
                   '    </section>';
        var item = $.jStorage.get("currentItem");
        var itemType = item.kan?"kanji":"vocabulary";
        var itemJP = item.kan?item.kan:item.voc;

        //WK ITEM
        $html = $html.replace("placeholder_item_type",itemType);
        $html = $html.replace("placeholder_item_type",itemType);
        $html = $html.replace("placeholder_item_type",itemType);
        $html = $html.replace("placeholder_href","/" + itemType + "/" + itemJP);
        $html = $html.replace("placeholder_item_jp",itemJP);
        $html = $html.replace("placeholder_item_meaning",item.en[0]);
        //JISHO
        $html = $html.replace("placeholder_jisho_href","http://jisho.org/search/" + itemJP);
        $html = $html.replace("placeholder_jisho_image",jisho_icon);
        

        $("#item-info-col1").append($html);
        
        
    };
    
    
    
    function addStyle(aCss) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
    }
    return null;
}
})();