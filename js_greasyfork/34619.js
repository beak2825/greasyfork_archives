// ==UserScript==
// @name         test
// @namespace    test
// @version      0.22
// @author       Luzhiled
// @description  ja
// @match        https://beta.atcoder.jp/users/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react-dom.js
// @downloadURL https://update.greasyfork.org/scripts/34619/test.user.js
// @updateURL https://update.greasyfork.org/scripts/34619/test.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let user_screen_name, contest_name, last_rating, now_rating, is_highest, tweet_text, difference;

  function getTweetText() {
    let res = "";
    if (GM_getValue("User name", false)) {
      res += "User: " + user_screen_name + "  ";
    }
    if (GM_getValue("Contest name", true)) {
      res += contest_name + " : ";
    }
    if (GM_getValue("Last rating", true)) {
      res += last_rating + " -> ";
    }
    res += now_rating;
    if (GM_getValue("Difference", true) || GM_getValue("highest?", true)) {
      res += " (";
      if (GM_getValue("Difference", true)) {
        res += difference;
      }
      if (GM_getValue("Difference", true) && GM_getValue("highest?", true) && is_highest) {
        res += ", ";
      }
      if (GM_getValue("highest?", true) && is_highest) {
        res += "highest!!";
      }
      res += ")";
    }

    return res;
  }

  let path_name = location.pathname;
  if (path_name.endsWith("/")) {
    path_name = path_name.slice(0, -1);
  }

  if (path_name.endsWith("/" + userScreenName)) {
    user_screen_name = userScreenName;
    contest_name = rating_history[rating_history.length - 1].ContestName;
    contest_name = contest_name.replace("AtCoder Grand Contest", "AGC");
    contest_name = contest_name.replace("AtCoder Regular Contest", "ARC");
    contest_name = contest_name.replace("AtCoder Biginner Contest", "ABC");
    last_rating = rating_history.length > 1 ? rating_history[rating_history.length - 2].NewRating : 0;
    now_rating  = rating_history[rating_history.length - 1].NewRating;
    difference = ((now_rating - last_rating) >= 0 ? ((now_rating - last_rating) === 0 ? "±" : "+") : "") + (now_rating - last_rating);
    if (last_rating === 0) last_rating = "Unrated";
    is_highest = true;
    for (let i = 0; i < rating_history.length - 1; ++i) {
      if (now_rating <= rating_history[i].NewRating) {
        is_highest = false;
      }
    }

    $('div.col-sm-8 > table.dl-table').append(`<tr id="tweet" class="tweet"><th>ツイート</th><td class="tweetbutton"><a class="button" id="tweetbutton" href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fbeta.atcoder.jp%2Fusers%2FLuzhiled&ref_src=twsrc%5Etfw&text=${encodeURIComponent(getTweetText())}&tw_p=tweetbutton&url=%20"  target="_blank"><span><i class="fa fa-twitter fa-btn" aria-hidden="true"></i> Tweet</span></a></td></tr>`);
    $('ul.nav.navbar-nav.navbar-right').prepend(`<li id="addedmenu" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Tweet Settings <span class="caret"></span></a><ul class="dropdown-menu" id="tweetsettings"></ul></li>`);
    $('head').append('<style type="text/css">.tweet a span{margin: 0px 0.5em;}.tweetbutton a {display: block;text-decoration: none;color: #fff;background-color: #1b95e0;border-radius: 0.25em;}input[type=checkbox] {display: none;}.from label {margin: 0px;display: block;padding: 3px 20px;clear: both;font-weight: normal;line-height: 1.42857143;white-space: nowrap;text-decoration: none;}.not-selected {color: #eee;margin: 0px;}.selected {color: #333;}</style>');
    $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">');

    var Checkbox = React.createClass({
      getInitialState: function () {
        return {
          data: [
            {id: "User name", selected: GM_getValue("User name", false) },
            {id: "Contest name", selected: GM_getValue("Contest name", true) },
            {id: "Last rating", selected: GM_getValue("Last rating", true) },
            {id: "Difference", selected: GM_getValue("Difference", true) },
            {id: "highest?", selected: GM_getValue("highest?", true) }
          ]
        };
      },

      render: function () {
        var checks = this.state.data.map(function (d) {
          return (React.createElement("label", {key: `${d.id}`, className: (d.selected ? "selected" : "not-selected")}, React.createElement('input', {type: "checkbox", checked: d.selected, onChange:this.__changeSelection.bind(this, d.id)}), ` ${d.id}`));
        }.bind(this));
        return (React.createElement("from",{className: "from", id: "settings-item"}, checks))
      },

      __changeSelection: function (id) {
        var nextState = this.state.data.map(function (d) {
          return {
            id: d.id,
            selected: (d.id === id ? !d.selected: d.selected)
          };
        });

        this.setState( {data: nextState });

        for (var i = 0; i < nextState.length; ++i) {
          GM_setValue(nextState[i].id, nextState[i].selected);
        }
        document.getElementById("addedmenu").setAttribute("class", "dropdown open");

        tweet_text = getTweetText();
        document.getElementById("tweetbutton").setAttribute("href", `https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fbeta.atcoder.jp%2Fusers%2FLuzhiled&ref_src=twsrc%5Etfw&text=${encodeURIComponent(getTweetText())}&tw_p=tweetbutton&url=%20`);
      },

    });

    ReactDOM.render(React.createElement(Checkbox, null), document.getElementById('tweetsettings'));
  }
})();
