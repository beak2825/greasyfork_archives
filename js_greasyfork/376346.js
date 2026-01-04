// ==UserScript==
// @name         PTS Search
// @namespace    Yoma
// @version      0.1
// @description  Yoma gone
// @author       Yoma
// @match        http://www.habbousdf.com/pts/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376346/PTS%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/376346/PTS%20Search.meta.js
// ==/UserScript==

(function() {
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

class User {
	//{
		expandFeats() {
			var out = this.feats;
			
			//out = out.replace("5", "ABDEFGHIJKLMNOPQRSTUWXYZ");
			out = out.replace("_", "QFNZ");
			out = out.replace("=", "QFZ");
			out = out.replace("+", "QZ");
			out = out.replace("&", "TPU");
			out = out.replace("^", "TU");
			out = out.replace("?", "SMB");
			out = out.replace("!", "SM");
			out = out.replace("%", "RA");
			out = out.replace(">", "KJ");
			out = out.replace("<", "GD");
			out = out.replace("~", "EY");
			
			this.feats = out;
		}
		
		constructor(userData) {
			this.originalMotto = userData;
			this.motto = userData;
			this.motto.replace("(*)", "");
			
			if (this.motto.indexOf("(/") > -1) {
				this.motto = this.motto.split("(/")[0];
			}
			
			this.branch = this.motto.split("]")[0];
			
			if (this.branch.indexOf(" ") == -1) {
				this.branch = "USDF";
			}
			else {
				this.branch = this.branch.split(" ")[1].replace("[", "").trim();
			}
			
			if (this.motto.indexOf("/") > -1) {
				this.rank = this.motto.split("]")[1].split("/")[0].trim();
				this.pos = this.motto.split("]")[1].split("/")[1].split("{")[0].trim();
			}
			else if (this.motto.indexOf(",") > -1) {
				this.rank = this.motto.split("]")[1].split(", ")[0].trim();
				this.pos = this.motto.split("]")[1].split(", ")[1].split("{")[0];
			}
			else {
				this.rank = this.motto.split("]")[1].split("{")[0].trim();
				this.pos = undefined;
			}
			
			if (this.motto.indexOf("{") > -1) {
				this.feats = this.motto.split("{")[1].split("}")[0].trim();
			}
			else {
				this.feats = "";
			}
			
			this.expandFeats();
			
			console.log("Motto: " + this.motto + "\nBranch: " + this.branch + "\nRank: " + this.rank + "\nPos: " + this.pos + "\nFEATs: " + this.feats);
		}
		
		Feats() {
			return this.feats;
		}
		
		getMissing(other) {
			var otF = other.Feats();
			var out = "";
			var tF = this.Feats();
			
			
			for (var i = 0; i < otF.length; i++) {
				if (tF.indexOf(otF.charAt(i)) == -1) {
					out += otF.charAt(i);
				}
			}
			
			return out;
		}
		
		getExtra(other) {
			var otF = other.Feats();
			var out = "";
			var tF = this.Feats();
			
			
			for (var i = 0; i < tF.length; i++) {
				if (otF.indexOf(tF.charAt(i)) == -1) {
					out += tF.charAt(i);
				}
			}
			
			return out;
		}
		
		compareStatus(other) {
			var errors = "";
			
			var rank = userDiv.parent().siblings(".rank-title").text().split(")")[0].substring(1);
			var pg = rank.match("[A-Z]+");
			var index = parseInt(rank.match(/\d+/g));
			
			errors += "Users motto: " + this.motto + "<br/><br/>";
			console.log("PG: " + pg + "\nIndex: " + index);
			
			if (pg == "O" || pg == "ES" || pg == "P") {
				if (index > 4 || pg == "ES" || pg == "P") {
					errors += "> ATTENTION ON DECK<br\>";
				}
				else {
					errors += "> ATTENTION<br\>";
				}
			}
			
			if (this.originalMotto == other.originalMotto) {
				errors += "> Hard match";
			}
			
			if (this.branch != other.branch) {
				errors += "> Wrong branch<br/>";
			}
			if (this.rank != other.rank) {
				errors += "> Wrong rank<br/>";
			}
			if (this.pos != other.pos) {
				errors += "> Wrong office<br/>";
			}
			if (this.getMissing(other).length > 0 && other.motto.indexOf("{5}") == -1) {
				errors += "> Must add: {" + this.getMissing(other) + "}<br/>";
			}
			if (this.getExtra(other).length > 0) {
				errors += "> Must remove: {" + this.getExtra(other) + "}<br/>";
			}
			
			if (errors.length == 0) {
				errors += "ALL CLEAR";
			}
			
			return errors;
		}
	//}
}

//{
var output;

function createConsole() {
	var div = $("<div></div>", {
		id: "outputLog",
		css: {
			position: "fixed",
			right: "30px",
			bottom: "30px",
			backgroundColor: "#fff",
			color: "#000",
			width: "700px",
			height: "100px",
			fontFamily: "Courier New",
			padding: "10px",
			overflowY: "scroll"
		}
	});
	
	$("body").append(div);
	
	return div;
}

function log(str) {
	console.log(str);
	return;
	
	var p = $("<p></p>", {
	css: {
		margin: "0px",
		padding: "0px",
		lineHeight: "1"
	}
	});
	
	p.text(str);
	
	output.append(p);
	output[0].scrollTop = output[0].scrollHeight;
}

function gt(elm) {
	return elm
	.clone()    //clone the element
	.children() //select all the children
	.remove()   //remove all the children
	.end()  //again go back to selected element
	.text()
	.trim(); 
}

var userDiv;
//}

$(document).ready(function() {
	//output = createConsole();
	
	//{
		function insertSearch() {
			var div = $("<div></div>", {
				css: {
					textAlign: "center"
				}
			});
			
			var btn = $("<button></button>", {
				class: "btn btn-default",
				css: {
					display: "inline",
					borderRadius: "5px",
					marginLeft: "10px"
				}
			}).text("Search");
			
			var textBox = $("<input>", {
				id: "userInput",
				class: "form-control ui-autocomplete-input",
				type: "text",
				css: {
					display: "inline",
					width: "300px"
				}
			})
			.on("keypress", function(e) {
				if(e.which == 13) {
					btn.click();
				}
			});
			
			
			var lbl = $("<h2></h2>", {
				id: "result",
				css: {
					display: "block",
					textTransform: "none",
					fontSize: "20px"
				}
			}).text("Result: ");
			
			div.append(textBox);
			div.append(btn);
			div.append(lbl);
			div.insertBefore("#results");
			
			textBox.focus();
			
			btn.on("click", search);
		}
		
		var currentUserMotto;
		
		function search() {
			var user = $("#userInput").val();
			
			if (user == "") {
				$(".third h4").parent().show().parent().show();
				return;
			}
			
			log("starting search: " + user);
			
			$(".third h4:not(:contains(" + user + "))").parent().hide().parent().hide();
			userDiv = $(".third h4:contains(" + user + ")");
			
			console.log(userDiv[0]);
			
			userDiv.parent().show().parent().show();
			
			compareMotto(userDiv);
			log("search complete");
		}
		
		function compareMotto(user) {
			
			var userData;
			
			$("#result").text("Trying...");
			
			$.get("https://www.habbo.com/api/public/users?name=" + $("#userInput").val(), function(data) {
				userData = data;
				$("#result").text("Motto: " + userData.motto);
				
				log(user);
				
				log(user.parent()[0]);
				
				
				if (gt(user.parent()) == userData.motto) {
					log("match");
				}
				else {
					log("mismatch");
				}
				
				var userMotto = new User(userData.motto);
				var pts = new User(gt(user.parent()));
				
				$("#result").html(userMotto.compareStatus(pts));
			});
			
			//$("#result").text("Done");
			
		}
		
		insertSearch();
	//}

	function globalDischarge() {
		var b = "http://www.habbousdf.com/pts/index.php?page=discharged&type=";
		var div = $("<div></div>").load(b + "f .col-md-8").load(b + "q .col-md-8");
		
		$("#gettype").after(div);
		
	}
});	
})();