// ==UserScript==
// @name         Neggsweeper AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-06-21
// @description  Neggsweeper AP and also format for minesweeper solver
// @author       You
// @match        https://www.grundos.cafe/games/neggsweeper/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538978/Neggsweeper%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/538978/Neggsweeper%20AP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }


    var neggs_won = GM_getValue('neggs_wonkey', "");
    var remaining = GM_getValue('remainingkey', 0);
    var remaining_number = Number($(`.bigfont:first`).text())


    $('img.negg.negg-sweeper-tile').each(function (index) {
        var coords = $(this).attr("data-coords");
        var x_x = coords.substring(0, coords.lastIndexOf(","));
        var y_y = coords.substring(coords.indexOf(",") + 1);

        $(this).attr("x_axis", x_x);
        $(this).attr("y_axis", y_y);
        //        $(this).attr("status", "unknown");
        if ($('img.negg.negg-sweeper-tile').length - 1 == index) {
            add_coords()
        }

    })

    var solver_input = [];
    var new_row = [];
    var cols = $('main style').html();
    cols = Number(cols.substring(cols.indexOf("-rows: ") + 7,
                                 cols.lastIndexOf(";\n")));
    if ($(`.negg_mine`).length == 0 ) {
        setTimeout(function () {
            $(`[data-coords="13,13"]`).click()
        }, getRandomInt(500, 1500));
    }

    $('.center.mt-2:first').after(neggs_won)

    if ( $('p.bold.center:contains(You Lose!!!)').length == 1) {

        setTimeout(function () {
            $('[value*="Start Hard Game ("]').click();
        }, getRandomInt(1000, 2000));
    } else if ( $('p.bold.center:contains(You Won!!!)').length == 1) {


        var negg_won = $(`p:contains(You also win)`).text();
        negg_won = negg_won.substring(
            negg_won.indexOf("win a ") + 6,
            negg_won.lastIndexOf("!")
        );
        var today = new Date();
        var nstDate = today.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
        console.log(`${nstDate}: ${negg_won}`)


        neggs_won += `<div>${nstDate}: ${negg_won}</div>`;
        GM_setValue('neggs_wonkey', neggs_won);

        setTimeout(function () {
            $('[value*="Start Hard Game (150"]').click();
        }, getRandomInt(1000, 2000));
    }

    $('.negg-sweeper-tile').each(function(index){
        var symbol = "H";

        if ( $(this).attr("src") == "https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif" ){
            symbol = 'F';
        } else if ( $(this).attr("src") == "https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/negg.gif" ){
            symbol = 'H';
        } else if ( $(this).hasClass("num_0") ){
            symbol = 0;
        } else{
            symbol = $(this).text();
        }

        new_row.push(symbol)
        if (index + 1 == $('.negg-sweeper-tile').length ){
            //  console.log(new_row)

            printArr(new_row)

        }
    })
    function printArr(solver_input) {
        var mines = 10;
        if (cols == 14 ) {
            mines = 40;
        } else if (cols == 12 ) {
            mines = 25;
        }
        $('#neggsweeper_grid').after(`
<br><textarea id="pastethis">${cols}x${cols}x${mines}
</textarea>
<br><a href="https://davidnhill.github.io/JSMinesweeper/index.html?board=14x14x40">JSMinesweeper</a>`)


        for (var i = 0; i < solver_input.length; i++) {
            $('#pastethis').append(solver_input[i]);
            if (i % cols == cols - 1 ) {
                $('#pastethis').append(`
`);
            }
        }
    }


    function add_coords() {
        var cols = $('main style').html();
        cols = Number(cols.substring(cols.indexOf("-rows: ") + 7,
                                     cols.lastIndexOf(";\n")));


        $('#neggsweeper_grid .negg_mine').each(function (index) {
            var index_mine = $(this).index() + 1;
            $(this).attr("index",index_mine)
            var x_axis = Math.floor(index_mine / cols)
            var y_axis = index_mine % cols - 1;
            if (index_mine % cols == 0) {
                $(this).attr("x_axis", x_axis - 1);
                //  console.log(x_axis - 1)
            } else {
                $(this).attr("x_axis", x_axis);
            }
            //  console.log(`${x_axis},${y_axis}`)
            if (y_axis == -1) {
                $(this).attr("y_axis", cols - 1);

            } else {
                $(this).attr("y_axis", y_axis);
            }

            if ($('#neggsweeper_grid .negg_mine').length - 1 == index) {
                find_flags()
                hover_coords()
            }

        })
    }

    function hover_coords() {
        $('.negg-sweeper-tile').hover(function (index) {
            var x_axis = $(this).attr("x_axis");
            var y_axis = $(this).attr("y_axis");
            //   console.log(`${x_axis},${y_axis}`)
            $(this).attr("title",`${x_axis},${y_axis}`);
        })
    }
    function find_flags() {
        $('#neggsweeper_grid .negg_mine:not(.num_0)').each(function (index) {

            var x_axis = Number($(this).attr("x_axis"));
            var y_axis = Number($(this).attr("y_axis"));
            var text = Number($(this).text())
            // console.log(`${x_axis},${y_axis} is a number`)

            var neighbour = [
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis}"]`),
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis + 1}"]`),
                $(`img[x_axis="${x_axis}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis}"][y_axis="${y_axis + 1}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis + 1}"]`)
            ];

            var how_many_img = 0;
            var how_many_flag = 0;
            for (var i = 0; i < 8; i++) {
                //      console.log(neighbour[i])
                var src = neighbour[i].attr("src");

                if (typeof src !== 'undefined' && src !== false) {

                    how_many_img++

                    if (src == "https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif") {
                        how_many_flag++
                    }
                    neighbour[i].addClass("flag_this")
                    neighbour[i].attr("re", `${x_axis},${y_axis}`)
                }

                if (i == 7) {
                    if (text == how_many_img && how_many_img !== how_many_flag) {
                        console.log(`${x_axis},${y_axis} has ${how_many_img} images and ${how_many_flag} flag`)
                        $(this).attr("style", "background:pink")
                        $('.flag_this[src="https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif"]').removeClass('flag_this')

                        if (!$('#flag_it').is(":checked")) {
                            $(`input#flag_it`).click()
                            setTimeout(function () {
                                $('.flag_this:first').click()
                            }, getRandomInt(1000, 2000));
                        }else {

                            setTimeout(function () {
                                $('.flag_this:first').click()
                            }, getRandomInt(500, 1500));
                        }
                        return false
                    } else {
                        $(`img.negg`).removeClass("flag_this")
                    }


                    if (index == $('#neggsweeper_grid .negg_mine:not(.num_0)').length - 1) {
                        if ($('.flag_this').length == 0) {
                            console.log('move onto safe clicking')
                            safe_clicking()
                        }
                    }
                }



            }
        })

    }

    function safe_clicking() {
        $('#neggsweeper_grid .negg_mine:not(.num_0)').each(function (index) {

            var x_axis = Number($(this).attr("x_axis"));
            var y_axis = Number($(this).attr("y_axis"));
            var text = Number($(this).text())
            // console.log(`${x_axis},${y_axis} is a number`)

            var neighbour = [
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis}"]`),
                $(`img[x_axis="${x_axis - 1}"][y_axis="${y_axis + 1}"]`),
                $(`img[x_axis="${x_axis}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis}"][y_axis="${y_axis + 1}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis - 1}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis}"]`),
                $(`img[x_axis="${x_axis + 1}"][y_axis="${y_axis + 1}"]`)
            ];

            var how_many_img = 0;
            var how_many_flag = 0;
            for (var i = 0; i < 8; i++) {
                //      console.log(neighbour[i])
                var src = neighbour[i].attr("src");

                if (typeof src !== 'undefined' && src !== false) {

                    how_many_img++

                    if (src == "https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif") {
                        how_many_flag++
                    }
                    neighbour[i].addClass("safe_this")
                    neighbour[i].attr("re", `${x_axis},${y_axis}`)
                }

                if (i == 7) {



                    if (text == how_many_flag && how_many_img !== how_many_flag) {
                        console.log(`${x_axis},${y_axis} has ${how_many_img} images and ${how_many_flag} flag`)
                        $(this).attr("style", "background:lightblue")
                        $('.safe_this[src="https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/flagnegg.gif"]').removeClass('safe_this')

                        if ($('#flag_it').is(":checked")) {
                            $(`input#flag_it`).click()
                            setTimeout(function () {
                                $('.safe_this:first').click()
                            }, getRandomInt(1000, 2000));

                        } else {
                            setTimeout(function () {
                                $('.safe_this:first').click()
                            }, getRandomInt(500, 1500));
                        }
                        return false
                    } else {
                        $('.safe_this').removeClass('safe_this')
                    }
                    console.log(`length ` + $('#neggsweeper_grid .negg_mine:not(.num_0)').length )

                    if ( $('#neggsweeper_grid .negg_mine:not(.num_0)').length  == index + 1) {

                        $(`body`).append(`<style>#pastethis { display:block!important;border: 1px solid red; background-color: yellow; }</style>`)

                        if (remaining_number + 1 !== remaining && remaining_number !== remaining) {
                            new Audio('http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatedible.ogg').play()
                        }

                        GM_setValue('remainingkey', remaining_number);
                    }

                }



            }
        })


    }

    $('body').append(`<style>
@import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");
#pastethis {
  font-family: "Space Mono", monospace;
  width: 200px;
  height: 200px;
  text-align: left;
  display:none;
}

.flag_this {
  filter: brightness(0.5);
}
.safe_this {
  filter: brightness(1.5);
}
.biggie {
  z-index: 2;
  width: 400px;
  height: 400px;
  position: absolute;
  top: 345px;
  left: 230px;
}
</style>`)
})();