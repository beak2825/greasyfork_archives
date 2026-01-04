// ==UserScript==
// @name        AO3 Regraph
// @description Draw the statistics bar chart on your AO3 stats page without using google and with more user options.
// @namespace   AO3 Userscripts
// @match       http*://archiveofourown.org/users/*/stats*
// @version     1.4.1
// @history     v1.4.1 Fixed a typo that broke fancy mode 1. 2024-08-09.
// @history     v1.4 Support added for gradient or rainbow bar charts, plus a hook for inserting user code. 2024-08-08.
// @history     v1.3 Improved y-axis numbering at low numbers; locale support for number format display added. 2024-08-07.
// @history     v1.2 Word wrap support added for titles. Only wraps on spaces; will not attempt to wrap at hyphens, etc. Will DEFINITELY not hyphenate for you. Adds a fudge factor to cope with word lengths, so may occasionally produce an extra line. 2024-05-22
// @history     v1.1 Slightly kudgy fix so date sorting doesn't kill the graph. Date sorting in flat view displays date-sorted data; in fandom view it reverts to normal. 2024-05-20
// @history     v1.0 Full bar chart completed, y-axis titled, all spaces auto-calculated, variable font size and graph size introduced. READY 2024-05-06.
// @history     v0.3 Basic bar chart created (minus y-axis) WITH fandom sorting, 2024-04-20.
// @history     v0.2 Data extraction completed 2024-04-20.
// @history     v0.1 Created 2024-04-16, initial testing only.
// @author      Ardil the Traveller
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/494600/AO3%20Regraph.user.js
// @updateURL https://update.greasyfork.org/scripts/494600/AO3%20Regraph.meta.js
// ==/UserScript==

/* This is how Ardil goes to hell.
 * If you are reading this you are probably less of a noob at scripting than me. I apologise for the suffering you are about to endure.
 * I apparently will only learn any web-centric language by throwing myself wildly at it while screaming. PHP didn't deserve this abuse either. */

// The only part of the webpage this script edits is the <div id="stat_chart" class="statistics chart">.

(function () {
  "use strict";

  /* Settings */
  // BE SURE TO COPY YOUR SETTINGS BEFORE UPDATING THE SCRIPT! Updates will overwrite user settings with the defaults.

  const barFillColour = "#993333"; // Insert the hex value of your favourite colour here. At last your stats chart can be eye-melting yellow if you want.
  const barTextColour = "#BBAA88"; // Set the text that displays at the bottom of your bar to a colour you can read against your other colour.
  let numberOfBars = 8; // Don't set this above 10 unless you have a mega-wide screen...

  // Vertical height settings for the graph. The width is read from the webpage so that it still fits in whatever the original horizontal space on your screen was.
  const chart_ratio = 5; /* Height will be width divided by this number. The google value on my screen is about 10. I like 5 or so, personally.
                          * A value of 1 will make the chart square. */

  // Font and number settings for the chart:
  const yaxis_title_size = 16; // font size in px for the Y-axis title.
  const yaxis_title_font = "sans-serif"; // change the text inside the quotes if you want another font for the Y-axis title.
  const data_labels_size = 12; // font size in px for the various data labels.
  const data_labels_font = "sans-serif"; // change the text inside the quotes if you want another font for the data labels.
  const number_format = "en-GB"; // change this to your locale to use the thousands separators or other number formatting rules of your language!

  // Stat to display when sorting by date. I haven't found where AO3 keeps the date field, so fandom view date sorting doesn't work.
  const dateDisplays = "hits"; /* Your options are "hits", "kudos.count" (kudos), "comment_thread_count" (comments), "bookmarks.count" (bookmarks),
                                * "subscriptions.count" (subscriptions), or "word_count" (words).
                                * Inputting anything else other than one of EXACTLY THESE will break the graph. */

  // SUPER EXPERIMENTAL FANCY BARS
  // DO NOT TOUCH THIS UNLESS YOU ARE HAPPY WITH FAIRLY COMPLEX RULES. Otherwise leave enableFancyMode = 0 (off).
  const enableFancyMode = 0; /* Set this to 1 or 2, define your fanciness below, touch wood. When it inevitably breaks, cry, then message Ardil
                              * with what went wrong. I'll try to work out the bug and fix it for you. */
  // Fancy Mode = 1: For all bars to share a single gradient from hex colour grad_start to hex colour grad_end:
  const grad_start = "#FFFFFF"; // Choose your initial hex colour.
  const grad_end = "#000000"; // Choose your final hex colour.
  const grad_type = "graphMax"; /* Options are only "graphMax" or "barMax". "graphMax" means that only the highest bar gets the full gradient;
                                   * "barMax" means that all bars get the full gradient. Defaults to "graphMax".*/
  // Fancy Mode = 2: Bars gradiented individually. Choose a hex colour for the start and end of each bar. If you use fewer colours than you have bars,
  //                 it will repeat them until it has enough.
  const grad_starts = ["#FFFFFF", "#FF0000", "#FF00FF"]; // I recommend using as many starts as you have set numberOfBars, but it will cope if you don't.
  const grad_ends = ["#000000", "#00FFFF", "#00FF00"]; // I recommend using as many ends as you have starts, but it will cope (potentially humourously) if you don't.
  // Fancy Mode = 3: If you would rather fully define your own fanciness, ctrl-F "User Fanciness" in this document and edit the instructions
  //                 displayed in the "case 3:" block, between the "case 3:" and the "break;".

  /* End Settings */

  /*---------------------------------------------------------------------------------------------------------------------------------------------*/

  /* Function definitions */

  function addFancyChart(statistics, sorting, bar_count) {
    // magic for inserting chart goes here

    let plottingdata = []; // I use this to avoid one million switch statements to pick the right data points.
    let plottinglabels = [];
    let yaxis_title = "";

    // Choose what to sort on.
    // If we are in flat view, everything is already fine. If we are in fandom view, we will need to sort everything.

    // Kludge fix so we get _a_ graph for date sorting, even if it's not the one we'd like. I will fix this if I ever find a way to get the dates out of AO3.
    if (sorting.sortCol == "date") {
      sorting.sortCol = dateDisplays;
    }

    if (!sorting.flatView) {
      // More complicated magic for fandom mode...

      // This sorts ascending.
      switch (sorting.sortCol) {
        case "hits" :
          // Sort by hits.
          statistics.sort(function(a, b){return a.hits - b.hits});
          yaxis_title = "Hits";
          break;
        case "kudos.count" :
          // Sort by kudos.
          statistics.sort(function(a, b){return a.kudos - b.kudos});
          yaxis_title = "Kudos";
          break;
        case "comment_thread_count" :
          // Sort by comments.
          statistics.sort(function(a, b){return a.comments - b.comments});
          yaxis_title = "Comments";
          break;
        case "bookmarks.count" :
          // Sort by bookmarks.
          statistics.sort(function(a, b){return a.bookmarks - b.bookmarks});
          yaxis_title = "Bookmarks";
          break;
        case "subscriptions.count" :
          // Sort by subscriptions.
          statistics.sort(function(a, b){return a.subscriptions - b.subscriptions});
          yaxis_title = "Subscriptions";
          break;
        case "word_count" :
          // Sort by word count.
          statistics.sort(function(a, b){return a.words - b.words});
          yaxis_title = "Words";
          break;
        default :
          // What the fuck we should never be here.
          console.log("Sorting type not recognised! Graph aborted.");
          return "OW";
      } // End switch.
      if (sorting.desc) {
        // Descending sort. Reverse the order of everything.
        statistics.reverse();
      }
    }

    switch (sorting.sortCol) {
      case "hits" :
        // Sort by hits.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].hits);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Hits";
        break;
      case "kudos.count" :
        // Sort by kudos.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].kudos);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Kudos";
        break;
      case "comment_thread_count" :
        // Sort by comments.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].comments);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Comments";
        break;
      case "bookmarks.count" :
        // Sort by bookmarks.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].bookmarks);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Bookmarks";
        break;
      case "subscriptions.count" :
        // Sort by subscriptions.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].subscriptions);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Subscriptions";
        break;
      case "word_count" :
        // Sort by subscriptions.
        for (let i = 0; i < statistics.length; i++) {
          plottingdata.push(statistics[i].words);
          plottinglabels.push(statistics[i].title);
        }
        yaxis_title = "Words";
        break;
      default :
        // What the fuck we should never be here.
        console.log("Sorting type not recognised! Graph aborted.");
        return "OW";
    } // End switch.

    // Make a canvas.
    let boundaries = document.getElementById("stat_chart").getBoundingClientRect();
    //console.log("Boundaries of image area: " + JSON.stringify(boundaries));
    let inside_width = document.getElementById("stat_chart").clientWidth;
    //console.log("Client width reports: " + inside_width);

    let chart_height = inside_width / chart_ratio; // Make the graph have a constant size ratio.
    chart_height = chart_height.toFixed(0); // And make that be an actual integer number of pixels please.
    document.getElementById("stat_chart").style.height = chart_height + "px";

    // Build canvas instructions because I can't put a JS variable in my HTML string can I, that would be silly.
    document.getElementById("stat_chart").innerHTML = '<canvas id="inserted_stats" width="' + inside_width + '" height="' + chart_height + '" style="border:1px solid #AAAAAA;">';

    // Set up canvas and brush for drawing.
    const stats_canvas = document.getElementById("inserted_stats");
    const brush = stats_canvas.getContext("2d");
    // Build the font strings.
    const yaxis_title_info = yaxis_title_size + "px " + yaxis_title_font;
    const data_labels_info = data_labels_size + "px " + data_labels_font;
    brush.font = data_labels_info; // Start in data label font as we only ever need the other one once.

    // Sort out the bar count so that we don't try to display more bars than there are.
    bar_count = Math.min(bar_count, statistics.length);
    // Dump the data for bars we won't display so that the ymax doesn't look stupid.
    plottingdata = plottingdata.slice(0,bar_count);
    plottinglabels = plottinglabels.slice(0, bar_count);

    // Determine the y-axis maximum.
    let ymax = 0;
    ymax = Math.max(...plottingdata);
    //console.log(plottingdata, Math.max(...plottingdata));

    // Horizontal chart spacings:
    // There should be space for the left axis. Subtract that off first. We can work out the space needed using the width of the longest bit of text, i.e. max y
    const left_axis_space = Math.ceil(brush.measureText(Intl.NumberFormat(number_format).format(ymax)).width) + yaxis_title_size + 10; // Allows a few px either side of the labels.
    const plot_width = inside_width - left_axis_space;
    // There are bar_count columns and bar_count+1 padding spaces. Padding space should be, let's say, 1/4 the width of a column.
    // So there must be 4*bar_count + (bar_count + 1) units to divide the available space into.
    const pad_space = plot_width / (5 * bar_count + 1);
    const col_width = pad_space * 4;
    const title_width = col_width + pad_space;

    // Vertical chart spacings:
    const top_space = 10; // Allow a small amount of space so the chart doesn't touch the element above.
    // Find out if we will need to word wrap and by how much, then set the bottom_axis_space to suit.
    let max_title_lines = 0;
    for (let i = 0; i < plottinglabels.length; i++) {
      if (Math.ceil(brush.measureText(plottinglabels[i]).width / title_width + 0.25) > max_title_lines) {
        // 0.25 is a fudge factor for long words messing up clipping. Just gives us a little extra breathing room.
        max_title_lines = Math.ceil(brush.measureText(plottinglabels[i]).width / title_width);
      }
    }
    // console.log("Maximum number of title lines is " + max_title_lines);
    const bottom_axis_space = max_title_lines*data_labels_size + 4; // Allows a couple of px either side of the labels.
    const plot_height = chart_height - bottom_axis_space - top_space;
    //console.log("Plot height is now: " + plot_height + " px, and full chart height is " + chart_height + " px.");

    // Determine the y-axis scale, now with new and improved number handling and modulo 4 support for numbers < 100.
    ymax = ymax.toExponential(1); // Produces, e.g., 1.2E+2 from 196. Will always be 6 characters long.
    let the_exponent = ymax.slice(3); // Record the last three characters, i.e. the exponent (E+2, say).
    ymax = parseFloat(ymax.slice(0,3)) + 0.1; // Make sure the maximum is just a little higher than the highest value.
    ymax = ymax.toFixed(1) + the_exponent; // Put the exponent back on in string form.
    ymax = parseFloat(ymax); // Turn this back into a number.
    if (ymax < 1000) { // If the maximum is not guaranteed to be a multiple of 100, do some modulo 4 arithmetic to remove any chance of awkward decimals.
      ymax = Math.ceil(ymax/4) * 4;
    }
    // test international number formatting
    // console.log("ymax when formatted is: " + Intl.NumberFormat("en-GB").format(ymax));

    let ystep = parseInt(ymax / 4);

    // Draw y-axis values and major lines.
    const ticklen = 5;
    const tickgap = parseInt(plot_height / 4);
    brush.strokeStyle = "#888899"
    brush.lineWidth = 1;
    brush.beginPath();
    brush.moveTo(left_axis_space - ticklen, top_space);
    brush.lineTo(inside_width, top_space);
    brush.stroke();
    brush.beginPath();
    brush.moveTo(left_axis_space - ticklen, top_space + tickgap);
    brush.lineTo(inside_width, top_space + tickgap);
    brush.stroke();
    brush.beginPath();
    brush.moveTo(left_axis_space - ticklen, top_space + 2 * tickgap);
    brush.lineTo(inside_width, top_space + 2 * tickgap);
    brush.stroke();
    brush.beginPath();
    brush.moveTo(left_axis_space - ticklen, top_space + 3 * tickgap);
    brush.lineTo(inside_width, top_space + 3 * tickgap);
    brush.stroke();

    // Draw axes. Done second to avoid axes being cut by lines.
    brush.strokeStyle = "black";
    brush.beginPath();
    brush.moveTo(left_axis_space, 0);
    brush.lineTo(left_axis_space, plot_height + top_space);
    brush.lineTo(inside_width, plot_height + top_space);
    brush.stroke();
    // Y-axis labels.
    brush.textAlign = "end"
    brush.textBaseline = "middle"
    brush.fillText(Intl.NumberFormat(number_format).format(ymax), left_axis_space - ticklen, top_space);
    // console.log("measure text " + brush.measureText(ymax).width + "left space" + left_axis_space);
    brush.fillText(Intl.NumberFormat(number_format).format(ymax - ystep), left_axis_space - ticklen, top_space + tickgap);
    brush.fillText(Intl.NumberFormat(number_format).format(ymax - 2*ystep), left_axis_space - ticklen, top_space + 2*tickgap);
    brush.fillText(Intl.NumberFormat(number_format).format(ymax - 3*ystep), left_axis_space - ticklen, top_space + 3*tickgap);
    brush.fillText(0, left_axis_space - ticklen, top_space + plot_height);
    // Y-axis text involves rotating, which is complicated as it rotates as if it were THE WHOLE PICTURE. Is there a saner way to do this???
    brush.rotate(-90 * Math.PI / 180); //(0,0) now in top right corner, so the y-coord is our x value and the x-coord is our -y.
    brush.textAlign = "center";
    brush.textBaseline = "top";
    brush.font = yaxis_title_info;
    brush.fillText(yaxis_title, - (top_space + 2*tickgap), 2);
    brush.font = data_labels_info;
    brush.rotate(90 * Math.PI / 180); // Put it back to draw the rest!

    // Draw bars and x-axis labels.
    brush.strokeStyle = "black";
    brush.lineWidth = 1;
    brush.textAlign = "center";

    // Some fancy mode setup stuff, in case you haven't chosen the same number of gradients as you have bars.
    // This just replicates your gradient choices until there are enugh in the array. If you have mismatched start and end counts, it might be funny.
    let gradient_starts = [];
    let gradient_ends = [];
    if ( (enableFancyMode == 2) && ((grad_starts.length < numberOfBars) || (grad_ends.length < numberOfBars)) ) {
      let starts_repeat = Math.ceil(numberOfBars / grad_starts.length);
      let ends_repeat = Math.ceil(numberOfBars / grad_ends.length);
      for (let i = 0; i < Math.max(starts_repeat, ends_repeat); i++) {
        gradient_starts.push(grad_starts);
        gradient_ends.push(grad_ends);
      }
    }
    gradient_starts = gradient_starts.flat();
    gradient_ends = gradient_ends.flat();

    // Enter the drawing loop. Each iteration draws one bar.
    for (let i = 0; i < bar_count; i++) {
      let bar_height = plot_height * (plottingdata[i] / ymax);
      let bar_top = top_space + plot_height - bar_height;
      let bar_left = left_axis_space + pad_space + (i * (col_width + pad_space));
      switch (enableFancyMode) {
        case 1:
          let gradient1 = brush.createLinearGradient(0, top_space + plot_height, 0, top_space);
          // x0, y0, x1, y1 - start and end coordinates for gradient.
          // If it doesn't change with x, keep both x-coordinates 0. If it doesn't change with y, keep both y-coordinates 0.
          if (grad_type == "barMax") { // Change it to vary per bar.
            gradient1 = brush.createLinearGradient(0, top_space + plot_height, 0, bar_top);
          }
          gradient1.addColorStop(0, grad_start);
          gradient1.addColorStop(1, grad_end);
          brush.fillStyle = gradient1;
          brush.beginPath();
          brush.fillRect(bar_left, bar_top, col_width, bar_height);
          brush.strokeRect(bar_left, bar_top, col_width, bar_height);
          break;
        case 2:
          let gradient2 = brush.createLinearGradient(0, top_space + plot_height, 0, bar_top);
          // x0, y0, x1, y1 - start and end coordinates for gradient.
          // If it doesn't change with x, keep both x-coordinates 0. If it doesn't change with y, keep both y-coordinates 0.
          gradient2.addColorStop(0, gradient_starts[i]);
          gradient2.addColorStop(1, gradient_ends[i]);
          brush.fillStyle = gradient2;
          brush.beginPath();
          brush.fillRect(bar_left, bar_top, col_width, bar_height);
          brush.strokeRect(bar_left, bar_top, col_width, bar_height);
          break;
        case 3:
          // User Fanciness: Insert your own code here.
          /* The position of the x-axis is (top_space + plot_height), and the position of the top of the bar you are working on is bar_top.
           * The position of the left side of the bar you are working on is bar_left, and the right side is (bar_left + col_width).
           * The bar is col_width pixels wide. The command you are using to draw with is "brush".
           * Check out the other case statements for examples of how it works. */
          console.log("User has not defined fanciness! Graph cannot be drawn in this mode."); // Remove this warning when you have written code.
          break;
        default:
          // Standard single-colour bars.
          brush.fillStyle = barFillColour;
          brush.beginPath();
          brush.fillRect(bar_left, bar_top, col_width, bar_height);
          brush.strokeRect(bar_left, bar_top, col_width, bar_height);
          break;
      }

      // Magic number "+/- 2" is an offset to get the text away from the X-axis.
      brush.fillStyle = "black";
      brush.textBaseline = "top";
      // Check if we need to wrap a title.
      if (brush.measureText(plottinglabels[i]).width > title_width) {
        // Insert title wrap magic here.
        // console.log("Entering title wrap mode for title " + plottinglabels[i]);
        let split_title = [""];
        let title_line = 0;
        let title_words = plottinglabels[i].split(" "); // Splits on spaces, so there will be no spaces after the fact and we'll need to put them back.
        for (let j = 0; j < title_words.length; j++) {
          if ((brush.measureText(split_title[title_line] + " " + title_words[j]).width > title_width) && (split_title[title_line].length > 0)) {
            // Change onto a new line, UNLESS there's nothing in this line and it's just that the whole word is too long.
            // If the whole word is too long, print the word anyway, maybe you should display fewer columns. (Proper hyphenation is too hard.
            // Splitting on hyphens is also just a whole 'nother problem I don't want to deal with right now...)
            split_title.push(title_words[j]);
            title_line = title_line + 1;
          } else {
            // Continue on this line.
            if (j == 0) {
              split_title[title_line] = split_title[title_line] + title_words[j];
            } else {
              split_title[title_line] = split_title[title_line] + " " + title_words[j];
            }
          }
        } // Title suitably broken up. Hopefully. Now print the word-wrapped title.
        for (let j = 0; j < split_title.length; j++) {
          brush.fillText(split_title[j], bar_left + col_width/2, top_space + plot_height + 2 + j*data_labels_size);
        }
      } else {
        // We didn't need to word wrap. Just print the title.
        brush.fillText(plottinglabels[i], bar_left + col_width/2, top_space + plot_height + 2);
      }

      brush.fillStyle = barTextColour;
      brush.textBaseline = "bottom";
      brush.fillText(Intl.NumberFormat(number_format).format(plottingdata[i]), bar_left + col_width/2, top_space + plot_height - 2);
    } // Bar plotting complete!

    // this is shit magic for inserting text instead as a test
    // document.getElementById("stat_chart").innerHTML = "<p>I WILL BE PRETTY ONE DAY</p>";
  } //End of addFancyChart function.

  function getViewType(statspage_href) {
    // Magic for finding out what kind of view we are displaying.
    // Needs to return Fandom/Flat, Sort Column, and Asc/Desc.
    // All of these have defaults: Fandom, Hits, and Desc.
    let view_description = {flatView : false, sortCol : "hits", desc : true};

    // Analyse the input web address for flat view: if we're using flat view, the string "flat_view=true" will appear somewhere.
    if (statspage_href.search("flat_view=true") != -1) {
      view_description.flatView = true;
    }

    // Analyse the input web address for sort ascending / descending:
    if (statspage_href.search("sort_direction=ASC") != -1) {
      view_description.desc = false;
    }

    // Analyse the input web address for the sort column. This is the tricky one.
    let iscolsorted = statspage_href.search("sort_column=");
    if (iscolsorted != -1) {
      // A sort column has been chosen. Dice the string to find out which one.
      // First, dispose of everything up to and including "sort_column=".
      let sort_type = statspage_href.substring(iscolsorted + 12);
      let nextampersand = sort_type.search("&");
      sort_type = sort_type.substring(0, nextampersand);
      if (sort_type.length > 0) {
        view_description.sortCol = sort_type;
      }
    }

    return view_description;
  } // End of getViewType function.

  function getStats(sorting_type) {
    // Magic for getting the stats out of the stats page.
    // Might have to rewrite this if AO3 ever change the stats page layout.

    let all_stories = document.getElementsByClassName("fandom listbox group");
    //console.log("All stories object is: " + all_stories + ", a " + typeof(all_stories) + " with length: " + all_stories.length);
    //console.log("All stories element 0 is: " + all_stories[0] + ", a " + typeof(all_stories[0]));
    //console.log("Contents of all stories [0]: " + all_stories[0].innerHTML);

    const stories = []; // Create a stories array to store our stories. We'll return this at the end.

    if (sorting_type.flatView) {
      // In this case, all_stories will have length 1, as there is only one listbox group.

      // Get all the list elements. There should be one of these per story, each one containing one set of story tat.
      let story_list = all_stories[0].getElementsByTagName("li");
      let story_count = story_list.length;
      // I can use this to work out where the subscriptions are, and anything else that might or might not exist.
      // Involves too much string munging for my liking for me to do it that way for everything.

      // To get the fic names, find all of the <a href>s - these should only contain the names (and fic IDs if I get what's in the href).
      let extract_titles = all_stories[0].getElementsByTagName("a");
      //console.log("Extracted title 0: " + extract_titles[0].innerText);

      // Get the fandoms, conveniently in class "fandom".
      let extract_fandoms = all_stories[0].getElementsByClassName("fandom");
      //console.log("Extracted fandom 0: " + extract_fandoms[0].innerText);

      // Get the wordcounts, class "words".
      let extract_wordcounts = all_stories[0].getElementsByClassName("words");
      //console.log("Extracted wordcount 0: " + extract_wordcounts[0].innerText);

      // Get the hits. Hits text is in dt.hits, number is in dd.hits.
      let extract_hits = all_stories[0].querySelectorAll("dd.hits");
      //console.log("Extracted hits 0: " + extract_hits[0].innerText);

      // Get the kudos. Kudos text is in dt.kudos, number is in dd.kudos.
      let extract_kudos = all_stories[0].querySelectorAll("dd.kudos");
      //console.log("Extracted kudos 0: " + extract_kudos[0].innerText);

      // Get the bookmarks. Bookmarks text is in dt.bookmarks, number is in dd.bookmarks.
      let extract_bookmarks = all_stories[0].querySelectorAll("dd.bookmarks");
      //console.log("Extracted bookmarks 0: " + extract_bookmarks[0].innerText);

      // Get the comments. Comments text is in dt.comments, number is in dd.comments.
      let extract_comments = all_stories[0].querySelectorAll("dd.comments");
      //console.log("Extracted comments 0: " + extract_comments[0].innerText);

      // Process and clean the various numerical strings to get numbers. Pop each piece of data into an object. Array of objects. Thing.
      for (let i = 0; i < story_count; i++) {
        // Cut wordcount down to numbers only. Format is "(X words)" where X is the number, so we remove [0] and everything after [-7].
        let wordcount = extract_wordcounts[i].innerText;
        wordcount = wordcount.slice(1, wordcount.length-7);
        // Sort out subscriptions where they exist. They don't always exist, so be careful.
        let subs = 0;
        let subs_exist = story_list[i].innerText.search("Subscriptions: ");
        if (subs_exist != -1) {
          subs = story_list[i].innerText.slice(subs_exist+15);
          subs = subs.slice(0, subs.search(/\s/));
          subs = parseInt(subs.replace(/,/g, ""));
        }

        // Create a new story object and add it to our stories array.
        let the_story = {
          title         : extract_titles[i].innerText,
          fandoms       : extract_fandoms[i].innerText.slice(1,extract_fandoms[i].innerText.length-1),
          words         : parseInt(wordcount.replace(/,/g, "")),
          hits          : parseInt(extract_hits[i].innerText.replace(/,/g, "")),
          kudos         : parseInt(extract_kudos[i].innerText.replace(/,/g, "")),
          bookmarks     : parseInt(extract_bookmarks[i].innerText.replace(/,/g, "")),
          comments      : parseInt(extract_comments[i].innerText.replace(/,/g, "")),
          subscriptions : subs
        };
        stories.push(the_story);
      }
      // And we're done with flat view!

    } else {
      //console.log("Fandom View Detected.");

      let fandom_count = all_stories.length;
      //console.log("Assessing stories for " + fandom_count + " fandoms.");

      let titles_list = [];
      for (let i = 0; i < fandom_count; i++) {
        let fandom_name = all_stories[i].getElementsByClassName("heading");
        let fandom = fandom_name[0].innerText;
        let story_list = all_stories[i].getElementsByTagName("li");
        let story_count = story_list.length;

        // To get the fic names, find all of the <a href>s - these should only contain the names (and fic IDs if I get what's in the href).
        let extract_titles = all_stories[i].getElementsByTagName("a");
        //console.log("Extracted title 0: " + extract_titles[0].innerText);

        // Get the wordcounts, class "words".
        let extract_wordcounts = all_stories[i].getElementsByClassName("words");
        //console.log("Extracted wordcount 0: " + extract_wordcounts[0].innerText);

        // Get the hits. Hits text is in dt.hits, number is in dd.hits.
        let extract_hits = all_stories[i].querySelectorAll("dd.hits");
        //console.log("Extracted hits 0: " + extract_hits[0].innerText);

        // Get the kudos. Kudos text is in dt.kudos, number is in dd.kudos.
        let extract_kudos = all_stories[i].querySelectorAll("dd.kudos");
        //console.log("Extracted kudos 0: " + extract_kudos[0].innerText);

        // Get the bookmarks. Bookmarks text is in dt.bookmarks, number is in dd.bookmarks.
        let extract_bookmarks = all_stories[i].querySelectorAll("dd.bookmarks");
        //console.log("Extracted bookmarks 0: " + extract_bookmarks[0].innerText);

        // Get the comments. Comments text is in dt.comments, number is in dd.comments.
        let extract_comments = all_stories[i].querySelectorAll("dd.comments");
        //console.log("Extracted comments 0: " + extract_comments[0].innerText);
        for (let j = 0; j < story_count; j++) {
          let title_location = titles_list.indexOf(extract_titles[j].innerText);
          if ( title_location == -1 ) {
            // No story by this title is yet recorded. Fill in the story object.
            // Cut wordcount down to numbers only. Format is "(X words)" where X is the number, so we remove [0] and everything after [-7].
            let wordcount = extract_wordcounts[j].innerText;
            wordcount = wordcount.slice(1, wordcount.length-7);
            // Find out if subscriptions are real.
            let subs = 0;
            let subs_exist = story_list[j].innerText.search("Subscriptions: ");
            if (subs_exist != -1) {
              subs = story_list[j].innerText.slice(subs_exist+15);
              subs = subs.slice(0, subs.search(/\s/));
              subs = parseInt(subs.replace(/,/g, ""));
            }
            let the_story = {
               title         : extract_titles[j].innerText,
               fandoms       : fandom,
               words         : parseInt(wordcount.replace(/,/g, "")),
               hits          : parseInt(extract_hits[j].innerText.replace(/,/g, "")),
               kudos         : parseInt(extract_kudos[j].innerText.replace(/,/g, "")),
               bookmarks     : parseInt(extract_bookmarks[j].innerText.replace(/,/g, "")),
               comments      : parseInt(extract_comments[j].innerText.replace(/,/g, "")),
               subscriptions : subs
            }
            // Add the story to the story array.
            stories.push(the_story);
            // Add processed title to the titles list.
            titles_list.push(extract_titles[j].innerText);
          } else {
            // We already have a story by this title. Find it and add a fandom to it.
            // The story should be in the same index in stories as the title is in titles_list.
            stories[title_location].fandoms = stories[title_location].fandoms + ", " + fandom;
          }
        }
      }
    }
    // And we're done with fandom view!.
    return stories;
  }
  /* End function definitions */

  /* Main Code
   * Super awesome final magic that makes it all work happens here */

  // Figure out how we are displaying and sorting our data.
  let view_sort = getViewType(window.location.href);

  //Test if it worked:
  //console.log("View instructions: " + JSON.stringify(view_sort));

  let story_stats = getStats(view_sort);
  // Test that worked.
  //console.log("Stats exist for " + story_stats.length + " stories.");
  //console.log("First story: " + JSON.stringify(story_stats[0]));
  //console.log("Last story: " + JSON.stringify(story_stats[story_stats.length-1]));

  addFancyChart(story_stats, view_sort, numberOfBars); // HOLY SHIT IT WORKED
})();