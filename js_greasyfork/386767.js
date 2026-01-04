/**
  The MIT License (MIT)

  Copyright (c) 2019 Anveshak

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// ==UserScript==
// @name        Rainbow Selection
// @author      Anveshak, Fractalism
// @description Adapted from Shadow Selection by Anveshak. Create custom dynamic text shadows for highlighted text.
// @namespace   Fractalism
// @include     *
// @version     0.0.3
// @license MIT
// @copyright   2019, Anveshak
// @icon        http://oi63.tinypic.com/142f1tx.jpg
// @downloadURL https://update.greasyfork.org/scripts/386767/Rainbow%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/386767/Rainbow%20Selection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Parameters

    // browser: Firefox=1, Chrome=2, WebKit=3, Other=4, or use -1 to try them all
    const browser = 2;

    // shadow syntax 2
    //const shadow2 = ;
    // shadow_list: a list of shadow objects that define each text shadow    
    // shadow syntax: shadow(offset_x, offset_y, blur, RGBA(R, G, B, A))
    // offset_x, offset_y: relative position of the text shadow in pixels (right and down are the positive directions)
    // blur: blur radius of the text shadow in pixels
    // color: initial color of each shadow in RGBA, where 0<=R,G,B<=255 and 0<=A<=1
    // Note: not all algorithms make use of the color parameter
    var shadow_list = [
        shadow(3, 4, 5, RGBA(255, 255, 0, 0.7)),
        shadow(-3, -4, 5, RGBA(0, 255, 255, 0.5)),
        //shadow(1, 1, 3, RGBA(0, 0, 0, 0.6)),
    ];

    // algorithm: algorithm to use for updating text shadows
    // (using multiple algorithms might produce undefined behavior)
    const algorithm = function () {
        //fluorescence(25);
        //discrete_cycle();
        //randomize(true);
        orbit(true, 0.4);
        continuous_cycle(["F640EA", "2FF", "1DF616", "EF1", "F62C16"], 10);
    };

    // exec_interval: update text shadows every x milliseconds
    const exec_interval = 200;



    // Algorithms

    // Fluorescence:
    // RGB(0,0,0) -> RGB(255,0,0) -> RGB(255,255,0) -> RGB(255,255,255) -> RGB(0,255,255) -> RGB(0,0,255) -> RGB(0,0,0) -> start over
    // delta: step size, how much to advance R, G, or B on each iteration
    // Note: Single shadow recommended
    // Note: Same as continuous_cycle(["000000","FF0000","FFFF00","FFFFFF","00FFFF","0000FF"])
    function fluorescence(delta = 20) {
        // Initialize static variables upon first execution
        if (typeof fluorescence.stage === "undefined") {
            fluorescence.stage = 1; // the current state of the algorithm
        }

        for (let i = 0; i < shadow_count; ++i) {
            let color = shadow_list[i].color;
            switch (fluorescence.stage) {
                case 1:
                    (color.R < 255) ? (color.R = Math.min(color.R + delta, 255)) : (++fluorescence.stage);
                    break;
                case 2:
                    (color.G < 255) ? (color.G = Math.min(color.G + delta, 255)) : (++fluorescence.stage);
                    break;
                case 3:
                    (color.B < 255) ? (color.B = Math.min(color.B + delta, 255)) : (++fluorescence.stage);
                    break;
                case 4:
                    (color.R > 0) ? (color.R = Math.max(color.R - delta, 0)) : (++fluorescence.stage);
                    break;
                case 5:
                    (color.G > 0) ? (color.G = Math.max(color.G - delta, 0)) : (++fluorescence.stage);
                    break;
                case 6:
                    (color.B > 0) ? (color.B = Math.max(color.B - delta, 0)) : (fluorescence.stage = 1);
                    break;
                default:
                    throw `Error at ${fluorescence.name}`;
            }
        }
    }

    // Discrete Cycle:
    // Cycle between red, green, and blue
    // Note: Bad for the eyes, not recommended
    function discrete_cycle() {
        for (let i = 0; i < shadow_count; ++i) {
            let color = shadow_list[i].color;
            if (color.R) {
                color.R = 0;
                color.G = 255;
            } else if (color.G) {
                color.G = 0;
                color.B = 255;
            } else {
                color.B = 0;
                color.R = 255;
            }
        }
    }

    // Randomize:
    // Assign random color coordinates
    // Note: Made for single shadow
    function randomize(use_alpha = false) {
        for (let i = 0; i < shadow_count; ++i) {
            let color = shadow_list[i].color;
            color.R = Math.floor(Math.random() * 256);
            color.G = Math.floor(Math.random() * 256);
            color.B = Math.floor(Math.random() * 256);
            if (use_alpha) {
                color.A = Math.random();
            }
        }
    }

    // Orbit:
    // Shadows orbit around text
    // phaseStep: how much to advance the phase on each iteration
    // Note: Initial x,y offsets must be nonzero
    // Note: Made for multiple shadows
    function orbit(counterclockwise = true, phaseStep = 0.25) {
        if (typeof orbit.stars === "undefined") {
            orbit.stars = [];
            for (let i = 0; i < shadow_count; ++i) {
                let star = shadow_list[i];
                orbit.stars[i] = {
                    radius: Math.sqrt(Math.pow(star.offset_x, 2) + Math.pow(star.offset_y, 2)),
                    phase: Math.atan(star.offset_y / star.offset_x),
                };
                if (orbit.stars[i].radius == 0) throw "Radius cannot be zero";
            }
        }

        for (let i = 0; i < shadow_count; ++i) {
            var shadow = shadow_list[i];
            var star = orbit.stars[i];
            star.phase = (star.phase + (counterclockwise ? phaseStep : -phaseStep)) % (2 * Math.PI);
            shadow.offset_x = star.radius * Math.cos(star.phase);
            shadow.offset_y = -star.radius * Math.sin(star.phase);
        }
    }

    // Continuous cycle:
    // Cycle between any set of hex-specified colors smoothly (or set stages=1 for a discrete effect)
    // Note: Specify at least two colors
    // Note: Made for single shadow
    function continuous_cycle(color_list = ["ff0000", "00ff00", "0000ff"], stages = 10) {
        function toRGB(color_code) {
            if (color_code.length == 6) {
                return {
                    R: parseInt(color_code.substr(0, 2), 16),
                    G: parseInt(color_code.substr(2, 2), 16),
                    B: parseInt(color_code.substr(4, 2), 16),
                }
            } else if (color_code.length == 3) {
                return {
                    R: parseInt(color_code.substr(0, 1).repeat(2), 16),
                    G: parseInt(color_code.substr(1, 1).repeat(2), 16),
                    B: parseInt(color_code.substr(2, 1).repeat(2), 16),
                }
            } else {
                throw "Wrong color code"
            }
        }

        if (typeof continuous_cycle.src_color === "undefined") {
            continuous_cycle.dst_index = 1;
            continuous_cycle.src_color = toRGB(color_list[0]);
            continuous_cycle.dst_color = toRGB(color_list[1]);
            continuous_cycle.step = [
                (continuous_cycle.dst_color.R - continuous_cycle.src_color.R) / stages,
                (continuous_cycle.dst_color.G - continuous_cycle.src_color.G) / stages,
                (continuous_cycle.dst_color.B - continuous_cycle.src_color.B) / stages,
            ];
            continuous_cycle.stage = 0;
        }

        for (let i = 0; i < shadow_count; ++i) {
            shadow_list[i].color.R = continuous_cycle.src_color.R + Math.round(continuous_cycle.stage * continuous_cycle.step[0]);
            shadow_list[i].color.G = continuous_cycle.src_color.G + Math.round(continuous_cycle.stage * continuous_cycle.step[1]);
            shadow_list[i].color.B = continuous_cycle.src_color.B + Math.round(continuous_cycle.stage * continuous_cycle.step[2]);
        }
        ++continuous_cycle.stage;

        if (continuous_cycle.stage == stages) {
            continuous_cycle.src_color = continuous_cycle.dst_color;
            continuous_cycle.dst_index = (continuous_cycle.dst_index == color_list.length - 1) ? (0) : (continuous_cycle.dst_index + 1);
            continuous_cycle.dst_color = toRGB(color_list[continuous_cycle.dst_index]);
            continuous_cycle.step = [
                (continuous_cycle.dst_color.R - continuous_cycle.src_color.R) / stages,
                (continuous_cycle.dst_color.G - continuous_cycle.src_color.G) / stages,
                (continuous_cycle.dst_color.B - continuous_cycle.src_color.B) / stages,
            ];
            continuous_cycle.stage = 0;
        }
    }



    // Main program

    var shadow_count = shadow_list.length;
    var styleNode = document.createElement("style");
    document.head.appendChild(styleNode);

    // execute the selected algorithm once to obtain the next set of text shadows, then apply it to the document
    function update_shadows() {
        algorithm();
        var shadow_str = "";
        for (let i = 0; i < shadow_count; ++i) {
            if (i > 0) shadow_str += ",";
            shadow_str += shadow_list[i].offset_x + "px ";
            shadow_str += shadow_list[i].offset_y + "px ";
            shadow_str += shadow_list[i].blur + "px ";
            shadow_str += `rgba(${shadow_list[i].color.R}, ${shadow_list[i].color.G}, ${shadow_list[i].color.B}, ${shadow_list[i].color.A})`;
        }

        var selection_Content = `color: #000; background: none; text-shadow: ${shadow_str};`;
        var a_selection_Content = `color: #000; background: none; text-shadow: ${shadow_str};`;
        var input_selection_Content = `color: #3356C6; background: none;`;

        var style_str;
        switch (browser) {
            case 1:
                style_str = `
                    ::-moz-selection { ${selection_Content} }
                    a::selection { ${a_selection_Content} }
                `;
                break;
            case 2:
                style_str = `
                    ::selection { ${selection_Content} }
                    a::selection { ${a_selection_Content} }
                    input::selection { ${input_selection_Content} }
                `;
                break;
            case 3:
                style_str = `
                    ::-webkit-selection { ${selection_Content} }
                    a::selection { ${a_selection_Content} }
                `;
                break;
            case 4:
                style_str = `
                    ::-ms-selection { ${selection_Content} }
                    ::-o-selection { ${selection_Content} }
                    a::selection { ${a_selection_Content} }
                `;
                break;
            default:
                style_str = `
                    ::-moz-selection { ${selection_Content} }
                    ::-webkit-selection { ${selection_Content} }
                    ::-ms-selection { ${selection_Content} }
                    ::-o-selection { ${selection_Content} }
                    ::selection { ${selection_Content} }
                    a::selection { ${a_selection_Content} }
                    input::selection { ${input_selection_Content} }
                `;
        }
        styleNode.innerHTML = style_str;
    }

    // Let the party begin
    setInterval(function () {
        try {
            update_shadows();
        } catch (err) {
            console.error("Error encountered:", err);
        }
    }, exec_interval);



    // utility functions

    function RGBA(red, green, blue, alpha) {
        return {
            R: red,
            G: green,
            B: blue,
            A: alpha,
        };
    }

    function shadow(offset_x, offset_y, blur, color) {
        return {
            offset_x: offset_x,
            offset_y: offset_y,
            blur: blur,
            color: color,
        }
    }

})()
