// ==UserScript==
// @name         Animoji
// @namespace    http://tampermonkey.net/
// @version      0.1.2b
// @description  Easy and fast way for users to add emojis and gifs to posts on Anilist . by Makhloufbel
// @author       Makhloufbel
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-2.1.3.min.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/444181/Animoji.user.js
// @updateURL https://update.greasyfork.org/scripts/444181/Animoji.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // the muscle of the extention
    function main() {
        $(document).ready(() => {
            //appending the button and the popup to the Dom
            $(".markdown-editor").append(`
               <div class="my-btn up" title="Emoji/GIF">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <defs>
            <style>
              .b {
                fill: #864e20;
                stroke: #864e20;
              }
            </style>
          </defs>
          <rect
            x="1"
            y="1"
            width="22"
            height="22"
            rx="7.656"
            style="fill: #f8de40; stroke: #f8de40"
          />
          <path
            class="b"
            d="M7.055 7.313A1.747 1.747 0 1 0 8.8 9.059a1.747 1.747 0 0 0-1.745-1.746zM16.958 7.313A1.747 1.747 0 1 0 18.7 9.059a1.747 1.747 0 0 0-1.742-1.746zM14 11.207a.32.32 0 0 0-.313.327 2.1 2.1 0 0 1-.5 1.33A1.593 1.593 0 0 1 12 13.3a1.6 1.6 0 0 1-1.187-.43 2.088 2.088 0 0 1-.5-1.334.32.32 0 1 0-.64-.012 2.712 2.712 0 0 0 .679 1.791 2.211 2.211 0 0 0 1.648.623 2.211 2.211 0 0 0 1.647-.626 2.718 2.718 0 0 0 .679-1.791.322.322 0 0 0-.326-.314z"
          />
          <path
            d="M23 13.938a14.69 14.69 0 0 1-12.406 6.531c-5.542 0-6.563-1-9.142-2.529A7.66 7.66 0 0 0 8.656 23h6.688A7.656 7.656 0 0 0 23 15.344z"
            style="fill: #e7c930; stroke: #e7c930"
          />
        </svg>
      </div>
               `);
      const home = new RegExp(`(^https?:\/\/)?(www\.)?anilist.co\/home`, "gi");
      //const profile = new RegExp(`(^https?:\/\/)?(www\.)?anilist.co\/user\/\w+`,"gi");
      const settings = new RegExp(
          `(^https?:\/\/)?(www\.)?anilist.co\/settings`,
          "gi"
      );

      let margin,
          match = false;
      if (window.location.href.match(home)) {
          margin = 55;
          match = true;
      }
      if (window.location.href.match(settings)) {
          margin = 30;
          match = true;
      }
      if (match == false) margin = 5;

      $("#app").append(`
      <div class="my-container" style="margin-inline : ${margin}%">
        <div class="my-resault">
        <div class="close-container">⛒</div>
        <div class="toggle-btn" data-btn="emoji">
          <div class="toggle-label toggle-label-off">emoji</div>
          <div class="toggle-switch"></div>
          <div class="toggle-label toggle-label-on">GIF</div>
        </div>
        <div id="my-search-bar" class="my-search-bar">
          <input type="text" class="search-input" data-search placeholder="Search..."/>
          <div id="closer" class="toggle"></div>
        </div>
        <div class="match-list" data-match-list>
        <p>Search for your favourite Emoji or GIF </p>
        <p>then right click to insert at curser position</p>
        </div>
        </div>
      </div>
               `);

      $(".my-container").draggable();
      // $(".my-container").resizable();

      $("#app").css("position", "relative");
      $("#closer").click(() => {
          //$(this).parent().toggleClass("closed");
          document.getElementById("my-search-bar").classList.toggle("closed");
          $(this).prev().focus();
          setTimeout(() => {
              document.querySelector("#my-search-bar > input[data-search]").value =
                  "";
          }, 500);
      });

      setTimeout(() => {
          $("#closer").click();
      }, 100);

      setTimeout(() => {
          $("#closer").click();
      }, 1500);
      $(() => {
          $(".toggle-btn").on("click", function (event) {
              event.preventDefault();
              $(this).toggleClass("active");
              if ($(this).attr("data-btn") == "emoji") {
                  $(this).attr("data-btn", "gif");
              } else {
                  $(this).attr("data-btn", "emoji");
              }
              $(".match-list").html(
                  "<p>Search for your favourite Emoji or GIF </p><p>then right click to insert at curser position</p>"
              );

              document.querySelector("#my-search-bar > input[data-search]").value =
                  "";
          });
      });

      $(".my-btn").click(() => {
          $(".my-container").fadeToggle();
          // let top = $(".my-btn").offset().top - $(".my-container").height() / 4;
          // $(".my-btn").toggleClass("up");
          // console.log($(".my-btn").offset().left);
          // if ($(".my-btn").offset().left > window.outerWidth * 0.6) {
          //   $(".my-container").css("margin-left", "5%");
          // } else {
          //   $(".my-container").css("margin-left", "55%");
          // }

          // let classList = $(".my-btn").attr("class").split(/\s+/);
          // $.each(classList, function (index, item) {
          //   if (item === "up") {
          //     $(".my-container").animate({ top: "-1200%" }, "fast");
          //   } else {
          //     $(".my-container").animate({ top: `${top}px` }, "slow");
          //   }
          // });
      });

      $(".close-container").click(() => {
          $(".my-container").fadeToggle();
          // $(".my-container").animate({ top: "-1200%" }, "fast");
          // $(".my-btn").toggleClass("up");
      });

      const search = document.querySelector("[data-search]");
      const matchList = document.querySelector("[data-match-list]");
      let searchMode = "emoji";
      //Search emojis.jsom from gist and filtering it

      const searchEmojis = async (searchText) => {
          //fetching data and processing it
          const res = await fetch(
              "https://gist.githubusercontent.com/Makhloufbel/b96611f729ee3dcf62d3c64e047265c6/raw/e0644fb6953013023d6f93fe5af7c1ecaeaa5657/emojis.json"
          );
          const emojis = await res.json();

          //Get matches with current input
          let matches = emojis.filter((emoji) => {
              const regex = new RegExp(`${searchText}`, "gi");
              //we're getting string from text so the comparing them part should be with texts
              return emoji.unicodeName.match(regex);
          });

          if (searchText.length == 0) {
              matches = [];
              matchList.innerHTML =
                  "<p>Search for your favourite Emoji or GIF </p><p>then right click to insert at curser position</p>";
          }

          outputHtml(matches);
      };

      //Show the matches
      const outputHtml = (matches) => {
          if (matches.length > 0) {
              //preparing data and cleaning the rough edges
              const html = matches
              .map((match) => {
                  let codes = match.codePoint.split(" ");
                  codes = codes.filter((e) => {
                      return !e.includes("fully-qualified") && !e.includes(";");
                  });
                  let attr = codes.join(" ");
                  //create DomElements to insert in document
                  let card = `<div class="card allemocl" data-emoji = '${attr}' title='${match.unicodeName}'>`;
                  codes.forEach((code) => {
                      card += `&#x${code};`;
                  });
                  card += `</div>`;
                  return card;
              })
              .join("");

              matchList.innerHTML = html;
          }
      };
      //check if searching mode is for emojis
      search.addEventListener("input", () => {
          searchMode = document.querySelector("[data-btn]").dataset.btn;
          if (searchMode == "emoji") {
              searchEmojis(search.value);
          }
      });
      /*************************************/
      /*              GIF                  */
      /*************************************/

      // api from https://tenor.com/gifapi/documentation
      // url Async requesting function
      function httpGetAsync(theUrl, callback) {
          // create the request object
          var xmlHttp = new XMLHttpRequest();

          // set the state change callback to capture when the response comes in
          xmlHttp.onreadystatechange = function () {
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                  callback(xmlHttp.responseText);
              }
          };

          // open as a GET call, pass in the url and set async = True
          xmlHttp.open("GET", theUrl, true);

          // call send with no params as they were passed in on the url string
          xmlHttp.send(null);

          return;
      }

      // callback for the top X GIFs of search
      function tenorCallback_search(responsetext) {
          // parse the json response
          var response_objects = JSON.parse(responsetext);

          let top_15_gifs = response_objects["results"];
          // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
          let imgs = ``;

          top_15_gifs.forEach((gif) => {
              let url = gif["media"][0]["nanogif"]["url"];
              let gify = gif["media"][0]["gif"];
              let width = parseInt(gif["media"][0]["nanogif"]["dims"][0]) * 1.5;
              let height = parseInt(gif["media"][0]["nanogif"]["dims"][1]) * 1.5;
              imgs += `<img src='${url}' data-medium =${gify["url"]} width="${width}" height="${height}" class="allegicl"></img>`;
          });
          matchList.innerHTML = imgs;
          return;
      }

      // function to call the trending and category endpoints
      function searchTenor(search_term) {
          // set the apikey and limit
          var apikey = "LIVDSRZULELA";
          var lmt = 15;

          // using default locale of en_US
          var search_url =
              "https://g.tenor.com/v1/search?q=" +
              search_term +
              "&key=" +
              apikey +
              "&limit=" +
              lmt;

          httpGetAsync(search_url, tenorCallback_search);

          // data will be loaded by each call's callback
          return;
      }
      /********************************/
      /*   SUPPORT FUNCTIONS ABOVE    */
      /*        MAIN BELOW            */
      /********************************/
      search.addEventListener("input", (e) => {
          searchMode = document.querySelector("[data-btn]").dataset.btn;
          if (searchMode == "gif") {
              searchGifs(search.value);
          }
      });

      const searchGifs = (searchText) => {
          //Get matches with current input

          if (searchText.length > 2) {
              searchTenor(searchText);
          }
      };
      // insert Emoji or gif to areaText
      const textArea = document.querySelector(".el-textarea__inner");
      matchList.addEventListener("click", (e) => {
          //Check if clicked on a gif called "medium" don't judge on the weird naming
          if (e.target.dataset.medium != null) {
              typeInTextarea(textArea, `img350(${e.target.dataset.medium})`);
          }

          if (e.target.dataset.emoji != null) {
              let codes = e.target.dataset.emoji.split(" ");
              let text = "";
              codes.forEach((code) => {
                  text += `&#x${code};`;
              });

              typeInTextarea(textArea, text);
          }
      });

      function typeInTextarea(element, newText) {
          let start = element.selectionStart;
          let end = element.selectionEnd;
          let text = element.value;
          let before = text.substring(0, start);
          let after = text.substring(end, text.length);
          element.value = before + newText + after;
          element.selectionStart = element.selectionEnd = start + newText.length;
          element.focus();
      }
  });
}
    // my css
    const css = [
        `
@import "https://unpkg.com/open-props";

	.my-search-bar {
		transition: all 0.5s cubic-bezier(0.7, 0.03, 0.17, 0.97) 0.25s;
		position: relative;
		width: 300px;
		height: 50px;
		margin: 0 auto;
	}
	.my-search-bar input {
		outline: none;
		box-shadow: none;
		height: 50px;
		line-height: 50px;
		width: 100%;
		padding: 0 1em;
		box-sizing: border-box;
		background: transparent;
		color: white;
		border: 4px solid var(--gray-1);
		border-radius: 50px;
	}
	.my-search-bar .toggle {

		transition: all 0.5s cubic-bezier(0.98, 0.02, 0.46, 0.99) 0.25s;
		position: absolute;
		width: 50px;
		height: 50px;
		cursor: pointer;
		right: 0;
		top: 0;
		border-radius: 50px;
	}
	.my-search-bar .toggle .toggle:after,
	.my-search-bar .toggle .toggle:before {
		border-color: var(--pink-6);
	}
	.my-search-bar .toggle:after,
	.my-search-bar .toggle:before {
		-moz-transition: all 1s;
		-o-transition: all 1s;
		-webkit-transition: all 1s;
		transition: all 1s;
		content: "";
		display: block;
		position: absolute;
		right: 0;
		width: 0;
		height: 25px;
		border-left: 4px solid var(--gray-1);
		border-radius: 4px;
		top: 0;
	}
	.my-search-bar .toggle:before {

		animation: close-one-reverse 0.85s 1 normal cubic-bezier(1, 0.01, 0.46, 1.48);

		transform: translate(-25px, 12.5px) rotate(45deg);
	}
	.my-search-bar .toggle:after {

		animation: close-two-reverse 0.85s 1 normal cubic-bezier(1, 0.01, 0.46, 1.48);

		transform: translate(-25px, 12.5px) rotate(-45deg);
	}
	.my-search-bar.closed {
		width: 50px;
	}
	.my-search-bar.closed input {
		color: var(--pink-6);
	}
	.my-search-bar.closed .toggle:before {
		height: 0px;
		transform: translate(-8px, 8px) rotate(45deg);
	}
	.my-search-bar.closed .toggle:after {
		animation: close-two 0.85s 1 normal cubic-bezier(1, 0.01, 0.46, 1.48);
		height: 25px;
		transform: translate(0, 37.5px) rotate(-45deg);
	}

	@-moz-keyframes close-one {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		10% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		60% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		100% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
	}
	@-webkit-keyframes close-one {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		10% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		60% {
			height: 0px;
			-webkit-transform: translate(-8px, 8px) rotate(45deg);
			transform: translate(-8px, 8px) rotate(45deg);
		}
		100% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
	}
	@keyframes close-one {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		10% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		60% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		100% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
	}
	@-moz-keyframes close-two {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
		60% {
			height: 2px;
			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		70% {
			height: 2px;

			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
	}
	@-webkit-keyframes close-two {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
		60% {
			height: 2px;
			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		70% {
			height: 2px;
			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
	}
	@keyframes close-two {
		0% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
		60% {
			height: 2px;

			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		70% {
			height: 2px;

			transform: translate(-6px, 37.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
	}
	@-moz-keyframes close-one-reverse {
		0% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		40% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		80% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		100% {
			height: 25px;

			transform: translate(-25px, 12.5px) rotate(45deg);
		}
	}
	@-webkit-keyframes close-one-reverse {
		0% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		40% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		80% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		100% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
	}
	@keyframes close-one-reverse {
		0% {
			height: 0px;
			transform: translate(-8px, 8px) rotate(45deg);
		}
		40% {
			height: 0px;

			transform: translate(-8px, 8px) rotate(45deg);
		}
		80% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
		100% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(45deg);
		}
	}
	@-moz-keyframes close-two-reverse {
		0% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
		40% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		50% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
	}
	@-webkit-keyframes close-two-reverse {
		0% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
		40% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		50% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
	}
	@keyframes close-two-reverse {
		0% {
			height: 25px;
			transform: translate(0, 37.5px) rotate(-45deg);
		}
		40% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		50% {
			height: 2px;
			transform: translate(-6px, 40.5px) rotate(-45deg);
		}
		100% {
			height: 25px;
			transform: translate(-25px, 12.5px) rotate(-45deg);
		}
	}
	.toggle-switch {
		background: var(--gray-2);
		width: 80px;
		height: 30px;
		overflow: hidden;
		border-radius: 3px;
		display: inline-block;
		vertical-align: middle;
		margin: 0 10px;
	}
	.toggle-switch:after {
		content: " ";
		display: block;
		width: 40px;
		height: 30px;
		background-color: var(--blue-4);
		border: 3px solid var(--gray-1);
		border-top: 0;
		border-bottom: 0;
		margin-left: -3px;
		transition: all 0.1s ease-in-out;
	}
	.active .toggle-switch:after {
		margin-left: 40px;
	}
	.toggle-label {
		display: inline-block;
		line-height: 30px;
	}
	.toggle-label-off {
		color: var(--blue-4);
	}
	.active .toggle-label-off {
		color: var(--gray-4);
	}
	.active .toggle-label-on {
		color: var(--blue-4);
	}
	.toggle-btn {
		margin-block: 1rem;
		cursor: pointer;
		/* margin-inline: 30%; */
	}

	.my-container {
		width: 40%;
		height: 80%;
		margin-inline: 30%;
		display: none;
		top: 8%;
		left: 0;
		margin-block: 2rem;
		background-image: var(--gradient-8);
		border: var(--blue-6) solid .125em;
		border-radius: .5em;
		overflow-y: scroll;
		position: fixed;

		z-index: 999
	}
	.my-resault {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.match-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
/*   column-count: 3;
  column-gap: 25px;
  column-rule: 2px solid #3366FF; */
		gap: 0.5rem;
		margin-block: 1rem;
		padding: .5rem;
		min-height: 40%;
		box-shadow: var(--shadow-4);
		width: 95%
	}
	.match-list>*{
		flex: auto;
	}
	div.match-list > p{
		flex-basis: 100%;
		text-align: center;
	}
	.match-list>*:not(p):hover{
	transform: scale(1.1);
	transition: all .5s cubic-bezier(0.47, 0, 0.745, 0.715) ;
	}
	.my-btn {
		position: relative;
		width: 20px;
		margin: 0;
		padding: 0;
	}
	.close-container {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		color: var(--red-8);
		font-size: 2.5rem;
		text-shadow: 0px 0px 5px var(--red-8);
		font-weight: 900;
		cursor: pointer;
	}

	.allemocl {
		margin-left: 4px;
		margin-bottom: 5px;
		border-radius: 8px;
		border-style: outset;
		border: 1px solid #d3d3d3;
		border-color: #d3d3d3;
		display: inline-block;
		min-width: 41px;
		width: auto;
		height: 41px;
		font-size: 26px;
		line-height: 41px;
		text-align: center;
		vertical-align: middle;
		overflow: hidden;
		cursor: pointer;
		box-shadow: 2px 0 3px 1px #bfbfbf33;
		transition: 0.5s;
	}
	.allemocl {
		border-color: rgb(21, 25, 28);
		background-color: rgb(0 0 0 /.5);
		box-shadow: var(--shadow-2);
	}
	.allemocl:hover {
		background-color: rgb(25 25 25 /.5);
		cusror: pointer;
		margin-top: -5px;
		box-shadow: var(--shadow-4);
	}
	.allegicl {
		border-radius: 8px;
		display: inline-block;
		border-style: outset;
		border: 1px solid #d3d3d3;
		border-color: #d3d3d3;
	}
`,
];
    // inject css
    document.head.insertAdjacentHTML("beforeend", "<style>" + css + "</style>");

    //firt deploy
    setTimeout(() => {
        // css();
        console.log("loaded");
        window.onload = main();
    }, 1000);
    // check url change
    function checkURLchange() {
        if (window.location.href != oldURL) {
            //css();
            $(".my-btn").remove();
            $(".my-container").remove();
            main();
            oldURL = window.location.href;
        }
    }

    let oldURL = window.location.href;
    setInterval(checkURLchange, 1000);



})();
