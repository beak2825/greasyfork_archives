// ==UserScript==
// @name         WME Rearview
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Utility for drawing polygons on the editor map with polygons being remembered statefully.
// @author       slemmon
// @match        https://www.waze.com/editor/*
// @match        https://editor-beta.waze.com/editor/*
// @require      https://greasyfork.org/scripts/15731-wme-util-singleton/code/WME%20Util%20Singleton.js?version=98096
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15484/WME%20Rearview.user.js
// @updateURL https://update.greasyfork.org/scripts/15484/WME%20Rearview.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/**
 *  =============================================
 *  USER INFORMATION
 *  =============================================
 *
 * DRAWING USER-DEFINED POLYGONS (masked)
 * Click the pencil icon to enable the draw feature to draw a polygon on the map
 * 
 * DRAWING OUTLINE POLYGONS
 * Double-click the pencil icon to draw outlined polygons -vs- filled/masked polygons
 *
 * DRAWING A BOX OVER THE CURRENT MAP VIEW (masked)
 * Click the box button below the pencil icon to mask the current map view
 * 
 * DRAWING AN OUTLINE OVER THE CURRENT MAP VIEW
 * Double-click the box icon below the pencil icon to toggle the box outline control.
 * Clicking on the box outline icon will place an outline over the current map view.
 *
 * MERGING POLYGONS / BOXES
 * Drawing a polygon or creating a box over an existing polygon will merge the two creating
 * a single polygon of the outer edge of the overlapping polygons (any holes between the polygons
 * will be omitted).  The merged polygon's fill color will be determined by the last-drawn
 * polygon / box.
 *
 * NAVIGATING THROUGH POLYGON DRAW HISTORY
 * The lower back and forward buttons will allow you to undo / redo polygons and boxes.
 * **Note: If you undo polygon history and then draw a polygon / box it will become the next
 * step in the redo path.
 *
 * CLEAR POLYGONS
 * The trashcan button will clear all polygons / boxes from the map.  This action can be undone.
 *
 * RESET POLYGONS
 * To clear all polygons and reset the stateful history in browser memory double-click the
 * trashcan icon.  On the following confirm reset dialog click the second trashcan icon.
 * **Note: This action cannot be undone.
 *
 * COLLAPSED / EXPANDED CONTROLS
 * Click the X button to collapse the controls (hiding the clear, undo, and redo buttons).
 * Click the + button to expand the controls.
 *
 * STATEFULNESS
 * The 'outline' state of the draw and box controls persists between page refreshes.
 * The map polygons / boxes and the undo / redo history also persist.
 *
 * TAB PARITY
 * Changes made on one open tab will be replicated on any other open tabs (within the same
 * browser and on the same Waze hostname).
 */
$(document.body).on('extready', function () {
    //W.ux = W.ux || {};

    Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
    
    Ext.define('W.ux.BeenHere', {
        singleton: true,
        util: W.ux.Util,
        
        _defaultStyle: {
            strokeColor: '#0BA9CC',
            strokeOpacity: 1,
            strokeWidth: 3,
            pointRadius: 6,
            fillColor: '#0BA9CC',
            fillOpacity: .3
        },
        style: {},
        getStyle: function () {
            return this.style;
        },
        setStyle: function (style) {
            this.style = Ext.apply({}, (style || {}), this._defaultStyle);
        },
        init: function () {
            var me = this,
                map = me.util.getMap(),
                wazeEvents = Waze.model.actionManager.events,
                vectors, draw;

            me.setStyle(me.getStyle());
            vectors = me.getDrawLayer()
            map.addLayer(vectors);
            vectors.setVisibility(true);
            draw = me.getDrawControl()
            map.addControls([draw]);

            me.initControls();
            me.geoJson = new OpenLayers.Format.GeoJSON();
            me.loadHistory();
            me.pollHistory();

            wazeEvents.register("afteraction", me, me.onActionChange);
            wazeEvents.register("afterclearaction", me, me.onActionChange);
            wazeEvents.register("afterundoaction", me, me.onActionChange);
        },
        onActionChange: function () {
            this.setActive(!Waze.model.actionManager.canSave());
        },
        getDrawControl: function () {
            var draw = this.draw;

            if (!draw) {
                OpenLayers.Control.BHDrawFeature = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
                    initialize: function (layer, handler, options) {
                        var me = this;

                        OpenLayers.Control.DrawFeature.prototype.initialize.apply(me, [layer, handler, options]);

                        // configure the keyboard handler
                        me.keyboardHandler = new OpenLayers.Handler.Keyboard(this, {
                            keydown: me.handleKeyDown
                        }, {});
                    },
                    handleKeyDown: function (evt) {
                        switch (evt.keyCode) {
                            case 90: // z
                                if (evt.metaKey || evt.ctrlKey) {
                                    this.undo();
                                }
                                break;
                            case 89:
                                evt.preventDefault(); // prevent the browser from handling this
                                if (evt.metaKey || evt.ctrlKey) {
                                    this.redo();
                                }
                                break;
                            case 27: // esc
                                this.cancel();;
                                break;
                        }
                    },
                    activate: function () {
                        OpenLayers.Control.DrawFeature.prototype.activate.apply(this, arguments);
                        this.keyboardHandler.activate();
                    },
                    deactivate: function () {
                        OpenLayers.Control.DrawFeature.prototype.deactivate.apply(this, arguments);
                        this.keyboardHandler.deactivate();
                    }
                });

                draw = this.draw = new OpenLayers.Control.BHDrawFeature(this.getDrawLayer(), OpenLayers.Handler.Polygon);
            }

            return draw;
        },
        getDrawLayer: function () {
            var me = this,
                vectors = me.vectorsLayer;

            if (!vectors) {
                vectors = me.vectorsLayer = new OpenLayers.Layer.Vector('Been Here Again', {
                    eventListeners: {
                        featuresadded: me.onVectorsChange,
                        visibilitychanged : me.onVisibilityChange,
                        scope: me
                    },
                    //style: $.extend({}, me.getStyle())
                    style: Ext.apply({}, me.getStyle())
                });
            }

            return vectors;
        },
        initControls: function () {
            var me = this,
                mapEl = Ext.get(me.util.getMap().div);
            
            me.controlsEl = mapEl.appendChild({
                class: 'bt-controls-wrap noselect',
                html: '<div class="bt-controls-ct">' +
                '<div class="bt-control-close" data-toggle="tooltip"></div>' +
                '<div class="bt-control-draw"></div>' +
                '<div class="bt-control-clear bt-control-disabled"></div>' +
                '<div class="bt-control-box"></div>' +
                //'<div class="bt-control-clear"></div>' +
                '<div class="bt-control-back bt-control-disabled"></div>' +
                '<div class="bt-control-forward bt-control-disabled"></div>' +
                '</div>' +

                '<div class="bt-delete-confirm">' +
                'Reset <br>all?' +
                '<div class="bt-delete-confirm-close"></div>' +
                '<div class="bt-delete-confirm-true"></div>' +
                //'<div class="bt-delete-confirm-close">confirm</div>' +
                '</div>'
            });

            me.addStyleRules();
            me.addFonts();
            me.initControlHandlers();
        },
        initControlHandlers: function () {
            var me = this,
                target;

            // click handlers for the controls
            me.controlsEl.on({
                click: function (e) {
                    var target = e.getTarget(null, null, true);
                    
                    if (target.hasCls('bt-control-back') && !target.hasCls('bt-control-disabled')) {
                        me.back();
                    }
                    if (target.hasCls('bt-control-forward') && !target.hasCls('bt-control-disabled')) {
                        me.forward();
                    }
                    if (target.hasCls('bt-control-draw')) {
                        me.toggleDraw();
                    }
                    if (target.hasCls('bt-control-box')) {
                        me.addFullScreenMask();
                    }
                    if (target.hasCls('bt-control-clear') && !target.hasCls('bt-control-disabled')) {
                        me.clearFeatures();
                    }
                    if (target.hasCls('bt-delete-confirm-true')) {
                        me.resetAll();
                    }
                    if (target.hasCls('bt-delete-confirm-close')) {
                        me.closeDeleteDialog();
                    }
                    if (target.hasCls('bt-control-close')) {
                        me.toggleCollapsed();
                    }
                },
                dblclick: function (e) {
                    var target = e.getTarget(null, null, true);
                    
                    if (target.hasCls('bt-control-clear') && !target.hasCls('bt-control-disabled')) {
                        me.confirmClearFeatures();
                    }
                    if (target.hasCls('bt-control-draw')) {
                        me.toggleDrawOutline();
                    }
                    if (target.hasCls('bt-control-box')) {
                        me.toggleBoxOutline();
                    }
                }
            });
        },
        toggleDrawOutline: function (select) {
            var el = Ext.query('.bt-control-draw', false)[0],
                outlineCls = 'bt-control-draw-outline',
                isOutline = el.hasCls(outlineCls),
                timestamp;

            if (select === true || select === false) {
                el[select ? 'addCls' : 'removeCls'](outlineCls);
            } else {
                el.toggleCls(outlineCls);
            }

            isOutline = el.hasCls(outlineCls);
            /*timestamp = Date.now().toString();
            if (!this.suspendEvents) {
                localStorage.setItem('bh_draw_outline', isOutline);
                localStorage.setItem('bh_history_timestamp', timestamp);
                this.lastSaved = timestamp;
                el.addCls('bt-control-selected');
                this.getDrawControl().activate();
            }*/

            if (!this.suspendEvents) {
                this.saveState();
                el.addCls('bt-control-selected');
                this.getDrawControl().activate();
            }
        },
        toggleBoxOutline: function (select) {
            var me = this,
                el = Ext.query('.bt-control-box', false)[0],
                outlineCls = 'bt-control-box-outline',
                isOutline = el.hasCls(outlineCls),
                vectors = me.getDrawLayer(),
                features, timestamp;

            if (select === true || select === false) {
                el[select ? 'addCls' : 'removeCls'](outlineCls);
            } else {
                el.toggleCls(outlineCls);
            }

            isOutline = el.hasCls(outlineCls);
            /*timestamp = Date.now().toString();
            if (!this.suspendEvents) {
                localStorage.setItem('bh_box_outline', isOutline);
                localStorage.setItem('bh_history_timestamp', timestamp);
                this.lastSaved = timestamp;

                me.back();
                features = vectors.features;
                me.setFeatureStyle(features[features.length - 1], {
                    fillOpacity: el.hasCls('bt-control-box-outline') ? 0 : .3
                });
            }*/
            if (!this.suspendEvents) {
                this.saveState();
                me.back().back();
                me.cache = me.cache.slice(0, me.getCachePos() + 1);
                me.setCachePos(me.cache.length - 1);
            }
        },
        addFullScreenMask: function () {
            var el = Ext.query('.bt-control-box', false)[0],
                extent = this.util.getMap().getExtent(),
                points = [
                    new OpenLayers.Geometry.Point(extent.left, extent.top),
                    new OpenLayers.Geometry.Point(extent.left, extent.bottom),
                    new OpenLayers.Geometry.Point(extent.right, extent.bottom),
                    new OpenLayers.Geometry.Point(extent.right, extent.top)
                ];

            this.getDrawLayer().addFeatures([this.util.getPolyFromPoints(points, null, Ext.apply({}, {
                fillOpacity: el.hasCls('bt-control-box-outline') ? 0 : .3
            }, this.getStyle()))])
        },
        setFeatureStyle: function (feature, style) {
            feature.style = Ext.apply({}, (style || {}), this.getStyle());
            this.getDrawLayer().redraw();
        },
        toggleCollapsed: function (collapsed) {
            var el = Ext.query('.bt-controls-wrap', false)[0],
                collapsedCls = 'bt-controls-collapsed',
                isCollapsed, collapsedState, timestamp;

            if (collapsed === true || collapsed === false) {
                if (collapsed) {
                    el.addCls(collapsedCls);
                } else {
                    el.removeCls(collapsedCls);
                }
            } else {
                el.toggleCls(collapsedCls);
            }

            if (!localStorage) {
                return;
            }

            isCollapsed = el.hasCls(collapsedCls);
            /*timestamp = Date.now().toString();
            if (!this.suspendEvents) {
                localStorage.setItem('bh_collapsed', isCollapsed);
                localStorage.setItem('bh_history_timestamp', timestamp);
                this.lastSaved = timestamp;
            }*/
            if (!this.suspendEvents) {
                this.saveState();
            }
        },
        confirmClearFeatures: function () {
            Ext.query('.bt-controls-wrap', false)[0].toggleCls('bt-show-delete-confirm');
            this.back().back();
        },
        closeDeleteDialog: function () {
            Ext.query('.bt-controls-wrap', false)[0].toggleCls('bt-show-delete-confirm');
        },
        clearFeatures: function () {
            this.getDrawLayer().destroyFeatures();
            this.onVectorsChange();
        },
        resetAll: function () {
            var me = this;

            Ext.query('.bt-controls-wrap', false)[0].toggleCls('bt-show-delete-confirm');
            me.getDrawLayer().destroyFeatures();
            me.cache = [];
            //me.setCachePos(0);
            me.lastSaved = null;

            /*if (localStorage) {
                localStorage.removeItem('bh_history');
                localStorage.removeItem('bh_history_timestamp');
                localStorage.removeItem('bh_history_pos');
            }*/
            Ext.state.Manager.clear(me.stateId);
            me.setCachePos(0);
        },
        toggleDraw: function (select) {
            var el = Ext.query('.bt-control-draw', false)[0],
                draw = this.getDrawControl(),
                selected = el.hasCls('bt-control-selected');

            if (select || !selected) {
                draw.activate();
                el.addCls('bt-control-selected');
            }
            if (select === false || selected) {
                draw.deactivate();
                el.removeCls('bt-control-selected');
            }
        },
        addStyleRules: function () {
            var panButton = $('.pan-button'),
                panBottom = panButton.position().top + panButton.outerHeight(),
                rules = [
                    // controls wrap and control button styling
                    '.bt-controls-wrap { position: absolute; top: ' + parseInt(panBottom + 23) + 'px; left: 8px; z-index: 1004; width: 60px; height: 90px; background: white; border-radius: 3px; overflow: hidden; transition: all 150ms; }',
                    '.bt-controls-wrap > .bt-controls-ct > div { position: relative; padding: 4px; margin: 2px; display: inline-block; cursor: pointer; border-radius: 1px; }',
                    '.bt-controls-wrap > .bt-controls-ct > div:hover { background: #DCECF1; }',
                    '.bt-controls-wrap > .bt-controls-ct > div:active { background: #9FC3CE; }',
                    '.bt-controls-wrap > .bt-controls-ct > div:before { font-family: "Material Icons"; line-height: 18px; vertical-align: top; font-size: 18px; color: #58889E; -webkit-font-smoothing: antialiased; border-radius: 50%; }',
                    '.bt-control-draw:before { content: "\\e254"; }',
                    '.bt-control-draw-outline:before { content: "\\e22b"; }',
                    '.bt-control-box:before { content: "\\e421"; }',
                    '.bt-control-box-outline:before { content: "\\e3c6" }',
                    '.bt-control-close:before { content: "\\e5cd"; }',
                    '.bt-control-clear:before { content: "\\e872"; }',
                    '.bt-control-back:before { content: "\\e166"; }',
                    '.bt-control-forward:before { content: "\\e15a"; }',
                    '.bt-control-selected { background: #9FC3CE !important; }',
                    '.bt-control-disabled { background: white !important; }',
                    '.bt-control-disabled:before { opacity: .3; }',

                    // reset confirmation styling
                    '.bt-controls-ct { position: absolute; top: 0px; left: 0px; -webkit-font-smoothing: antialiased; transition: all 0ms; }',
                    '.bt-delete-confirm { position: absolute; left: 0px; top: 100%; width: 60px; text-align: center; color: #8E0808; background: white; line-height: 16px; transition: all 150ms !important; padding: 15px 0px; }',
                    '.bt-delete-confirm-true { font-family: "Material Icons"; background: #EC5A5A; cursor: pointer; margin-top: 5px; }',
                    '.bt-delete-confirm-true:before { content: "\\e872"; line-height: 38px; font-size: 25px; color: white; }',
                    '.bt-delete-confirm-true:hover { background: #EC6666 }',
                    '.bt-delete-confirm-true:hover:before { color: #A01818; }',
                    '.bt-delete-confirm-close { position: absolute; top: 0px; right: 0px; font-size: 12px; line-height: 12px; font-family: "Material Icons"; padding: 2px; cursor: pointer; }',
                    '.bt-delete-confirm-close:before { content: "\\e5cd"; }',
                    '.bt-delete-confirm-close:hover:before { color: #EC6666; }',
                    '.bt-show-delete-confirm .bt-controls-ct { top: -100%; }',
                    '.bt-show-delete-confirm .bt-delete-confirm { top: 0px; }',

                    // collapsed controls
                    '.bt-controls-collapsed.bt-controls-wrap { width: 30px; height: 90px; transition-delay: 150ms; border-radius: 18px; }',
                    '.bt-controls-collapsed .bt-control-close, .bt-controls-collapsed .bt-control-draw, .bt-controls-collapsed .bt-control-box { border-radius: 50% !important; }',
                    '.bt-controls-collapsed .bt-control-clear { margin-left: -100% !important; }',
                    '.bt-controls-wrap div { transition: transform 150ms, border-radius 150ms; transition-delay: 150ms; }',
                    '.bt-controls-collapsed .bt-control-clear, .bt-controls-collapsed .bt-control-back, .bt-controls-collapsed .bt-control-forward { transform: scale(0, 0); transition-delay: 0ms !important; }',
                    '.bt-controls-collapsed .bt-control-close { transform: rotate(-135deg) }',

                    // prevent selection rule
                    '.noselect, .noselect * { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'
                ];

            this.util.injectStyleRules(rules);
        },
        addFonts: function () {
            Ext.getHead().appendChild({
                tag: 'link',
                href: "https://fonts.googleapis.com/icon?family=Material+Icons", 
                rel: "stylesheet"
            });
        },
        getCache: function () {
            return this.cache = this.cache || [];
        },
        mergeIntersections: function () {
            var layer = this.getDrawLayer(),
                intersections = this.util.getIntersection(layer),
                merged;

            if (intersections.length) {
                merged = this.util.getMergedPolygon(intersections[0], intersections[1]);
                me.suspendEvents = true;
                layer.destroyFeatures(intersections);
                layer.addFeatures([merged]);
                me.suspendEvents = false;
                return true;
            } else {
                return false;
            }
        },
        onVectorsChange: function (features) {
            var me = this,
                cache = me.getCache(),
                pos = me.getCachePos(),
                timestamp = Date.now().toString(),
                vectors, features, len;

            if (!localStorage) {
                return;
            }

            if (!me.suspendEvents) {
                // merge any overlapping polygons
                while (me.mergeIntersections()) {}

                //if (Ext.query('.bt-control-draw', false)[0].hasCls('bt-control-draw-outline')) {
                    vectors = me.getDrawLayer();
                    features = vectors.features;
                    len = features.length;
                    if (features[len - 1]) {
                        features[len - 1].style = Ext.apply({}, {
                            fillOpacity: Ext.query('.bt-control-draw', false)[0].hasCls('bt-control-draw-outline') ? 0 : .3
                        }, me.getStyle());
                        vectors.redraw();
                    }
                //}
                
                if (pos !== null && pos < me.cache.length - 1) {
                    me.cache = me.cache.slice(0, pos + 1);
                    //me.cache.push(me.geoJson.write(me.getDrawLayer().features));
                } else {
                    //me.cache.push(me.geoJson.write(me.getDrawLayer().features));
                }
                var featsObj = Ext.decode(me.geoJson.write(me.getDrawLayer().features));
                Ext.each(me.getDrawLayer().features, function (feature, i) {
                    if (feature.style) {
                        featsObj.features[i].style = Ext.apply({}, feature.style);
                    }
                });
                me.cache.push(Ext.encode(featsObj));

                /*localStorage.setItem('bh_history', JSON.stringify(me.cache));
                localStorage.setItem('bh_history_timestamp', timestamp);
                localStorage.setItem('bh_history_pos', me.cache.length - 1);
                me.setCachePos(me.cache.length - 1);
                me.lastSaved = timestamp;*/
                //me.setCachePos(me.cache.length - 1);
                //me.saveState();
                //me.toggleDraw(false);

                /*if (Ext.query('.bt-control-draw', false)[0].hasCls('bt-control-draw-outline')) {
                    vectors = me.getDrawLayer();
                    features = vectors.features;
                    len = features.length;
                    if (features[len - 1]) {
                        features[len - 1].style = Ext.apply({}, {
                            fillOpacity: 0
                        }, me.getStyle());
                        vectors.redraw();
                    }
                }*/

                //console.log(Ext.decode(me.geoJson.write(me.getDrawLayer().features)));
                me.setCachePos(me.cache.length - 1);
                //me.saveState();
                me.toggleDraw(false);
            }
        },
        onVisibilityChange: function (ctx) {
            this.setActive(ctx.object.visibility);
        },
        setActive: function (visible) {
            this.getDrawControl()[!visible ? 'deactivate' : (Ext.query('.bt-control-draw', false).hasCls('bt-control-selected') ? 'activate' : 'deactivate')]();
            Ext.query('.bt-controls-wrap', false)[0][visible ? 'fadeIn' : 'fadeOut'](150);
        },
        loadHistory: function () {
            /*if (!localStorage) {
                return;
            }

            var me = this,
                history = localStorage.getItem('bh_history'),
                collapsed = localStorage.getItem('bh_collapsed'),
                drawOutline = localStorage.getItem('bh_draw_outline'),
                boxOutline = localStorage.getItem('bh_box_outline');

            if (history) {
                me.suspendEvents = true;
                me.cache = JSON.parse(history);
                me.loadFromCache(parseInt(localStorage.getItem('bh_history_pos')));
                me.lastSaved = localStorage.getItem('bh_history_timestamp');
                me.suspendEvents = false;
            }
            me.suspendEvents = true;
            me.toggleCollapsed(collapsed === 'true' ? true : false);
            me.toggleDrawOutline(drawOutline === 'true' ? true : false);
            me.toggleBoxOutline(boxOutline === 'true' ? true : false);
            me.lastSaved = localStorage.getItem('bh_history_timestamp');
            me.suspendEvents = false;*/
            var me = this,
                state = this.fetchState();
            
            if (state) {
                me.suspendEvents = true;
                if (state.history && state.history.length) {
                    me.cache = state.history || [];
                    me.loadFromCache(state.historyPos);
                }
                me.lastSaved = state.lastSaved;
                me.suspendEvents = false;
                me.suspendEvents = true;
                if (!Ext.isEmpty(state.collapsed)) {
                    me.toggleCollapsed(state.collapsed);
                }
                if (!Ext.isEmpty(state.drawOutline)) {
                    me.toggleDrawOutline(state.drawOutline);
                }
                if (!Ext.isEmpty(state.boxOutline)) {
                    me.toggleBoxOutline(state.boxOutline);
                }
                me.suspendEvents = false;
            }
            
        },
        pollHistory: function () {
            var me = this;

            setInterval(function () {
                //var remoteStamp = localStorage.getItem('bh_history_timestamp');
                //var remoteStamp = me.fetchState().lastSaved;
                var stored = Ext.state.Manager.getProvider().decodeValue(localStorage.getItem('ext-wme-bh')),
                    remoteStamp = stored.lastSaved;
                
                if (remoteStamp && remoteStamp !== me.lastSaved) {
                    console.log(remoteStamp, me.lastSaved);
                    me.saveState(stored);
                    me.loadHistory();
                }
            }, 3000);
        },
        getCachePos: function () {
            return (this.pos === null) ? this.getCache().length - 1 : this.pos;
        },
        setCachePos: function (newPos) {
            var cache = this.getCache(),
                back = Ext.query('.bt-control-back', false)[0],
                forward = Ext.query('.bt-control-forward', false)[0],
                clear = Ext.query('.bt-control-clear', false)[0],
                disabledCls = 'bt-control-disabled';

            this.pos = newPos;
            back[newPos === 0 ? 'addCls' : 'removeCls'](disabledCls);
            forward[newPos < cache.length - 1 ? 'removeCls' : 'addCls'](disabledCls);
            clear[cache.length ? 'removeCls' : 'addCls'](disabledCls);

            if (!this.suspendEvents) {
                this.saveState();
            }
            //localStorage.setItem('bh_history_pos', newPos);
        },
        back: function () {
            var me = this,
                pos = me.getCachePos(),
                newPos = (pos - 1 < 0) ? 0 : pos - 1;

            me.setCachePos(newPos);
            me.loadFromCache(newPos);
            return me;
        },
        forward: function () {
            var me = this,
                cache = me.getCache(),
                pos = me.getCachePos(),
                newPos = (pos + 1 > (cache.length - 1)) ? cache.length - 1 : pos + 1;

            me.setCachePos(newPos);
            me.loadFromCache(newPos);
            return me;
        },
        loadFromCache: function (pos) {
            var me = this,
                cache = me.getCache(),
                newPos = Ext.isEmpty(pos) ? cache.length - 1 : pos,
                features = me.geoJson.read(cache[newPos]),
                drawLayer = me.getDrawLayer();

            // apply the style to the feature if any style was recorded
            Ext.each(Ext.decode(cache[newPos]).features, function (ref, i) {
                if (!Ext.isEmpty(ref.style)) {
                    features[i].style = ref.style;
                }
            });
            
            me.suspendEvents = true;
            drawLayer.destroyFeatures();
            drawLayer.addFeatures(features);
            me.setCachePos(newPos);
            me.suspendEvents = false;
        },
        
        
        
        //state: new Ext.util.LocalStorage({
            //id: 'ext-wme-bh'
        //}),
        isCollapsed: function () {
            return Ext.query('.bt-controls-wrap', false)[0].hasCls('bt-controls-collapsed');
        },
        isDrawOutline: function () {
            return Ext.query('.bt-control-draw', false)[0].hasCls('bt-control-draw-outline');
        },
        isBoxOutline: function () {
            return Ext.query('.bt-control-box', false)[0].hasCls('bt-control-box-outline');
        },
        
        stateId: 'wme-bh',
        
        // a state param may be passed in to save to localstorage since Ext's localstorage
        // provider tries to cache anything not set through it directly
        // passing in a prepared state pulled directly from localStorage forces the
        // localstorage provider to "sync" with the changes saved up from another tab
        saveState: function (state) {
            //this.state.setItem('wme-bh', this.prepareState());
            var state = state || this.prepareState();
            
            me.lastSaved = state.lastSaved;
            Ext.state.Manager.set(this.stateId, state);
        },
        prepareState: function () {
            var me = this,
                state = {
                    history: me.getCache(),
                    historyPos: me.getCachePos(),
                    collapsed: me.isCollapsed(),
                    drawOutline: me.isDrawOutline(),
                    boxOutline: me.isBoxOutline(),
                    lastSaved: Date.now().toString()
                };
            
            return state;
        },
        fetchState: function () {
            return Ext.state.Manager.get(this.stateId);
        }
    });

    Ext.application({
        name: 'BeenHere',

        launch: function () {
            var util = W.ux.Util;
            
            if (util.getMap()) {
                W.ux.BeenHere.init();
            } else {
                var task = setInterval(function () {
                    if (util.getMap()) {
                        W.ux.BeenHere.init();
                        clearInterval(task);
                    }
                }, 100);
            }
        }
    });
});