// ==UserScript==
// @name        sanath
// @namespace   sanath
// @include     http://www.cricket.com.au/news/odi-goat-sachin-tendulkar-india-sanath-jayasuria-sri-lanka-semi-final-1/2016-05-14
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     4
// @description vote sanaaa
// @downloadURL https://update.greasyfork.org/scripts/19693/sanath.user.js
// @updateURL https://update.greasyfork.org/scripts/19693/sanath.meta.js
// ==/UserScript==



$(document).ready(function(){

round=0;




var voteSana= function(){

round++;

votesPerRound= 30; //
for (i = 0; i <votesPerRound; i++) {
    PollAnswer = {
                    PollId: 'b26ba54c-4616-4d66-b88b-fed2784bc8a0' ,
                    PollAnswerId: 'ba20defa-4d7c-4d38-a965-f04a627b95a1',
                    PollAnswerTotal: 0,
                    CreateDate: null,
                    LastUpdated: null,
                };
				

	$.ajax({
                        type: 'POST',
                        async: true,
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        url: 'http://www.cricket.com.au/cricketcomau/Polls/SubmitPollAnswers',
                        data: JSON.stringify(PollAnswer),
						success: function(data){
						
						//$(".poll-answers .answer, .vote").hide();
                                                //$(".poll-answers .ansScore, .voted").show();
                                                //$("#totalVotes").text(data.TotalVotes + " VOTES");

						
						
						}
			});
			
}

//$("#pollGraph").append("<p>My VOTES "+round*50+"</br></p>");




};

$("#pollGraph").append("<p>My VOTES</br></p>");
setInterval(voteSana,50000);  //50s to 50s


});

