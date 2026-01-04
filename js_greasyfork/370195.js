// ==UserScript==
// @name        JiraAPA
// @include     https://*/secure/RapidBoard.jspa*
// @match        http://10.217.50.10:8080/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     3.31
// @grant       none
// @namespace http://tampermonkey.net/
// @description Skrypt usprawniający prace jira
// @downloadURL https://update.greasyfork.org/scripts/370195/JiraAPA.user.js
// @updateURL https://update.greasyfork.org/scripts/370195/JiraAPA.meta.js
// ==/UserScript==


// ====================================================================
//             Konfiguracja
// ====================================================================



// dodanie labeli w backlogu
var add_extra_fields=true;


// ====================================================================
//             koniec konfiguracji
// ====================================================================

var doing_modifications=false;


var $j = jQuery.noConflict(true);

var matched,j_browser;
$j.uaMatch = function (ua) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];
    return {
        j_browser: match[1] || '',
        version: match[2] || '0'
    };
};





matched = $j.uaMatch(navigator.userAgent);
j_browser = {
};
if (matched.j_browser) {
    j_browser[matched.j_browser] = true;
    j_browser.version = matched.version;
}
if (j_browser.chrome) {
    j_browser.webkit = true;
} else if (j_browser.webkit) {
    j_browser.safari = true;
}
$j.browser = j_browser;

$j(document).ready(function () {
    var timer=0;

    $j( "body" ).bind("DOMSubtreeModified", function(){
        if (timer)
        {
            window.clearTimeout(timer);
        }
        if(! doing_modifications) {
            timer = window.setTimeout(function() {
                var StepsTable = document.getElementById("project-config-steps-table");
                if(StepsTable)
                    StepsTable.addEventListener("mouseup", SaveValue, false);
                updateExtraFields();
                MovePanel();
                SetResizable();
                SetResizableExecution();
                //        SetValue();
                RestoreValue();
            }, 100);
        }
    });
});


function SetResizableExecution(){

    //         window.addEventListener('load', function()
    //                                 {
    $j("th:contains('Test Step')").css('overflow','auto');
    $j("th:contains('Test Step')").css('resize','horizontal');


    $j("th:contains('Test Data')").css('overflow','auto');
    $j("th:contains('Test Data')").css('resize','horizontal');


    $j("th:contains('Expected Result')").css('overflow','auto');
    $j("th:contains('Expected Result')").css('resize','horizontal');


    $j("th:contains('Step-attachment')").css('overflow','auto');
    $j("th:contains('Step-attachment')").css('resize','horizontal');


    $j("th:contains('Status')").css('overflow','auto');
    $j("th:contains('Status')").css('resize','horizontal');

    $j("th:contains('Comment')").css('overflow','auto');
    $j("th:contains('Comment')").css('resize','horizontal');


    $j("th:contains('Attachments')").css('overflow','auto');
    $j("th:contains('Attachments')").css('resize','horizontal');


    if ($j(".detail-exec-view-wrapper")[0] || $j(".issue-view")[0])
    {
        $j(".aui-page-panel").css({"padding":"60px"});
        $j(".aui-sidebar-wrapper").width('60px');
        $j("th:contains('Test Step')").width('10%');
        $j("th:contains('Test Data')").width('20%');
        $j("th:contains('Expected Result')").width('60%');
        //         $j('li').live('click', function(){
        //         } );
    }
    //         },false);
}

function MovePanel()
{
    $j('#viewissuesidebar').css("display","table-header-group");
    $j('#hipchat-viewissue-panel').hide();

}

function SetResizable()
{
    if( $j('#type-val').length ) // selektor od typu Issue czy jest
    {
        if ($j("#type-val").text().trim() == "Test") // jesli testowy
        {
            //  AddName();
            console.log("TEST ");

            $j("th[title^='Test Step']").css('resize','horizontal');
            $j("th[title^='Attachment']").css('resize','horizontal');
            $j("th[title^='Test Data']").css('resize','horizontal');
            $j("th[title^='Expected Result']").css('resize','horizontal');
            $j('.textarea ztextarea noresize ztextarea-result').css('width', '150px') ;

            $('li').live('click', function(){
                $('input[type=text], textarea').css('max-width', '700px');
            } );
        }
    }

}

function RestoreValue()
{
    console.log("restore");



    $j("th:contains('Test Step')").width(localStorage.getItem('TestStepWidth'));
    $j("th:contains('Test Data')").width(localStorage.getItem('TestDataWidth'));
    $j("th:contains('Expected Result')").width(localStorage.getItem('ExpectedResultWidth'));
    $j("th:contains('Attachment')").width(localStorage.getItem('AttachmentWidth'));

}

function SaveValue(){

    // alert();
    //     localStorage.setItem('nazwa',
    var TestStepWidth = $j("th[title^='Test Step']").css('width');
    var TestDataWidth = $j("th[title^='Test Data']").css('width');
    var ExpectedResultWidth = $j("th[title^='Expected Result']").css('width');
    var AttachmentWidth = $j("th[title^='Attachment']").css('width');

    localStorage.setItem('TestStepWidth',TestStepWidth);
    localStorage.setItem('TestDataWidth',TestDataWidth);
    localStorage.setItem('ExpectedResultWidth',ExpectedResultWidth);
    localStorage.setItem('AttachmentWidth',AttachmentWidth);

}



function AddName()
{
    var name = document.getElementById("summary-val");
    var login = document.getElementsByClassName("aui-page-panel");

    var text = name.innerText || element.textContent;
    name.innerHTML = text;

    $j('#header ul').append(
        $j('<li>').append(
            $j('<a>').attr('href','/user/messages').append(
                $j('<span>').attr('class', 'tab').append(name.innerHTML)
            )));
}



function updateExtraFields(){
    try{
        doing_modifications=true;

        if ((add_extra_fields)) {

            $j('.ghx-plan-extra-fields').each(function (index) {
                if ($j(this).find('span.ghx-end.ghx-extra-field-estimate').length) {
                    $j(this).find('.ghx-extra-field').prependTo($j(this).find('span.ghx-end.ghx-extra-field-estimate'));
                    $j(this).find('span.ghx-end.ghx-extra-field-estimate').unwrap();
                }
                else {
                    $j(this).find('.ghx-extra-field').prependTo($j(this).prev());
                }
            });

            $j('.ghx-issue-content').each(function (index) {

                if (( ! $j(this).find('.ghx-extra-field-content').hasClass('aui-label ghx-label ghx-label-10')) && ( ! $j(this).find('.ghx-extra-field-content').hasClass('aui-lozenge') )) {
                    $j(this).find('.ghx-extra-field').each(function() {

                        switch ($j(this).text()) {
                            case 'None' :
                                $j(this).remove();
                                break;
                            case 'C???' :
                                $j(this).remove();
                                break;
                            default :
                                $j(this).find('.ghx-extra-field-content').toggleClass("aui-label ghx-label ghx-label-10");
                                break;
                        }
                    });
                }
            });

            $j('.ghx-extra-field-seperator').remove();
            $j('.ghx-issue-compact .ghx-row').css('height', 'auto');
            $j('span.ghx-extra-field-content.aui-label.ghx-label.ghx-label-10').css('background', '#add');
            $j('span.ghx-extra-field-content.aui-label.ghx-label.ghx-label-10').css('color', '#000000');
            $j('span.ghx-extra-field-content.aui-label.ghx-label.ghx-label-10').css('margin-left', '5px');

            $j('.ghx-column-headers .ghx-column.ghx-busted-max').css({"color" : "#FFFFFF","font-weight" : "bold","background" : "#d04437", "border-bottom-color" : "#d04437", "padding-left" : "10px"});
            $j('.ghx-column-headers .ghx-column.ghx-busted-max h2').css({"color" : "#FFFFFF"});
            $j('.ghx-column-headers .ghx-column.ghx-busted-max div.ghx-qty').css({"text-shadow" : "2px 2px 3px #000000"});
            $j('.ghx-column-headers .ghx-constraint.ghx-busted').css({"color" : "#000000", "font-style" : "italic"});

            $j('.ghx-column-headers .ghx-column.ghx-busted-min').css({"color" : "#FFFFFF","font-weight" : "bold", "background" : "#f6c342", "border-bottom-color" : "#f6c342", "padding-left" : "10px"});
            $j('.ghx-column-headers .ghx-column.ghx-busted-min h2').css({"color" : "#FFFFFF"});
            $j('.ghx-column-headers .ghx-column.ghx-busted-min div.ghx-qty').css({"text-shadow" : "2px 2px 3px #000000"});

        }
    } catch (exception) {
        doing_modifications=false;
        console.log("Błąd na stronie :" + exception);
    }
    doing_modifications=false;
}