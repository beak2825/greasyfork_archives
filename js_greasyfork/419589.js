// ==UserScript==
// @name       poker-utalasok
// @version    0.2
// @description  Opens links from the CodeProject newsletter
// @match      https://www.advancedpokertraining.com/poker/live_ring_game_results.php*
// @require http://code.jquery.com/jquery-latest.js
// @namespace herczegd
// @downloadURL https://update.greasyfork.org/scripts/419589/poker-utalasok.user.js
// @updateURL https://update.greasyfork.org/scripts/419589/poker-utalasok.meta.js
// ==/UserScript==

$(document).ready(function () {
    $('div.apt_col.apt_span_3_of_12').append('<span class="buttonred" style=""><a id="switch" class="qwe">Utalások letöltése</a></span>');
    $('.qwe').click(function(){
  var hrefs = new Array();
    var elements = $('table.tournament_details > tbody > tr');

    var winners = new Array();
    var loosers = new Array();
    var payments = new Array();
    var players = new Array();

    elements.each(function () {
        var playerInfo = $(this).children().toArray();
		let player = new Player($(playerInfo[0]).text(), $(playerInfo[3]).text(), !$(playerInfo[3]).text().startsWith('-'));
		if(player.winner) {
            winners.push(player);
        } else {
            loosers.push(player);
        }
        players.push(new Player($(playerInfo[0]).text(), $(playerInfo[3]).text(), !$(playerInfo[3]).text().startsWith('-')));
    });
	loosers = loosers.reverse();



	loosers.forEach(function(looser){
		winners.forEach(function(winner){
			if(looser.chips != 0 && winner.chips != 0){
				//ha megegyezik a a két összeg
				if(winner.chips == Math.abs(looser.chips)){
					payments.push(new Payment(looser.name, winner.name, winner.chips));
					looser.chips = 0;
					winner.chips = 0;
				} else if(Math.abs(looser.chips) > winner.chips){ //ha a veszteség nagyobb, mint a nyeremény
					payments.push(new Payment(looser.name, winner.name, winner.chips));
					looser.chips = looser.chips + winner.chips;
					winner.chips = 0;
				} else { //ha a nyeremény nagyobb, mint a veszteség
					payments.push(new Payment(looser.name, winner.name, looser.chips));
					winner.chips = winner.chips + looser.chips;
					looser.chips = 0;
				}
			}
		});
	});
    download_csv(payments, players);
})
});


class Player{
    constructor(name, chips, winner){
        this.name = name.trim();
        this.chips = parseInt(chips, 10);
        this.winner = winner;
    }

    toCsv(){
        return this.name.toString()+','+this.chips.toString()+'\n';
    }
}

class Payment{
	constructor(sender, receiver, amount){
		this.sender = sender.trim();
		this.receiver = receiver.trim();
		this.amount = Math.abs(amount);
	}

    toCsv(){
        return this.sender.toString()+','+this.receiver.toString()+','+this.amount.toString()+'\n';
    }
}


function download_csv(data, players) {
    var csv = 'ki,kinek,mennyit\n';
    data.forEach(function(payment) {
            csv += payment.toCsv();
    });

    csv += '\n\n\n';

    csv += 'Vegeredmeny:\n';
    players.forEach(function(player) {
            csv += player.toCsv();
    });


    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'poker_result_'+new Date().getTime()+'.csv';
    hiddenElement.click();
}