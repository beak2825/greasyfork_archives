// ==UserScript==
// @name       Github Pull Request Reviewer
// @namespace  http://gmatheu.github.io/
// @version    0.1
// @description  Give some order to your pull request
// @match      https://github.com/*/*/pull/*/files
// @copyright  2014+, Gonzalo Matheu based on Jeremy Wentwort's version
// @require http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @require http://cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage.min.js
// @downloadURL https://update.greasyfork.org/scripts/4690/Github%20Pull%20Request%20Reviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/4690/Github%20Pull%20Request%20Reviewer.meta.js
// ==/UserScript==


///////////////////////////////////////////////////////////////
// Style
///////////////////////////////////////////////////////////////
$(".container").width("95%");
$("#js-repo-pjax-container").width("95%");
$(".meta").css("padding","0px 10px");
$(".file").css("margin-bottom","3px");


///////////////////////////////////////////////////////////////
// DnD Sort
///////////////////////////////////////////////////////////////
$("#files").sortable({
    cursor: "move",
    handle: ".handle",
	start: function( event, ui ) {},
    stop: function( event, ui ) {}
});


///////////////////////////////////////////////////////////////
// Toggle data view for all files
///////////////////////////////////////////////////////////////
$('<a>',{
    text: 'Show Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'Show Data',
    href: '#',
    click: function(){ 
		$(".data").show()
    }
}).insertBefore($(".show-diff-stats"));

$('<a>',{
    text: 'Hide Data',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'File Data',
    href: '#',
    click: function(){ 
		$(".data").hide()
    }
}).insertBefore($(".show-diff-stats"));


///////////////////////////////////////////////////////////////
// Buttons for each file
///////////////////////////////////////////////////////////////
var bodyTag = $('body');
var filesContainer = $("#files");
$(".file").each(function(){
    var fileDiv = $(this);
    var actionsDiv = fileDiv.find(".actions");
    var dataDiv = fileDiv.find(".data");
    
    $('<a>',{
        text: 'Data',
	    class: 'minibutton',
        style: '',
        title: 'Toggle',
        href: '#',
        click: function(){ 
            dataDiv.toggle();
            return false;
        }
	}).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Top',
	    class: 'minibutton',
        style: '',
        title: 'Moves File to Top',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
			filesContainer.prepend(fileDiv);
            return false;
        }
	}).appendTo(actionsDiv);
    
    $('<a>',{
        text: 'Bottom',
	    class: 'minibutton',
        style: '',
        title: 'Moves File to Bottom',
        href: '#',
        click: function(){ 
            fileDiv.detach(); 
			filesContainer.append(fileDiv);
            return false;
        }
	}).appendTo(actionsDiv);
    
    $('<div>',{
        text: '☰',
        class: 'handle',
        style: '',
        style: 'font-size:20px; display: inline-block; line-height:20px; padding-left:10px; cursor:move;'
	}).appendTo(actionsDiv);
    
});

////////////////////////
// Save Scrolling
///////////////////////
$(window).scroll(function() {
    var pos = $(window).scrollTop();
    localStorage.setItem('pull-request-scroll', pos);
});

$('<a>',{
    text: 'Last Position',
    class: 'minibutton',
    style: 'margin-left:10px;',
    title: 'Go to Last Position',
    href: '#',
    click: function(){ 
        var pos = localStorage.getItem('pull-request-scroll');
        console.log(pos);
		$(window).scrollTop(pos);
    }
}).insertBefore($(".show-diff-stats"));
