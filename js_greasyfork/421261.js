// ==UserScript==
// @name         RYM: Advanced collection view widget 2
// @namespace    https://rateyourmusic.com/~pandrew
// @version      1.1
// @description  updated version of "andrew 3"'s script, fixed fixed for new rym and expanded functionality
// @match        https://rateyourmusic.com/~*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @copyright    2014+, pandy butternubs
// @downloadURL https://update.greasyfork.org/scripts/421261/RYM%3A%20Advanced%20collection%20view%20widget%202.user.js
// @updateURL https://update.greasyfork.org/scripts/421261/RYM%3A%20Advanced%20collection%20view%20widget%202.meta.js
// ==/UserScript==

$(document).ready(function(){

    username = document.URL.split('~')[1];
    
    widget = '<br>&nbsp;&nbsp;&nbsp;<b>Search '+username+'\'s music for...</b><div id="music-widget" style="text-align: left; font-size: small; border: 1px solid #333; padding: 10px;">';

    // rating selector
    widget += 'Rating: <select name="rating" style="min-width:2em;" id="ratemin" >';

    ratings = '<option value="none">--</option><option value="5.0">5</option><option value="4.5">4.5</option>';
    ratings += '<option value="4.0">4</option><option value="3.5">3.5</option><option value="3.0">3</option>';
    ratings += '<option value="2.5">2.5</option><option value="2.0">2</option><option value="1.5">1.5</option>';
    ratings += '<option value="1.0">1</option><option value="0.5">0.5</option><option value="0.0">unrated</option></select>';

    widget += ratings;
    widget += ' to <select name="maxrating" style="min-width:2em;" id="ratemax">';
    widget += ratings;

    // ownership
    widget += ' | Ownership: ';
    widget += '<select name="type" id="ownship"><option value="none">All</option><option value="oo">Owned</option>';
    widget += '<option value="ow">On wishlist</option><option value="on">Not Owned</option><option value="ou">Used to Own</option></select>';

    // number per page
    widget += ' | Items per page: <input type="text" size="4" maxlength="4" id="perpage" name="q">';

    // sorting
    widget += ' | Sort by: <select id="jrscript-sortby">'
    widget += '<option value="a">Artist</option>'
    widget += '<option value="e">Release Date</option>'
    widget += '<option value="l">Title</option>'
    widget += '<option value="r">Rating</option>'
    widget += '<option value="d">Rated Date</option>'
    widget += '<option value="t">Color</option>'
    widget += '</select>'
    
    widget += '<select id="jrscript-sortorder">'
    widget += '<option value="none">--</option>'
    widget += '<option value="d">Reverse</option>'
    widget += '</select>'
    
    // view type
    widget += '<br><br>View style: ';
    widget += '<select id="viewtype">'
    widget += '<option value="d.rp,aat,r,ts,albjh,o,g">Full</option>'
    widget += '<option value="d.rp,aat,r,ts,albjh,v,o,g">Full + Reviews</option>'
    widget += '<option value="none">Standard</option>'
    widget += '<option value="visual">Covers only</option>';
    widget += '<option value="tracks">Display tracklist column</option>'
    widget += '<option value="review">Display reviews</option>';
    widget += '<option value="track_ratings">Display track ratings</option></select>';

    // release type
    widget += ' | Release type: ';
    widget += '<select id="rlstype"><option value="none">All</option><option value="typs">Album</option>';
    widget += '<option value="type">EP</option><option value="typc">Compilation</option><option value="typi">Single</option>';
    widget += '<option value="typd">Video</option><option value="typb">Bootleg</option></select>';

    // search terms
    widget += '&nbsp;|&nbsp;Search terms: &Tab;<input type="text" size="15" id="srchquery" name="q" autocomplete="off"> &Tab; <select id="srchtype">';
    widget += '<option value="strm_a">Artist</option>'
    widget += '<option value="strm_l">Title</option>';
    widget += '<option value="strm_q">Review</option>'
    widget += '<option value="stag">Tag</option>'
    widget += '<option value="strm_b">Label</option>'
    widget += '<option value="strm_h">Genres</option>'
    widget += '<option value="strm_relyear">Release Year</option></select>';

    // end
    widget += '&Tab;<input type="submit" id="gobtn" value="GO>"></div><br><br>';

    music_header = 'music';

    // $('.bubble_header:contains("'+music_header+'")').after(widget)

//     $('a[href="/collection/'+document.URL.split('~')[1]+'/"]').parent().after(widget);
    $('.profilesearch label[for="q"]').parent().parent().parent().replaceWith(widget);

    // https://rateyourmusic.com/collection/<username>/<options>
    // https://rateyourmusic.com/collection/<username>/strm_<searchtype>,<options>/<searchquery>/1

//     $('#toggle-widget').bind('click', function(){$('#music-widget').toggle()});
//     $('#music-widget').toggle();

//     $('#gobtn').click(function(){
//         console.log("test");
//         window.location = "https://sfdghfgds09ue08rghjf09uhuigfdfg.bdsfsgdgdad";
//     })

    $('#gobtn').click(function(){
        console.log("test");
        username = document.URL.split('~')[1];
        options = '';


        if ($('#perpage').val() != '' && !isNaN($('#perpage').val())){
            options += ',n'+$('#perpage').val();
        }

        if ($('#rlstype').val() != 'none'){
            options += ','+$('#rlstype').val();
        }

        if ($('#ratemin').val() != 'none' || $('#ratemax').val() != 'none'){
            rating = [$('#ratemin').val(), $('#ratemax').val()];
            rating.sort();
            options += ',r'+rating[0];
            if (rating[1] != 'none' && rating[1] != rating[0]){
                options += '-'+rating[1];
            }
        }

        if ($('#ownship').val() != 'none'){
            options += ','+$('#ownship').val();
        }

        if ($("#jrscript-sortby").val() != 'none'){
            options += ',ss.'+$("#jrscript-sortby").val();
            israting = $("#jrscript-sortby").val() == 'r'
            // make 5 -> 0 be default for rating sort
            if ($("#jrscript-sortorder").val() != 'none'){
                if (! israting) {
                    options += 'd'
                }
            } else if (israting) {
                    options += 'd'
            }
        }

        if ($('#srchquery').val() != ''){
            if ($('#viewtype').val() != 'none'){
                viewtype = $('#viewtype').val()+',';
            } else {viewtype = ''} 

            window.location = 'https://rateyourmusic.com/collection/'+username+'/'+viewtype+$('#srchtype').val()+','+options+'/'+$('#srchquery').val()+'/1';
        } else{
            if ($('#viewtype').val() != 'none'){
                options = $('#viewtype').val() + options;
            }
            window.location = 'https://rateyourmusic.com/collection/'+username+'/'+options;
        }

    })
    
    
})


