// ==UserScript==
// @name         Saturn
// @namespace    http://tampermonkey.net/
// @version      v0.8.2
// @description  take over the world!
// @author       You
// @match        https://*.ourworldoftext.com/*
// @icon         https://media.discordapp.net/attachments/367475763680641024/1185806886130417854/New_Piskel-1.png_37.png?format=png&quality=lossless&width=160&height=160
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482903/Saturn.user.js
// @updateURL https://update.greasyfork.org/scripts/482903/Saturn.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    function calculateContrastYIQ(
        hexColor) {
        const [red, green,
        blue] = hexColor.match(/\w\w/g).map(
            c => parseInt(c,
                16));
        const yiq = ((red *
                299) + (green *
                    587) + (
                    blue * 114)
                ) / 1000;
        return yiq >= 128 ?
            'black' : 'white';
    };
    const fetchStyle = (
    url) => {
        return new Promise((
                resolve,
                reject
                ) => {
                const
                    link =
                    document
                    .createElement(
                        'link'
                        );
                link.type =
                    'text/css';
                link.rel =
                    'stylesheet';
                link.onload =
                    resolve;
                link.onerror =
                    reject;
                link.href =
                    url;
                const
                    headScript =
                    document
                    .querySelector(
                        'script'
                        );
                headScript
                    .parentNode
                    .insertBefore(
                        link,
                        headScript
                        );
            });
    };
    const loadExternalScript =
        async (url) => {
            return new Promise(
                (resolve,
                    reject
                    ) => {
                    const
                        script =
                        document
                        .createElement(
                            'script'
                            );
                    script
                        .type =
                        'text/javascript';
                    script
                        .async =
                        true;
                    script
                        .src =
                        url;
                    script
                        .onload =
                        resolve;
                    script
                        .onerror =
                        reject;
                    document
                        .head
                        .appendChild(
                            script
                            );
                });
        };
    const delay = (time) => {
        return new Promise(
            res => {
                setTimeout
                    (res,
                        time
                        )
            });
    };
    let esc = "\x1b";

    function decoration(text,
        bold, italic, under,
        strike) {
        let output = "";
        for (let i = 0; i < text
            .length; i++) {
            let char = text[i];
            output +=
                setCharTextDecorations(
                    char, bold,
                    italic,
                    under,
                    strike);
        };
        return output;
    };

    function color(text, color =
        "000000") {
        return `${esc}F${color.toString().toLowerCase()}${text}`;
    };
    if (!document.querySelector(
            "#owot")) return;
    var oldString = "";
    var oldX = 0;
    var oldY = 0;
    window.writeToXY = function(
        text, textColor, x,
        y, bgColor = -1) {
        let parser =
            textcode_parser(
                text,
                xyToTile(x,
                    y),
                textColor,
                bgColor);
        let origX = x;
        let over = false;
        let letters = [];
        let maxWidth = 0;
        let maxHeight = 0;
        let currentWidth =
        0;
        let currentHeight =
            1;
        oldX = x;
        oldY = y;
        oldString = text;
        while (!over) {
            let next =
                parser
                .next();
            if (next == -
                1) {
                over = true;
            } else if (next
                .type ==
                "char") {
                let xy =
                    tileToXY(
                        [next
                            .tileX,
                            next
                            .tileY,
                            next
                            .charX,
                            next
                            .charY
                            ]);
                writeCharToXY
                    (next
                        .char,
                        next
                        .color,
                        xy[
                            0],
                        xy[
                            1],
                        next
                        .bgColor
                        );
                letters
                    .push({
                        char: next
                            .char,
                        x: xy[
                            0],
                        y: xy[
                            1]
                    });
                // Update width and height calculations
                currentWidth
                    = Math
                    .max(
                        currentWidth,
                        xy[
                            0] -
                        origX +
                        1);
                currentHeight
                    = Math
                    .max(
                        currentHeight,
                        xy[
                            1] -
                        oldY +
                        1);
            };
        };
        maxWidth =
            currentWidth;
        maxHeight =
            currentHeight;
        return {
            clear: function() {
                letters
                    .forEach(
                        function(
                            letter
                            ) {
                            writeCharToXY
                                ("", 0,
                                    letter
                                    .x,
                                    letter
                                    .y
                                    );
                        }
                        );
            },
            width: maxWidth,
            height: maxHeight
        };
    };

    function componentToHex(c) {
        var hex = c.toString(
        16);
        return hex.length == 1 ?
            "0" + hex : hex;
    };

    function rgbToHex(r, g, b) {
        return componentToHex(
            r) + componentToHex(
                g) +
            componentToHex(b);
    };

    function hexToRgb(hex) {
        var shorthandRegex =
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(
            shorthandRegex,
            function(m, r,
                g, b) {
                return r +
                    r + g +
                    g + b +
                    b;
            });
        var result =
            /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
            .exec(hex);
        return result ? {
            r: parseInt(
                result[
                    1],
                16),
            g: parseInt(
                result[
                    2],
                16),
            b: parseInt(
                result[
                    3],
                16)
        } : null;
    };

    function clamp(value, min,
        max) {
        if (value < min) {
            return min;
        } else if (value >
            max) {
            return max;
        }
        return value;
    }

    function percOf(total,
        percentage) {
        // Ensure that the input values are numbers
        if (typeof total !==
            'number' ||
            typeof percentage !==
            'number') {
            throw new Error(
                'Both arguments must be numbers'
                );
        };
        // Calculate the percentage
        const result = (
            percentage / 100
            ) * total;
        // Return the result
        return result;
    };
    window.tileToXY = function(
        pos) {
        return [(pos[0] *
                16 +
                pos[2]),
            (pos[1] * 8 + pos[3])];
    };
    window.xyToTile = function(
        x, y) {
        return {
            tileX: Math
                .floor(x /
                    tileC),
            tileY: Math
                .floor(y /
                    tileR),
            charX: x - Math
                .floor(x /
                    tileC) *
                tileC,
            charY: y - Math
                .floor(y /
                    tileR) *
                tileR
        }
    };
    cyclePaste = function() {};
    w.on("paste",
    async function(e) {
            let parser =
                textcode_parser(
                    e
                    .text, {
                        tileX: e
                            .tileX,
                        tileY: e
                            .tileY,
                        charX: e
                            .charX,
                        charY: e
                            .charY
                    },
                    YourWorld
                    .Color,
                    YourWorld
                    .BgColor
                    );
            let over =
                false;
            let i = 0;
            while (!
                over) {
                i += 1;
                let next =
                    await parser
                    .next();
                if (next ==
                    -1
                    ) {
                    over =
                        true;
                };
                if (next
                    .type ==
                    "char"
                    ) {
                    await writeChar
                        (next
                            .char,
                            false,
                            next
                            .color,
                            false,
                            0,
                            next
                            .bgColor
                            );
                    if (i %
                        32 ==
                        0
                        )
                        delay(
                            1
                            );
                } else if (
                    next
                    .type ==
                    "link"
                    ) {
                    let coords = {
                        tileX: next
                            .tileX,
                        tileY: next
                            .tileY,
                        charX: next
                            .charX,
                        charY: next
                            .charY
                    }
                    if (next
                        .linkType ==
                        "url"
                        ) {
                        linkQueue
                            .push(
                                ["url",
                                    next
                                    .tileX,
                                    next
                                    .tileY,
                                    next
                                    .charX,
                                    next
                                    .charY,
                                    next
                                    .url
                                    ]);
                    } else if (
                        next
                        .linkType ==
                        "coord"
                        ) {
                        linkQueue
                            .push(
                                ["coord",
                                    next
                                    .tileX,
                                    next
                                    .tileY,
                                    next
                                    .charX,
                                    next
                                    .charY,
                                    next
                                    .coord_tileX,
                                    next
                                    .coord_tileY
                                    ]);
                    };
                };
            };
        });
    (function() {
        var addEvent =
            function(el,
                type, fn) {
                if (el
                    .addEventListener
                    ) el
                    .addEventListener(
                        type,
                        fn,
                        false
                        );
                else el
                    .attachEvent(
                        'on' +
                        type,
                        fn);
            };
        var extend =
            function(obj,
                ext) {
                for (var key in
                        ext)
                    if (ext
                        .hasOwnProperty(
                            key
                            )
                        )
                        obj[
                            key] =
                        ext[
                            key];
                return obj;
            };
        window.fitText =
            function(el,
                kompressor,
                options) {
                var settings =
                    extend({
                            'minFontSize': -1 /
                                0,
                            'maxFontSize': 1 /
                                0
                        },
                        options
                        );
                var fit =
                    function(
                        el
                        ) {
                        var compressor =
                            kompressor ||
                            1;
                        var resizer =
                            function() {
                                el.style
                                    .fontSize =
                                    Math
                                    .max(
                                        Math
                                        .min(
                                            el
                                            .clientWidth /
                                            (compressor *
                                                10
                                                ),
                                            parseFloat(
                                                settings
                                                .maxFontSize
                                                )
                                            ),
                                        parseFloat(
                                            settings
                                            .minFontSize
                                            )
                                        ) +
                                    'px';
                            };
                        resizer
                            ();
                        addEvent
                            (window,
                                'resize',
                                resizer
                                );
                        addEvent
                            (window,
                                'orientationchange',
                                resizer
                                );
                    };
                if (el
                    .length)
                    for (var i =
                            0; i <
                        el
                        .length; i++
                        )
                        fit(el[
                            i]);
                else fit(
                el);
                return el;
            };
    })();
    /*

    thanks for this, lime.owot

    */
    try {
        let curZ = 256;
        await loadExternalScript
            (
                "https://code.jquery.com/jquery-3.6.0.min.js");
        await loadExternalScript
            (
                "https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js");
        await loadExternalScript
            (
                "https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js");
        await loadExternalScript
            (
                "https://www.jqueryscript.net/demo/paste-image-clipboard/paste.js");
        await fetchStyle(
            "https://unpkg.com/css.gg/icons/icons.css"
            );
        await fetchStyle(
            "https://storestuff.neocities.org/saturn/style.css"
            );
        await fetchStyle(
            "https://fonts.googleapis.com/css?family=Ubuntu:regular,bold&subset=Latin"
            );
        (function() {
            if (window
                .addEventListener
                ) {
                var kkeys = [],
                    konami =
                    "38,38,40,40,37,39,37,39,66,65";
                var triggered =
                    false;
                $(window)
                    .keydown(
                        function(
                            e
                            ) {
                            kkeys
                                .push(
                                    e
                                    .keyCode
                                    );
                            if (kkeys
                                .toString()
                                .indexOf(
                                    konami
                                    ) >=
                                0
                                ) {
                                if (triggered ===
                                    false
                                    ) {
                                    triggered
                                        =
                                        true;
                                    kkeys
                                        .length =
                                        0;
                                } else if (
                                    triggered ===
                                    true
                                    ) {
                                    triggered
                                        =
                                        false;
                                };
                            };
                            while (
                                kkeys
                                .length >=
                                konami
                                .split(
                                    ","
                                    )
                                .length
                                ) {
                                kkeys
                                    .shift();
                            };
                        });
            };
        })();

        function playSound(
            sound) {
            if (soundsEnabled)
                sound.play();
            return undefined;
        };
        document.body.style
            .fontFamily =
            "Ubuntu";

        function changeColor(
            hex = "ff0000") {
            $("body").get(0)
                .style
                .setProperty(
                    "--color",
                    `#${hex}`);
            $("body").get(0)
                .style
                .setProperty(
                    "--foreColor",
                    `${calculateContrastYIQ(hex)}`
                    );
        };
        $("body").get(0).style
            .setProperty(
                "--color",
                "#1985ff");
        $("body").get(0).style
            .setProperty(
                "--foreColor",
                "white");

        function createWindow(
            title =
            "Hello, world!",
            width = "450px",
            mini = true, x = 0,
            y = 0) {
            curZ += 1;
            const id = (Date
                    .now() +
                    Math.floor(
                        Math
                        .random() *
                        99999))
                .toString();
            const topBar = $(
                '<div></div>'
                ).css({
                width: width,
                height: "25px",
                position: "fixed",
                cursor: "move",
                top: y,
                left: x,
                background: `linear-gradient(90deg, var(--color) 0%, black 250%)`,
                zIndex: curZ,
                paddingLeft: "10px",
                color: "var(--foreColor)",
                fontFamily: "Ubuntu",
                fontWeight: 100,
                opacity: 0.7,
                transition: "0.1s ease-in-out",
                transitionProperty: "opacity"
            });
            topBar.hover(
                function() {
                    $(this)
                        .css(
                            "opacity",
                            0.9
                            );
                    $(this)
                        .focus();
                },
                function() {
                    $(this)
                        .css(
                            "opacity",
                            0.7
                            );
                });
            topBar.dblclick(
                function() {
                    curZ +=
                        1;
                    $(this)
                        .focus();
                    $(this)
                        .css(
                            "zIndex",
                            curZ
                            );
                });
            const
                topBarContent =
                $('<div></div>')
                .css({
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%"
                });
            const topBarTitle =
                $('<p></p>')
                .html(title);
            topBarContent
                .append(
                    topBarTitle
                    );
            topBar.append(
                topBarContent
                );
            const
                buttonsContainer =
                $('<div></div>')
                .css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                });
            const
                minimaxWindow =
                $(
                    '<button><i class="gg-minimize-alt"></i></button>')
                .css({
                    cursor: "pointer",
                    background: "none",
                    color: "white",
                    outline: "none",
                    border: "none",
                    fontSize: "40%",
                    width: "25px",
                    height: "100%",
                    marginRight: "5px",
                    maxWidth: "100%"
                });
            if (mini)
                buttonsContainer
                .append(
                    minimaxWindow
                    );
            const closeWindow =
                $(
                    '<button><i class="gg-close"></i></button>')
                .css({
                    cursor: "pointer",
                    background: "none",
                    color: "white",
                    outline: "none",
                    border: "none",
                    fontSize: "40%",
                    width: "25px",
                    height: "100%"
                });
            buttonsContainer
                .append(
                    closeWindow
                    );
            topBarContent
                .append(
                    buttonsContainer
                    );
            const content = $(
                '<content></content>'
                ).css({
                width: "100%",
                padding: "15px",
                background: "black",
                color: "white",
                position: "absolute",
                top: "100%",
                left: "0",
                boxSizing: "border-box",
                cursor: "auto",
                border: "2px solid rgba(255, 255, 255, 0.2)"
            });
            topBar.append(
                content);
            $("body").append(
                topBar);
            const
                constrainWindow =
                () => {
                    const
                        windowWidth =
                        topBar
                        .outerWidth();
                    const
                        windowHeight =
                        topBar
                        .outerHeight();
                    const
                        screenWidth =
                        $(
                            window)
                        .width();
                    const
                        screenHeight =
                        $(
                            window)
                        .height();
                    const maxX =
                        screenWidth -
                        windowWidth;
                    const maxY =
                        screenHeight -
                        windowHeight;
                    const
                        constrainedX =
                        Math
                        .max(0,
                            Math
                            .min(
                                x,
                                maxX
                                )
                            );
                    const
                        constrainedY =
                        Math
                        .max(0,
                            Math
                            .min(
                                y,
                                maxY
                                )
                            );
                    topBar.css({
                        top: constrainedY,
                        left: constrainedX,
                    });
                };
            topBar.draggable({
                cancel: "content",
                containment: "window",
                drag: constrainWindow,
            });
            let minimaxTooltip =
                registerTooltip(
                    minimaxWindow,
                    `Minimize`);
            registerTooltip(
                closeWindow,
                `Close`);
            constrainWindow();
            const obj = {
                topBar,
                content,
                close: function() {
                    playSound
                        (
                            clickSound);
                    topBar
                        .css(
                            "display",
                            "none"
                            );
                    this.opened =
                        false;
                },
                open: function() {
                    playSound
                        (
                            openWindow);
                    topBar
                        .css(
                            "display",
                            "block"
                            );
                    this.opened =
                        true;
                },
                mini: function() {
                    playSound
                        (
                            clickSound);
                    content
                        .css(
                            "display",
                            "none"
                            );
                    this.minimized =
                        true;
                    minimaxWindow
                        .html(
                            `<i class="gg-maximize"></i>`
                            );
                    minimaxTooltip
                        .content(
                            "Maximize"
                            );
                },
                max: function() {
                    playSound
                        (
                            clickSound);
                    content
                        .css(
                            "display",
                            "block"
                            );
                    this.minimized =
                        false;
                    minimaxWindow
                        .html(
                            `<i class="gg-minimize-alt"></i>`
                            );
                    minimaxTooltip
                        .content(
                            "Minimize"
                            );
                },
                move: function(
                    x =
                    0,
                    y =
                    0) {
                    topBar
                        .css({
                            top: y,
                            left: x,
                        });
                },
                opened: true,
                minimized: false
            };
            closeWindow.click(
                function() {
                    obj
                .close();
                });
            if (mini) {
                minimaxWindow
                    .click(
                        function() {
                            if (obj
                                .minimized
                                ) {
                                obj
                            .max();
                            } else {
                                obj
                            .mini();
                            };
                        });
            };
            return obj;
        };
        var clickSound =
            new Howl({
                src: [
                    'https://storestuff.neocities.org/saturn/sounds/mouseClick.mp3'
                    ],
                volume: 0.25,
            });
        var tickX = new Howl({
            src: [
                'https://storestuff.neocities.org/saturn/sounds/areaTick.mp3'
                ],
            volume: 0.05,
        });
        var tickY = new Howl({
            src: [
                'https://storestuff.neocities.org/saturn/sounds/areaTick.mp3'
                ],
            volume: 0.05,
        });
        var shutter = new Howl({
            src: [
                'https://storestuff.neocities.org/saturn/sounds/shutterClick.mp3'
                ],
            volume: 0.2,
        });
        var openMenu =
    new Howl({
            src: [
                'https://storestuff.neocities.org/saturn/sounds/openMenu.mp3'
                ],
            volume: 0.4,
        });
        var openWindow =
            new Howl({
                src: [
                'https://storestuff.neocities.org/saturn/sounds/openWindow.mp3'
                ],
                volume: 0.4,
            });
        RegionSelection =
            function() {
                this.selection =
                    null;
                this.regionSelected =
                    false;
                this.regionCoordA =
                    null;
                this.regionCoordB =
                    null;
                this.isSelecting =
                    false;
                this.charColor =
                    "#9999e6";
                this.color =
                    "rgba(0, 0, 255, 0.1)";
                this.tiled =
                    false;
                this.lastSelectionHover =
                    null;
                this.lastSelectionTiled =
                    this.tiled;
                this.restartSelection =
                    false;
                this.init =
                    function() {
                        if (this
                            .selection
                            )
                            return;
                        var div =
                            document
                            .createElement(
                                "div"
                                );
                        div.className =
                            "region_selection";
                        div.style
                            .display =
                            "none";
                        div.style
                            .backgroundColor =
                            this
                            .color;
                        this.marker =
                            document
                            .createElement(
                                "div"
                                );
                        this.marker
                            .style
                            .width =
                            "100%";
                        this.marker
                            .style
                            .height =
                            "25px";
                        this.marker
                            .style
                            .position =
                            "absolute";
                        this.marker
                            .style
                            .top =
                            "-25px";
                        this.marker
                            .style
                            .maxWidth =
                            "100%";
                        this.marker
                            .style
                            .left =
                            "0";
                        this.marker
                            .style
                            .fontFamily =
                            "Ubuntu";
                        this.marker
                            .style
                            .color =
                            "white";
                        this.marker
                            .style
                            .background =
                            "rgba(0, 0, 0, 0.5)";
                        this.marker
                            .style
                            .display =
                            "block";
                        this.marker
                            .innerHTML =
                            "...";
                        div.appendChild(
                            this
                            .marker
                            );
                        console
                            .log(
                                this
                                .marker,
                                this
                                .marker
                                .parentNode
                                );
                        document
                            .body
                            .appendChild(
                                div
                                );
                        this.selection =
                            div;
                    }
                let prevWidth =
                    0;
                let prevHeight =
                    0;
                this.setSelection =
                    function(
                        start,
                        end) {
                        var coordA =
                            start
                            .slice(
                                0
                                );
                        var coordB =
                            end
                            .slice(
                                0
                                );
                        orderRangeABCoords
                            (coordA,
                                coordB
                                );
                        var tileX1 =
                            coordA[
                                0
                                ];
                        var tileY1 =
                            coordA[
                                1
                                ];
                        var charX1 =
                            coordA[
                                2
                                ];
                        var charY1 =
                            coordA[
                                3
                                ];
                        var tileX2 =
                            coordB[
                                0
                                ];
                        var tileY2 =
                            coordB[
                                1
                                ];
                        var charX2 =
                            coordB[
                                2
                                ];
                        var charY2 =
                            coordB[
                                3
                                ];
                        if (this
                            .tiled
                            ) {
                            charX1
                                =
                                0;
                            charY1
                                =
                                0;
                            charX2
                                =
                                tileC -
                                1;
                            charY2
                                =
                                tileR -
                                1;
                        }
                        var pxCoordA =
                            tileAndCharsToWindowCoords(
                                tileX1,
                                tileY1,
                                charX1,
                                charY1
                                );
                        var pxCoordB =
                            tileAndCharsToWindowCoords(
                                tileX2,
                                tileY2,
                                charX2,
                                charY2
                                );
                        var regWidth =
                            pxCoordB[
                                0
                                ] -
                            pxCoordA[
                                0
                                ] +
                            Math
                            .trunc(
                                cellW /
                                zoomRatio
                                ) -
                            2;
                        var regHeight =
                            pxCoordB[
                                1
                                ] -
                            pxCoordA[
                                1
                                ] +
                            Math
                            .trunc(
                                cellH /
                                zoomRatio
                                ) -
                            2;
                        var sel =
                            this
                            .selection;
                        sel.style
                            .width =
                            regWidth +
                            "px";
                        sel.style
                            .height =
                            regHeight +
                            "px";
                        sel.style
                            .top =
                            pxCoordA[
                                1
                                ] +
                            "px";
                        sel.style
                            .left =
                            pxCoordA[
                                0
                                ] +
                            "px";
                        let startXY =
                            tileToXY(
                                start
                                );
                        let endXY =
                            tileToXY(
                                end
                                );
                        let width =
                            Math
                            .abs(
                                endXY[
                                    0
                                    ] -
                                startXY[
                                    0
                                    ] +
                                1
                                );
                        let height =
                            Math
                            .abs(
                                startXY[
                                    1
                                    ] -
                                endXY[
                                    1
                                    ] +
                                1
                                );
                        if (prevWidth !=
                            width &&
                            (width -
                                1
                                ) %
                            8 ==
                            0) {
                            tickX
                                .rate(
                                    1 +
                                    (width /
                                        64
                                        )
                                    );
                            playSound
                                (
                                    tickX);
                        };
                        if (prevHeight !=
                            height &&
                            (height -
                                1
                                ) %
                            8 ==
                            0) {
                            tickY
                                .rate(
                                    1 +
                                    (width /
                                        64
                                        )
                                    );
                            playSound
                                (
                                    tickY);
                        };
                        prevWidth
                            =
                            width;
                        prevHeight
                            =
                            height;
                        this.marker
                            .innerHTML =
                            `${width}, ${height}`;
                        this.marker
                            .fontSize =
                            "60%";
                    }
                this.show =
                    function() {
                        this.selection
                            .style
                            .display =
                            "";
                    }
                this.hide =
                    function() {
                        this.selection
                            .style
                            .display =
                            "none";
                    }
                this.deselect =
                    function(
                        successful
                        ) {
                        this.regionSelected =
                            false;
                        this.regionCoordA =
                            null;
                        this.regionCoordB =
                            null;
                        this
                    .hide();
                        if (!
                            successful
                            ) {
                            for (
                                var i =
                                    0; i <
                                oncancelEvents
                                .length; i++
                                ) {
                                var func =
                                    oncancelEvents[
                                        i
                                        ];
                                func
                            ();
                            }
                        }
                    }
                this.stopSelectionUI =
                    function(
                        successful
                        ) {
                        if (!
                            this
                            .lastSelectionHover
                            )
                            return;
                        if (!
                            this
                            .isSelecting
                            )
                            return;
                        this.isSelecting =
                            false;
                        elm.owot
                            .style
                            .cursor =
                            defaultCursor;
                        var tileX =
                            this
                            .lastSelectionHover[
                                0
                                ];
                        var tileY =
                            this
                            .lastSelectionHover[
                                1
                                ];
                        var charX =
                            this
                            .lastSelectionHover[
                                2
                                ];
                        var charY =
                            this
                            .lastSelectionHover[
                                3
                                ];
                        if (this
                            .tiled
                            ) {
                            if (Tile
                                .get(
                                    tileX,
                                    tileY
                                    )
                                ) {
                                Tile.get(
                                        tileX,
                                        tileY
                                        )
                                    .backgroundColor =
                                    "";
                            }
                        } else {
                            uncolorChar
                                (tileX,
                                    tileY,
                                    charX,
                                    charY,
                                    "reg"
                                    );
                        }
                        w.setTileRedraw(
                            tileX,
                            tileY,
                            true
                            );
                        this.deselect(
                            successful
                            );
                    }
                var
            onselectionEvents = [];
                var
            oncancelEvents = [];
                this.onselection =
                    function(
                        func) {
                        onselectionEvents
                            .push(
                                func
                                );
                    }
                this.oncancel =
                    function(
                        func) {
                        oncancelEvents
                            .push(
                                func
                                );
                    }
                this.handleSelection =
                    function() {
                        playSound
                            (
                                shutter);
                        for (var i =
                                0; i <
                            onselectionEvents
                            .length; i++
                            ) {
                            var func =
                                onselectionEvents[
                                    i
                                    ];
                            this.regionSelected =
                                true;
                            if (!
                                this
                                .regionCoordA
                                )
                                continue;
                            this.setSelection(
                                this
                                .regionCoordA,
                                this
                                .regionCoordB
                                );
                            var coordA =
                                this
                                .regionCoordA
                                .slice(
                                    0
                                    );
                            var coordB =
                                this
                                .regionCoordB
                                .slice(
                                    0
                                    );
                            orderRangeABCoords
                                (coordA,
                                    coordB
                                    );
                            if (this
                                .tiled
                                ) {
                                coordA
                                    [
                                        2] =
                                    0;
                                coordA
                                    [
                                        3] =
                                    0;
                                coordB
                                    [
                                        2] =
                                    tileC -
                                    1;
                                coordB
                                    [
                                        3] =
                                    tileR -
                                    1;
                            }
                            var regWidth =
                                (coordB[
                                        0] -
                                    coordA[
                                        0
                                        ]
                                    ) *
                                tileC +
                                coordB[
                                    2
                                    ] -
                                coordA[
                                    2
                                    ] +
                                1;
                            var regHeight =
                                (coordB[
                                        1] -
                                    coordA[
                                        1
                                        ]
                                    ) *
                                tileR +
                                coordB[
                                    3
                                    ] -
                                coordA[
                                    3
                                    ] +
                                1;
                            func(coordA,
                                coordB,
                                regWidth,
                                regHeight
                                );
                        }
                        if (!
                            this
                            .restartSelection
                            ) {
                            this.stopSelectionUI(
                                true
                                );
                        } else {
                            this.restartSelection =
                                false;
                            this.regionCoordA =
                                null;
                            this.regionCoordB =
                                null;
                            this
                        .hide();
                        }
                    }
                this.startSelection =
                    function() {
                        if (this
                            .isSelecting
                            ) {
                            this.restartSelection =
                                true;
                        }
                        this.isSelecting =
                            true;
                        elm.owot
                            .style
                            .cursor =
                            "cell";
                        this.selection
                            .style
                            .backgroundColor =
                            this
                            .color;
                    }
                this.destroy =
                    function() {
                        for (var i =
                                0; i <
                            regionSelections
                            .length; i++
                            ) {
                            if (regionSelections[
                                    i
                                    ] ==
                                this
                                ) {
                                regionSelections
                                    .splice(
                                        i,
                                        1
                                        );
                                i--;
                            }
                        }
                    }
                regionSelections
                    .push(this);
                this.init();
                return this;
            }
        var ctrlPressed = false;
        var ctrlCount = 0;
        var ctrlTimestamp = 0;
        var timeout;
        let shortcutsEnabled =
            true;
        let soundsEnabled =
        true;
        let showMouseShadow =
            true;
        var menu = $(
            "<div></div>");
        menu.css({
            background: "rgba(0, 0, 0, 0.4)",
            width: "100%",
            height: "100%",
            zIndex: 2147483640,
            position: "fixed",
            top: 0,
            left: 0,
            display: "none",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
        });
        var tabs = [
            {
                name: "Settings",
                description: "customize and change",
                image: "https://storestuff.neocities.org/saturn/settingsIcon.png",
                function: function() {
                    settingsWindow
                        .open();
                }
            },
            {
                name: "Tools",
                description: "various tools to utilize",
                image: "https://storestuff.neocities.org/saturn/toolsIcon.png",
                function: function() {
                    toolsWindow
                        .open();
                }
            },
            {
                name: "Decoration",
                description: "various tools to decorate with",
                image: "https://storestuff.neocities.org/saturn/decorationIcon.png",
                function: function() {
                    decorationWindow
                        .open();
                }
            },
            {
                name: "Mini Tools",
                description: "more smaller tools to utilize",
                image: "https://storestuff.neocities.org/saturn/smallerToolsIcon.png",
                function: function() {
                    miniToolsWindow
                        .open();
                }
            },
            {
                name: "Gizmos",
                description: "various gadgets with different purposes",
                image: "https://storestuff.neocities.org/saturn/gizmoIcon.png",
                function: function() {
                    gizmosWindow
                        .open();
                }
            }
        ];
        let chatEditable =
        false;
        let status = $(
            "<div></div>");
        $("#owot").css("zIndex",
            -256);
        $("#chat_window").css(
            "zIndex", 255);
        $("#chat_open").css({
            zIndex: 254,
            border: "2px solid white",
            color: "white"
        });
        $("#total_unread").css({
            color: "white"
        });
        status.css({
            zIndex: 15,
            background: `rgba(0, 0, 0, 0.5)`,
            position: `fixed`,
            top: `95%`,
            width: `100%`,
            height: `5%`,
            color: "white",
            fontFamily: "Ubuntu",
            paddingTop: "5px",
            textAlign: "right",
            boxSizing: "border-box"
        });
        status.html(
            `<p style="padding-right: 12.5px;"><img src="https://storestuff.neocities.org/saturn/icons/smiley.png" width="20"></p>`
            );

        function setStatus(
            content =
            "Hello, world",
            icon = "info") {
            status.html(
                `<p style="padding-right: 12.5px;">${content}<img src="https://storestuff.neocities.org/saturn/icons/${icon}.png" width="20"></p>`
                );
            return true;
        };
        $("body").append(
        status);
        let tooltips = [];

        function registerTooltip(
            element,
            initialContent) {
            let tooltip = $(
                "<div></div>"
                );
            tooltip.css({
                zIndex: 10e10,
                position: "absolute",
                display: "none",
                backgroundColor: "#333",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "5px",
                fontFamily: "Ubuntu"
            });
            tooltip.html(
                initialContent
                );
            $(element)
                .mouseenter(
                    function() {
                        tooltip
                            .css(
                                "display",
                                "block"
                                );
                    })
                .mouseleave(
                    function() {
                        tooltip
                            .css(
                                "display",
                                "none"
                                );
                    });
            $("body").append(
                tooltip);
            let tooltipObj = {
                content: function(
                    newContent
                    ) {
                    tooltip
                        .html(
                            newContent
                            );
                }
            };
            tooltips.push({
                element: element,
                tooltip: tooltipObj
            });
            $(document).on(
                "mousemove",
                function(
                    event) {
                    if (tooltip
                        .css(
                            "display"
                            ) ===
                        "block"
                        ) {
                        tooltip
                            .css(
                                "top",
                                (event
                                    .pageY +
                                    10
                                    ) +
                                "px"
                                );
                        tooltip
                            .css(
                                "left",
                                (event
                                    .pageX +
                                    10
                                    ) +
                                "px"
                                );
                    }
                });
            return tooltipObj;
        }

        function startPasteImage(
            image) {
            var canvas =
                document
                .createElement(
                    "canvas");
            var ctx = canvas
                .getContext(
                    "2d");
            canvas.style
                .imageRendering =
                "pixelated";

            function componentToHex(
                c) {
                var hex = c
                    .toString(
                        16);
                return hex
                    .length ==
                    1 ? "0" +
                    hex : hex;
            }

            function rgbToHex(r,
                g, b) {
                return componentToHex(
                        r) +
                    componentToHex(
                        g) +
                    componentToHex(
                        b);
            }
            image.onload =
            async function() {
                    var selection =
                        new RegionSelection();
                    selection
                        .init();
                    $(selection
                            .selection
                            )
                        .append(
                            $(
                                `<img src="${image.src}" width="100%" height="100%" style="image-rendering: pixelated;">`)
                            );
                    selection
                        .onselection(
                            async function(
                                start,
                                end,
                                width,
                                height
                                ) {
                                setStatus
                                    ("Pasting image...",
                                        "rocket"
                                        );
                                var star = [
                                    start[0] *
                                    16 +
                                    start[2],
                                    start[1] *
                                    8 +
                                    start[3]
                                    ];
                                var en = [
                                    end[0] *
                                    16 +
                                    end[2],
                                    end[1] *
                                    8 +
                                    end[3]
                                    ];
                                canvas
                                    .width =
                                    image
                                    .width;
                                canvas
                                    .height =
                                    Math
                                    .floor(
                                        image
                                        .height /
                                        2
                                        );
                                var distX =
                                    en[
                                        0] -
                                    star[
                                        0
                                        ];
                                var distY =
                                    en[
                                        1] -
                                    star[
                                        1
                                        ];
                                distX
                                    +=
                                    1;
                                distY
                                    +=
                                    1;
                                distX
                                    *=
                                    100;
                                distY
                                    *=
                                    100;
                                canvas
                                    .width =
                                    percOf(
                                        canvas
                                        .width,
                                        Math
                                        .round(
                                            (distX /
                                                canvas
                                                .width
                                                ) *
                                            100
                                            )
                                        ) /
                                    100;
                                canvas
                                    .height =
                                    percOf(
                                        canvas
                                        .height,
                                        Math
                                        .round(
                                            (distY /
                                                canvas
                                                .height
                                                ) *
                                            100
                                            )
                                        ) /
                                    100;
                                await ctx
                                    .drawImage(
                                        image,
                                        0,
                                        0,
                                        canvas
                                        .width,
                                        canvas
                                        .height
                                        );
                                var imgData =
                                    ctx
                                    .getImageData(
                                        0,
                                        0,
                                        canvas
                                        .width,
                                        canvas
                                        .height
                                        );
                                for (
                                    let y =
                                        0; y <
                                    canvas
                                    .height; y +=
                                    1
                                    ) {
                                    for (
                                        let x =
                                            0; x <
                                        canvas
                                        .width; x +=
                                        1
                                        ) {
                                        var i =
                                            (y * canvas
                                                .width +
                                                x
                                                ) *
                                            4;
                                        var r =
                                            imgData
                                            .data[
                                                i
                                                ];
                                        var g =
                                            imgData
                                            .data[
                                                i +
                                                1
                                                ];
                                        var b =
                                            imgData
                                            .data[
                                                i +
                                                2
                                                ];
                                        var alpha =
                                            imgData
                                            .data[
                                                i +
                                                3
                                                ] /
                                            255;
                                        var color =
                                            resolveColorValue(
                                                rgbToHex(
                                                    r,
                                                    g,
                                                    b
                                                    )
                                                );
                                        alpha
                                            =
                                            1 -
                                            alpha;
                                        if (alpha <
                                            0.9
                                            ) {
                                            writeToXY
                                                ("█",
                                                    color,
                                                    star[
                                                        0
                                                        ] +
                                                    x,
                                                    star[
                                                        1
                                                        ] +
                                                    y
                                                    );
                                        };
                                        if (x %
                                            4096 ==
                                            0
                                            ) {
                                            await delay
                                                (
                                                    1);
                                        };
                                    }
                                };
                                setStatus
                                    ("Finished pasting image!",
                                        "star"
                                        );
                            });
                    selection
                        .startSelection();
                };
        };
        $(document).on(
            'pasteImage',
            function(ev,
                data) {
                var blobUrl =
                    URL
                    .createObjectURL(
                        data
                        .blob
                        );
                var image =
                    new Image();
                image
                    .crossOrigin =
                    "Anonymous";
                image.src =
                    blobUrl;
                startPasteImage
                    (image);
            });
        var tools = [
            {
                name: "Image Paste",
                tooltip: "Paste an image (ALT + V)",
                image: "https://storestuff.neocities.org/saturn/imagePasteIcon.png",
                altbind: "v",
                function: function() {
                    let input =
                        document
                        .createElement(
                            "input"
                            );
                    input
                        .type =
                        "file";
                    input
                        .accept =
                        "image/png, image/jpeg";
                    input
                        .click();
                    input
                        .addEventListener(
                            "change",
                            function(
                                event
                                ) {
                                var files =
                                    input
                                    .files;
                                if (files
                                    .length
                                    ) {
                                    var image =
                                        new Image();
                                    image
                                        .crossOrigin =
                                        "Anonymous";
                                    image
                                        .src =
                                        URL
                                        .createObjectURL(
                                            files[
                                                0
                                                ]
                                            );
                                    startPasteImage
                                        (
                                            image);
                                }
                            }
                            );
                }
            },
            {
                name: "Region Wiper",
                tooltip: "Clear an area (ALT + C)",
                image: "https://storestuff.neocities.org/saturn/wiperIcon.png",
                altbind: "c",
                function: function() {
                    var selection =
                        new RegionSelection();
                    selection
                        .init();
                    selection
                        .onselection(
                            async function(
                                start,
                                end,
                                width,
                                height
                                ) {
                                var star = [
                                    start[0] *
                                    16 +
                                    start[2],
                                    start[1] *
                                    8 +
                                    start[3]
                                    ];
                                var en = [
                                    end[0] *
                                    16 +
                                    end[2],
                                    end[1] *
                                    8 +
                                    end[3]
                                    ];
                                setStatus
                                    ("Wiping area...",
                                        "rocket"
                                        );
                                var area =
                                    (en[0] -
                                        star[
                                            0
                                            ] +
                                        1
                                        ) *
                                    (en[1] -
                                        star[
                                            1
                                            ] +
                                        1
                                        );
                                if (area >
                                    64
                                    ) {
                                    var midX =
                                        Math
                                        .floor(
                                            (star[
                                                    0] +
                                                en[
                                                    0]
                                                ) /
                                            2
                                            );
                                    var midY =
                                        Math
                                        .floor(
                                            (star[
                                                    1] +
                                                en[
                                                    1]
                                                ) /
                                            2
                                            );
                                    eraseArea
                                        (star[
                                                0],
                                            star[
                                                1
                                                ],
                                            midX,
                                            midY
                                            );
                                    await delay
                                        (
                                            1);
                                    eraseArea
                                        (midX +
                                            1,
                                            star[
                                                1
                                                ],
                                            en[
                                                0],
                                            midY
                                            );
                                    await delay
                                        (
                                            1);
                                    eraseArea
                                        (star[
                                                0],
                                            midY +
                                            1,
                                            midX,
                                            en[
                                                1]
                                            );
                                    await delay
                                        (
                                            1);
                                    eraseArea
                                        (midX +
                                            1,
                                            midY +
                                            1,
                                            en[
                                                0],
                                            en[
                                                1]
                                            );
                                } else {
                                    eraseArea
                                        (star[
                                                0],
                                            star[
                                                1
                                                ],
                                            en[
                                                0],
                                            en[
                                                1]
                                            );
                                };
                                setStatus
                                    ("Area wiped!",
                                        "star"
                                        );
                            });
                    async function eraseArea(
                        startX,
                        startY,
                        endX,
                        endY
                        ) {
                        for (
                            let x =
                                startX; x <=
                            endX; x++
                            ) {
                            for (
                                let y =
                                    startY; y <=
                                endY; y++
                                ) {
                                writeToXY
                                    (" ",
                                        0,
                                        x,
                                        y
                                        );
                            }
                        }
                    }
                    selection
                        .startSelection();
                }
            },
            {
                name: "Measure Area",
                image: "https://storestuff.neocities.org/saturn/measureIcon.png",
                tooltip: "Measure an area (ALT + M)",
                altbind: "m",
                function: function() {
                    var selection =
                        new RegionSelection();
                    selection
                        .init();
                    selection
                        .onselection(
                            async function(
                                start,
                                end,
                                width,
                                height
                                ) {
                                var star = [
                                    start[0] *
                                    16 +
                                    start[2],
                                    start[1] *
                                    8 +
                                    start[3]
                                    ];
                                var en = [
                                    end[0] *
                                    16 +
                                    end[2],
                                    end[1] *
                                    8 +
                                    end[3]
                                    ];
                                setStatus
                                    (`Start: [x ${star[0]}, y ${star[1]}] End: [x ${en[0]}, y ${en[1]}] Width: ${(en[0] - star[0]) + 1} char(s); Height: ${(en[1] - star[1]) + 1} char(s)`,
                                        "info"
                                        );
                            });
                    selection
                        .startSelection();
                }
            },
            {
                name: "Coordinates",
                image: "https://storestuff.neocities.org/saturn/coordIcon.png",
                tooltip: "Show coordinates (ALT + W)",
                altbind: "w",
                function: function() {
                    coords
                        .open();
                }
            }
        ];
        if (!Permissions
            .can_go_to_coord(
                state.userModel,
                state.worldModel
                )) {
            tools.push({
                name: "Goto",
                image: "https://storestuff.neocities.org/saturn/waypointIcon.png",
                tooltip: "Go to point (ALT + T)",
                altbind: "t",
                function: function() {
                    let modal =
                        new Modal();
                    modal
                        .createForm();
                    modal
                        .setFormTitle(
                            "Teleport to point\n"
                            );
                    let x =
                        modal
                        .addEntry(
                            "X",
                            "number"
                            )
                        .input;
                    let y =
                        modal
                        .addEntry(
                            "Y",
                            "number"
                            )
                        .input;
                    modal
                        .setMaximumSize(
                            360,
                            300
                            );
                    modal
                        .onSubmit(
                            function() {
                                w.doGoToCoord(
                                    parseFloat(
                                        x
                                        .value
                                        ),
                                    parseFloat(
                                        y
                                        .value
                                        )
                                    );
                            }
                            );
                    modal
                        .open();
                }
            });
        };
        var gizmos = [
            {
                name: "Snake",
                image: "https://storestuff.neocities.org/saturn/gizmoIcon.png",
                function: function() {
                    const
                        selection =
                        new RegionSelection();
                    selection
                        .init();
                    const
                        snakeTrail = [];
                    let snakeLength =
                        1;
                    let apple = {
                        x: 0,
                        y: 0
                    };
                    let currentDirection = {
                        x: 1,
                        y: 0
                    };
                    let active =
                        true;
                    let cell =
                        function(
                            x,
                            y
                            ) {
                            setInterval
                                (
                                    () => {
                                        if (
                                            active) {
                                            let xTrack = -
                                                1 +
                                                Math
                                                .floor(
                                                    Math
                                                    .random() *
                                                    3
                                                    );
                                            let yTrack = -
                                                1 +
                                                Math
                                                .floor(
                                                    Math
                                                    .random() *
                                                    3
                                                    );
                                            if (xTrack ===
                                                -
                                                currentDirection
                                                .x &&
                                                yTrack ===
                                                -
                                                currentDirection
                                                .y
                                                ) {
                                                return;
                                            };
                                            x +=
                                            xTrack;
                                            y +=
                                            yTrack;
                                            if (x ===
                                                apple
                                                .x &&
                                                y ===
                                                apple
                                                .y
                                                ) {
                                                snakeLength
                                                    +=
                                                    1;
                                                apple
                                                    = {
                                                        x: Math
                                                            .floor(
                                                                Math
                                                                .random() *
                                                                16
                                                                ),
                                                        y: Math
                                                            .floor(
                                                                Math
                                                                .random() *
                                                                8
                                                                )
                                                    };
                                            };
                                            snakeTrail
                                                .push({
                                                    x,
                                                    y,
                                                    color: resolveColorValue(
                                                        "13fc03"
                                                        )
                                                });
                                            if (snakeTrail
                                                .length >
                                                15
                                                ) {
                                                const
                                                    removedCell =
                                                    snakeTrail
                                                    .shift();
                                                writeToXY
                                                    (" ",
                                                        0,
                                                        removedCell
                                                        .x,
                                                        removedCell
                                                        .y
                                                        );
                                            };
                                            snakeTrail
                                                .forEach(
                                                    cell => {
                                                        writeToXY
                                                            ("█",
                                                                cell
                                                                .color,
                                                                cell
                                                                .x,
                                                                cell
                                                                .y
                                                                );
                                                    }
                                                    );
                                            writeToXY
                                                ("A",
                                                    resolveColorValue(
                                                        "ff0000"
                                                        ),
                                                    apple
                                                    .x,
                                                    apple
                                                    .y
                                                    );
                                            currentDirection
                                                = {
                                                    x: xTrack,
                                                    y: yTrack
                                                };
                                        };
                                    },
                                    125
                                    );
                        };
                    selection
                        .onselection(
                            (start,
                                end
                                ) => {
                                let window =
                                    createWindow(
                                        "Snake",
                                        "300px",
                                        true,
                                        "500px"
                                        );
                                createButton
                                    (window
                                        .content,
                                        "Freeze",
                                        function(
                                            but
                                            ) {
                                            active
                                                = !
                                                active;
                                            but.html(
                                                active ?
                                                "Freeze" :
                                                "Unfreeze"
                                                )
                                        }
                                        );
                                setStatus
                                    ("The snake is loose!",
                                        "smiley"
                                        );
                                const [
                                star,
                                en
                                ] = [
                        [start[0] * 16 +
                  start[2],
                  start[1] *
                                    8 +
                                    start[3]
                                    ],
                        [end[0] * 16 +
                  end[2], end[1] * 8 +
                  end[3]]
                    ];
                                cell(star[
                                        0],
                                    star[
                                        1
                                        ]
                                    );
                            }
                            );
                    selection
                        .startSelection();
                }
        }];
        tabs.forEach(function(
            tab) {
            var tabMenu =
                $(
                    "<div></div>");
            tabMenu.css({
                background: "rgba(0, 0, 0, 0.8)",
                width: "250px",
                height: "250px",
                cursor: "pointer",
                display: "inline-block",
                marginRight: "5px",
                marginBottom: "5px",
                textAlign: "center",
                wordBreak: "break-word",
                fontFamily: "Ubuntu"
            });
            var center =
                $(
                    "<center></center>");
            center.css({
                width: "100%",
                height: "100%",
                padding: "15px",
                boxSizing: "border-box",
            });
            tabMenu
                .append(
                    center
                    );
            var img = $(
                "<img>"
                );
            img.css({
                width: "80%",
                height: "80%",
            });
            img.attr(
                "src",
                tab
                .image ||
                "https://storestuff.neocities.org/saturn/xor.png"
                );
            center
                .append(
                    img
                    );
            var p = $(
                "<p></p>"
                );
            p.css({
                color: "white"
            });
            p.html(
                `<b>${tab.name} =></b> ${tab.description}`);
            center
                .append(
                    p);
            menu.append(
                tabMenu
                );
            tabMenu
                .click(
                    function() {
                        setStatus
                            (`<b>${tab.name}</b> has been deployed.`,
                                "rocket"
                                );
                        tab
                    .function();
                        menu.css(
                            "display",
                            "none"
                            );
                        playSound
                            (
                                clickSound);
                    });
        });
        menu.click(function() {
            menu.css(
                "display",
                "none"
                );
        });
        $("body").append(menu);
        $(document).keydown(
            function(
            event) {
                if (event
                    .which ===
                    16) {
                    var currentTime =
                        new Date()
                        .getTime();
                    if (ctrlPressed &&
                        (currentTime -
                            ctrlTimestamp <
                            1000
                            )
                        ) {
                        ctrlCount++;
                    } else {
                        ctrlCount
                            =
                            1;
                    }
                    if (ctrlCount ===
                        2) {
                        if (menu
                            .css(
                                "display"
                                ) ==
                            "none"
                            ) {
                            playSound
                                (
                                    openMenu);
                            menu.css(
                                "display",
                                "flex"
                                );
                        } else {
                            menu.css(
                                "display",
                                "none"
                                )
                        };
                        ctrlCount
                            =
                            0;
                        ctrlPressed
                            =
                            false;
                        clearTimeout
                            (
                                timeout);
                    } else {
                        ctrlPressed
                            =
                            true;
                        ctrlTimestamp
                            =
                            currentTime;
                        clearTimeout
                            (
                                timeout);
                        timeout
                            =
                            setTimeout(
                                function() {
                                    ctrlCount
                                        =
                                        0;
                                    ctrlPressed
                                        =
                                        false;
                                },
                                300
                                );
                    }
                }
            });

        function createAlert(
            title = "Hello",
            content = "Hi",
            icon = "info") {
            let alert =
                createWindow(
                    title,
                    `360px`,
                    false,
                    `${(window.innerWidth / 2) - 180}px`
                    );
            alert.topBar.css(
                "top",
                `${(window.innerHeight / 2) - alert.topBar.height()}px`
                );
            alert.content.html(
                `<img src="https://storestuff.neocities.org/saturn/icons/${icon}.png" style="vertical-align: middle;" width="50"> ${content}`
                )
        };
        let intro =
            createWindow(
                `saturn`,
                "450px", true,
                "25px", "50px");
        intro.content.html(
            `<b>saturn</b> has loaded!<br>press <b><code>shift</code> twice quickly</b> to open the <b>saturn</b> menu.<br><br><i>made by draker/perimountain / v0.8.2 (beta) </i>`
            );

        function updateColor(
            hex) {
            $("body").get(0)
                .style
                .setProperty(
                    "--color",
                    `#${hex}`);
            $("body").get(0)
                .style
                .setProperty(
                    "--foreColor",
                    `${calculateContrastYIQ(hex)}`
                    );
            localStorage
                .setItem(
                    "saturnColor",
                    hex);
        };
        let savedColor =
            localStorage
            .getItem(
                "saturnColor");
        updateColor(
            savedColor ||
            "1985ff");
        let settingsWindow =
            createWindow(
                `Settings`,
                "300px", true,
                "25px", "100px"
                );
        settingsWindow.close();

        function createColor(
            text =
            "accent color",
            value, cb =
            function() {}) {
            let div = $('<div>')
                .addClass(
                    'saturn-Setting'
                    );
            (function() {
                let input =
                    $('<input>', {
                        type: 'color',
                        value: `${value}`,
                        class: 'saturn-padRight'
                    });
                input.on(
                    'input',
                    function() {
                        cb($(this)
                            .val()
                            );
                    });
                div.append(
                    input
                    );
                div.append(
                    `<span>${text}</span>`
                    );
                settingsWindow
                    .content
                    .append(
                        div)
                    .append(
                        '<br>'
                        );
            })();
            return div;
        };

        function createText(
            text = "text",
            value, cb =
            function() {}) {
            let div = $('<div>')
                .addClass(
                    'saturn-Setting'
                    );
            (function() {
                let input =
                    $('<input>', {
                        type: 'text',
                        value: `${value}`,
                        class: 'saturn-padRight',
                    });
                input.css({
                    padding: '5px',
                    fontFamily: 'Ubuntu',
                    outline: 'none',
                    border: '2x solid white',
                    background: 'none',
                    color: 'white',
                    width: "60%",
                });
                input.on(
                    'input',
                    function() {
                        cb($(this)
                            .val()
                            );
                    });
                div.append(
                    input
                    );
                div.append(
                    `<span>${text}</span>`
                    );
                settingsWindow
                    .content
                    .append(
                        div)
                    .append(
                        '<br>'
                        );
            })();
            return div;
        };

        function createNumber(
            text = "text",
            value, min =
            Infinity, max =
            Infinity, cb =
            function() {}) {
            let div = $('<div>')
                .addClass(
                    'saturn-Setting'
                    );
            let keyName =
                `saturn:${text.replace(" ", "").substring(0, 8)}`;
            if (window
                .localStorage
                .getItem(
                    keyName)) {
                value =
                    parseInt(
                        window
                        .localStorage
                        .getItem(
                            keyName
                            ));
            };
            (function() {
                let input =
                    $('<input>', {
                        type: 'number',
                        value: value,
                        class: 'saturn-padRight',
                        min: min,
                        max: max
                    });
                input.css({
                    padding: '5px',
                    fontFamily: 'Ubuntu',
                    outline: 'none',
                    border: '2x solid white',
                    background: 'none',
                    color: 'white',
                    width: "60%",
                });
                input.on(
                    'input',
                    function() {
                        cb($(this)
                            .val()
                            );
                        window
                            .localStorage
                            .setItem(
                                keyName,
                                $(
                                    this)
                                .val()
                                );
                        playSound
                            (
                                clickSound);
                    });
                div.append(
                    input
                    );
                div.append(
                    `<span>${text}</span>`
                    );
                settingsWindow
                    .content
                    .append(
                        div)
                    .append(
                        '<br>'
                        );
            })();
            return div;
        };

        function getValueWithinDiv(
            div) {
            return div.get(0)
                .querySelector(
                    "input")
                .value;
        };

        function createCheck(
            text = "text",
            value, cb =
            function() {}, ls =
            function() {}) {
            let div = $('<div>')
                .addClass(
                    'saturn-Setting'
                    );
            let keyName =
                `saturn:${text.replace(" ", "").substring(0, 8)}`;
            if (window
                .localStorage
                .getItem(
                    keyName)) {
                value = window
                    .localStorage
                    .getItem(
                        keyName
                        ) ==
                    "true";
                ls(value);
            };
            (function() {
                let input =
                    $('<input>', {
                        type: 'checkbox',
                        checked: value,
                        class: 'saturn-padRight',
                    });
                input.css({
                    padding: '5px',
                    fontFamily: 'Ubuntu',
                    outline: 'none',
                    border: '2x solid white',
                    background: 'none',
                    color: 'white',
                });
                input.on(
                    'input',
                    function() {
                        cb($(this)
                            .is(
                                ':checked')
                            );
                        window
                            .localStorage
                            .setItem(
                                keyName,
                                $(
                                    this)
                                .is(
                                    ":checked")
                                );
                        playSound
                            (
                                clickSound);
                    });
                div.append(
                    input
                    );
                div.append(
                    `<span>${text}</span>`
                    );
                settingsWindow
                    .content
                    .append(
                        div)
                    .append(
                        '<br>'
                        );
            })();
            return div;
        };
        let accentColor =
            createColor(
                "accent color",
                `#${localStorage.getItem('saturnColor')}`,
                function(val) {
                    let selectedColor =
                        val
                        .substring(
                            1);
                    updateColor(
                        selectedColor
                        );
                });
        registerTooltip(
            accentColor,
            "Set accent of windows"
            );
        let shortcutsCheck =
            createCheck(
                "tool shortcuts",
                true,
                function(
                value) {
                    shortcutsEnabled
                        = value;
                },
                function(
                value) {
                    shortcutsEnabled
                        = value;
                });
        shortcutsEnabled =
            getValueWithinDiv(
                shortcutsCheck);
        registerTooltip(
            shortcutsCheck,
            "Toggle tool shortcuts"
            );
        let soundsCheck =
            createCheck(
                "sound effects",
                true,
                function(
                value) {
                    soundsEnabled
                        = value;
                },
                function(
                value) {
                    soundsEnabled
                        = value;
                });
        registerTooltip(
            soundsCheck,
            "Toggle sound effects"
            );
        let shadowCheck =
            createCheck(
                "mouse shadow",
                true,
                function(
                value) {
                    showMouseShadow
                        = value;
                },
                function(
                value) {
                    showMouseShadow
                        = value;
                });
        registerTooltip(
            shadowCheck,
            "Toggle mouse shadow, easy to see your mouse on canvas"
            );
        let animals = [
            {
                name: "BLEH",
                description: "Don't let them see your",
                url: "https://i.pinimg.com/originals/a5/45/30/a54530bfc5a56062196acd26d1a46b1d.jpg"
            },
            {
                name: "UNI",
                description: "Search him up on google",
                url: "https://pbs.twimg.com/media/FpuxcfiX0AAuUA4.jpg"
            },
            {
                name: "GANDALF",
                description: "It is monday",
                url: "https://pbs.twimg.com/profile_images/1541571907891380230/8UfD54z8_400x400.jpg"
            },
            {
                name: "FUCK MY SHIT UP",
                description: "If you don't know how to braid, hit that follow button",
                url: "https://media.discordapp.net/attachments/979449457596833872/1179095109854310512/20231128_091601.jpg",
            },
            {
                name: "THIS CAT IS",
                description: "L",
                url: "https://storestuff.neocities.org/saturn/thiscatis.gif",
            },
            {
                name: "MAXWELL",
                description: "The carryable",
                url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51L0de8MG3L._UXNaN_FMjpg_QL85_.jpg"
            },
            {
                name: "IS NOT CAT BUT RAT",
                description: "it will be eaten inshallah",
                url: "https://bigrat.monster/media/bigrat.jpg",
            },
            {
                name: "CHORUS CAT",
                description: "Sing the ringtone",
                url: "https://storestuff.neocities.org/saturn/chorus.png",
            },
            {
                name: "DRIVING CAT",
                description: "Turning mmrp",
                url: "https://storestuff.neocities.org/saturn/driving.gif"
            }
        ];
        let chosenAnimal = 0;
        let animalNumber =
            createNumber(
                "animal", 1, 0,
                animals.length,
                function(val) {
                    chosenAnimal
                        = val
                });
        chosenAnimal =
            getValueWithinDiv(
                animalNumber);
        registerTooltip(
            animalNumber,
            "Choose your fighter"
            );
        settingsWindow.close();
        var miniTools = [
            {
                name: "Burn-in Image Paster",
                description: "Image paster, but it overlays the colors onto the text within the region",
                function: function() {
                    function startBurnPasteImage(
                        image
                        ) {
                        var canvas =
                            document
                            .createElement(
                                "canvas"
                                );
                        var ctx =
                            canvas
                            .getContext(
                                "2d"
                                );
                        canvas
                            .style
                            .imageRendering =
                            "pixelated";

                        function componentToHex(
                            c
                            ) {
                            var hex =
                                c
                                .toString(
                                    16
                                    );
                            return hex
                                .length ==
                                1 ?
                                "0" +
                                hex :
                                hex;
                        }

                        function rgbToHex(
                            r,
                            g,
                            b
                            ) {
                            return componentToHex(
                                    r
                                    ) +
                                componentToHex(
                                    g
                                    ) +
                                componentToHex(
                                    b
                                    );
                        }
                        image
                            .onload =
                            async function() {
                                var selection =
                                    new RegionSelection();
                                selection
                                    .init();
                                $(selection
                                        .selection
                                        )
                                    .append(
                                        $(
                                            `<img src="${image.src}" width="100%" height="100%" style="image-rendering: pixelated;">`)
                                        );
                                selection
                                    .onselection(
                                        async function(
                                            start,
                                            end,
                                            width,
                                            height
                                            ) {
                                            setStatus
                                                ("Pasting image...",
                                                    "rocket"
                                                    );
                                            var star = [
                                    start[0] *
                                    16 +
                                    start[2],
                                    start[1] *
                                    8 +
                                    start[3]
                                    ];
                                            var en = [
                                    end[0] *
                                    16 +
                                    end[2],
                                    end[1] *
                                    8 +
                                    end[3]
                                    ];
                                            canvas
                                                .width =
                                                image
                                                .width;
                                            canvas
                                                .height =
                                                Math
                                                .floor(
                                                    image
                                                    .height /
                                                    2
                                                    );
                                            var distX =
                                                en[
                                                    0] -
                                                star[
                                                    0
                                                    ];
                                            var distY =
                                                en[
                                                    1] -
                                                star[
                                                    1
                                                    ];
                                            distX
                                                +=
                                                1;
                                            distY
                                                +=
                                                1;
                                            distX
                                                *=
                                                100;
                                            distY
                                                *=
                                                100;
                                            canvas
                                                .width =
                                                percOf(
                                                    canvas
                                                    .width,
                                                    Math
                                                    .round(
                                                        (distX /
                                                            canvas
                                                            .width
                                                            ) *
                                                        100
                                                        )
                                                    ) /
                                                100;
                                            canvas
                                                .height =
                                                percOf(
                                                    canvas
                                                    .height,
                                                    Math
                                                    .round(
                                                        (distY /
                                                            canvas
                                                            .height
                                                            ) *
                                                        100
                                                        )
                                                    ) /
                                                100;
                                            await ctx
                                                .drawImage(
                                                    image,
                                                    0,
                                                    0,
                                                    canvas
                                                    .width,
                                                    canvas
                                                    .height
                                                    );
                                            var imgData =
                                                ctx
                                                .getImageData(
                                                    0,
                                                    0,
                                                    canvas
                                                    .width,
                                                    canvas
                                                    .height
                                                    );
                                            for (
                                                let y =
                                                    0; y <
                                                canvas
                                                .height; y +=
                                                1
                                                ) {
                                                for (
                                                    let x =
                                                        0; x <
                                                    canvas
                                                    .width; x +=
                                                    1
                                                    ) {
                                                    var i =
                                                        (y * canvas
                                                            .width +
                                                            x
                                                            ) *
                                                        4;
                                                    var r =
                                                        imgData
                                                        .data[
                                                            i
                                                            ];
                                                    var g =
                                                        imgData
                                                        .data[
                                                            i +
                                                            1
                                                            ];
                                                    var b =
                                                        imgData
                                                        .data[
                                                            i +
                                                            2
                                                            ];
                                                    var alpha =
                                                        imgData
                                                        .data[
                                                            i +
                                                            3
                                                            ] /
                                                        255;
                                                    var color =
                                                        resolveColorValue(
                                                            rgbToHex(
                                                                r,
                                                                g,
                                                                b
                                                                )
                                                            );
                                                    alpha
                                                        =
                                                        1 -
                                                        alpha;
                                                    if (alpha <
                                                        0.9
                                                        ) {
                                                        let info =
                                                            getCharInfoXY(
                                                                star[
                                                                    0
                                                                    ] +
                                                                x,
                                                                star[
                                                                    1
                                                                    ] +
                                                                y
                                                                );
                                                        if (info
                                                            .char !=
                                                            " "
                                                            ) {
                                                            writeToXY
                                                                (info
                                                                    .char,
                                                                    color,
                                                                    star[
                                                                        0
                                                                        ] +
                                                                    x,
                                                                    star[
                                                                        1
                                                                        ] +
                                                                    y
                                                                    );
                                                        } else {
                                                            continue
                                                        };
                                                    };
                                                    if (x %
                                                        4096 ==
                                                        0
                                                        ) {
                                                        await delay
                                                            (
                                                                1);
                                                    };
                                                }
                                            };
                                            setStatus
                                                ("Finished pasting image!",
                                                    "star"
                                                    );
                                        });
                                selection
                                    .startSelection();
                            };
                    };
                    let input =
                        document
                        .createElement(
                            "input"
                            );
                    input
                        .type =
                        "file";
                    input
                        .accept =
                        "image/png, image/jpeg";
                    input
                        .click();
                    input
                        .addEventListener(
                            "change",
                            function(
                                event
                                ) {
                                var files =
                                    input
                                    .files;
                                if (files
                                    .length
                                    ) {
                                    var image =
                                        new Image();
                                    image
                                        .crossOrigin =
                                        "Anonymous";
                                    image
                                        .src =
                                        URL
                                        .createObjectURL(
                                            files[
                                                0
                                                ]
                                            );
                                    startBurnPasteImage
                                        (
                                            image);
                                }
                            }
                            );
                }
            }
        ]
        let miniToolsWindow =
            createWindow(
                `Tools`,
                "560px", true,
                "25px", "150px"
                );
        miniToolsWindow.close();
        miniTools.forEach(
            function(tool) {
                let button =
                    createButton(
                        miniToolsWindow
                        .content,
                        tool
                        .name,
                        tool
                        .function
                        );
                registerTooltip
                    (button,
                        tool
                        .description
                        );
            });
        let toolsWindow =
            createWindow(
                `Tools`,
                "560px", true,
                "25px", "150px"
                );
        toolsWindow.close();
        let toolContent = $(
            "<div></div>");
        toolContent.css({
            margin: 0,
            width: "100%",
            height: "100%"
        });
        toolsWindow.content
            .append(
            toolContent);
        tools.forEach(function(
            tab) {
            var toolMenu =
                $(
                    "<div></div>");
            toolMenu
                .css({
                    background: "rgba(0, 0, 0, 0.8)",
                    width: "125px",
                    height: "125px",
                    cursor: "pointer",
                    display: "inline-block",
                    marginRight: "5px",
                    marginBottom: "5px",
                    textAlign: "center",
                    wordBreak: "break-word",
                    fontFamily: "Ubuntu",
                    border: "solid 2px rgba(255, 255, 255, 0.5)"
                });
            var center =
                $(
                    "<center></center>");
            center.css({
                width: "100%",
                height: "100%",
                padding: "15px",
                boxSizing: "border-box",
            });
            toolMenu
                .append(
                    center
                    );
            var img = $(
                "<img>"
                );
            img.css({
                width: "80%",
                height: "80%",
                border: "solid 2px rgba(255, 255, 255, 0.5)"
            });
            registerTooltip
                (img,
                    tab
                    .tooltip
                    );
            img.attr(
                "src",
                tab
                .image ||
                "https://storestuff.neocities.org/saturn/xor.png"
                );
            center
                .append(
                    img
                    );
            var p = $(
                "<h6></h6>"
                );
            p.css({
                color: "white",
                width: "100%"
            });
            p.html(
                `<b>${tab.name}</b>`);
            center
                .append(
                    p);
            toolContent
                .append(
                    toolMenu
                    );
            toolMenu
                .click(
                    function() {
                        setStatus
                            (`<b>${tab.name}</b> has been deployed.`,
                                "rocket"
                                );
                        tab.function({
                            toolMenu: toolMenu,
                            p: p,
                            img: img,
                            center: center
                        });
                        menu.css(
                            "display",
                            "none"
                            );
                        playSound
                            (
                                clickSound);
                    });
        });
        let gizmosWindow =
            createWindow(
                `Gizmos`,
                "500px", true,
                "500px", "200px"
                );
        gizmosWindow.close();
        let gizmosContent = $(
            "<div></div>");
        gizmosContent.css({
            margin: 0,
            width: "100%",
            height: "100%"
        });
        gizmosWindow.content
            .append(
                gizmosContent);
        gizmos.forEach(function(
            tab) {
            var gizmoMenu =
                $(
                    "<div></div>");
            gizmoMenu
                .css({
                    background: "rgba(0, 0, 0, 0.8)",
                    width: "125px",
                    height: "125px",
                    cursor: "pointer",
                    display: "inline-block",
                    marginRight: "5px",
                    marginBottom: "5px",
                    textAlign: "center",
                    wordBreak: "break-word",
                    fontFamily: "Ubuntu",
                    border: "solid 2px rgba(255, 255, 255, 0.5)"
                });
            var center =
                $(
                    "<center></center>");
            center.css({
                width: "100%",
                height: "100%",
                padding: "15px",
                boxSizing: "border-box",
            });
            gizmoMenu
                .append(
                    center
                    );
            var img = $(
                "<img>"
                );
            img.css({
                width: "80%",
                height: "80%",
                border: "solid 2px rgba(255, 255, 255, 0.5)"
            });
            img.attr(
                "src",
                tab
                .image ||
                "https://storestuff.neocities.org/saturn/xor.png"
                );
            center
                .append(
                    img
                    );
            var p = $(
                "<h6></h6>"
                );
            p.css({
                color: "white",
                width: "100%"
            });
            p.html(
                `<b>${tab.name}</b>`);
            center
                .append(
                    p);
            gizmosContent
                .append(
                    gizmoMenu
                    );
            gizmoMenu
                .click(
                    function() {
                        setStatus
                            (`<b>${tab.name}</b> has been released.`,
                                "rocket"
                                );
                        tab
                    .function();
                        menu.css(
                            "display",
                            "none"
                            );
                        playSound
                            (
                                clickSound);
                    });
        });
        let decorationWindow =
            createWindow(
                `Decoration`,
                "600px", true,
                "25px", "250px"
                );

        function createButton(
            div, text =
            "Hello, world",
            callback =
            function() {}) {
            let button = $(
                `<button>${text}</button>`
                );
            button.css({
                fontFamily: "Ubuntu",
                border: "2px solid var(--color)",
                color: "white",
                padding: "5px",
                cursor: "pointer",
                outline: "none",
                background: "none",
                marginRight: "5px",
                marginBottom: "5px"
            });
            button.click(
                function() {
                    callback
                        (
                            button);
                    playSound
                        (
                            clickSound);
                });
            div.append(button);
            return button;
        };

        function createDropdown(
            div, callback =
            function() {},
            options = []) {
            let button = $(
                `<select></select>`
                );
            button.css({
                fontFamily: "Ubuntu",
                border: "2px solid var(--color)",
                color: "white",
                padding: "5px",
                cursor: "pointer",
                outline: "none",
                background: "none",
                marginRight: "5px",
                marginBottom: "5px"
            });
            button.change(
                function() {
                    let val =
                        button
                        .find(
                            ":selected"
                            )
                        .val();
                    callback
                        (options[
                                parseFloat(
                                    val
                                    )
                                ],
                            parseFloat(
                                val
                                )
                            );
                });
            options.unshift(
                "none selected"
                );
            options.forEach(
                function(
                    option,
                    index) {
                    let optionButton =
                        $(
                            `<option></option>`);
                    optionButton
                        .attr(
                            "value",
                            index
                            );
                    optionButton
                        .html(
                            option
                            );
                    optionButton
                        .css(
                            "color",
                            "black"
                            );
                    button
                        .append(
                            optionButton
                            );
                });
            button.val("0");
            div.append(button);
            return button;
        };

        function createBr(div) {
            div.append($(
                "<br>"))
        };

        function createOutline(
            base = {
                tl: "╭",
                l: "─",
                tr: "╮",
                vl: "│",
                br: "╯",
                bl: "╰"
            }, name = "Outline"
            ) {
            let button =
                createButton(
                    decorationWindow
                    .content,
                    `${base.tl}${base.br} ${name}`,
                    function(
                        button
                        ) {
                        /* <p style="font-family: monospace; white-space: pre; line-height: 0.65em; font-size: 1.5em">┏━━━┓<br>
┃   ┃<br>
┗━━━┛</p>*/
                        setStatus
                            (`<b>${name}</b> has been selected.`,
                                "star"
                                );
                        var selection =
                            new RegionSelection();
                        selection
                            .init();
                        selection
                            .onselection(
                                function(
                                    start,
                                    end,
                                    width,
                                    height
                                    ) {
                                    var star = [
                                        start[0] *
                                        16 +
                                        start[2],
                                        start[1] *
                                        8 +
                                        start[3]
                                        ];
                                    var en = [
                                        end[0] *
                                        16 +
                                        end[2],
                                        end[1] *
                                        8 +
                                        end[3]
                                        ];
                                    writeToXY
                                        (base
                                            .tl,
                                            0,
                                            star[
                                                0
                                                ],
                                            star[
                                                1
                                                ]
                                            );
                                    writeToXY
                                        (base
                                            .tr,
                                            0,
                                            en[
                                                0],
                                            star[
                                                1
                                                ]
                                            );
                                    writeToXY
                                        (base
                                            .bl,
                                            0,
                                            star[
                                                0
                                                ],
                                            en[
                                                1]
                                            );
                                    writeToXY
                                        (base
                                            .br,
                                            0,
                                            en[
                                                0],
                                            en[
                                                1]
                                            );
                                    for (
                                        let i =
                                            1; i <
                                        (width -
                                            1
                                            ); i++
                                        ) { // top
                                        writeToXY
                                            (base
                                                .l,
                                                0,
                                                star[
                                                    0
                                                    ] +
                                                i,
                                                star[
                                                    1
                                                    ]
                                                );
                                    };
                                    for (
                                        let i =
                                            1; i <
                                        (width -
                                            1
                                            ); i++
                                        ) { // bottom
                                        writeToXY
                                            (base
                                                .l,
                                                0,
                                                star[
                                                    0
                                                    ] +
                                                i,
                                                en[
                                                    1]
                                                );
                                    };
                                    for (
                                        let i =
                                            1; i <
                                        (height -
                                            1
                                            ); i++
                                        ) { // left
                                        writeToXY
                                            (base
                                                .vl,
                                                0,
                                                star[
                                                    0
                                                    ],
                                                star[
                                                    1
                                                    ] +
                                                i
                                                );
                                    };
                                    for (
                                        let i =
                                            1; i <
                                        (height -
                                            1
                                            ); i++
                                        ) { // right
                                        writeToXY
                                            (base
                                                .vl,
                                                0,
                                                en[
                                                    0],
                                                star[
                                                    1
                                                    ] +
                                                i
                                                );
                                    };
                                }
                                );
                        selection
                            .startSelection();
                    });
            registerTooltip(
                button,
                `<p style="font-family: monospace; white-space: pre; line-height: 0.6em; font-size: 1.5em">${base.tl}${base.l.repeat(3)}${base.tr}<br>
${base.vl}   ${base.vl}<br>
${base.bl}${base.l.repeat(3)}${base.br}</p>`);
        };
        createOutline({
                tl: "╭",
                l: "─",
                tr: "╮",
                vl: "│",
                br: "╯",
                bl: "╰"
            },
            "Rounded Outline"
            );
        createOutline({
                tl: "┏",
                l: "━",
                tr: "┓",
                vl: "┃",
                br: "┛",
                bl: "┗"
            },
            "Boxed Outline");
        createOutline({
                tl: "╔",
                l: "═",
                tr: "╗",
                vl: "║",
                br: "╝",
                bl: "╚"
            },
            "Gated Outline");
        createOutline({
                tl: "╒",
                l: "╍",
                tr: "╕",
                vl: "╏",
                br: "╛",
                bl: "╘"
            },
            "Dashed Outline"
            );
        createOutline({
                tl: "+",
                l: "-",
                tr: "+",
                vl: "|",
                br: "+",
                bl: "+"
            },
            "Homely Outline"
            );
        createBr(
            decorationWindow
            .content);
        let mono = createButton(
            decorationWindow
            .content,
            "Static",
            function() {
                setStatus(
                    `<b>Monochrome static</b> has been spilled.`,
                    "star"
                    );
                var selection =
                    new RegionSelection();
                selection
                    .init();
                selection
                    .onselection(
                        function(
                            start,
                            end,
                            width,
                            height
                            ) {
                            var star = [
                                start[0] *
                                16 +
                                start[2],
                                start[1] *
                                8 +
                                start[3]
                                ];
                            var en = [
                                end[0] *
                                16 +
                                end[2],
                                end[1] *
                                8 +
                                end[3]
                                ];
                            for (
                                let x =
                                    star[
                                        0
                                        ]; x <
                                en[
                                    0] +
                                1; x++
                                ) {
                                for (
                                    let y =
                                        star[
                                            1
                                            ]; y <
                                    en[
                                        1] +
                                    1; y++
                                    ) {
                                    let c =
                                        Math
                                        .floor(
                                            Math
                                            .random() *
                                            255
                                            );
                                    writeToXY
                                        ("█",
                                            resolveColorValue(
                                                rgbToHex(
                                                    c,
                                                    c,
                                                    c
                                                    )
                                                ),
                                            x,
                                            y
                                            );
                                };
                            };
                        });
                selection
                    .startSelection();
            });
        registerTooltip(mono,
            `<img src="https://storestuff.neocities.org/saturn/mono.png" width="50" style="image-rendering: pixelated;">`
            );
        let color =
            createButton(
                decorationWindow
                .content,
                "Color Static",
                function() {
                    setStatus(
                        `<b>Static</b> has been spilled.`,
                        "star"
                        );
                    var selection =
                        new RegionSelection();
                    selection
                        .init();
                    selection
                        .onselection(
                            function(
                                start,
                                end,
                                width,
                                height
                                ) {
                                var star = [
                                    start[0] *
                                    16 +
                                    start[2],
                                    start[1] *
                                    8 +
                                    start[3]
                                    ];
                                var en = [
                                    end[0] *
                                    16 +
                                    end[2],
                                    end[1] *
                                    8 +
                                    end[3]
                                    ];
                                for (
                                    let x =
                                        star[
                                            0
                                            ]; x <
                                    en[
                                        0] +
                                    1; x++
                                    ) {
                                    for (
                                        let y =
                                            star[
                                                1
                                                ]; y <
                                        en[
                                            1] +
                                        1; y++
                                        ) {
                                        writeToXY
                                            ("█",
                                                resolveColorValue(
                                                    rgbToHex(
                                                        Math
                                                        .floor(
                                                            Math
                                                            .random() *
                                                            255
                                                            ),
                                                        Math
                                                        .floor(
                                                            Math
                                                            .random() *
                                                            255
                                                            ),
                                                        Math
                                                        .floor(
                                                            Math
                                                            .random() *
                                                            255
                                                            )
                                                        )
                                                    ),
                                                x,
                                                y
                                                );
                                    };
                                };
                            });
                    selection
                        .startSelection();
                });
        registerTooltip(color,
            `<img src="https://storestuff.neocities.org/saturn/colorful.png" width="50" style="image-rendering: pixelated;">`
            );

        function tint(baseColor,
            tintColor,
            intensity = 0.5) {
            const
                calculateColor =
                (base, tint) =>
                1 - (1 - tint) /
                (base === 0 ?
                    0.01 : base
                    );
            const r = Math.max(
                0, Math.min(
                    255,
                    Math
                    .round(
                        calculateColor(
                            1 -
                            baseColor
                            .r /
                            255,
                            tintColor
                            .r /
                            255
                            ) *
                        255)
                    ));
            const g = Math.max(
                0, Math.min(
                    255,
                    Math
                    .round(
                        calculateColor(
                            1 -
                            baseColor
                            .g /
                            255,
                            tintColor
                            .g /
                            255
                            ) *
                        255)
                    ));
            const b = Math.max(
                0, Math.min(
                    255,
                    Math
                    .round(
                        calculateColor(
                            1 -
                            baseColor
                            .b /
                            255,
                            tintColor
                            .b /
                            255
                            ) *
                        255)
                    ));
            return {
                r,
                g,
                b
            };
        };
        let tinted =
            createButton(
                decorationWindow
                .content,
                "Tinted Static",
                function() {
                    let modal =
                        new Modal();
                    modal
                        .createForm();
                    modal
                        .setFormTitle(
                            "Choose your static color\n"
                            );
                    let color =
                        modal
                        .addEntry(
                            "Color",
                            "color"
                            )
                        .input;
                    modal
                        .setMaximumSize(
                            360,
                            300
                            );
                    modal
                        .onSubmit(
                            function() {
                                let rgb =
                                    hexToRgb(
                                        color
                                        .value
                                        );
                                var selection =
                                    new RegionSelection();
                                selection
                                    .init();
                                selection
                                    .onselection(
                                        function(
                                            start,
                                            end,
                                            width,
                                            height
                                            ) {
                                            var star = [
                    start[0] * 16 + start[2],
                    start[1] * 8 + start[3]
                ];
                                            var en = [
                    end[0] * 16 + end[2],
                    end[1] * 8 + end[3]
                ];
                                            for (
                                                let x =
                                                    star[
                                                        0
                                                        ]; x <
                                                en[
                                                    0] +
                                                1; x++
                                                ) {
                                                for (
                                                    let y =
                                                        star[
                                                            1
                                                            ]; y <
                                                    en[
                                                        1] +
                                                    1; y++
                                                    ) {
                                                    let drop =
                                                        Math
                                                        .floor(
                                                            Math
                                                            .random() *
                                                            255
                                                            );
                                                    writeToXY
                                                        ("█",
                                                            resolveColorValue(
                                                                rgbToHex(
                                                                    clamp(
                                                                        rgb
                                                                        .r -
                                                                        drop,
                                                                        0,
                                                                        rgb
                                                                        .r
                                                                        ),
                                                                    clamp(
                                                                        rgb
                                                                        .g -
                                                                        drop,
                                                                        0,
                                                                        rgb
                                                                        .g
                                                                        ),
                                                                    clamp(
                                                                        rgb
                                                                        .b -
                                                                        drop,
                                                                        0,
                                                                        rgb
                                                                        .b
                                                                        )
                                                                    )
                                                                ),
                                                            x,
                                                            y
                                                            );
                                                }
                                            }
                                        }
                                        );
                                selection
                                    .startSelection();
                            });
                    modal
                .open();
                    setStatus(
                        `<b>Tinted Static</b> has been spilled.`,
                        "star"
                        );
                });
        createBr(
            decorationWindow
            .content);
        registerTooltip(color,
            `<img src="https://storestuff.neocities.org/saturn/colorful.png" width="50" style="image-rendering: pixelated;">`
            );
        let fillWithColor =
            createButton(
                decorationWindow
                .content,
                "Fill Color",
                function() {
                    let modal =
                        new Modal();
                    modal
                        .createForm();
                    modal
                        .setFormTitle(
                            "Choose your color\n"
                            );
                    let color =
                        modal
                        .addEntry(
                            "Color",
                            "color"
                            )
                        .input;
                    let char =
                        modal
                        .addEntry(
                            "Char",
                            "text"
                            )
                        .input;
                    char.value =
                        "█";
                    modal
                        .setMaximumSize(
                            360,
                            300
                            );
                    modal
                        .onSubmit(
                            function() {
                                var selection =
                                    new RegionSelection();
                                selection
                                    .init();
                                let fillDiv =
                                    $(
                                        "<div></div>");
                                fillDiv
                                    .css({
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: `#${color.value}`,
                                        opacity: 0.5
                                    });
                                $(selection
                                        .selection
                                        )
                                    .append(
                                        fillDiv
                                        );
                                selection
                                    .onselection(
                                        function(
                                            start,
                                            end,
                                            width,
                                            height
                                            ) {
                                            var star = [
                    start[0] * 16 + start[2],
                    start[1] * 8 + start[3]
                ];
                                            var en = [
                    end[0] * 16 + end[2],
                    end[1] * 8 + end[3]
                ];
                                            for (
                                                let x =
                                                    star[
                                                        0
                                                        ]; x <
                                                en[
                                                    0] +
                                                1; x++
                                                ) {
                                                for (
                                                    let y =
                                                        star[
                                                            1
                                                            ]; y <
                                                    en[
                                                        1] +
                                                    1; y++
                                                    ) {
                                                    writeToXY
                                                        (char
                                                            .value,
                                                            resolveColorValue(
                                                                color
                                                                .value
                                                                ),
                                                            x,
                                                            y
                                                            );
                                                }
                                            }
                                        }
                                        );
                                selection
                                    .startSelection();
                            });
                    modal
                .open();
                    setStatus(
                        `<b>The area has been filled.</b>`,
                        "star"
                        );
                });
        registerTooltip(
            fillWithColor,
            `Fill a selected area with a color`
            );
        createBr(
            decorationWindow
            .content);
        decorationWindow
    .close();
        tools.forEach(function(
            tab) {
            $(document)
                .on('keydown',
                    function(
                        e
                        ) {
                        if (e
                            .altKey &&
                            e
                            .key ===
                            tab
                            .altbind &&
                            shortcutsEnabled ==
                            true
                            ) {
                            tab
                        .function();
                        };
                    });
        });
        var coords =
            createWindow(
                "Coordinates",
                250, true, 500,
                250);
        coords.close();
        let coordText = $(
            "<p></p>");
        coords.content.append(
            coordText);

        function coordupdate() {
            var pos =
                currentPosition;
            var str = "";
            str += "TileX: " +
                pos[0] +
                ", CharX: " +
                pos[2] + "<br>";
            str += "TileY: " +
                pos[1] +
                ", CharY: " +
                pos[3] + "<br>";
            str += "<br>";
            str += "Char: [" +
                tileToXY(pos)
                .toString() +
                "]";
            coordText.html(str);
        };
        coordupdate();
        document.onmousemove =
            coordupdate;
        $('#owot').hover(
            function() {
                $(this).css(
                    'cursor',
                    'auto'
                    );
            },
            function() {
                $(this).css(
                    'cursor',
                    'auto'
                    );
            });
        $(document).ready(
            function() {
                var $mouseShadow =
                    $(
                        '<div class="mouse-shadow"></div>')
                    .css({
                        'position': 'fixed',
                        'pointer-events': 'none',
                        'width': '20px',
                        'height': '20px',
                        'border-radius': '50%',
                        'display': 'none',
                        'border': '1px solid white',
                    });
                var $mouseRing =
                    $(
                        '<div class="mouse-shadow"></div>')
                    .css({
                        'position': 'fixed',
                        'pointer-events': 'none',
                        'width': '40px',
                        'height': '40px',
                        'border-radius': '50%',
                        'display': 'none',
                        'border': '1px solid white',
                    });
                $('body')
                    .append(
                        $mouseShadow
                        );
                $('body')
                    .append(
                        $mouseRing
                        );
                let ringX =
                    0;
                let ringY =
                    0;
                let curX =
                0;
                let curY =
                0;

                function lerp(
                    value1,
                    value2,
                    amount
                    ) {
                    amount =
                        amount <
                        0 ?
                        0 :
                        amount;
                    amount =
                        amount >
                        1 ?
                        1 :
                        amount;
                    return value1 +
                        (value2 -
                            value1
                            ) *
                        amount;
                };
                $(document)
                    .mousemove(
                        function(
                            e
                            ) {
                            curX =
                                e
                                .pageX;
                            curY =
                                e
                                .pageY;
                            $mouseShadow
                                .css({
                                    'display': showMouseShadow ?
                                        "block" : "none",
                                    'top': e
                                        .pageY -
                                        10,
                                    'left': e
                                        .pageX -
                                        10,
                                    'background-color': 'rgba(0, 0, 0, 0.125)',
                                });
                        });
                setInterval(
                    () => {
                        ringX
                            =
                            lerp(
                                ringX,
                                curX,
                                0.05
                                );
                        ringY
                            =
                            lerp(
                                ringY,
                                curY,
                                0.05
                                );
                        $mouseRing
                            .css({
                                'display': showMouseShadow ?
                                    "block" : "none",
                                'top': ringY -
                                    20,
                                'left': ringX -
                                    20,
                                'background-color': 'rgba(0, 0, 0, 0.125)',
                            });
                    }, 5
                    );
            });
        let imageAnimal = $(
            "<div>");
        imageAnimal.draggable();
        imageAnimal.css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100px",
            height: "100px",
            cursor: "grab",
            backgroundSize: "100px 100px"
        });
        let animalTooltip =
            registerTooltip(
                imageAnimal,
                "none");
        let prevUrl = "";
        setInterval(() => {
            if (chosenAnimal !=
                0) {
                let curAnimal =
                    animals[
                        parseInt(
                            chosenAnimal
                            ) -
                        1
                        ];
                if (curAnimal
                    .url !=
                    prevUrl
                    ) {
                    imageAnimal
                        .attr(
                            "src",
                            curAnimal
                            .url
                            );
                };
                imageAnimal
                    .css(
                        "backgroundImage",
                        `url(${curAnimal.url}), url(https://storestuff.neocities.org/saturn/loading.gif)`
                        );
                prevUrl
                    =
                    curAnimal
                    .url;
                animalTooltip
                    .content(
                        `${curAnimal.name} => ${curAnimal.description}`
                        );
            } else {
                imageAnimal
                    .css(
                        "display",
                        "none"
                        );
            };
        }, 250);
        $("body").append(
            imageAnimal);
    } catch (error) {
        console.error(error);
    };
})();