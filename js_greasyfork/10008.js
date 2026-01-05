// ==UserScript==
// @name        Torrent Moving Helper [KAT][SU+]
// @namespace   pxgamer
// @description Helps moving torrents by setting (not moving to) the right category for all torrents on a page
// @include     *kat.cr/usearch/*
// @include     *kat.cr/search/*
// @include     *kat.cr/user/*/uploads/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     3.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10008/Torrent%20Moving%20Helper%20%5BKAT%5D%5BSU%2B%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/10008/Torrent%20Moving%20Helper%20%5BKAT%5D%5BSU%2B%5D.meta.js
// ==/UserScript==

let i=0;

let list = '<select id="torrent-category-picker"><option value="0,0">Auto (deactivated for the moment)</option><option value="21,0">TV</option><option value="2,18">Movies > 3D Movies</option><option value="2,19">Movies > Music videos</option><option value="2,20">Movies > Movie clips</option><option value="2,22">Movies > Handheld</option><option value="2,69">Movies > iPad</option><option value="2,23">Movies > Highres Movies</option><option value="2,80">Movies > UltraHD</option><option value="2,24">Movies > Bollywood</option><option value="2,62">Movies > Concerts</option><option value="2,63">Movies > Dubbed Movies</option><option value="2,64">Movies > Asian</option><option value="2,46">Movies > Documentary</option><option value="2,47">Movies > Trailer</option><option value="2,25">Movies > Other Movies</option><option value="4,31">Games > PC</option><option value="4,32">Games > Mac</option><option value="4,94">Games > Linux</option><option value="4,33">Games > PS2</option><option value="4,34">Games > XBOX360</option><option value="4,74">Games > Xbox ONE</option><option value="4,35">Games > Wii</option><option value="4,36">Games > Handheld</option><option value="4,40">Games > NDS</option><option value="4,44">Games > PSP</option><option value="4,45">Games > PS3</option><option value="4,77">Games > PS4</option><option value="4,76">Games > PS Vita</option><option value="4,58">Games > iOS</option><option value="4,59">Games > Android</option><option value="4,37">Games > Other Games</option><option value="3,26">Applications > Windows</option><option value="3,27">Applications > Mac</option><option value="3,28">Applications > UNIX</option><option value="3,78">Applications > Linux</option><option value="3,60">Applications > iOS</option><option value="3,61">Applications > Android</option><option value="3,29">Applications > Handheld</option><option value="3,30">Applications > Other Applications</option><option value="12,49">Music > Mp3</option><option value="12,75">Music > AAC</option><option value="12,15">Music > Lossless</option><option value="12,72">Music > Transcode</option><option value="12,73">Music > Soundtrack</option><option value="12,82">Music > Radio Shows</option><option value="12,87">Music > Karaoke</option><option value="12,16">Music > Other Music</option><option value="9,38">Books > Ebooks</option><option value="9,39">Books > Comics</option><option value="9,50">Books > Magazines</option><option value="9,51">Books > Textbooks</option><option value="9,53">Books > Fiction</option><option value="9,54">Books > Non-fiction</option><option value="9,13">Books > Audio books</option><option value="9,56">Books > Academic</option><option value="9,79">Books > Poetry</option><option value="9,80">Books > Newspapers</option><option value="9,52">Books > Other Books</option><option value="7,48">Anime > Other Anime</option><option value="7,85">Anime > Anime Music Video</option><option value="7,84">Anime > English-translated</option><option value="6,65">XXX > Video</option><option value="6,70">XXX > HD Video</option><option value="6,89">XXX > UltraHD</option><option value="6,66">XXX > Pictures</option><option value="6,67">XXX > Magazines</option><option value="6,68">XXX > Books</option><option value="6,43">XXX > Hentai</option><option value="6,83">XXX > Games</option><option value="6,17">XXX > Other XXX</option><option value="5,8">Other > Pictures</option><option value="5,14">Other > Sound clips</option><option value="5,41">Other > Covers</option><option value="5,42">Other > Wallpapers</option><option value="5,71">Other > Tutorials</option><option value="5,81">Other > Subtitles</option><option value="5,88">Other > Fonts</option><option value="5,55">Other > Unsorted</option></select>';
let list2 = '<select id="torrent-torType-picker" style="width: 160px;"><option value="torType">Any torType</option> <option value="zipType">zipType</option> <option value="pictureType">pictureType</option> <option value="folderType">folderType</option> <option value="musicType">musicType</option> <option value="flashType">flashType</option> <option value="exeType">exeType</option> <option value="filmType">filmType</option> <option value="txtType">txtType</option> <option value="pdfType">pdfType</option> <option value="nfoType">nfoType</option> <option value="undefinedType">undefinedType</option></select>';
let cats = '<select class="shortinput" id="categoryId_<id>" name="categoryId" onchange="getSubcategory(<id>);"><option value="21">tv</option><option value="2" selected="selected">movies</option><option value="4">games</option><option value="3">applications</option><option value="12">music</option><option value="9">books</option><option value="7">anime</option><option value="6">xxx</option><option value="5">other</option></select>';
let subcats = ['',
               '',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="18">3D Movies</option><option value="19">Music videos</option><option value="20">Movie clips</option><option value="22">Handheld</option><option value="69">iPad</option><option value="23">Highres Movies</option><option value="90">UltraHD</option><option value="24">Bollywood</option><option value="62">Concerts</option><option value="63">Dubbed Movies</option><option value="64">Asian</option><option value="46">Documentary</option><option value="47">Trailer</option><option value="25">Other Movies</option></select>',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="26">Windows</option><option value="27">Mac</option><option value="28">UNIX</option><option value="78">Linux</option><option value="60">iOS</option><option value="61">Android</option><option value="29">Handheld</option><option value="30">Other Applications</option></select>',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="31">PC</option><option value="32">Mac</option><option value="94">Linux</option><option value="33">PS2</option><option value="34">XBOX360</option><option value="74">Xbox ONE</option><option value="35">Wii</option><option value="36">Handheld</option><option value="40">NDS</option><option value="44">PSP</option><option value="45">PS3</option><option value="77">PS4</option><option value="76">PS Vita</option><option value="58">iOS</option><option value="59">Android</option><option value="37">Other Games</option></select>',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="8">Pictures</option><option value="14">Sound clips</option><option value="41">Covers</option><option value="42">Wallpapers</option><option value="71">Tutorials</option><option value="81">Subtitles</option><option value="88">Subtitles</option><option value="55">Unsorted</option></select>',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="65">Video</option><option value="70">HD Video</option><option value="89">UltraHD</option><option value="66">Pictures</option><option value="67">Magazines</option><option value="68">Books</option><option value="43">Hentai</option><option value="83">Games</option><option value="17">Other XXX</option></select>',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="48">Other Anime</option><option value="85">Anime Music Video</option><option value="84">English-translated</option></select>',
               '',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="38">Ebooks</option><option value="39">Comics</option><option value="50">Magazines</option><option value="51">Textbooks</option><option value="53">Fiction</option><option value="54">Non-fiction</option><option value="13">Audio books</option><option value="56">Academic</option><option value="79">Poetry</option><option value="80">Newspapers</option><option value="52">Other Books</option></select>',
               '',
               '',
               '<select class="shortinput" name="sub_cat" id="sub_cat_<id>"><option value="49">Mp3</option><option value="75">AAC</option><option value="15">Lossless</option><option value="72">Transcode</option><option value="73">Soundtrack</option><option value="82">Radio Shows</option><option value="87">Karaoke</option><option value="16">Other Music</option></select>',
               '',
               '',
               '',
               '',
               '',
               '',
               '',
               '',
               ' '];

$('table#mainSearchTable, table.data').last().before('<div class="buttonsline"><a class="postLink icon16 textButton torrent-moving-helper"><span></span>Torrent Moving Helper</a>'+
                                                     '</div><div style="display:none;" id="helper-settings">'+
                                                     '<style>#tmh-options td {border-right: 4px solid transparent;}</style>'+
                                                     '<table id="tmh-options"><tbody>'+
                                                       '<tr>'+
                                                         '<th><div class="lightgrey font11px">Set the following torrents to be moved to:</div></th>'+
                                                         '<th><div class="lightgrey font11px">Only allow this torType:</div></th>'+
                                                         '<th><div class="lightgrey font11px">Allow:</div></th>'+
                                                       '</tr>'+
                                                       '<tr>'+
                                                         '<td>'+list+'</td>'+
                                                         '<td>'+list2+'</td>'+
                                                         '<td><select id="torrent-choose-specific" style="width: 150px;"><option val="Any">Any</option><option val="Ones not set">Ones not set</option><option val="Ones that are set">Ones that are set</option></select></td>'+
                                                       '</tr>'+
                                                     '</tbody></table>'+
                                                     '<div class="buttonsline"><a class="postLink icon16 icheck textButton torrent-moving-start"><span></span>Begin</a></div></div>');

$(document).delegate('.torrent-moving-helper', 'click', function() {
  $('#helper-settings').toggle();
}); 


let hash = window.location.hash;
if (hash.length > 0) {
  $('#torrent-category-picker').val(hash.split('#')[1]);
  $('#torrent-torType-picker').val(hash.split('#')[2]);
  $('#torrent-choose-specific').val(hash.split('#')[3]);
}
let title = document.title;
let count = 0;
let numOf = 0;

$(document).delegate('.torrent-moving-start', 'click', function() {
  setUpTorrents($(this));
}); 
function setUpTorrents(button) {
  i = 0;
  button.html('<span></span>Update');
  
  
  let num = $('#torrent-category-picker').val().split(',')[0];
  let num2 = $('#torrent-category-picker').val().split(',')[1];
  let template = subcats[num];
  let catnew = $('#torrent-category-picker :selected').text();
  $('table:last').prepend('<style>.block {display: block !important;}</style>');
  $('table:last tr:not(.firstr)').each(function() {
    let specificChosen = false;
    if (($('#torrent-choose-specific :selected').val()=='Ones not set' && $('[id^="categoryId_"]', $(this)).length == 0)||($('#torrent-choose-specific :selected').val()=='Ones that are set' && $('[id^="categoryId_"]', $(this)).length == 1)||$('#torrent-choose-specific :selected').val()=='Any') {
      specificChosen = true; 
    }
    
    
    if ($('[id^="cat_"]', $(this)).first().text() != catnew && $('.markeredBlock', $(this)).is('.'+$('#torrent-torType-picker').val()) && specificChosen) {
      let id = $('[id^="cat_place_"]', $(this)).attr('id').split('_')[2];
      let temptemplate = template.replace('<id>', id);
      let all = '<div style="padding-top: 5px;">'+cats.split('<id>').join(id)+' <span id="sub_span_'+id+'">'+temptemplate+'</span> <button class="siteButton bigButton saveCategoryButton" onclick="setCategory(\''+id+'\');"><span>save</span></button> <a class="torrent-cancel-move" title="Don\'t move this torrent"><i class="ka ka16 ka-delete ka-red"></i></a></div>';
      $('#cat_place_'+id).html(all);
      $('#categoryId_'+id).val(num);
      $('#sub_cat_'+id).val(num2);
      
      numOf++;
    }
  });
  document.title = '['+count+'/'+numOf+'] '+title;
  changePages();
}

function changePages() {
  let param = '#'+$('#torrent-category-picker option:selected').val()+
              '#'+$('#torrent-torType-picker option:selected').val()+
              '#'+$('#torrent-choose-specific option:selected').val();
  $('.pages .turnoverButton:not(.active, .nohov)').each(function() {
    let orig = $(this).attr('href').split('#')[0];
    $(this).attr('href', orig+param);
  });
}

$(document).delegate('[id^="cat_place_"] .bigButton', 'click', function() {
  $(this).removeClass('saveCategoryButton');
  count++;
  document.title = '['+count+'/'+numOf+'] '+title;
});
