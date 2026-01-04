// ==UserScript==
// @name        King County eRealProperty Enhancements
// @match       *://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?*
// @grant       none
// @version     1.0.3
// @description Enhance the display on King County eRealProperty dashboards
// @copyright   2020, Chang Lan <me@changlan.org>
// @license     MIT
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.55.2/plotly.min.js
// @namespace https://greasyfork.org/users/687714
// @downloadURL https://update.greasyfork.org/scripts/411390/King%20County%20eRealProperty%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/411390/King%20County%20eRealProperty%20Enhancements.meta.js
// ==/UserScript==

$.noConflict();
$(document).ready(function () {
  const table = $('table#cphContent_GridViewDBTaxRoll');
  const header = table.find('tr.GridViewHeaderStyle');
  header.append('<th scope="col">Appreciation (%)</th>');
  const rows = table.find('tr.GridViewRowStyle,tr.GridViewAlternatingRowStyle');

  $('table#cphContent_GridViewDBTaxRoll').parent().parent().prepend('<div id="chart" style="width:1000;height:400px;"></div>');

  let x = [];
  let y = [];
  
  let cummulative_appreciation = 1.0;
  let cummulative_years = 0;
  
  let cols = $(rows[0]).children();
  
  let prev_val = parseFloat(cols.last().text().replace(/,/g, ''));
  let prev_year = parseInt(cols.first().text());
  
  for (i = 1; i < rows.length; ++i) {
    let cols = $(rows[i]).children()
    const val = parseFloat(cols.last().text().replace(/,/g, ''));
    const year = parseInt(cols.first().text());
    const num_years = prev_year - year;
    
    const appreciation = Math.pow(prev_val / val, 1.0 / num_years);
    const imp_val = parseFloat(cols.eq(-2).text().replace(/,/g, ''));
    
    $(rows[i-1]).append('<td>' + ((appreciation-1) * 100).toFixed(2) + '% </td>');
    console.log(num_years);
    
    if (imp_val > 0) {
      x.push(prev_year);
      y.push((appreciation-1) * 100);
      cummulative_appreciation *= Math.pow(appreciation, num_years);
      cummulative_years += num_years;
    }
    
    prev_val = val;
    prev_year = year;
  }
  
  const geomean = Math.pow(cummulative_appreciation, 1.0 / cummulative_years);

  let ctx = document.getElementById('chart');
  let layout = {
    title: 'geomean = ' + ((geomean-1) * 100).toFixed(2) + '%',
    shapes: [{
      type: 'line',
      xref: 'paper',
      x0: 0,
      y0: geomean,
      x1: 1,
      y1: geomean,
      line: {
        color: 'rgb(255, 0, 0)',
        width: 1,
        dash: 'dot'
      }
    }]
  }
  Plotly.newPlot(ctx, [{
    x: x,
    y: y,
    type: 'scatter',
  }], layout);
});
