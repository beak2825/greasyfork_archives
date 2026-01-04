// ==UserScript==
// @name         Wukong Dev Scripts
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  motiff 开发调试脚本
// @author       You
// @match        https://local.yuanfudao.biz:3000/*
// @match        https://local.yuanfudao.biz/*
// @match        https://wukong.yuanfudao.biz/*
// @match        https://motiff.com/*
// @match        https://*.motiff.com/*
// @match        https://www.motiff.com/*
// @match        https://beta.motiff.com/*
// @match        https://motiff.ai/*
// @match        https://*.motiff.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481990/Wukong%20Dev%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/481990/Wukong%20Dev%20Scripts.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    const NodeType = {
        Vector: 0,
        Document: 1,
        Rectangle: 2,
        Star: 3,
        Polygon: 4,
        Line: 5,
        Ellipse: 6,
        Page: 7,
        Frame: 8,
        Group: 9,
        BoolOperation: 10,
        Text: 11,
        ComponentSet: 12,
        Component: 13,
        Instance: 14,
        PaintStyle: 15,
        TextStyle: 16,
        EffectStyle: 17,
        StyleContainer: 18,
        // Cache = 19, 已弃用
        Comment: 20,
        // Glyph = 21, 已弃用
        Slice: 22,
        LayoutGridStyle: 23,
        Invalid: 99,
    }

    function isStyleNode(nodeType) {
        return nodeType === NodeType.PaintStyle || nodeType == NodeType.TextStyle || nodeType == NodeType.EffectStyle
    }

    function getPageAspect(node) {
        if (node.type !== NodeType.Page) {
            return null
        }

        var pageAspect = {
            lastCreatedNodeId: node.lastCreatedNodeId,
            viewport: node.viewport,
            backgrounds: node.backgrounds,
            selectedTextRange: node.selectedTextRange,
            hoveredNodeId: node.hoveredNodeId,
            targetFrameId: node.targetFrameId,
            hoveredElId: node.hoveredElId,
            selectionRect: node.selectionRect,
            selectedGuideIndex: node.selectedGuideIndex,
            currentViewingFrameId: node.currentViewingFrameId,
            selectedReverseIndex: node.selectedReverseIndex,
            scaleToolPanel: node.scaleToolPanel,
            autoLayoutHoverMenuItem: node.autoLayoutHoverMenuItem,
            autoLayoutSpaceInput: node.autoLayoutSpaceInput,
            showMultipleRenameModal: node.showMultipleRenameModal,
            multipleRenameParams: node.multipleRenameParams,
            titleInputHandle: node.titleInputHandle,
            hoveredHyperlink: node.hoveredHyperlink,
            hyperlinkEditingMode: node.hyperlinkEditingMode,
            showHoverPopupHyperlink: node.showHoverPopupHyperlink,
            hoverPopupHyperlink: node.hoverPopupHyperlink,
            nodePreviewTrack: node.nodePreviewTrack,
            selectLayoutGridState: node.selectLayoutGridState,
            testNotStyleSquares: node.testNotStyleSquares,
            rightClickMenuState: node.rightClickMenuState,
            selection: node.selection,
        }

        return pageAspect
    }

    function getInstanceAspect(node) {
        if (node.type !== NodeType.Instance) {
            return null
        }

        var instanceAspect = {
            mainComponentId: node.mainComponentId,
            symbolData: node.symbolData,
            derivedSymbolData: node.derivedSymbolData,
            scaleFactor: node.scaleFactor,
        }
        return instanceAspect
    }

    function getDocumentAspect(node) {
        if (node.type !== NodeType.Document) {
            return null
        }

        var documentAspect = {
            editorMode: node.editorMode,
            dragMoveMode: node.dragMoveMode,
            quickSwitchToHandTool: node.quickSwitchToHandTool,
            quickSwitchToZoomTool: node.quickSwitchToZoomTool,
            currentPageId: node.currentPageId,
            insertNodeState: node.insertNodeState,
            mouseDownWorldPosition: node.mouseDownWorldPosition,
            mouseWorldPosition: node.mouseWorldPosition,
            mouseDownCameraPosition: node.mouseDownCameraPosition,
            mouseCameraPosition: node.mouseCameraPosition,
            mouseInDragging: node.mouseInDragging,
            mouseDown: node.mouseDown,
            rotationInDragging: node.rotationInDragging,
            debouncedMovingBoundsPositionHold: node.debouncedMovingBoundsPositionHold,
            snapToPixel: node.snapToPixel,
            enablePixelGrid: node.enablePixelGrid,
            showRuler: node.showRuler,
            enableLayoutGrid: node.enableLayoutGrid,
            showMultiplayerCursor: node.showMultiplayerCursor,
            showSidebar: node.showSidebar,
            fullscreen: node.fullscreen,
            shouldActiveVariantPropsInput: node.shouldActiveVariantPropsInput,
            editingNameState: node.editingNameState,
            attrPanelStyleEditorState: node.attrPanelStyleEditorState,
            syncStatus: node.syncStatus,
            editingTextNodeState: node.editingTextNodeState,
            handToolDraggingState: node.handToolDraggingState,
            zoomToolDraggingState: node.zoomToolDraggingState,
            editingVectorState: node.editingVectorState,
            editingVectorPenState: node.editingVectorPenState,
            editingPaint: node.editingPaint,
            placingImageState: node.placingImageState,
            imageStates: node.imageStates,
            selectedGradientColorStopIndex: node.selectedGradientColorStopIndex,
            popupState: node.popupState,
            availableFonts: node.availableFonts,
            rightClickState: node.rightClickState,
            docId: node.docId,
            thumbnailId: node.thumbnailId,
            syncProgress: node.syncProgress,
            windowInnerHeight: node.windowInnerHeight,
            layerPanelScrollTop: node.layerPanelScrollTop,
            mouseRightClickWorldPosition: node.mouseRightClickWorldPosition,
            colorPickState: node.colorPickState,
            docReadonly: node.docReadonly,
            mainMenuVisible: node.mainMenuVisible,
            canvasRightClickMenuVisible: node.canvasRightClickMenuVisible,
            topExtendBoolMenuVisible: node.topExtendBoolMenuVisible,
            enterLayerPanelArea: node.enterLayerPanelArea,
            cursorWithinCanvas: node.cursorWithinCanvas,
            colorMode: node.colorMode,
            inspectState: node.inspectState,
            isViewportAnimating: node.isViewportAnimating,
            showComment: node.showComment,
            showResolvedComments: node.showResolvedComments,
            hoveredCommentId: node.hoveredCommentId,
            activedCommentId: node.activedCommentId,
            drawingComment: node.drawingComment,
            draftComment: node.draftComment,
            selectionPaint: node.selectionPaint,
            freezeSelectionPaint: node.freezeSelectionPaint,
            infiniteSelectionPaint: node.infiniteSelectionPaint,
            editorDevToolEnabled: node.editorDevToolEnabled,
            dragWithSpace: node.dragWithSpace,
            libraryContentVOChangeId: node.libraryContentVOChangeId,
            remoteLibraryChangesChangeId: node.remoteLibraryChangesChangeId,
            libraryPublishModalStateChangeId: node.libraryPublishModalStateChangeId,
            libraryMainModalRoutePath: node.libraryMainModalRoutePath,
            inspectCodeType: node.inspectCodeType,
            localStyleEditingState: node.localStyleEditingState,
            displayPanels: node.displayPanels,
            libraryAssetPanelStateChangeId: node.libraryAssetPanelStateChangeId,
            libraryReplaceModalStateChangeId: node.libraryReplaceModalStateChangeId,
            openingDetailLibraryIdInfo: node.openingDetailLibraryIdInfo,
            replaceTargetLibraryIdInfo: node.replaceTargetLibraryIdInfo,
            subscribedLibraryIds: node.subscribedLibraryIds,
            libraryUpgradeStateChangeId: node.libraryUpgradeStateChangeId,
            showSlice: node.showSlice,
            sidebarPanels: node.sidebarPanels,
            rightClickSource: node.rightClickSource,
            needLayoutOnce: node.needLayoutOnce,
            hasBeenOpened: node.hasBeenOpened,
            isDocImportedFromSketch: node.isDocImportedFromSketch,
            isDocImportedFromFigma: node.isDocImportedFromFigma,
            expandBoundsRotationCollisionRange: node.expandBoundsRotationCollisionRange,
            coactorMembershipMap: node.coactorMembershipMap,
            coactorMouseMap: node.coactorMouseMap,
            coactorSelectionsMap: node.coactorSelectionsMap,
            coactorViewportMap: node.coactorViewportMap,
            coactorObservedMap: node.coactorObservedMap,
            docMode: node.docMode,
            mirrorNodeId: node.mirrorNodeId,
            mirrorScreenScrollY: node.mirrorScreenScrollY,
            activatedPluginType: node.activatedPluginType,
            imageSearchProgress: node.imageSearchProgress,
            notificationMovedComponentStyleNodeIds: node.notificationMovedComponentStyleNodeIds,
            operateSystem: node.operateSystem,
            inverseZoomDirection: node.inverseZoomDirection,
            smallNudgeAmount: node.smallNudgeAmount,
            bigNudgeAmount: node.bigNudgeAmount,
            allFonts: node.allFonts,
            showShortcutPanel: node.showShortcutPanel,
            historyMode: node.historyMode,
            movingComment: node.movingComment,
            commentClusterResult: node.commentClusterResult,
            libraryUpgradedCount: node.libraryUpgradedCount,
            devicePixelRatio: node.devicePixelRatio,
            textSearch: node.textSearch,
            memoryUsage: node.memoryUsage,
            canvasSearchParam: node.canvasSearchParam,
            documentColorProfile: node.documentColorProfile,
            canvasSearchResultSelection: node.canvasSearchResultSelection,
            documentColorProfileMeta: node.documentColorProfileMeta,
            canvasSearchResult: node.canvasSearchResult,
            isDocImportedFromAI: node.isDocImportedFromAI,
        }

        return documentAspect
    }

    function getLayoutAspect(node) {
        var type = node.type
        if (
            type === null ||
            type === undefined ||
            isStyleNode(type) ||
            type === NodeType.Comment ||
            type === NodeType.Page ||
            type === NodeType.Document ||
            type === NodeType.Page
        ) {
            return null
        }

        var layoutAspect = {
            visible: node.visible,
            locked: node.locked,
            width: node.width,
            height: node.height,
            relativeTransform: node.relativeTransform,
            cornerRadius: node.cornerRadius,
            topLeftRadius: node.topLeftRadius,
            topRightRadius: node.topRightRadius,
            strokeWeight: node.strokeWeight,
            borderTopWeight: node.borderTopWeight,

            // Style
            fillStyleId: node.fillStyleId,
            strokeStyleId: node.strokeStyleId,
            effectStyleId: node.effectStyleId,
            computedFills: node.getComputedFills(),
            computedStrokes: node.getComputedStrokes(),
            computedEffects: node.getComputedEffects(),
        }
        return layoutAspect
    }

    function getTextAspect(node) {
        if (node.type !== NodeType.Text) {
            return null
        }
        var textAspect = {
            // TextStyleNode & TextNode props
            computedFontSize: node.getComputedFontSize(),
            computedFontName: node.getComputedFontName(),
            computedLineHeight: node.getComputedLineHeight(),
            computedLetterSpacing: node.getComputedLetterSpacing(),
            computedParagraphSpacing: node.getComputedParagraphSpacing(),
            computedTextDecoration: node.getComputedTextDecoration(),

            // TextNode own props
            textAlignVertical: node.textAlignVertical,
            textAlignHorizontal: node.textAlignHorizontal,
            textAutoResize: node.textAutoResize,
            autoRename: node.autoRename,
            textCase: node.textCase,
            textData: node.textData,
            textLayoutData: node.textLayoutData,
            hyperlink: node.hyperlink,
            textTruncation: node.textTruncation,
            maxLines: node.maxLines,
            textStyleId: node.textStyleId,

            // other
            fullStyledTextSegments: node.getFullStyledTextSegments(),
            hasUnloadedFont: node.hasUnloadedFont(),
        }

        return textAspect
    }

    var wm = {
        get curSel() {
            var sels = wukong.currentSelection()
            if (sels.length === 0) {
                return null
            }
            return this.get(sels[0].id)
        },
        get(id) {
            var node = wukong.getNode(id)
            var self = this

            const getStyleNode = (attr) => {
                const id = node[attr]
                if (!id) {
                    return null
                }
                return self.get(id)
            }

            const target = {
                id: id,
                _node: node,
                get parent() {
                    var parentInfo = node.parentInfo
                    if (!parentInfo) {
                        return null
                    }
                    return self.get(parentInfo.parentId)
                },
                get children() {
                    var childrenIds = node.childrenIds
                    var children = childrenIds.map((id) => self.get(id))
                    return children
                },
                get sourceInComponent() {
                    if (!id.includes(';')) {
                        return self.get(id)
                    }
                    const ids = id.split(';')
                    const sourceId = ids[ids.length - 1]
                    return self.get(sourceId)
                },
                get mainComponent() {
                    var cid = node.mainComponentId
                    if (!cid) {
                        return null
                    }
                    return self.get(cid)
                },
                get layoutAttrs() {
                    var width = node.width
                    var height = node.height
                    var relativeTransform = node.relativeTransform

                    return {
                        width,
                        height,
                        relativeTransform,
                    }
                },
                get fillStyle() {
                    return getStyleNode('fillStyleId')
                },
                get strokeStyle() {
                    return getStyleNode('strokeStyleId')
                },
                get effectStyle() {
                    return getStyleNode('effectStyleId')
                },
            }

            return new Proxy(target, {
                get: function (obj, prop) {
                    return prop in target ? target[prop] : node[prop]
                },
                set: function (obj, prop, val) {
                    node[prop] = val
                },
            })
        },

        extractNode(node) {
            if (typeof node === 'string' || node instanceof String) {
                node = this.get(node)
            }

            return {
                id: node.id,
                name: node.name,
                type: node.type,
                ...getDocumentAspect(node),
                ...getPageAspect(node),
                ...getLayoutAspect(node),
                ...getInstanceAspect(node),
                ...getTextAspect(node),
            }
        },

        get po() {
            if (this.curSel) {
                return this.extractNode(this.curSel)
            }
        },
    }
    window.wm = wm

    // Code Helper

    let downloadURL = function (data, fileName) {
        let a
        a = window.document.createElement('a')
        a.href = data
        a.download = fileName
        window.document.body.appendChild(a)
        a.style = 'display: none'
        a.click()
        a.remove()
    }

    let _downloadBlob = function (data, fileName, mimeType) {
        let blob, url
        blob = new Blob([data], {
            type: mimeType,
        })
        url = window.URL.createObjectURL(blob)
        downloadURL(url, fileName)
    }

    var dc = {}
    dc.downloadBlob = function (data, filename) {
        _downloadBlob(data, filename, 'application/octet-stream')
    }
    dc.downloadProto = function (proto, msg, name) {
        var writter = proto.encode(msg)
        var buffer = writter.finish()
        dc.downloadBlob(buffer, name)
    }
    dc.downloadJson = function (obj, name) {
        var str = JSON.stringify(obj, null, 2)
        _downloadBlob(str, name, 'application/json')
    }
    dc.downloadDocumentFromReplayer = function (decoded) {
        for (let call of decoded.bridgeCalls) {
            if (call.code === Wukong.DocumentProto.WasmCallCode.WCC_handleSynergyEvent) {
                let payload = Wukong.DocumentProto.Arg_handleSynergyEvent.decodeDelimited(call.args)
                // @ts-ignore
                window.dc.downloadBlob(payload.payload, 'document.bin')
                break
            }
        }
    }
    dc.downloadClipboardFromReplayer = function (decoded) {
        for (let call of decoded.bridgeCalls) {
            if (
                call.code === Wukong.DocumentProto.JsCallCode.JCC_clipboardReadItems &&
                call.action === Wukong.DocumentProto.BridgeAction.BRIDGE_ACTION_JS_CALL_END
            ) {
                let payload = Wukong.DocumentProto.Ret_clipboardReadItems.decodeDelimited(call.ret)
                // @ts-ignore
                window.dc.downloadProto(Wukong.DocumentProto.Ret_clipboardReadItems, payload, 'clipboard.bin')
                break
            }
        }
    }
    dc.prettyStringify = function (o) {
        var s = '{'
        s += Object.keys(o)
            .sort((a, b) => a.localeCompare(b))
            .map((key) => {
                var c = ''
                c += `"${key}"`
                c += ':'
                c += JSON.stringify(o[key])
                return c
            })
            .join(',')
        s += '}'
        return s
    }
    window.dc = dc

    var dd = {}
    dd.selPublishInfos = () => {
        const queue = [wm.curSel]
        const ret = []
        while (queue.length) {
            const node = queue.shift()

            if (node.type === 12 || node.type === 13) {
                ret.push([node.id, node.publishFile, node.publishId])
            }
            if (node.type === 14) {
                const comp = node.mainComponent
                if (comp.parent) {
                    queue.push(comp.parent)
                } else {
                    queue.push(comp)
                }
            }
            for (const child of node.children) {
                queue.push(child)
            }
        }

        return ret
    }
    dd.replaceEditedMainComponentIds = (from, to) => {
        var NP_mainComponentId = 239
        var store = wkd.store.store

        var targetNodes = Object.values(store).filter(
            (v) =>
                v.id &&
                v.type === 14 &&
                v.mainComponentId === from &&
                v.editedProps &&
                v.editedProps.includes(NP_mainComponentId)
        )
        console.log('targetNodes size:', targetNodes.length)
        targetNodes.forEach((node) => wkd.updateNodeAttr(node.id, 'mainComponentId', to))
    }
    dd.getSelRelCompIds = () => {
        var sel = wm.curSel

        const queue = [sel]
        const mainCompIds = new Set()
        while (queue.length) {
            const cur = queue.shift()

            if (cur.type === 14) {
                mainCompIds.add(cur.mainComponentId)
            }

            for (const child of cur.children) {
                queue.push(child)
            }
        }
        return [...mainCompIds]
    }
    dd.localizeSelRelComps = () => {
        const mainCompIds = dd.getSelRelCompIds()
        let offsetX = 0

        for (const id of mainCompIds) {
            const mainComp = wm.get(id)
            let target = mainComp
            if (target.parent?._node && target.parent.type == 12) {
                target = target.parent
            }
            const width = target.width

            wukong.currentPage().append(target._node)
            target._node.relativeTransform = {
                translateX: offsetX,
                translateY: 0,
            }
            mainComp._node.publishFile = null
            mainComp._node.publishId = null
            offsetX = offsetX + width + 10
        }
    }
    dd.selNodeByNameInSel = (targetName) => {
        var curSels = wukong.currentSelection()
        var targetId = curSels.length === 0 ? wukong.currentPage().id : curSels[0].id
        console.log(targetId)

        const queue = [wukong.getNode(targetId)]
        const ret = []
        while (queue.length) {
            const [node] = queue.splice(0, 1)
            if (node.name === targetName) {
                ret.push(node.id)
            }

            for (const child of node.getChildren()) {
                queue.push(child)
            }
        }
        wm.get(wukong.currentPage().id).selection = ret
    }
    dd.walkAll = (fn) => {
        var docNode = wukong.currentDocument()
        var queue = [docNode]
        var ret = []
        var visited = new Set()

        while (queue.length) {
            var node = queue.shift()
            fn(node)

            if (node.type === 14) {
                var mid = node.mainComponentId
                var m = wukong.getNode(mid)
                var mp = m.getParent()
                var target = mp ? mp : m
                if (!visited.has(target.id)) {
                    visited.add(target.id)
                    queue.push(target)
                }
            }

            for (const child of node.getChildren()) {
                queue.push(child)
            }
        }
    }
    dd.digestAndDownload = (filename) => {
        var docNode = wukong.currentDocument()
        var queue = [docNode]
        var ret = []

        while (queue.length) {
            var node = queue.shift()
            ret.push(extractNode(node))

            for (const child of node.getChildren()) {
                queue.push(child)
            }
        }

        var s = JSON.stringify(ret)
        dc.downloadBlob(s, filename)
    }

    dd.digestAndDownloadText = (filename) => {
        function extractDigest(node) {
            if (node.type !== 11) {
                return null
            }

            return {
                id: node.id,
                characters: node.textData?.characters || '',
            }
        }

        var docNode = wukong.currentDocument()
        var queue = [docNode]
        var ret = []

        while (queue.length) {
            var node = queue.shift()
            var val = extractDigest(node)
            if (val) {
                ret.push(val)
            }

            for (const child of node.getChildren()) {
                queue.push(child)
            }
        }

        var s = JSON.stringify(ret)
        dc.downloadBlob(s, filename)
    }

    window.dd = dd
})()
