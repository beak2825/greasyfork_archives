// ==UserScript==
// @name        WaniKani Stroke Order
// @namespace   japanese
// @version     1.1.22
// @description Shows a kanji's stroke order on its page and during lessons and reviews.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @author      Looki, maintained by kind users on the forum
// @grant       GM_xmlhttpRequest
// @connect     jisho.org
// @connect     cloudfront.net
// @require     https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js
// @require     https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1326536

// @downloadURL https://update.greasyfork.org/scripts/414633/WaniKani%20Stroke%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/414633/WaniKani%20Stroke%20Order.meta.js
// ==/UserScript==

/*
 * Thanks a lot to ...
 * Wanikani Phonetic-Semantic Composition - Userscript
 * by ruipgpinheiro (LordGravewish)
 * ... for code showing me how to insert sections during kanji reviews.
 * The code heavily borrows from that script!
 * Also thanks to Halo for a loading bug fix!
 */

;(function () {
    /* global Snap */

    /*
     * Helper Functions/Variables
     */
    let wkItemInfo = unsafeWindow.wkItemInfo

    /*
     * Global Variables/Objects/Classes
     */
    const JISHO = 'https://jisho.org'
    const strokeOrderCss =
        '.stroke_order_diagram--bounding_box {fill: none; stroke: #ddd; stroke-width: 2; stroke-linecap: square; stroke-linejoin: square;}' +
        '.stroke_order_diagram--bounding_box {fill: none; stroke: #ddd; stroke-width: 2; stroke-linecap: square; stroke-linejoin: square;}' +
        '.stroke_order_diagram--existing_path {fill: none; stroke: #aaa; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round;}' +
        '.stroke_order_diagram--current_path {fill: none; stroke: #000; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round;}' +
        '.stroke_order_diagram--path_start {fill: rgba(255,0,0,0.7); stroke: none;}' +
        '.stroke_order_diagram--guide_line {fill: none; stroke: #ddd; stroke-width: 2; stroke-linecap: square; stroke-linejoin: square; stroke-dasharray: 5, 5;}'

    init()

    /*
     * Main
     */
    function init() {
        wkItemInfo.on('lesson').forType('kanji').under('composition').append('Stroke Order', loadDiagram)
        wkItemInfo
            .on('lessonQuiz, review, extraStudy, itemPage')
            .forType('kanji')
            .under('composition')
            .appendAtTop('Stroke Order', loadDiagram)

        let style = document.createElement('style')
        style.textContent = strokeOrderCss
        document.head.appendChild(style)
    }

    function xmlHttpRequest(urlText) {
        return new Promise((resolve, reject) =>
            GM_xmlhttpRequest({
                method: 'GET',
                url: urlText,
                onload: (xhr) => {
                    xhr.status === 200 ? resolve(xhr) : reject(xhr.responseText)
                },
                onerror: (xhr) => {
                    reject(xhr.responseText)
                },
            }),
        )
    }

    /*
     * Adds the diagram section element to the appropriate location
     */
    async function loadDiagram(injectorState) {
        let xhr = await xmlHttpRequest(JISHO + '/search/' + encodeURI(injectorState.characters) + '%20%23kanji')

        let strokeOrderSvg = xhr.responseText.match(/var url = '\/\/(.+)';/)
        if (!strokeOrderSvg) return null

        xhr = await xmlHttpRequest('https://' + strokeOrderSvg[1])

        let namespace = 'http://www.w3.org/2000/svg'
        let div = document.createElement('div')
        let svg = document.createElementNS(namespace, 'svg')
        svg.id = 'stroke_order'
        div.style = 'width: 100%; overflow: auto hidden;'
        new strokeOrderDiagram(
            svg,
            xhr.responseXML || new DOMParser().parseFromString(xhr.responseText, 'application/xml'),
        )
        div.append(svg)
        return div
    }

    /*
     * Lifted from jisho.org, modified to allow multiple rows
     */
    var strokeOrderDiagram = function (element, svgDocument) {
        var s = Snap(element)
        var diagramSize = 200
        var coordRe = '(?:\\d+(?:\\.\\d+)?)'
        var strokeRe = new RegExp('^[LMT]\\s*(' + coordRe + ')[,\\s](' + coordRe + ')', 'i')
        var f = Snap(svgDocument.getElementsByTagName('svg')[0])
        var allPaths = f.selectAll('path')
        var drawnPaths = []
        var framesPerRow = 10
        var rowCount = Math.floor((allPaths.length - 1) / framesPerRow) + 1
        var canvasWidth = (Math.min(framesPerRow, allPaths.length) * diagramSize) / 2
        var frameSize = diagramSize / 2
        var canvasHeight = frameSize * rowCount
        var frameOffsetMatrix = new Snap.Matrix()
        frameOffsetMatrix.translate(-frameSize / 16 + 2, -frameSize / 16 + 2)

        // Set drawing area
        s.node.style.width = canvasWidth + 'px'
        s.node.style.height = canvasHeight + 'px'
        s.node.setAttribute('viewBox', '0 0 ' + canvasWidth + ' ' + canvasHeight)

        // Draw global guides
        var boundingBoxTop = s.line(1, 1, canvasWidth - 1, 1)
        var boundingBoxLeft = s.line(1, 1, 1, canvasHeight - 1)
        for (var i = 0; i < rowCount; i++) {
            var horizontalY = frameSize / 2 + i * frameSize
            var horizontalGuide = s.line(0, horizontalY, canvasWidth, horizontalY)
            horizontalGuide.attr({ class: 'stroke_order_diagram--guide_line' })
            var boundingBoxBottom = s.line(1, frameSize * (i + 1) - 1, canvasWidth - 1, frameSize * (i + 1) - 1)
            boundingBoxBottom.attr({ class: 'stroke_order_diagram--bounding_box' })
        }
        boundingBoxTop.attr({ class: 'stroke_order_diagram--bounding_box' })
        boundingBoxLeft.attr({ class: 'stroke_order_diagram--bounding_box' })

        // Draw strokes
        var pathNumber = 1
        allPaths.forEach(function (currentPath) {
            var effectivePathNumber = ((pathNumber - 1) % framesPerRow) + 1
            var effectiveY = Math.floor((pathNumber - 1) / framesPerRow) * frameSize
            var moveFrameMatrix = new Snap.Matrix()
            moveFrameMatrix.translate(frameSize * (effectivePathNumber - 1) - 4, -4 + effectiveY)

            // Draw frame guides
            var verticalGuide = s.line(
                frameSize * effectivePathNumber - frameSize / 2,
                1,
                frameSize * effectivePathNumber - frameSize / 2,
                canvasHeight - 1,
            )
            var frameBoxRight = s.line(
                frameSize * effectivePathNumber - 1,
                1,
                frameSize * effectivePathNumber - 1,
                canvasHeight - 1,
            )
            verticalGuide.attr({ class: 'stroke_order_diagram--guide_line' })
            frameBoxRight.attr({ class: 'stroke_order_diagram--bounding_box' })

            // Draw previous strokes
            drawnPaths.forEach(function (existingPath) {
                var localPath = existingPath.clone()
                localPath.transform(moveFrameMatrix)
                localPath.attr({ class: 'stroke_order_diagram--existing_path' })
                s.append(localPath)
            })

            // Draw current stroke
            currentPath.transform(frameOffsetMatrix)
            currentPath.transform(moveFrameMatrix)
            currentPath.attr({ class: 'stroke_order_diagram--current_path' })
            s.append(currentPath)

            // Draw stroke start point
            var match = strokeRe.exec(currentPath.node.getAttribute('d'))
            var pathStartX = match[1]
            var pathStartY = match[2]
            var strokeStart = s.circle(pathStartX, pathStartY, 4)
            strokeStart.attr({ class: 'stroke_order_diagram--path_start' })
            strokeStart.transform(moveFrameMatrix)

            pathNumber++
            drawnPaths.push(currentPath.clone())
        })
    }
})()
