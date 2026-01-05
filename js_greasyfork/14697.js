// ==UserScript==
// @author Julien Brassard
// @name       Sherweb TFS Enhancer
// @namespace
// @version    0.8
// @description  enter something useful
// @include      *alm.sherweb.com/*/_backlogs*
// @copyright  2012+, You
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/14697/Sherweb%20TFS%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/14697/Sherweb%20TFS%20Enhancer.meta.js
// ==/UserScript==

/*
GM_setValue( "52087.color", "#F5DEB3" ); //Promo Epic
GM_setValue( "52585.parent.id", "52087" );
GM_setValue( "52580.parent.id", "52087" );
GM_setValue( "52581.parent.id", "52087" );
GM_setValue( "52581.parent.id", "52087" );
GM_log(GM_listValues());
*/

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//addGlobalStyle('.board-tile .container { position: absolute; bottom: -13px; right: -9px; height: auto; !important; }');

//addGlobalStyle('.board-tile .field-container.additional-field .field-label[title="Priority"] { width:auto; margin:0; !important; }');
//addGlobalStyle('.board-tile .additional-field.lastAdditionalField { margin:0; !important; }');

//addGlobalStyle('.board-tile .field-container.additional-field .field-label[title="Area Path"] { display:none; !important; }');


$(document).ready(function() {

    var colPriorityIndex;
    var colNodeNameIndex;
    var colColorIndex;
    var colIdIndex;

    document.addEventListener("DOMNodeInserted", function(event){

        var element = event.target;
        var color;

        if( $(element).hasClass("grid-header-column") && $(element).find('[title="Priority"]') ){
            var index = $('.grid-header-column').parent().find('[title="Priority"]').index();
            if( index != -1 ) {
                colPriorityIndex = index;
            }
        }

        if( $(element).hasClass("grid-header-column") && $(element).find('[title="Node Name"]') ){
            var index = $('.grid-header-column').parent().find('[title="Node Name"]').index();
            if( index != -1 ) {
                colNodeNameIndex = index;
            }
        }

        if( $(element).hasClass("grid-header-column") && $(element).find('[title="Color"]') ){
            var index = $('.grid-header-column').parent().find('[title="Color"]').index();
            if( index != -1 ) {
                colColorIndex = index;
            }
        }
        
        if( $(element).hasClass("grid-header-column") && $(element).find('[title="ID"]') ){
            var index = $('.grid-header-column').parent().find('[title="ID"]').index();
            if( index != -1 ) {
                colIdIndex = index;
            }
        }

        if( $(element).hasClass("board-tile") ){
        /****************************************/
        // Style Wiki Links in Kanban Tiles
        /****************************************/
        
            var wikiElementGroup = $(element).find('[field="Sherweb.WikiLink"]');
            if(wikiElementGroup !== undefined) {
                var wikiUrl = $(wikiElementGroup).children('.onTileEditTextDiv').text();

                $(wikiElementGroup).children('.onTileEditTextDiv').css("display", "none");
                $(wikiElementGroup).children('.field-label').changeElementType("a");
                $(wikiElementGroup).children('.field-label')
                    .attr('target','_blank')
                    .attr('href', wikiUrl)
                    .prepend('<span class="icon icon-tfs-link"></span>');
            }
        
        
        /****************************************/
        // Style Color in Kanban Tiles
        /****************************************/
            var colorElementGroup = $(element).find('[field="Sherweb.Color"]');
            if(colorElementGroup !== undefined) {
                var colorName = $(colorElementGroup).children('.onTileEditTextDiv').text();
                $(colorElementGroup).remove();
                $(element).children('.board-tile-content-container').css("border-left-color", colorName);
            }
        }
        
        /****************************************/
        // Style Epics "Color" field (when dropdown is open)
        /****************************************/
        if( $(element).parent().hasClass("items")){
            console.log($(element));
            color = $(element).attr("title");
            $(element).css("background-color", color);
        } 

        if( $(element).hasClass("workitem-dialog") ){
            
            var epicId;
            var epicColor;
            var epicFeatures;
            
            
            GM_log( $(element).children('a') );
        }

        if( $(element).hasClass("grid-row") ){
            
            /****************************************/
            // Store Color of Epics
            /****************************************/
            if ( $(element).has("[title='Epic']").length ) {
                
                var epicId;
                var epicColor;
                
                idEl = $(element).children().eq(colIdIndex);
                colorEl = $(element).children().eq(colColorIndex);
                
                if( $(idEl).index() === colIdIndex && $(colorEl).index() === colColorIndex ){
                    epicId = $(idEl).attr('title');
                    epicColor = $(colorEl).attr('title');
                    GM_setValue( epicId+".color", epicColor );
                    GM_log("Setting color "+epicColor+" for Epic #"+epicId);
                }                
            }

            /****************************************/
            // Style "Architecture" Row
            /****************************************/
            if ( $(element).has("[title='Architecture'], [title='ACE'], [title='Testing'], [title='Release']").length ) {
                $(element).css("color",'gray');
                $(element).find(".work-item-color").css('background-color', '#999');
            }
            
            /****************************************/
            // Style "== OFFSET ==" Row
            /****************************************/
            if ( $(element).has("[title='== OFFSET ==']").length ) {
                $(element).css("color",'gray');
                $(element).addClass("sprint-line-single");
                $(element).find(".work-item-color").css('background-color', '#999');
            }

            /****************************************/
            // Style Priority Column
            /****************************************/

            var priorityEl;
            var priority;

            priorityEl = $(element).children().eq(colPriorityIndex);
            
            if($(priorityEl).index() === colPriorityIndex){
                priority = $(priorityEl).attr('title');
            }

            var priorityColor = getPriorityColor(priority);

            if(priorityColor !== undefined) {
                //console.log("Setting '" + color + "' color on priority " + priority);
                $(priorityEl).css('color', priorityColor);
                //$('<style></style>').appendTo($(document.body)).remove();
                //console.log(element);
                //console.log($(element));
            }
            
            /****************************************/
            // Style Node Name Column
            /****************************************/

            var nodeNameEl;
            var nodeName;

            nodeNameEl = $(element).children().eq(colNodeNameIndex);
            
            if($(nodeNameEl).index() === colNodeNameIndex) {
                nodeName = $(nodeNameEl).attr('title');
                
                if(nodeName == "Sherweb") {
                    $(nodeNameEl).css('color', 'red');
                }
            }
        }        

        
        // Style Tags
        if ( $(element).hasClass("tag-item") ) {

            var tagName = $(element).attr('title');

            var color = getTagColor(tagName);

            if(color !== undefined){
                $(element).find('.tag-box').css('background-color', color);
            }
        }      


    });

    /*function getColumnIndex(colElement, titleToMatch) {
        if( $(colElement).hasClass("grid-header-column") && $(element).find('[title="'+titleToMatch+'"]') ){
            var index = $('.grid-header-column').parent().find('[title="'+titleToMatch+'"]').index();
            if( index != -1 ) {
                return index;
            }
            else {
                return undefined;
            }
        }
    }*/
    
    function getPriorityColor(priority) {
        
        var color;
        
        if(priority == '1'){
            color = 'Red';
        }
        else if(priority == '2'){
            color = 'Crimson';
        }
        else if(priority == '3'){
            color = 'DarkRed';
        }
        else if(priority == '4'){
            color = 'Black';
        }
        else if(priority == '0'){
            color = 'Gray';
        }
        return color;
    }

    function getTagColor(tagName) {

        var color;
        
        if(tagName=="To Groom"){
            color = 'LightSalmon';
        }
        else if(tagName=="To Spec"){
            color = 'Khaki';
        }
        else if(tagName=="Non-Fonctional"){
            color = 'Thistle';
        }
        else if(tagName=="AdminSherweb"){
            color = 'Indigo';
        }
        else if(tagName=="Ready"){
            color = 'LightGreen';
        }
        else if(tagName=="Groomed"){
            color = 'LightGreen';
        }
        else if(tagName=="To Review"){
            color = 'LightPink';
        }
        else if(tagName=="Incomplete"){
            color = 'LightPink';
        }
        return color;
    }
});


(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};
        
        if(this[0]===undefined) return;

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
})(jQuery);