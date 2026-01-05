// ==UserScript==
// @name       RYM: Advanced collection view widget
// @namespace  https://rateyourmusic.com/~pandrew
// @version    0.6
// @description  custom filters for viewing music collections
// @match      https://rateyourmusic.com/~*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @copyright  2014+, pandy butternubs
// @downloadURL https://update.greasyfork.org/scripts/3894/RYM%3A%20Advanced%20collection%20view%20widget.user.js
// @updateURL https://update.greasyfork.org/scripts/3894/RYM%3A%20Advanced%20collection%20view%20widget.meta.js
// ==/UserScript==

widget = '<br><a id="toggle-widget" style="color: #181818;" href="javascript:void(0);">show/hide widget</a><div id="music-widget" style="text-align: left; font-size: x-small; background-color: #ffe; border: 1px solid #333; padding: 6px;">'

// rating selector
widget += 'Rating: <select name="rating" style="min-width:2em;" id="ratemin" >'

ratings = '<option value="none">--</option><option value="5.0">5</option><option value="4.5">4.5</option>'
ratings += '<option value="4.0">4</option><option value="3.5">3.5</option><option value="3.0">3</option>'
ratings += '<option value="2.5">2.5</option><option value="2.0">2</option><option value="1.5">1.5</option>'
ratings += '<option value="1.0">1</option><option value="0.5">0.5</option><option value="0.0">unrated</option></select>'

widget += ratings
widget += ' to <select name="maxrating" style="min-width:2em;" id="ratemax">'
widget += ratings

// ownership
widget += ' | Ownership: '
widget += '<select name="type" id="ownship"><option value="none">All</option><option value="oo">Owned</option>'
widget += '<option value="ow">On wishlist</option><option value="on">Not Owned</option><option value="ou">Used to Own</option></select>'

// number per page
widget += ' | Items per page: <input type="text" size="4" maxlength="4" id="perpage" name="q">'

// view type
widget += '<br><br>View style: '
widget += '<select id="viewtype"><option value="none">--</option><option value="visual">Covers only</option>'
widget += '<option value="tracks">Display tracklist column</option><option value="review">Display reviews</option>'
widget += '<option value="track_ratings">Display track ratings</option></select>'

// release type
widget += ' | Release type: '
widget += '<select id="rlstype"><option value="none">All</option><option value="typs">Album</option>'
widget += '<option value="type">EP</option><option value="typc">Compilation</option><option value="typi">Single</option>'
widget += '<option value="typd">Video</option><option value="typb">Bootleg</option></select>'

// search terms
widget += '&nbsp;|&nbsp;Search terms: &Tab;<input type="text" size="15" id="srchquery" name="q"> &Tab;'
widget += '<select id="srchtype"><option value="a">Artist</option><option value="l">Release</option>'
widget += '<option value="q">Review</option><option value="g">Tag</option><option value="b">Label</option><option value="h">Genres</option><option value="relyear">Release Year</option></select>'

// end
widget += '&Tab;<input type="submit" id="gobtn" value="GO>"></div><br><br>'

music_header = 'music'

// $('.bubble_header:contains("'+music_header+'")').after(widget)

$('a[href="/collection/'+document.URL.split('~')[1]+'/"]').parent().after(widget);

// https://rateyourmusic.com/collection/<username>/<options>
// https://rateyourmusic.com/collection/<username>/strm_<searchtype>,<options>/<searchquery>/1

$('#toggle-widget').bind('click', function(){$('#music-widget').toggle()})
$('#music-widget').toggle()

$('#gobtn').bind('click', function(){
    username = document.URL.split('~')[1]
    options = ''

    
    if ($('#perpage').val() != '' && !isNaN($('#perpage').val())){
        options += ',n'+$('#perpage').val();
    }
   
    if ($('#rlstype').val() != 'none'){
        options += ','+$('#rlstype').val();
    }
    
    if ($('#ratemin').val() != 'none' || $('#ratemax').val() != 'none'){
        rating = [$('#ratemin').val(), $('#ratemax').val()]
        rating.sort()
        options += ',r'+rating[0]
        if (rating[1] != 'none' && rating[1] != rating[0]){
            options += '-'+rating[1];
        }
    }
    
    if ($('#ownship').val() != 'none'){
        options += ','+$('#ownship').val();
    }

    
    if ($('#srchquery').val() != ''){
        if ($('#viewtype').val() != 'none'){
        viewtype = $('#viewtype').val()+',';
        } else {viewtype = ''} 

        window.location = 'https://rateyourmusic.com/collection/'+username+'/'+viewtype+'strm_'+$('#srchtype').val()+','+options+'/'+$('#srchquery').val()+'/1'
    } else{
        if ($('#viewtype').val() != 'none'){
        	options = $('#viewtype').val() + options;
    	}
        window.location = 'https://rateyourmusic.com/collection/'+username+'/'+options
    }

})

