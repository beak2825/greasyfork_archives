// ==UserScript==
// @name     BDManagementEnhancer
// @version  1.57
// @license  none
// @run-at   document-end
// @match  https://bd742.com/user.php*
// @require https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @require https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @require https://cdn.jsdelivr.net/npm/daterangepicker@3.1.0/daterangepicker.js
// @require https://cdn.jsdelivr.net/npm/jquery.hotkeys@0.1.0/jquery.hotkeys.js
// @namespace https://greasyfork.org/users/290665
// @description Enhances advertisement management at bd742.com
// @grant GM_addStyle
// @grant GM_download
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/381570/BDManagementEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/381570/BDManagementEnhancer.meta.js
// ==/UserScript==

const xrps = 25; // XHR requests per second
const maxXHR = 6; // maximum concurrent XHR requests
const ladMinNo = 150;
const urlParm = "?mtm_campaign=lhannounce";

const special_banners = [14];
const regular_banners = [12,14,16];

var $ = window.jQuery;

const chmap = {
    'a': ['ａ','𝐚','𝖆','𝒂','𝓪','𝕒','𝚊','𝖺','𝗮','𝙖','𝘢'],
    'b': ['ｂ','𝐛','𝖇','𝒃','𝓫','𝕓','𝚋','𝖻','𝗯','𝙗','𝘣'],
    'c': ['ｃ','𝐜','𝖈','𝒄','𝓬','𝕔','𝚌','𝖼','𝗰','𝙘','𝘤'],
    'd': ['ｄ','𝐝','𝖉','𝒅','𝓭','𝕕','𝚍','𝖽','𝗱','𝙙','𝘥'],
    'e': ['ｅ','𝐞','𝖊','𝒆','𝓮','𝕖','𝚎','𝖾','𝗲','𝙚','𝘦'],
    'f': ['ｆ','𝐟','𝖋','𝒇','𝓯','𝕗','𝚏','𝖿','𝗳','𝙛','𝘧'],
    'g': ['ｇ','𝐠','𝖌','𝒈','𝓰','𝕘','𝚐','𝗀','𝗴','𝙜','𝘨'],
    'h': ['ｈ','𝐡','𝖍','𝒉','𝓱','𝕙','𝚑','𝗁','𝗵','𝙝','𝘩'],
    'i': ['ｉ','𝐢','𝖎','𝒊','𝓲','𝕚','𝚒','𝗂','𝗶','𝙞','𝘪'],
    'j': ['ｊ','𝐣','𝖏','𝒋','𝓳','𝕛','𝚓','𝗃','𝗷','𝙟','𝘫'],
    'k': ['ｋ','𝐤','𝖐','𝒌','𝓴','𝕜','𝚔','𝗄','𝗸','𝙠','𝘬'],
    'l': ['ｌ','𝐥','𝖑','𝒍','𝓵','𝕝','𝚕','𝗅','𝗹','𝙡','𝘭'],
    'm': ['ｍ','𝐦','𝖒','𝒎','𝓶','𝕞','𝚖','𝗆','𝗺','𝙢','𝘮'],
    'n': ['ｎ','𝐧','𝖓','𝒏','𝓷','𝕟','𝚗','𝗇','𝗻','𝙣','𝘯'],
    'o': ['ｏ','𝐨','𝖔','𝒐','𝓸','𝕠','𝚘','𝗈','𝗼','𝙤','𝘰'],
    'p': ['ｐ','𝐩','𝖕','𝒑','𝓹','𝕡','𝚙','𝗉','𝗽','𝙥','𝘱'],
    'q': ['ｑ','𝐪','𝖖','𝒒','𝓺','𝕢','𝚚','𝗊','𝗾','𝙦','𝘲'],
    'r': ['ｒ','𝐫','𝖗','𝒓','𝓻','𝕣','𝚛','𝗋','𝗿','𝙧','𝘳'],
    's': ['ｓ','𝐬','𝖘','𝒔','𝓼','𝕤','𝚜','𝗌','𝘀','𝙨','𝘴'],
    't': ['ｔ','𝐭','𝖙','𝒕','𝓽','𝕥','𝚝','𝗍','𝘁','𝙩','𝘵'],
    'u': ['ｕ','𝐮','𝖚','𝒖','𝓾','𝕦','𝚞','𝗎','𝘂','𝙪','𝘶'],
    'v': ['ｖ','𝐯','𝖛','𝒗','𝓿','𝕧','𝚟','𝗏','𝘃','𝙫','𝘷'],
    'w': ['ｗ','𝐰','𝖜','𝒘','𝔀','𝕨','𝚠','𝗐','𝘄','𝙬','𝘸'],
    'x': ['ｘ','𝐱','𝖝','𝒙','𝔁','𝕩','𝚡','𝗑','𝘅','𝙭','𝘹'],
    'y': ['ｙ','𝐲','𝖞','𝒚','𝔂','𝕪','𝚢','𝗒','𝘆','𝙮','𝘺'],
    'z': ['ｚ','𝐳','𝖟','𝒛','𝔃','𝕫','𝚣','𝗓','𝘇','𝙯','𝘻'],
    'A': ['Ａ','𝐀','𝕬','𝑨','𝓐','𝔸','𝙰','𝖠','𝗔','𝘼','𝘈'],
    'B': ['Ｂ','𝐁','𝕭','𝑩','𝓑','𝔹','𝙱','𝖡','𝗕','𝘽','𝘉'],
    'C': ['Ｃ','𝐂','𝕮','𝑪','𝓒','ℂ','𝙲','𝖢','𝗖','𝘾','𝘊'],
    'D': ['Ｄ','𝐃','𝕯','𝑫','𝓓','𝔻','𝙳','𝖣','𝗗','𝘿','𝘋'],
    'E': ['Ｅ','𝐄','𝕰','𝑬','𝓔','𝔼','𝙴','𝖤','𝗘','𝙀','𝘌'],
    'F': ['Ｆ','𝐅','𝕱','𝑭','𝓕','𝔽','𝙵','𝖥','𝗙','𝙁','𝘍'],
    'G': ['Ｇ','𝐆','𝕲','𝑮','𝓖','𝔾','𝙶','𝖦','𝗚','𝙂','𝘎'],
    'H': ['Ｈ','𝐇','𝕳','𝑯','𝓗','ℍ','𝙷','𝖧','𝗛','𝙃','𝘏'],
    'I': ['Ｉ','𝐈','𝕴','𝑰','𝓘','𝕀','𝙸','𝖨','𝗜','𝙄','𝘐'],
    'J': ['Ｊ','𝐉','𝕵','𝑱','𝓙','𝕁','𝙹','𝖩','𝗝','𝙅','𝘑'],
    'K': ['Ｋ','𝐊','𝕶','𝑲','𝓚','𝕂','𝙺','𝖪','𝗞','𝙆','𝘒'],
    'L': ['Ｌ','𝐋','𝕷','𝑳','𝓛','𝕃','𝙻','𝖫','𝗟','𝙇','𝘓'],
    'M': ['Ｍ','𝐌','𝕸','𝑴','𝓜','𝕄','𝙼','𝖬','𝗠','𝙈','𝘔'],
    'N': ['Ｎ','𝐍','𝕹','𝑵','𝓝','ℕ','𝙽','𝖭','𝗡','𝙉','𝘕'],
    'O': ['Ｏ','𝐎','𝕺','𝑶','𝓞','𝕆','𝙾','𝖮','𝗢','𝙊','𝘖'],
    'P': ['Ｐ','𝐏','𝕻','𝑷','𝓟','ℙ','𝙿','𝖯','𝗣','𝙋','𝘗'],
    'Q': ['Ｑ','𝐐','𝕼','𝑸','𝓠','ℚ','𝚀','𝖰','𝗤','𝙌','𝘘'],
    'R': ['Ｒ','𝐑','𝕽','𝑹','𝓡','ℝ','𝚁','𝖱','𝗥','𝙍','𝘙'],
    'S': ['Ｓ','𝐒','𝕾','𝑺','𝓢','𝕊','𝚂','𝖲','𝗦','𝙎','𝘚'],
    'T': ['Ｔ','𝐓','𝕿','𝑻','𝓣','𝕋','𝚃','𝖳','𝗧','𝙏','𝘛'],
    'U': ['Ｕ','𝐔','𝖀','𝑼','𝓤','𝕌','𝚄','𝖴','𝗨','𝙐','𝘜'],
    'V': ['Ｖ','𝐕','𝖁','𝑽','𝓥','𝕍','𝚅','𝖵','𝗩','𝙑','𝘝'],
    'W': ['Ｗ','𝐖','𝖂','𝑾','𝓦','𝕎','𝚆','𝖶','𝗪','𝙒','𝘞'],
    'X': ['Ｘ','𝐗','𝖃','𝑿','𝓧','𝕏','𝚇','𝖷','𝗫','𝙓','𝘟'],
    'Y': ['Ｙ','𝐘','𝖄','𝒀','𝓨','𝕐','𝚈','𝖸','𝗬','𝙔','𝘠'],
    'Z': ['Ｚ','𝐙','𝖅','𝒁','𝓩','ℤ','𝚉','𝖹','𝗭','𝙕','𝘡']
};
const defaultfont = 1;

addStyle();

unsafeWindow.updateAdNames = function() {
    $('ul.dropdown-menu[role="menu"] li a').each(function() {
        var txt = $(this).text();
        var link = $(this).attr('href');
        var size;
        size = link.match(/size=(\d+)/);
        var number = $(this).data('adnumber')
        if (number) {
            if (Store.getItem('name-'+size[1]+"-"+number)) {
                $(this).html(number+ ' <span class="adnamemenu">'+Store.getItem('name-'+size[1]+"-"+number)+"</span>")
                    .parent().removeClass("empty-banner")
            } else {
                $(this).html(number + " (empty)").parent().addClass("empty-banner");
            }
        }
    });
};

unsafeWindow.overview = function() {
    if ($('#overview').length) {
        $('#overview').remove();
        return;
    }
    var overview = $(
        '<div id="overview">'
        +'<div id="overview-tools" class="btn-group" style="display:block;">'
        +'<a class="btn btn-secondary disabled" href="#" onclick="printOverview(overview)"><span class="glyphicon glyphicon-print"></span> Print</a>'
        +'<a class="btn btn-secondary disabled" href="#" onclick="tableOverview(overview)"><span class="glyphicon glyphicon-list-alt"></span> Table</a>'
        +'<a class="btn btn-warning disabled" id="cleanbutton" href="#"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Clean</a>'
        +'<a class="btn btn-primary disabled" id="announcebutton" href="#"><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span> Announce</a>'
        +'<label><select name="overviewstyle" onchange="changeoverviewstyle();">'
        +'<option value="compact">Compact View</option>'
        +'<option value="details">Details view</option>'
        +'<option value="gallery" selected="selected">Gallery view</option>'
        +'<option value="table">Table view</option>'
        +'</select></label>'
        +'<label>sort by <select name="overviewsort" onchange="sortOverview();"><option value="adno">Ad number</option>'
        +'<option value="name">Name</option><option value="targeturl">Target URL</option><option value="text">Ad text</option>'
        +'<option value="startdate">Start date</option></select></label>'
        +'<label><input type="checkbox" name="showActive" checked="checked"> active (<span id="noActive"></span>)</label>'
        +'<label><input type="checkbox" name="showPlanned" checked="checked"> planned (<span id="noPlanned"></span>)</label>'
        +'<label><input type="checkbox" name="showInactive" checked="checked"> inactive/disabled (<span id="noInactive"></span>)</label>'
        +'<label><input type="checkbox" name="showEmpty"> empty (<span id="noEmpty"></span>)</label>'
        +'<span id="overviewProgress"></span>'
    ).insertBefore('div.well:first');
    $('#announcebutton').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        announce(overview);
    });
    $('#cleanbutton').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        cleanNames(overview);
    });
    $('#overview-tools input').on('change',function() { filterOverview() });
    changeoverviewstyle();
    $('ul.dropdown-menu[role="menu"]').last().find('li a').each(function() {
        var txt = $(this).text();
        var link = $(this).attr('href');
        var size;
        size = link.match(/size=(\d+)/);
        var number;
        var name;
        if (number=link.match(/ad_n=(\d+)/)) {
            name = Store.getItem('name-'+size[1]+"-"+number[1]);
        } else {
            number = ['',''];
            return;
        }

        $('<div>'
          +'<a href="'+link+'">'
          +'<span class="adno">'+(number?number[1]:'')+'</span>'
          +(name?' '+name:'&nbsp;')
          +'<div class="detail"></div></a>'
          +'</div>')
            .data("link",link)
            .data("targeturl","")
            .data("name",name)
            .data("adno",number[1])
            .addClass("overviewentry loadme")
            .appendTo(overview);
    });
    checkStatus(overview); // starts fetching of ads
}

unsafeWindow.overviewProgress = function() {
}

unsafeWindow.filterOverview = function(entry) {
    let showActive = $('[name=showActive]').is(':checked');
    let showInactive = $('[name=showInactive]').is(':checked');
    let showPlanned = $('[name=showPlanned]').is(':checked');
    let showEmpty = $('[name=showEmpty]').is(':checked');

    $(entry?$(entry):$('#overview .overviewentry')).each(function(undefined,element) {
        if ((! showActive && $(element).hasClass('active'))
            || (! showInactive && $(element).hasClass('inactive'))
            || (! showPlanned && $(element).hasClass('planned'))
            || (! showEmpty && $(element).hasClass('empty'))
           ) {
            $(element).addClass('hidden');
        } else {
            $(element).removeClass('hidden');
        }
    });
};
unsafeWindow.sortOverview = function() {
    let sortkey = $('[name=overviewsort').val();
    $('#overview .overviewentry').sort(
        sortkey == "adno"
        ? function(a,b) { return (parseInt($(b).data('adno'))) < parseInt($(a).data('adno')) ? 1 : -1; }
        : function(a,b) { return ($(b).data(sortkey)) < ($(a).data(sortkey)) ? 1 : -1; }
    ).appendTo($('#overview'));
};

unsafeWindow.changeoverviewstyle = function() {
    let style = $('[name=overviewstyle]').val();
    switch (style) {
        case "compact":
            $('#overview').removeClass('showdetails gallery table');
            break;
        case "details":
            $('#overview').removeClass('gallery table').addClass('showdetails');
            break;
        case "gallery":
            $('#overview').removeClass('table').addClass('showdetails gallery');
            break;
        case "table":
            $('#overview').removeClass('gallery').addClass('showdetails table');
            break;
    }
};

unsafeWindow.countOverview = function() {
    $('#overview #noActive').html($('#overview .active').length);
    $('#overview #noInactive').html($('#overview .inactive, #overview .disabled').length);
    $('#overview #noPlanned').html($('#overview .planned').length);
    $('#overview #noEmpty').html($('#overview .empty').length);
};

(function($){
    $.fn.tzCheckbox = function(options){

        // Default On / Off labels:

        options = $.extend({
            labels : ['ON','OFF']
        },options);

        return this.each(function(){
            var originalCheckBox = $(this),
                labels = [];

            // Checking for the data-on / data-off HTML5 data attributes:
            if(originalCheckBox.data('on')){
                labels[0] = originalCheckBox.data('on');
                labels[1] = originalCheckBox.data('off');
            }
            else labels = options.labels;

            // Creating the new checkbox markup:
            var checkBox = $('<span>',{
                className   : 'tzCheckBox '+(this.checked?'checked':''),
                html:   '<span class="tzCBContent">'+labels[this.checked?0:1]+
                '</span><span class="tzCBPart"></span>'
            });

            // Inserting the new checkbox, and hiding the original:
            checkBox.insertAfter(originalCheckBox.hide());

            checkBox.click(function(){
                checkBox.toggleClass('checked');

                var isChecked = checkBox.hasClass('checked');

                // Synchronizing the original checkbox:
                originalCheckBox.attr('checked',isChecked);
                checkBox.find('.tzCBContent').html(labels[isChecked?0:1]);
            });

            // Listening for changes on the original and affecting the new one:
            originalCheckBox.bind('change',function(){
                checkBox.click();
            });
        });
    };
})(jQuery);

var myVersion = GM_info.script.version;
var Store = localStorage;
$('header .navbar-brand').after('<div style="position: absolute;top: 76px;left: 18px;color: #ee6000;font-size: 13px;">Enhanced by BDManagementEnhancer V'+myVersion+'</div>');
$("head").append('<link href="//cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css">');

var matches = $('#wrap > div.container > div > div div.btn-group:nth-child(3) > ul li:nth-last-child(2) a').attr('href').match(/(.*=)(\d+)$/);
var myurl = matches[1];
var lastad = parseInt(matches[2]);
var currentad = parseInt($('input[name=ad_n]').val());
var nextad = currentad+1;
var prevad = currentad-1;
if (prevad < 1) prevad = 1;
var sizepar = $('input[name=size]').val();
var namevar = 'name-'+sizepar+'-'+currentad;

$('h1').append(' <span id="name_title"></span>');
$('#myform>table tr:nth-child(4) td:nth-child(2)').wrapInner('<div class="spacelist"></div>');
$('#myform>table tr:nth-child(8) a')
    .addClass('btn btn-danger')
    .css('width','100px')
    .css('white-space','normal');

var spacelist = $('.spacelist').html();
if ( spacelist ) {
    spacelist = '<label>'+spacelist.replace(/<br>/gi,'</label><br><label>')+'</label>';
    $('.spacelist').html(spacelist);
}
$('#myform>table tr:nth-child(9) td:nth-child(2)').css('position','relative').append('<div id="textpreviewcontainer">Preview: <div id="textpreview"></div></div>');
$('#myform>table tr:nth-child(11) td:nth-child(2) br').remove();
$('#myform>table tr:nth-child(12) td:nth-child(2) br').remove();
// delete image button
$('#myform > table tr:nth-child(8) a').html('<span class="glyphicon glyphicon-trash"></span>').attr('style','');
$('#myform > table tr:nth-child(8) td:first-child').remove();

// "pause this banner" button
$('#myform > table tr:nth-child(14) a').prepend('<span class="glyphicon glyphicon-pause"></span> ');
// "delete this banner" button
$('#myform > table tr:nth-child(15) a').prepend('<span class="glyphicon glyphicon-trash"></span> ');

// ENABLED switch
$('input[name=enabled]').after('<span style="position:relative;left:50px;">Name <input class="form-control" id="adname" style="width:200px;display:inline;"><span>'
                               + ' <a href="#" onclick="openqaz()">Unicode Text</a>');
$('input[name=enabled]').wrap('<label for="enabled"></label>');


$('#adname').on('change keyup', function () {
    $('#name_title').html($('#adname').val());
    Store.setItem(namevar,$('#adname').val());
    updateAdNames();
    document.title=$('#adname').val() + ' | Banner Management';
});

$('#wrap > div.container > div:first-child > div > div.btn-group').eq(1).attr('id', "ads-button");

// OVERVIEW button
$('<a id="overviewbutton" title="Overview" href="#" class="btn btn-primary"><span class="glyphicon glyphicon-th-list"></span> Overview</a>')
    .on('click', overview)
    .wrap('<div class="btn-group"></div>')
    .appendTo('#wrap > div.container > div:first-child > div')
    .after(' ');


$('#ads-button').on('click', function(ev) {
    $('input[name=adfilter]').focus().select();
})

// PREVIOUS AD button
$('#wrap > div.container > div:first-child > div').append('<div class="btn-group"><a id="prevad" title="Previous banner" href="'
                                                          + myurl + (prevad)
                                                          +'" class="btn btn-info"><span class="glyphicon glyphicon glyphicon-step-backward"></span></a></div> ');
if (isNaN(currentad) || prevad==currentad) $('#prevad').attr( "disabled", "disabled" );

// CURRENT AD input box
$('#wrap > div.container > div:first-child > div').append('<div class="btn-group"><input id="currentad" title="Current banner. Enter number and press return to jump to another banner!" value="'+ (isNaN(currentad)?'':currentad) +'"></div> ');
$('#currentad').bind('keypress', function(event) {
    if ((event.keyCode || event.which) == 13) {
        window.location.href = myurl + $(this).val();
    }
});

// NEXT AD button
$('#wrap > div.container > div:first-child > div').append('<div class="btn-group"><a id="nextad" title="Next banner" href="'
                                                          + myurl + (nextad)
                                                          +'" class="btn btn-info"><span class="glyphicon glyphicon glyphicon-step-forward"></span></a></div> ');
if (isNaN(currentad) || currentad==lastad) $('#nextad').attr( "disabled", "disabled" );

// NEW AD button
$('#wrap > div.container > div:first-child > div').append('<div class="btn-group"><a id="newad" title="Add new banner" href="'
                                                          + myurl + (lastad +1)
                                                          +'" class="btn btn-warning"><span class="glyphicon glyphicon glyphicon-plus"></span> new</a></div> ');

// Import/Export buttons
$('#wrap > div.container > div:first-child > div')
    .append('<div class="btn-group"><a id="importNames" title="Import Names" data-toggle="modal" data-target="#myModal" href="#" class="btn btn-primary"><span class="glyphicon glyphicon-import"></span> Imp</a></div> ');

$('<div class="modal" tabindex="-1" role="dialog" id="myModal">'
  +'  <div class="modal-dialog" role="document">'
  +'    <div class="modal-content">'
  +'      <div class="modal-header">'
  +'        <h5 class="modal-title">Import names from JSON</h5>'
  +'        <button type="button" class="close" data-dismiss="modal" aria-label="Close">'
  +'          <span aria-hidden="true">&times;</span>'
  +'        </button>'
  +'      </div>'
  +'      <div class="modal-body">'
  +'        <textarea style="width:100%;height:300px;" id="jsonPaste" placeholder="Paste JSON data here!"></textarea>'
  +'      </div>'
  +'      <div class="modal-footer">'
  +'        <button type="button" class="btn btn-primary" '
  +'             onclick="return importJSON($(\'#jsonPaste\').val());"><span class="glyphicon glyphicon-import"></span> Import names</button>'
  +'        <button type="button" class="btn btn-secondary" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>'
  +'      </div>'
  +'    </div>'
  +'  </div>'
  +'</div>').appendTo('#wrap');

var datum = new Date();
$('#wrap > div.container > div:first-child > div')
    .append('<div class="btn-group"><a id="exportNames" title="Export Names" class="btn btn-primary"><span class="glyphicon glyphicon-export"></span> Exp</a></div> ')
    .find('a#exportNames')
    .attr('href', 'data:application/json;charset=utf-8,'+(JSON.stringify(Store)).replace(/ /g,'%20'))
    .attr('download', 'bd-'+datum.toISOString().substring(0,10) +'.json');

// CLEAR button
$(' <button style="margin-left:8px;" type="reset" name="clearButton" class="btn btn-warning"><span class="glyphicon glyphicon-trash"></span> Clear</button>').on('click', function(event) {
    $('form :text, form select').val('');
    $('#adname').keyup();
    event.preventDefault();
}).insertAfter('input[type=submit]');

// Save as ... button
$(' <input style="margin-left:8px;" type="button" name="saveAsButton" value="Save as..." class="btn btn-secondary">').on('click', function(event) {
    event.preventDefault();
    var saveas = prompt("Save as ... (ad number)");
    if (saveas === null) return;
    if (confirm("Are you sure to overwrite ad number "+saveas+" ("+Store.getItem('name-'+sizepar+'-'+saveas)+")?")) {
        $('input[name=ad_n]').val(saveas);
        Store.setItem('name-'+sizepar+'-'+saveas,$('#adname').val());
        $('form').submit();
    }
}).insertAfter('input[type=submit]');

// SUBTEXT preview
$('[name=text1]').on('change keyup', function() {
    $('#textpreview').html($('[name=text1]').val());
});
$('#textpreview').html($('[name=text1]').val());

function updateDateRange(start, end, label) {
    $('[name=date_d1]').val(start.format('D'));
    $('[name=date_m1]').val(start.format('M'));
    $('[name=date_y1]').val(start.format('YYYY'));
    $('[name=date_d2]').val(end.format('D'));
    $('[name=date_m2]').val(end.format('M'));
    $('[name=date_y2]').val(end.format('YYYY'));
}

// DATE PICKER
$('#myform>table tr:nth-child(10) td:nth-child(2)')
    .wrapInner('<div class="old-datepicker"></div>')
    .prepend('<div class="new-datepicker"><input style="display:inline;" class="form-control" id="daterange">'
        +'<div id="weekpicker">'
        +'</div><br></div>'
    );

for (let week = 0; week < 8; week++) {
    $('#weekpicker').append($('<button/>', {
        "data": {"weeks": "1", "offset":week},
        "html": "w" + (week+1)
    }));
}

let nextweek_start = new Date();
nextweek_start.setDate(nextweek_start.getDate() + (8 - nextweek_start.getDay()) % 7);
let nextweek_end = new Date(nextweek_start);
nextweek_end.setDate(nextweek_end.getDate() + 6);

$('#weekpicker button').each(function(){
    let week = $(this).data('offset');
    let week_start = new Date(nextweek_start);
    week_start.setDate(week_start.getDate() + (week * 7));
    $(this).prepend( $('<span>', {
        class: "buttondate"
    }).html(week_start.getDate()+'.'+(week_start.getMonth()+1)+"."));
    if ($(this).is('last')) {
        week_start.setDate(week_start.getDate() + 7);
        $(this).append( $('<span>', {
            class: "buttondate"
        }).html(week_start.getDate()+'.'+(week_start.getMonth()+1)+"."));
    }
})

var mousebutton_pressed = false;
$('#weekpicker button')
    .on('click', adtime)
    .on('mousedown', week_drag_start)
    .on('mouseup', week_drag_stop)
    .on('mouseenter', function(){
        if (mousebutton_pressed) $(this).addClass('dragged')
    });

$('<div id="weekpicker-old"></div>').appendTo('.new-datepicker');

$('<button> &Larr; </button>').data({
    "movedays": -7
}).on('click', moveadtime).appendTo('#weekpicker-old');
$('<button>1w</button>').data({
    "weeks": 1,
    "offset": 0
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>2w</button>').data({
    "weeks": 2,
    "offset": 0
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>3w</button>').data({
    "weeks": 3,
    "offset": 0
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>4w</button>').data({
    "weeks": 4,
    "offset": 0
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>1+1w</button>').data({
    "weeks": 1,
    "offset": 1
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>1+2w</button>').data({
    "weeks": 2,
    "offset": 1
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>1+3w</button>').data({
    "weeks": 3,
    "offset": 1
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button>1+4w</button>').data({
    "weeks": 4,
    "offset": 1
}).on('click', adtime).appendTo('#weekpicker-old');
$('<button> &Rarr; </button>').data({
    "movedays": 7
}).on('click', moveadtime).appendTo('#weekpicker-old');

selectorsToString();
var thisYear = new Date().getFullYear();
$('#daterange').daterangepicker({
    autoApply: true,
    autoUpdateInput: true,
    showDropdowns: true,
    drops: "up",
    minYear: thisYear-1,
    maxYear: thisYear+3,
    "locale": {
        "format": "D.M.YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
        ],
        "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "firstDay": 1
    }
},updateDateRange
                               );
$('[name^="date_"]').on('change', selectorsToString);
function selectorsToString() {
    $('#daterange').val(
        $('[name=date_d1]').val() +"."+
        $('[name=date_m1]').val() +"."+
        $('[name=date_y1]').val() +" - "+
        $('[name=date_d2]').val() +"."+
        $('[name=date_m2]').val() +"."+
        $('[name=date_y2]').val()
    );
}

// rename ads with proper names
if (Store.getItem(namevar)) {
    $('#adname').val(Store.getItem(namevar)).change();
}

$('input[name=url1]').on('change', function() {
    nameFromURL();
});
nameFromURL();
function nameFromURL() {
    let adurl = $('input[name=url1]').val();
    let [name,area] = urltoname(adurl);
    if (name) {
        let namef = fancy(name.toUpperCase());
        if (! $('#adname').val()) $('#adname').val(`${name} ${area}`).change();
        if (! $('[name=text1]').val()) $('[name=text1]').val(namef);
    }
}
function urltoname(url) {
    let name;
    let area;
    let matches;
    if (url && url.length && (matches = url.match(/\/\/([a-z0-9]+)\.[a-z]+\/[a-z]{2,6}\/(.*)-/))) {
        name = matches[2];
        area = matches[1].replace(/^(.).+(..)$/,"$1$2").toUpperCase();
    }
    return [name,area];
}
function fancy(string,font=defaultfont) {
    if (!string.length) return;
    let out = "";
    for (const letter of string) {
        out += chmap?.[letter] ? chmap[letter][font] : letter;
    }
    return out;
}

var adFilter = $('<li id="adfilter"></li>').append($('<input name="adfilter" autocomplete="off" placeholder="Filter by name">'));
$('ul.dropdown-menu[role="menu"]').last().prepend(adFilter);
$(adFilter).on('click', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
});
$(adFilter).find('input[name="adfilter"]').on('keyup change', function(ev) {
    var string = $(ev.target).val();
    $('ul.dropdown-menu[role="menu"] li a').each(function() {
        if ($(this).find('span').text().match(new RegExp(string, 'i'))) {
            $(this).removeClass('disabled').show();
        } else {
            $(this).addClass('disabled').hide();
        }
    });
});

$(document).bind('keyup', 'a', function() {
    $('#wrap > div.container > div:nth-child(1) > div > div:nth-child(3) > button').trigger("click");
    $('input[name="adfilter"]').val("").focus();
});

setInterval(function(){
    if ($('#adfilter').is(':visible')) {
        $('input[name="adfilter"]').focus();
    }
}, 500);

$('ul.dropdown-menu[role="menu"] li a').each(function() {
    var txt = $(this).text();
    var link = $(this).attr('href');
    var size;
    size = link.match(/size=(\d+)/);
    var number;
    if (number=txt.match(/Banner number (\d+)/)) {
        $(this).data('adnumber',number[1]);
        if (Store.getItem('name-'+size[1]+"-"+number[1])) {
            $(this).html(number[1]+ ' <span class="adnamemenu">'+Store.getItem('name-'+size[1]+"-"+number[1])+"</span>");
        } else {
            $(this).html(number[1]+ ' (empty)').parent().addClass('empty-banner');
        }
    }
});

$('.spacelist input').on('change', function(ev) {
    hilite_spacelist($('.spacelist'));
});

unsafeWindow.importJSON = function(text) {
    try {
        var obj = JSON.parse(text);
    } catch (e) {
        $('#jsonPaste').val('').attr('placeholder',"Invalid JSON! Paste JSON data here!");
        return false;
    }
    Store.clear();
    $.each(obj,function(idx,val) {
        Store.setItem(idx,val);
    });
    unsafeWindow.$('#myModal').modal('hide');
    updateAdNames();
    return true;
}

unsafeWindow.announce = function(overview) {
    let now = new Date();

    if (now.getDay() >= 4) now.setDate(now.getDate() + 7); // from Thursday, go to next week
    let weekstart = new Date(now.setDate(now.getDate() + 1 - now.getDay())); // This Monday
    let weekend = new Date(now.setDate(now.getDate() + 6 - now.getDay())); // Next Saturday

    weekstart.setHours(0);
    weekstart.setMinutes(0);
    weekstart.setSeconds(0);
    weekend.setHours(23);
    weekend.setMinutes(59);
    weekend.setSeconds(59);

    let text = {};
    let htmltext = {};
    let firstdomain;
    let adcounter = [];
    $(overview)
    .find('.overviewentry')
    .not('.loadme')
    .not('.loading')
    .not('.inactive')
    .not('.disabled')
    .not('.empty')
    .not('.failed').each(function(id,el) {
        let adstart = new Date($(el).data('startdate'));
        let adend = new Date($(el).data('enddate'));
        if (adstart < weekend && adend > weekstart) {
            // console.log(this, adstart, adend);
            // let name = $(el).data('name');
            let target = $(el).data('targeturl');
            target = target.replace(/\?mtm_campaign=.*/,'');
            target += urlParm;
            let img = $(el).find('img').attr('src');
            let domain = target.match(/^https?:\/\/(.*?)\//)[1];
            if (! firstdomain) firstdomain = domain;
            if (domain.match(/^h....-test-forum\./i)) domain = firstdomain;
            let adno = $(el).find('a').attr('href').match(/ad_n=(\d+)/)[1];
            if (adno >= ladMinNo) domain = "ladisha.de";
            if (! text[domain]) text[domain] = "";
            if (! htmltext[domain]) htmltext[domain] = "";
            if (! adcounter[domain]) adcounter[domain] = 0;
            // if (adcounter[domain] >= 5) {
            //     adcounter[domain] = 0;
            //     text[domain] += "\n";
            //     htmltext[domain] += "<br>";
            // }
            text[domain] += `[URL="${target}"][IMG]${img}[/IMG][/URL] `;
            htmltext[domain] += `<a href="${target}"><img src="${img}"></a> `;
            adcounter[domain]++;
        }
    });

    let start = weekstart.toLocaleDateString("de-de");
    let end = new Date(weekend);
    end.setDate(weekend.getDate() + 1);
    end = end.toLocaleDateString("de-de");

    $('#announcepreview').remove();
    $('#overview-tools').after('<div id="announcepreview"></div>');

    let announcement = `[SIZE="3"]Diese Woche anwesend (${start} – ${end}):[/SIZE]\n\n`;
    $('#announcepreview').append(`<div style="font-size:110%;">Diese Woche anwesend (${start} – ${end}):</div>`);
    let domains = Object.keys(text).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

    for (let domain of domains) {
        console.log(domain);
        let header = domain.charAt(0).toUpperCase() + domain.slice(1);
        announcement += `[SIZE="4"][B][URL="https://${domain}"][COLOR="#11aac1"]${header}[/COLOR][/URL][/B][/SIZE]\n\n`;
        announcement += text[domain];
        announcement += "\n\n";
        $('#announcepreview').append(`<div style="font-size:130%;font-weight:bold;color:#11aac1;"><a href="https://${domain}">${header}</a></div>`);
        $('#announcepreview').append(htmltext[domain]);
    }

    console.log($('#announcepreview').html());


    navigator.clipboard.writeText(announcement);
    /*    adno: "186"
dateStart: "2010-11-30"
enabled: "1"
enddate: "2010-11-30"
link: "https://bd742.com/user.php?action=ad_edit&size=13&ad_n=186"
name: ""
startdate: "2010-11-30"
targeturl: ""
text: ""
  */
}

unsafeWindow.cleanNames = function(overview) {
    var sizepar = (location.href.match(/size=(\d+)/))[1];
    var all = $(overview)
    .find('.overviewentry')
    .not('.loadme')
    .not('.loading')
    .not('.failed');
    var total = all.length;
    $(all).each(function(id,el) {
        $(el).addClass('loading');
        window.setTimeout(function() {
            let key = 'name-'+sizepar+'-'+$(el).data('adno');
            if ($(el).data('adurl') || $(el).data('adtext')) {
                // get name from URL
                let url = $(el).data('adurl');
                let [name,area] = urltoname(url);
                if (name) {
                    name = `${name} ${area}`;
                }
                if (! name && $(el).data('adtext')) {
                    name = ($(el).data('adtext').match(/^(\S+)/))[1];
                }
                if (name) {
                    Store.setItem(key,name);
                    updateAdNames();
                }
            }
            if ($(el).data('adtext') === undefined && $(el).data('adurl') === undefined) {
                if ($(el).data('name') !== undefined && $(el).data('name') != "") {
                    // remove it
                    Store.setItem(key,"");
                    updateAdNames();
                }
            }
            $(el).removeClass('loading');
        }, 0);
    });
}
function hilite_spacelist(spacelist) {
    $(spacelist).children('label:has(input:checked)').addClass('selected');
    $(spacelist).children('label:not(:has(input:checked))').removeClass('selected');
}
function hilite_enabled() {
    var box = $('input[name=enabled]');
    if ($(box).is(':checked')) {
        $(box).removeClass('disabled')
    } else {
        $(box).addClass('disabled')
    }
}

hilite_spacelist($('.spacelist'));
var adList = [];
var openXHR = 0;
var fetchInterval;
unsafeWindow.checkStatus = function(overview) {
    $(overview).find('a').each(function(idx,element) {
        var url = $(element).attr('href');
        if (url && url.match(/action=ad_edit/)) adList.push([element,$(element).attr('href')]);
    });
    var timeout = parseInt(1000/xrps);
    fetchInterval = setInterval(getRemainingAdData, timeout);
}
unsafeWindow.loadImages = function(overview) {
    $(overview).find('div.overviewentry').each(function(idx,element) {
        var url = $(element).data('imagesrc');
        if (url) {
            $(element).find('img').remove();
            $('<img src="'+url+'">').appendTo(element);
        }
    });
}
unsafeWindow.printOverview = function(overview) {
    $('body').html($('#overview'));
    $('#overview span').remove();
    $('div#overview').css('column-count','6');
}
unsafeWindow.tableOverview = function(overview) {
    var otable=$('<table id="overviewtable"></table>');
    $(overview).find('div.overviewentry').each(function(i,el) {
        $('<tr class="clickable">'
          +'<td>'+$(el).data('adno')+'</td>'
          +'<td>'+$(el).data('name')+'</td>'
          +'<td>'+$(el).data('adtext')+'</td>'
          +'<td>'+$(el).data('adurl')+'</td>'
          +'<tr>')
            .addClass($(el).attr('class')).on('click', function() {
        }).appendTo(otable);
    });
    $(overview).replaceWith(otable);
}

unsafeWindow.getRemainingAdData = function() {
    var me;
    if (openXHR >= maxXHR) return;
    if (me = adList.shift()) {
        getAdData(me);
    } else {
        clearInterval(fetchInterval);
        $('#overview-tools a.btn').removeClass("disabled");
    }
}

unsafeWindow.getAdData = function(me) {
    var el = me[0];
    var url = me[1];
    $(el).parent().append(' <span class="date">loading</span>');
    $(el).closest('div').removeClass('loadme').addClass('loading');
    (function(element,URL) {
        openXHR++;
        $.get(URL,function(data) {
            var entry = $(element).closest('div');
            $(entry).removeClass('loading');
            const htmlDoc = new DOMParser().parseFromString(data,'text/html');

            var enabled = $(htmlDoc).find('[name=enabled]').prop('checked')
            $(entry).data('enabled',enabled?'1':'');

            var imagesrc = $(htmlDoc).find('#myform table img:last').attr('src');
            if (imagesrc && imagesrc.length && imagesrc.length > 2) {
                $(entry).data('imagesrc',imagesrc);
            } else {
                $(entry).addClass('empty');
            }
            var adURL =  $(htmlDoc).find('[name=url1]').val();
            if (adURL) $(entry).data('adurl',adURL);
            var adText =  $(htmlDoc).find('[name=text1]').val();
            if (adText) $(entry).data('adtext',adText);

            var dateStartStr = $(htmlDoc).find('[name=date_y1]').val()+'-'+
                ("00" + $(htmlDoc).find('[name=date_m1]').val()).slice(-2)+'-'+
                ("00" + $(htmlDoc).find('[name=date_d1]').val()).slice(-2);
            var dateEndStr = $(htmlDoc).find('[name=date_y2]').val()+'-'+
                ("00" + $(htmlDoc).find('[name=date_m2]').val()).slice(-2)+'-'+
                ("00" + $(htmlDoc).find('[name=date_d2]').val()).slice(-2);

            if (dateStartStr.match(/^\d/)) {
                var dateStart = new Date(dateStartStr).setHours(0,0,0,0);
                $(entry).data('dateStart',dateStartStr);
                var dateEnd = new Date(dateEndStr).setHours(23,59,59,999);
                $(entry).data('dateStart',dateEndStr);

                var today = new Date();

                $(entry).find('span.date').html(dateStartStr + '–' + dateEndStr);
                if (!enabled) $(entry).addClass('disabled');

                if (enabled && today >= dateStart && today <= dateEnd) {
                    $(entry).addClass('active');
                } else if (today <= dateStart) {
                    $(entry).addClass('planned');
                } else {
                    $(entry).addClass('inactive');
                }
            } else {
                $(entry).find('span.date').html('[n/a]');
                console.error(data);
            }
            let adplaces = [];
            $(htmlDoc).find("input[name='cats[7][]']:checked").each(function(idx,elem) {
                let id = $(elem).val();
                let label = $(elem)[0].nextSibling.nodeValue
                let banner;
                if (label) {
                    banner = label.match(/^(B +)(\d+)/);
                    if (banner.length) banner = banner[2];
                }
                adplaces.push({
                    'bannerid': id,
                    'label': label,
                    'banner': banner
                });
            });
            // console.log("adplaces: ",adplaces);
            let bannerplace = adplaces.map(function(el) {
                return el['banner'];
            }).join(', ');
            $(entry)
                .data("targeturl",adURL)
                .data("text",adText)
                .data("startdate",dateStartStr)
                .data("enddate",dateEndStr)
                .data("banner",adplaces)
                .find('.detail').html(
                    (imagesrc ? `<img src="${imagesrc}">` : '')
                    +`<div>${adText}</div>`
                    +`<div><a href="${adURL}">${adURL}</a></div>`
                    +`<span class="bannerplace">${bannerplace}</span>`
                );
            if (special_banners.includes(Number(bannerplace))) {
                $(entry).find(".bannerplace").addClass("special");
            }
            if (! regular_banners.includes(Number(bannerplace))) {
                $(entry).find(".bannerplace").addClass("nonstandard");
            }
            countOverview();
            overviewProgress();
            filterOverview($(element).closest('div'));
        }).fail(function() {
            $(element).closest('div').removeClass('loading').addClass('failed');
            console.error("failed!",element);
        }).then(function() {
            openXHR--;
        });
    })(el,url);

}
unsafeWindow.openqaz = function() {
    window.open('https://qaz.wtf/u/convert.cgi?text='+ $('#adname').val() +'%20'+$('#adname').val().toUpperCase());
}
function adtime(ev) {
    ev.preventDefault();
    let tg = ev.target;
    let weeks = $(tg).data("weeks");
    if (weeks <= 1) weeks = 1;
    let offset = $(tg).data("offset");
    let startday = 1; // mon
    if ($('input[name=url1]').val().match(/19\.de/)) startday = 0; // sun
    var dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
    };
    let start = new Date();
    start.setDate(start.getDate() + (startday + 7 - start.getDay()) % 7 + (offset * 7));
    let end = new Date(start);
    end.setDate(start.getDate() + (weeks * 7) - 1);
    $('#daterange').data('daterangepicker').setStartDate(start.toLocaleDateString('de-DE',dateOptions));
    $('#daterange').data('daterangepicker').setEndDate(end.toLocaleDateString('de-DE',dateOptions));
    updateDateRange($('#daterange').data('daterangepicker').startDate,$('#daterange').data('daterangepicker').endDate);
}
function week_drag_start(ev) {
    ev.preventDefault();
    mousebutton_pressed = true;
    $('#weekpicker button').removeClass("dragged");
    let tg = ev.target;
    $(tg).addClass("dragged");
}
function week_drag_stop(ev) {
    ev.preventDefault();
    mousebutton_pressed = false;
    let first = $("#weekpicker button.dragged").first();
    let last = $("#weekpicker button.dragged").last();

    let offset = $(first).data('offset');
    let weeks = $(last).data('offset') - offset +1;
    set_weeks(offset,weeks);
}

function set_weeks(offset,weeks) {
    let startday = 1; // mon
    if ($('input[name=url1]').val().match(/19\.de/)) startday = 0; // sun

    var dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
    };
    let start = new Date();
    start.setDate(start.getDate() + (startday + 7 - start.getDay()) % 7 + (offset * 7));
    let end = new Date(start);
    end.setDate(start.getDate() + (weeks * 7) - 1);
    $('#daterange').data('daterangepicker').setStartDate(start.toLocaleDateString('de-DE',dateOptions));
    $('#daterange').data('daterangepicker').setEndDate(end.toLocaleDateString('de-DE',dateOptions));
    updateDateRange($('#daterange').data('daterangepicker').startDate,$('#daterange').data('daterangepicker').endDate);
}

function moveadtime(ev) {
    ev.preventDefault();
    let tg = ev.target;
    let movedays = $(tg).data("movedays");
    var dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
    };
    let start = new Date($('#daterange').data('daterangepicker').startDate);
    start.setDate(start.getDate() + movedays);
    let end = new Date($('#daterange').data('daterangepicker').endDate);
    end.setDate(end.getDate() + movedays);
    $('#daterange').data('daterangepicker').setStartDate(start.toLocaleDateString('de-DE',dateOptions));
    $('#daterange').data('daterangepicker').setEndDate(end.toLocaleDateString('de-DE',dateOptions));
    updateDateRange($('#daterange').data('daterangepicker').startDate,$('#daterange').data('daterangepicker').endDate);
}
function addStyle() {
    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
    GM_addStyle(`
/* i really want this to be global */
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i|Roboto:400,400i,500,500i,700,700i&display=swap');

ul.dropdown-menu {
    column-gap: 4px;
    font-size: 13px;
    right: -515px;
    left: -200px;
    column-width: 120px;
    font-family: "Roboto Condensed";
}

.adnamemenu {
    font-weight: bold;
}

h1 {
    margin: 0;
    background-color: #11aac1;
    color: white;
    padding: 0 20px;
}

tr td {
    padding: 3px !important;
}

div.container div {
    padding-bottom: 0;
}

div.well {
    padding: 4px 8px;
}

.navbar {
    margin-bottom: 8px;
}

#myform>table {
    position: relative;
}

#myform>table tr {
    position: relative;
}

#myform>table tr:nth-child(-n+12) td:first-child {
    text-align: right;
    vertical-align: middle;
}

#myform>table tr:nth-child(1) {
    /* Editing...  */
    position: absolute;
    right: 20px;
    top: -43px;
    font-size: 13px;
    color: white;
}

#myform>table tr:nth-child(2) {
    /*  Approved...  */
    position: absolute;
    right: 20px;
    top: -27px;
    font-size: 13px;
    color: white;
}

#myform>table tr:nth-child(3) {
    /* thumbnail */
    position: absolute;
    right: 0px;
    top: 0px;
    transform: scale(0.7);
    display: none;
}

#myform>table tr:nth-child(8) {
    /* current banner */
    position: absolute;
    right: 0px;
    top: 0px;
    background-color:#ffffff;
}

#myform>table tr:nth-child(n+11):nth-child(-n+12) td:first-child {
    font-size: 10px;
}

#myform>table tr:nth-child(8) td a {
/* banner delete button */
    position: absolute;
    top: 0;
    right: 150px;
    width: 60px;
}

.spacelist {
    height: 280px !important;
    max-width: 765px;
    overflow: auto;
    line-height: 13px;
    column-gap: 0;
    column-width: 190px;
    column-fill: auto;
}

.container .dropdown-menu>li>a {
    line-height: 10px;
    padding: 4px;
}

input[type=checkbox] {
    margin: 0 auto !important;
}

.spacelist input[type="checkbox"] {
    transform: scale(0.8);
    margin-left: -13px !important;
    position: relative;
    top: 2px;
}

input[name=text1],
input[name=banner_uploaded],
input[name=url1] {
    width: 550px;
}

input#currentad {
    width: 50px;
    text-align: center;
}

#textpreview {
    position: absolute;
    border: none;
    width: 146px;
    height: 45px;
    overflow: hidden;
    font-family: verdana;
    font-size: 10px;
    text-align: center;
    top: 0px;
    left: 78px;
    color: #0000ff;
    background-color: #ffffff;
    resize: none;
    padding: 1px 3px 0;
}

#textpreviewcontainer {
    position: absolute;
    top: -170px;
    right: 165px;
}

.daterangepicker .today {
    background-color: #ffe840;
}

.daterangepicker td.in-range {
    background-color: #B4F0F8;
}

.daterangepicker td.start-date,
.daterangepicker td.end-date {
    background-color: #11AAC1;
}

#daterange {
    width: 170px;
}

.spacelist label {
    font-weight: normal;
    font-family: roboto;
    font-size: 12px;
    line-height: 11px;
    margin-top: -1px;
    margin-left: 14px;
    margin-right: 0px;
    margin-bottom: -1px;
    padding: 2px;
}

.spacelist .selected {
    font-weight: 700;
    background-color: #11aac1;
    color: white;
}

.adnamemenu {
    font-weight: bold;
    padding-left: 2px;
}

.tzCheckBox {
    background: no-repeat right bottom url(data:image/png;base64,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);
                                           display: inline-block;
                                           min-width: 60px;
                                           height: 33px;
                                           white-space: nowrap;
                                           position: relative;
                                           cursor: pointer;
                                           margin-left: 14px;
                                           }

.tzCheckBox.checked {
    background-position: top left;
    margin: 0 14px 0 0;
}

.tzCheckBox .tzCBContent {
    color: white;
    line-height: 31px;
    padding-right: 38px;
    text-align: right;
}

.tzCheckBox.checked .tzCBContent {
    text-align: left;
    padding: 0 0 0 38px;
}

.tzCBPart {
    background: no-repeat left bottom url(data:image/png;base64,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);
                                          width: 14px;
                                          position: absolute;
                                          top: 0;
                                          left: -14px;
                                          height: 33px;
                                          overflow: hidden;
                                          }

.tzCheckBox.checked .tzCBPart {
    background-position: top right;
    left: auto;
    right: -14px;
}

#adfilter {
    column-span: all;
    padding: 0px 6px;
}

#adfilter input[name="adfilter"] {
    box-sizing: border-box;
    width: 100%;
    line-height: initial;
    padding: 4px;
    background-color: #f2f5f7;
    border: 1px solid #aaa;
}

#overviewbutton {
    background-color: #6c456a;
}

#overview {
    padding: 8px;
    border: 1px solid gray;
    background-color: #f0f0f0;
    min-height: 150px;
    overflow: auto;
    font-size: 12px;
    column-count: 4;
    font-family: "Roboto Condensed";
}

#overview.showdetails {
    column-count: 2;
}
#overview.showdetails.table {
    column-count: 1;
    display:table;
}
#overview.showdetails.table .overviewentry {
    height:1.5em;
    display:table-row;
}
#overview.showdetails.table .overviewentry div,
    #overview.showdetails.table .overviewentry a,
        #overview.showdetails.table .overviewentry span {
            display: table-cell;
            height: 1.5em;
        }

div#overview div {
    border-radius: 3px;
    padding: 2px;
    color: rgb(51, 51, 51);
    position: relative;
    line-height: 12px;
    break-inside: avoid;
}

#overview div::after {
    position: absolute;
    right: 5px;
    top: 0;
}

.overviewentry span.date {
    font-weight: normal;
    right: 20px;
    top: 2px;
}

.overviewentry span.adno {
    width: 18px;
    display: inline-block;
    text-align: right;
}

#overview .overviewentry>a {
    color: inherit;
    max-width: 122px;
    width:100px;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
}

#overview div.active {
    background-color: #11aac1;
    color: white;
    font-weight: bold;
}

#overview div.active::after,
    #overview div.disabled::after {
        position: absolute;
        top: 2px;
        right: 4px;
    }

#overview div.disabled {
    background-color: #eaeaea;
    color: #acacac;
}


#overview div.loading {
    background-color: yellow !important;
    filter: none !important;
}

#overview div.loadme {
    background-color: #ffffeb;
    opacity: 0.15;
}

#overview div.failed {
    background-color: #772c2c;
}

#overview div.error,
    #overview div.disabled.planned {
        color: #f9430b;
        font-weight: bold;
    }

#overview div.planned {
    background-color: #c9dee1;
}


div#overview-tools {
    column-span: all;
    margin-bottom: 8px;
    padding: 2px !important;
    display: block;
}

div#overview-tools>* {
    margin: 0 10px;
    vertical-align: text-bottom;
}
#overview-tools a.btn {
    margin-right: 2px;
    margin-left: 0px;
}
div#overview-tools label {
    line-height: 44px;
}

#ads-button li.empty-banner a {
    color: #c0c0c0;
}

#ads-button li:nth-child(n+2):nth-child(-n+199) {
    border-left-width: 3px;
    border-left-style: solid;
}

#ads-button li:nth-child(n+2):nth-child(-n+101) {
    border-color: rgb(173, 20, 87);
}
#ads-button li:nth-child(n+101):nth-child(-n+150) {
    border-color: rgb(66, 133, 244);
}
#ads-button li:nth-child(n+151):nth-child(-n+199) {
    border-color: rgb(244, 81, 30);
}

#overviewtable {
    font-size: 12px;
    font-family: "Roboto Condensed";
}

.overviewentry .detail {
    display: none;
}

#overview.showdetails .overviewentry .detail {
    display: block;
    height: 105px;
}
#overview.showdetails:not(.gallery) .overviewentry .detail {
    background-color: rgba(255, 255, 255, 0.5);
}
#overview.showdetails.gallery .overviewentry .detail {
    height:174px;
}

#overview.showdetails.gallery .overviewentry .table {
    height:1.5em;
}

#overview.showdetails .overviewentry > a {
    line-height: 120%;
    max-width: initial;
}

#overview.showdetails .overviewentry > a {
    color: inherit;
    max-width: initial;
    width:100%;
}
#overview.showdetails .overviewentry .adno {
    width: 30px;
}

.detail {
    font-weight: normal;
}

#overview .detail img {
    display: block;
    height: 100px;
    float: right;
}
#overview.gallery .detail img {
    display: block;
    height: 170px;
    float: none;
}

#name_title {
    margin-left: 20px;
    font-weight: bold;
    color: #E3CBB3;
    text-shadow: 1px 1px 1px white, 1px -1px 1px white, -1px 1px 1px white, -1px -1px 1px white;
}
#overview.showdetails.gallery {
    column-count: 1;
}
#overview.gallery .overviewentry {
    display: inline-block;
    width: 116px;
    margin-left:1px;
    margin-right:1px;
}
#overview.gallery .overviewentry span,
    #overview.gallery .overviewentry .detail div {
        display: none;
    }
#overview.gallery .overviewentry.inactive .detail img {
    filter: grayscale(1);
    opacity: 0.6;
}
#overview.gallery .overviewentry.planned .detail img  {
    filter: grayscale(0.5);
    opacity: 0.8;
}

#overview .overviewentry.disabled.planned  .detail img {
    filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-55deg) saturate(700%) contrast(0.8);
}
#overview.showdetails:not(.table) .overviewentry.disabled::after,
    #overview.gallery .overviewentry.disabled::after {
        content: " ";
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='black' stroke-width='1'/><path d='M0 0 L100 100 ' stroke='black' stroke-width='1'/></svg>");
        background-repeat:no-repeat;
        background-position:center center;
        background-size: 100% 100%, auto;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
#overview .overviewentry.hidden {
    display:none;
}
#overview.table .overviewentry img {
    display: none;
}
.panel {
    position: absolute;
    top: 110px;
    right: 50px;
    left: 400px;
}
div#overview > div#announcepreview {
    background: white;
    padding: 8px;
    border: 1px solid lightgray;
    margin-bottom: 8px;
}
#overview .overviewentry .detail .bannerplace {
    position: absolute;
    top: -15px;
    right: 2px;
    font-size: 12px;
    padding: 2px 4px;
    display: block !important;
    border-radius: 2px;
}
#overview .overviewentry .detail .bannerplace.special {
    background-color: yellow;
    color: #ff8000;
}
#overview .overviewentry .detail .bannerplace.nonstandard {
    background-color: #ff8080;
    color: red;
}
#weekpicker {
    display: inline-grid;
    width: calc(100% - 210px);
    max-width: 400px;
    grid-template-columns: repeat(8, 12.5%);
    column-gap: 0;
    margin-left: 16px;
}
#weekpicker button {
    text-align: center;
    position: relative;
    border-top: none;
    border-bottom: none;
    border-right: none;
}
#weekpicker button:hover,
#weekpicker button.dragged:hover {
        background-color:#ff8000;
}
#weekpicker button.dragged {
    background-color:#ff800080;
}

#weekpicker button:last-child {
    border-right: 2px solid;
}
#weekpicker .buttondate {
    font-size: 0.7em;
    position: absolute;
    top: -15px;
    left: calc(-2px - 50%);
    width: 100%;
}
.new-datepicker {
    margin-top: 12px;
}
#weekpicker-old {
    margin-left: 170px;
    display: inline-block;
}
`);
}
