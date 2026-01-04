// ==UserScript==
// @name       RYM/ Sonemic: Average track rating
// @version    1.3
// @description:en  average track rating for rym/sonemic
// @description average track rating for rym/sonemic
// @match      https://sonemic.com/release/*
// @match      https://rateyourmusic.com/release/*
// @match      http://rateyourmusic.com/release/*
// @match      http://sonemic.com/release/*
// @namespace https://greasyfork.org/users/194849
// @downloadURL https://update.greasyfork.org/scripts/370086/RYM%20Sonemic%3A%20Average%20track%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/370086/RYM%20Sonemic%3A%20Average%20track%20rating.meta.js
// ==/UserScript==


//RYM

var $ = unsafeWindow.jQuery;
var url = window.location.href;
var weightedRatingSum_rym = 0;
var numberOfTracks_rym = 0;
var totalDuration = 0;
var relativeTrackDuration;
var weightedRating;
var ratingSum = 0;


//calculate total album duration
$('#tracks li.track').each(function() {


    //only count time if it's not "silence"
    if($(this).html().search('silence') < 0){

         //get the track length in seconds
        var duration = $(this).find('.tracklist_duration').text().trim();
        var a = duration.split(':');
        var seconds = (+a[0]) * 60 + (+a[1])

        if(!isNaN(seconds)){
            totalDuration+=seconds;
        }
    }

});




//Iterate through the tracklist and calculate weighted rating
$('#tracks li.track').each(function() {

    var seconds = 0;
    var a;

    var rating = $(this).find('.track_rating').text();

    //check if there is a valid rating value for the track
    if(parseFloat(rating) > 0){



        if(totalDuration > 0){
        //get the track length in seconds


           var duration = $(this).find('.tracklist_duration').text().trim();
            

            //calculate the length of multipart-tracks
            if(duration.length < 1){

                var longTrackSeconds = 0;
               
                $(this).nextAll().each(function() {
                    var partDuration = $(this).find('.tracklist_duration').text().trim();
                    a = partDuration.split(':');
                    var partSeconds = (+a[0]) * 60 + (+a[1])

                    if(partSeconds > 0){
                    seconds += partSeconds;

                    }

                });


            }else{

                 a = duration.split(':');
                 seconds = (+a[0]) * 60 + (+a[1])

            }

            console.log('trackSeconds: ' + seconds);


        relativeTrackDuration = seconds / totalDuration;

        weightedRating = relativeTrackDuration * rating;
        console.log('weighted Rating track: ' + weightedRating);

            weightedRatingSum_rym += parseFloat(weightedRating);

        }

     else{
         numberOfTracks_rym++;
         ratingSum += parseFloat(rating);
         }

    }

});

var finalRating;

console.log("duration: " +totalDuration);
console.log("tracks: " +numberOfTracks_rym);
console.log("sum: " +ratingSum);

finalRating = (totalDuration > 0) ? weightedRatingSum_rym.toFixed(2) : (ratingSum / numberOfTracks_rym).toFixed(2);

var header = $('.release_page_header').text();

var useless1 = document.getElementsByClassName("release_page_header");
for (var j = 0; j < useless1.length; j++) {
  var useless2 = useless1[j].innerText;
    if(useless2.includes("listing")){

        var element = document.getElementsByClassName("release_page_header")[j];
        var str = element.innerHTML;
var text = str + "(Average: " +finalRating+ ")";
element.innerHTML = text;

    }
}



//SONEMIC

if(url.includes('sonemic')){


var heading = document.getElementsByClassName("page_object_section_header");
var finalText;
var tracklist = document.getElementsByClassName("page_fragment_track_avg_rating");
var lengths = document.getElementsByClassName("page_fragment_track_duration");
var weightedRatingSum_sonemic = 0;
var trackCounter = 0;
var totalDuration_sonemic = 0;
var totalRatings_sonemic = 0;
var finalRating_sonemic;
var lengthsavailable = false;
var weightedRating_sonemic = 0;
var tracklengths = new Array(50);

//album duration
for (var k = 0; k < tracklist.length; k++) {

        var duration = lengths[k].innerText.trim();
        var a = duration.split(':');
        var seconds = (+a[0]) * 60 + (+a[1])

        tracklengths[k] = seconds;

        if(k==0 && seconds > 0) {lengthsavailable = true;}

        var rating = parseFloat(tracklist[k].innerText);

        totalDuration_sonemic += seconds;
        totalRatings_sonemic += rating;

}

    //track lengths are available and thus a weighted rating is possible
    if(lengthsavailable){


        for (k = 0; k < tracklist.length; k++) {

        rating = parseFloat(tracklist[k].innerText);


        relativeTrackDuration = tracklengths[k] / totalDuration_sonemic;

        weightedRating_sonemic = relativeTrackDuration * rating;
        weightedRatingSum_sonemic += parseFloat(weightedRating_sonemic);



}

        finalText = "Tracks (Average: " +weightedRatingSum_sonemic.toFixed(2)+ ")";

    }


else{

finalRating_sonemic = parseFloat(totalRatings_sonemic/tracklist.length);
finalText = "Tracks (Average: " +finalRating_sonemic.toFixed(2)+ ")";

    }
heading[1].innerHTML = finalText;



  }



