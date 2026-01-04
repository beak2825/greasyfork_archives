// @license; MIT
// Grid

// License: https://raw.githubusercontent.com/EbbDrop/SmarterSmartchool/main/LICENSE

let wideToolbarCallback = function (mutationsList, _) {
  for (let mutation of mutationsList) {
    if (mutation.type == 'childList' && mutation.removedNodes.length != 0) {
      for (const node of mutation.removedNodes) {
        if (node.id == "show-grid2") {
          $(".wide-toolbar").append(node);
        }
      }
    }
  }
};

let wideToolbarObserver = new MutationObserver(wideToolbarCallback);

let smscMainCallback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type == 'childList' && mutation.addedNodes.length == 1 && mutation.addedNodes[0].classList.contains('wide-toolbar')) {
      observer.disconnect();
      wideToolbarObserver.observe($('.wide-toolbar')[0], { attributes: false, childList: true, subtree: false });
      onLoad();
      addButton();
    }
  }
};

let smscMainObserver = new MutationObserver(smscMainCallback);
smscMainObserver.observe($('#smscMain')[0], { attributes: false, childList: true, subtree: false });

function totalToStr(total_numerator, total_denominator) {
  return (Math.round(total_numerator / total_denominator * 1000) / 10).toString() + '%';
}

function addButton() {
  var imageLink = "https://www.smartschool.be/wp/wp-content/uploads/2018/09/smartschool_app_logo_100x100.png"
  $(".wide-toolbar").append(
    $("<button/>")
      .attr("id", "show-grid2")
      .addClass("wide-toolbar__item")
      .append(
        $("<img/>")
          .addClass("wide-toolbar__item__icon")
          .attr("src", imageLink)
      )
      .append(
        $("<span/>").addClass("wide-toolbar__item__name").text("Grid")
      )
      .click(openGrid)
  );
}


function makeGrid() {
  let loading = $("<h3>Loading!</h3>");
  fetch('/results/api/v1/evaluations?itemsOnPage=500').then(r => r.json()).then(results => {
    let data = {};
    let course_to_graphic = {};
    let latest_period = null;
    for (const result of results) {
      if (result["type"] != "normal") {
        continue;
      }
      let period = result["period"]["name"];
      if (latest_period === null) {
        latest_period = period;
      }
      if (!(period in data)) {
        data[period] = {};
      }

      period = data[period];
      for (const course of result["courses"]) {
        course_to_graphic[course["name"]] = course["graphic"];
        const course_name = course["name"];
        if (!(course_name in period)) {
          period[course_name] = [];
        }
        period[course_name].push({ "date": result["date"], "name": result["name"], "graphic": result["graphic"] });
      }
    }

    for (let period_name of Object.keys(data)) {
      let period = data[period_name];

      let grid = $("<div/>").attr("id", "period").append($("<h2/>").text(period_name + ":"));
      let table = $("<table/>").attr("id", "result-table");

      let longest = 0;
      for (let [_, course] of Object.entries(period)) {
        course.sort((a, b) => { return a["date"].localeCompare(b["date"]); });
        if (course.length > longest) {
          longest = course.length;
        }
      }
      // Add row for disclamer
      let disc_row = $("<tr/>");
      for (let i = 0; i < longest + 1; i++) {
        disc_row.append($("<td/>").addClass("hidden-cell"));
      }
      disc_row.append($("<td/>").attr("id", "disclamer").text("!"));
      table.append(disc_row);

      let overallTotalNumerator = 0;
      let overallTotalDenominator = 0;

      for (let [course_name, course] of Object.entries(period)) {
        let row = $("<tr/>");
        if (course_to_graphic[course_name].type == "icon") {
          row.append($("<th/>").append(
            $("<span/>")
              .addClass("icon-label icon-label--24 smsc-svg--" + course_to_graphic[course_name]["value"] + "--24")
              .text(course_name)
          ));
        } else {
          row.append($("<th/>").text(course_name));
        }

        let total_numerator = 0;
        let total_denominator = 0;

        for (const result of course) {
          const desc = result["graphic"]["description"];
          const color = result["graphic"]["color"];
          const name = result["name"];

          row.append($("<td/>").addClass("c-" + color + "-combo--100").attr({ id: "details", content: name }).text(desc));

          let match = desc.match(/^([\d\,\.]+)\/([\d\,\.]+)$/);
          if (match) {
            total_numerator += parseFloat(match[1].replace(',', '.'));
            total_denominator += parseFloat(match[2].replace(',', '.'));
          }
        }

        for (let i = 0; i < longest - course.length; i++) {
          row.append($("<td/>"));
        }

        let last_cell = $("<td/>").addClass("total");
        if (total_denominator != 0) {
          last_cell.text(totalToStr(total_numerator, total_denominator));
          if (total_numerator / total_denominator < 0.5) {
            last_cell.addClass('is-low');
          }
        }
        row.append(last_cell);

        overallTotalNumerator += total_numerator;
        overallTotalDenominator += total_denominator;

        table.append(row);
      }

      let overallTotalRow = $("<tr/>");
      overallTotalRow.append($("<th/>").text("Total"));
      for (let i = 0; i < longest; i++) {
        overallTotalRow.append($("<td/>"));
      }
      let overallTotalCell = $("<td/>").addClass("total");
      if (overallTotalDenominator != 0) {
        overallTotalCell.text(totalToStr(overallTotalNumerator, overallTotalDenominator));
        if (overallTotalNumerator / overallTotalDenominator < 0.5) {
          overallTotalCell.addClass('is-low');
        }
      }
      overallTotalRow.append(overallTotalCell);
      table.append(overallTotalRow);

      grid.append($("<div/>").attr("id", "table-container").append(table));
      data[period_name] = grid;
    }

    let modal = $("<div/>").attr("id", "content-container");
    let period_buttons = $("<div/>");
    let main_grid = $("<div/>").attr("id", "period-container");
    for (let [period_name, grid] of Object.entries(data).reverse()) {
      // We are using two lambda's sice otherwice they will all use the same scope.
      period_buttons.append($("<button/>").addClass("period_button").text(period_name).click(((grid) => {
        return () => {
          main_grid.empty();
          main_grid.append(grid);
        };
      })(grid)));
    }
    if (period_buttons.children().length > 1) {
      period_buttons.prepend($("<span/>").text("Select period: "));
      modal.append(period_buttons);
    }

    if (latest_period !== null) {
      main_grid.append(data[latest_period]);
    }
    modal.append(main_grid);
    loading.replaceWith(modal);
  });
  return loading;
}

function onLoad() {
  let style = document.createElement('style');
  style.innerHTML = `

#result-table #disclamer {
    border: none !important;
    color: red;
    font-weight: bold;
    position: relative;
}
    
#disclamer:hover::before {
    visibility: visible;
    opacity: 1;
}
    
#disclamer::before {
    z-index: 1;
    content: "Deze totalen kunnen afwijken van uw werkelijke resultaten doordat niet altijd alle gegevens gekend zijn.";
    position: absolute;
    left: -20rem;
    border: 3px solid red;
    padding: 0.2rem;
    border-radius: 3px;
    background-color: white;
    width: 20rem;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear;
}
    
#details {
  position: relative;
}

#details:hover::before {
  visibility: visible;
  opacity: 0.9;
}

#details::before {
  z-index: 2;
  content: attr(content);
  color: white;
  background-color: #1a1a1a;
  visibility: hidden;
  position: absolute;
  text-align: center;
  padding: 0.313rem 0;
  border-radius: 0.375rem;
  opacity: 0;
  transition: opacity .6s;
  width: 15rem;
  top: 100%;
  left: 50%;
  margin-left: -7.5rem;
}

#result-table .hidden-cell {
  border: none !important;
}

.period_button {
  background-color: #ff520e;
  border-radius: 3px;
  border-style: none;
  color: #FFFFFF;
  margin-right: 0.5rem;
  padding: 0.4rem;
  text-align: center;
  transition: 100ms;
}

.period_button:hover {
  background-color: #ef4200;
}

.period_button:active {
  background-color: #ff6210;
}

.total {
    font-weight: bold;
}

.is-low {
    color: red !important;
}

#table-container {
  flex: 1 1 auto;
  overflow: auto;
}

#period {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#period-container {
  flex: 1;
  min-height: 0;
}

#content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#result-table {
    margin-top: 1rem;
    border: 0px;
}

#result-table th {
    text-align: left;
}

#result-table td {
    text-align: center;
}

#result-table th, #result-table td {
    border: 1px solid gray !important;
    padding: 0.5rem;
    min-width: 5.5rem;
}
 
#modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: .50;
    -webkit-opacity: .5;
    -moz-opacity: .5;
    filter: alpha(opacity=50);
    z-index: 1000;
}

#modal-content {
    background-color: white;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    box-shadow: 0 0 20px 0 #222;
    -webkit-box-shadow: 0 0 20px 0 #222;
    -moz-box-shadow: 0 0 20px 0 #222;
    display: none;
    padding: 10px;
    position: fixed;
    z-index: 1000;
    left: 10%;
    top: 10%;
    width: 80%;
    height: 80%;
}

#modal-background.active, #modal-content.active {
    display: block;
}

#modal-close {
  background-color: #ee0000;
  border-radius: 3px;
  border-style: none;
  color: #FFFFFF;
  padding: 0.4rem;
  text-align: center;
  transition: 100ms;
  position: absolute;
  right: 0.5rem;
}
#modal-close:hover {
  background-color: #dd0000;
}
#modal-close:active {
  background-color: #ff0000;
}
    `;
  document.head.appendChild(style);

  $("body").append(
    $("<div/>").attr("id", "modal-background")
  ).append(
    $("<div/>").attr("id", "modal-content").append(
      $("<button/>").attr("id", "modal-close").text("Close")
    ).append(makeGrid())
  );

  $("#modal-background, #modal-close").click(function () {
    $("#modal-content, #modal-background").toggleClass("active");
  });
}

function openGrid() {
  $("#modal-content, #modal-background").toggleClass("active");
}
