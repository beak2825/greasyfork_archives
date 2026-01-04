// ==UserScript==
// @name         Contador CAFI - Carteira de Análise Fundamentalista de Investimentos / Pense Rico
// @namespace    http://tampermonkey.net/
// @version      0.8
// @author       Vitor Subs
// @description  Utilizado para calcular o número de votos da CAFI no portal Pense Rico
// @match        https://forum.penserico.com/t/cafi-carteira-de-analise-fundamentalista-de-investimentos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395761/Contador%20CAFI%20-%20Carteira%20de%20An%C3%A1lise%20Fundamentalista%20de%20Investimentos%20%20Pense%20Rico.user.js
// @updateURL https://update.greasyfork.org/scripts/395761/Contador%20CAFI%20-%20Carteira%20de%20An%C3%A1lise%20Fundamentalista%20de%20Investimentos%20%20Pense%20Rico.meta.js
// ==/UserScript==

var globalVotes = {};
var personVotes = {};

function buildInterface() {
  $("body").append(`
<div style="position:fixed; right:0; bottom:0; z-index: 999;">
<button id="setup" style="font-size: 40px;"> Iniciar </button>
<button id="run" style="font-size: 40px;" disabled> Calcular </button>
<textarea id="result" style="height=500px"/>
</div>`);
}
function loadAllPosts(previousDocumentHeight, callback) {
  var documentHeight = $(document).height();
  if (previousDocumentHeight == documentHeight) {
    callback();
  } else {
    $("html, body").animate({ scrollTop: documentHeight - 750 }, 10000, null);
    setTimeout(function() {
      loadAllPosts(documentHeight, callback);
    }, 15000);
  }
}
function runPost(post, callback) {
  //post.find('.cooked').children().not('p, ul').remove();
  post
    .find(".cooked")
    .find(":not(p, ul, br, li, ol)")
    .remove();
  let username = post.find(".username > a").text();
  var text = post.find(".cooked")[0].innerHTML;
  var votes = text.match(/(\w{3,4}\d{1,2})/gi);
  if (votes && votes.length) {
    votes = votes.map(function(vote) {
      return vote.toUpperCase();
    });
    votes = [...new Set(votes)];
    if (votes.length > 10) {
      votes = votes.slice(0, 8);
    }
    if (personVotes[username]) {
      for (let i = 0; i < personVotes[username].length; i++) {
        globalVotes[personVotes[username][i]] -= 1;
      }
    }
    personVotes[username] = votes;
    for (let i = 0; i < votes.length; i++) {
      let vote = votes[i];
      if (!globalVotes[vote]) {
        globalVotes[vote] = 0;
      }
      globalVotes[vote] += 1;
    }
  }

  post.find(".cooked")[0].innerHTML = text.replace(
    /(\w{3,4}\d{1,2})/gi,
    "<span style='color: green; font-size: 32px; white-space: pre; line-height:1.5em'>    $1    </span>"
  );
  $("html, body").animate({ scrollTop: post.offset().top - 75 }, 1000, null);
  var nextPost = post.nextAll().first();
  if (nextPost.length) {
    setTimeout(function() {
      runPost(nextPost, callback);
    }, 1000);
  } else {
    callback();
  }
}
function organizeVotes() {
  let globalVotesArray = Object.keys(globalVotes)
    .map(function(key, index) {
      return { ticker: key, count: globalVotes[key] };
    })
    .sort(function(a, b) {
      return b.count - a.count;
    });
  for (let i = globalVotesArray.length - 1; i >= 0; i--) {
    var ticker = globalVotesArray[i].ticker.replace(/\d+$/, "");
    let mainVote = globalVotesArray.find(function(vote) {
      return vote.ticker.replace(/\d+$/, "") === ticker;
    });
    if (mainVote.ticker !== globalVotesArray[i].ticker) {
      mainVote.count += globalVotesArray[i].count;
    }
  }
  globalVotesArray = globalVotesArray.sort(function(a, b) {
    return b.count - a.count;
  });
  let result = "";
  for (let globalVote of globalVotesArray) {
    result += globalVote.ticker + "\t" + globalVote.count + "\n";
  }
  $("#result").val(result);
}

function buildEvents() {
  $("#setup").click(function() {
    $(".topic-post").each(function(key, value) {
      if (!$(value).find(".cafi-checkbox").length) {
        $(value)
          .find(".topic-meta-data")
          .first()
          .prepend('<input class="cafi-checkbox" type="checkbox"/>');
      }
    });
    $(".cafi-checkbox").change(function() {
      $("#run").prop("disabled", false);
    });
  });

  $("#run").click(function() {
    globalVotes = {};
    let selected = $(".cafi-checkbox:checked")
      .first()
      .parents(".topic-post")
      .first();
    runPost(selected, () => {
      organizeVotes();
    });
  });
}
(function() {
  "use strict";

  setTimeout(function() {
    buildInterface();
    buildEvents();
  }, 5000);

  // Your code here...
  //     console.log($('.topic-post'));
})();
