// ==UserScript==
// @name         Favs 4 ever
// @namespace    Fabi
// @version      0.2
// @description  Shouts Favoritos en todas tus cuentas de Taringa
// @author       Naoko-
// @include        http*://www.taringa.net/mi
// @downloadURL https://update.greasyfork.org/scripts/15774/Favs%204%20ever.user.js
// @updateURL https://update.greasyfork.org/scripts/15774/Favs%204%20ever.meta.js
// ==/UserScript==

//Lugar donde guardamos

GetShouts = function(){
    if(localStorage.favsForever == null)
        return [];
    
    return JSON.parse(localStorage.favsForever);
};

SetShouts  = function(obj){
    localStorage.setItem('favsForever', JSON.stringify(obj));
};

var buttonFav = '<div class="require-login button-action-s hastipsy pointer favsforever nofaved" title="Favoritos"><i class="icon favorite" style="margin-left:6px!important"></i></div>';
var buttonView='<li><a class="favsforever" href="#" title="Tu vieja">Mis Favs</a></li>';
var styleSheet='.favsforever.faved .icon {opacity: 1;background-position: -81px -175px;}';

$('head').append('<style>' + styleSheet + '</style>');
$('#Feed-controls-mi ul').append(buttonView);
$('.shout-footer .s-action-list').prepend(buttonFav);
$('.favsforever').tipsy();
$('.activity-element').addClass('fadded');

$('body').on('click', '.button-action-s.faved.favsforever',function(e){
    e.preventDefault();
    e.stopPropagation();    
    var $then = $(this);
    var myId = $then.closest('.s-action-list').attr('data-id');
    var shouts = GetShouts();
    for(a=0;a<shouts.length;a++){
        if(shouts[a].id==myId){
            shouts.splice(a,1);
            SetShouts(shouts);
            if($then.hasClass('faved')){
                $then.removeClass('faved');
                $then.addClass('nofaved');
            }
            return;
        }  
    }
});

$('body').on('click', '.button-action-s.nofaved.favsforever',function(){
    var obj = {};
    var objs = GetShouts();
    var $then = $(this);
    
    var body = $then.closest('.activity-element').get(0).outerHTML;
    var sId = $then.closest('.s-action-list').attr('data-id');
    
    for(a=0;a<objs.length;a++){
        if(objs[a].id==sId){
            return;
        }
    }
    
    obj.id=sId;
    obj.body=body;
    
    objs.push(obj);
    SetShouts(objs);
    
    if($then.hasClass('nofaved')){
        $then.removeClass('nofaved');
        $then.addClass('faved')
    }
    
});

$(document.body).on('click','a.favsforever', function(ev){
    
    ev.preventDefault();
    ev.stopPropagation();
    var $then = $(this);
    
    $('.Feed-load').removeClass('active');
    $then.addClass('active');
    Feed2.setConfig('lastId',false)
    var feed=GetShouts();

    $('#Feed-list').html('');
    for(a=0;a<feed.length;a++){
        var $shout = $(feed[a].body).removeClass('unread');
        $shout.find('.button-action-s.favsforever').removeClass('nofaved');
        $shout.find('.button-action-s.favsforever').addClass('faved');
        $shout.find('.s-delete').remove();
        $('#Feed-list').prepend($shout);
    }
    $('#Feed-list').prepend('<button class="btn a fExport" style="margin-left: 90px;">Exportar</button><button class="btn a fImport">Importar</button><input type="file" id="ffImport" style="display:none">');
    $(document).scrollTo($('#main-col'), 100);
});

$("body").on('click','.Feed-load',function(){
    var $then = $(this);
    $then.addClass('active');
    $('a.favsforever').removeClass('active');
});

$(document).ajaxSuccess(function(event,jqXHR,settings){
    if(settings.url.indexOf('ajax/feed/fetch')>-1){
        $('.activity-element').each(function(){
            var $then = $(this);
            if($then.hasClass('fadded')){
                return true; //skip
            }
            $then.addClass('fadded');
            
            $then.find('.shout-footer .s-action-list').prepend(buttonFav);
        });
    }
});

$("body").on('click','.fExport',function(){
    var shouts = GetShouts();
    var shoutsStr = JSON.stringify(shouts);
    download(shoutsStr,'Favoritos Taringa','text/plain');
});

$("body").on('click','.fImport',function(){
    //mydialog.confirm('Algunos archivos pueden ser maliciosos, no importe Archivos de favoritos de personas ajenas ya que puede comprometer su cuenta de Taringa!.','Atención');
    var ok = confirm('======={ ¡Atención! }=======\n\nAlgunos archivos pueden ser maliciosos, no importe Archivos de favoritos de personas ajenas ya que puede comprometer su cuenta de Taringa!'); //Tu puta madre seguridado
    if(ok)
        $('#ffImport').click();
});

function openDlg(){
    //document.getElementById('ffImport').click();
   $('#ffImport').click();
}

//http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(text, name, type) {
  var a = document.createElement("a");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
}

//http://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript

$('body').on('change','#ffImport', function(evv){
    readSingleFile(evv);
});

function readSingleFile(e) {
    
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents);
        
    };
    reader.readAsText(file);
}

function displayContents(contents) {
    var localShouts = GetShouts();
    var extShouts = JSON.parse(contents);
    extShouts.concat(localShouts);
    console.log(extShouts);
    SetShouts(extShouts);

    //Show again
    $('#Feed-list').html('');
    for(a=0;a<extShouts.length;a++){
        var $shout = $(extShouts[a].body).removeClass('unread');
        $shout.find('.button-action-s.favsforever').removeClass('nofaved');
        $shout.find('.button-action-s.favsforever').addClass('faved');
        $shout.find('.s-delete').remove();
        $('#Feed-list').prepend($shout);
    }
    $('#Feed-list').prepend('<button class="btn a fExport" style="margin-left: 90px;">Exportar</button><button class="btn a fImport">Importar</button><input type="file" id="ffImport" style="display:none">');
    $(document).scrollTo($('#main-col'), 100);
}
