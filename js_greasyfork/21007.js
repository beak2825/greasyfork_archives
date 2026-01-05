// ==UserScript==
// @name        WME OpenLayers Library Upgrade
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Adds all features missing in the light version of OpenLayers 2.12
// @include     /^https:\/\/(www|editor-beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21007/WME%20OpenLayers%20Library%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/21007/WME%20OpenLayers%20Library%20Upgrade.meta.js
// ==/UserScript==
(function() {
  function upgradeOL() {
    OpenLayers.Format.CSWGetRecords = function (a) {
      var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Format.CSWGetRecords.DEFAULTS),
          b = OpenLayers.Format.CSWGetRecords['v' + a.version.replace(/\./g, '_')];
      if (!b) throw 'Unsupported CSWGetRecords version: ' + a.version;
      return new b(a)
    };
    OpenLayers.Format.CSWGetRecords.DEFAULTS = {
      version: '2.0.2'
    };
    OpenLayers.Events.buttonclick = OpenLayers.Class({
      target: null,
      events: 'mousedown mouseup click dblclick touchstart touchmove touchend keydown'.split(' '),
      startRegEx: /^mousedown|touchstart$/,
      cancelRegEx: /^touchmove$/,
      completeRegEx: /^mouseup|touchend$/,
      initialize: function (a) {
        this.target = a;
        for (a = this.events.length - 1; 0 <= a; --a) this.target.register(this.events[a], this, this.buttonClick, {
          extension: !0
        })
          },
      destroy: function () {
        for (var a = this.events.length - 1; 0 <= a; --a) this.target.unregister(this.events[a], this, this.buttonClick);
        delete this.target
      },
      getPressedButton: function (a) {
        var b = 3,
            c;
        do {
          if (OpenLayers.Element.hasClass(a, 'olButton')) {
            c = a;
            break
          }
          a = a.parentNode
        } while (0 < --b && a);
        return c
      },
      buttonClick: function (a) {
        var b = !0,
            c = OpenLayers.Event.element(a);
        if (c && (OpenLayers.Event.isLeftClick(a) || !~a.type.indexOf('mouse'))) if (c = this.getPressedButton(c)) {
          if ('keydown' === a.type) switch (a.keyCode) {
            case OpenLayers.Event.KEY_RETURN:
            case OpenLayers.Event.KEY_SPACE:
              this.target.triggerEvent('buttonclick', {
                buttonElement: c
              }),
                OpenLayers.Event.stop(a),
                b = !1
          } else this.startEvt && (this.completeRegEx.test(a.type) && (b = OpenLayers.Util.pagePosition(c), this.target.triggerEvent('buttonclick', {
            buttonElement: c,
            buttonXY: {
              x: this.startEvt.clientX - b[0],
              y: this.startEvt.clientY - b[1]
            }
          })), this.cancelRegEx.test(a.type) && delete this.startEvt, OpenLayers.Event.stop(a), b = !1);
          this.startRegEx.test(a.type) && (this.startEvt = a, OpenLayers.Event.stop(a), b = !1)
        } else delete this.startEvt;
        return b
      }
    });
    OpenLayers.Control.OverviewMap = OpenLayers.Class(OpenLayers.Control, {
      element: null,
      ovmap: null,
      size: {
        w: 180,
        h: 90
      },
      layers: null,
      minRectSize: 15,
      minRectDisplayClass: 'RectReplacement',
      minRatio: 8,
      maxRatio: 32,
      mapOptions: null,
      autoPan: !1,
      handlers: null,
      resolutionFactor: 1,
      maximized: !1,
      initialize: function (a) {
        this.layers = [
        ];
        this.handlers = {
        };
        OpenLayers.Control.prototype.initialize.apply(this, [
          a
        ])
      },
      destroy: function () {
        this.mapDiv && (this.handlers.click && this.handlers.click.destroy(), this.handlers.drag && this.handlers.drag.destroy(), this.ovmap && this.ovmap.viewPortDiv.removeChild(this.extentRectangle), this.extentRectangle = null, this.rectEvents && (this.rectEvents.destroy(), this.rectEvents = null), this.ovmap && (this.ovmap.destroy(), this.ovmap = null), this.element.removeChild(this.mapDiv), this.mapDiv = null, this.div.removeChild(this.element), this.element = null, this.maximizeDiv && (this.div.removeChild(this.maximizeDiv), this.maximizeDiv = null), this.minimizeDiv && (this.div.removeChild(this.minimizeDiv), this.minimizeDiv = null), this.map.events.un({
          buttonclick: this.onButtonClick,
          moveend: this.update,
          changebaselayer: this.baseLayerDraw,
          scope: this
        }), OpenLayers.Control.prototype.destroy.apply(this, arguments))
      },
      draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (0 === this.layers.length) if (this.map.baseLayer) this.layers = [
          this.map.baseLayer.clone()
        ];
          else return this.map.events.register('changebaselayer', this, this.baseLayerDraw),
            this.div;
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'none';
        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');
        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000;
        this.extentRectangle.className = this.displayClass + 'ExtentRectangle';
        this.element.appendChild(this.mapDiv);
        this.div.appendChild(this.element);
        if (this.outsideViewport) this.element.style.display = '';
        else {
          this.div.className += ' ' + this.displayClass + 'Container';
          var a = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
          this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(this.displayClass + 'MaximizeButton', null, null, a, 'absolute');
          this.maximizeDiv.style.display = 'none';
          this.maximizeDiv.className = this.displayClass + 'MaximizeButton olButton';
          this.div.appendChild(this.maximizeDiv);
          a = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
          this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv('OpenLayers_Control_minimizeDiv', null, null, a, 'absolute');
          this.minimizeDiv.style.display = 'none';
          this.minimizeDiv.className = this.displayClass + 'MinimizeButton olButton';
          this.div.appendChild(this.minimizeDiv);
          this.minimizeControl()
        }
        this.map.getExtent() && this.update();
        this.map.events.on({
          buttonclick: this.onButtonClick,
          moveend: this.update,
          scope: this
        });
        this.maximized && this.maximizeControl();
        return this.div
      },
      baseLayerDraw: function () {
        this.draw();
        this.map.events.unregister('changebaselayer', this, this.baseLayerDraw)
      },
      rectDrag: function (a) {
        var b = this.handlers.drag.last.x - a.x,
            c = this.handlers.drag.last.y - a.y;
        if (0 != b || 0 != c) {
          var d = this.rectPxBounds.top,
              e = this.rectPxBounds.left,
              a = Math.abs(this.rectPxBounds.getHeight()),
              f = this.rectPxBounds.getWidth(),
              c = Math.max(0, d - c),
              c = Math.min(c, this.ovmap.size.h - this.hComp - a),
              b = Math.max(0, e - b),
              b = Math.min(b, this.ovmap.size.w - this.wComp - f);
          this.setRectPxBounds(new OpenLayers.Bounds(b, c + a, b + f, c))
        }
      },
      mapDivClick: function (a) {
        var b = this.rectPxBounds.getCenterPixel(),
            c = a.xy.x - b.x,
            d = a.xy.y - b.y,
            e = this.rectPxBounds.top,
            f = this.rectPxBounds.left,
            a = Math.abs(this.rectPxBounds.getHeight()),
            b = this.rectPxBounds.getWidth(),
            d = Math.max(0, e + d),
            d = Math.min(d, this.ovmap.size.h - a),
            c = Math.max(0, f + c),
            c = Math.min(c, this.ovmap.size.w - b);
        this.setRectPxBounds(new OpenLayers.Bounds(c, d + a, c + b, d));
        this.updateMapToRect()
      },
      onButtonClick: function (a) {
        a.buttonElement === this.minimizeDiv ? this.minimizeControl()  : a.buttonElement === this.maximizeDiv && this.maximizeControl()
      },
      maximizeControl: function (a) {
        this.element.style.display = '';
        this.showToggle(!1);
        null != a && OpenLayers.Event.stop(a)
      },
      minimizeControl: function (a) {
        this.element.style.display = 'none';
        this.showToggle(!0);
        null != a && OpenLayers.Event.stop(a)
      },
      showToggle: function (a) {
        this.maximizeDiv.style.display = a ? '' : 'none';
        this.minimizeDiv.style.display = a ? 'none' : ''
      },
      update: function () {
        null == this.ovmap && this.createMap();
        (this.autoPan || !this.isSuitableOverview()) && this.updateOverview();
        this.updateRectToMap()
      },
      isSuitableOverview: function () {
        var a = this.map.getExtent(),
            b = this.map.maxExtent,
            a = new OpenLayers.Bounds(Math.max(a.left, b.left), Math.max(a.bottom, b.bottom), Math.min(a.right, b.right), Math.min(a.top, b.top));
        this.ovmap.getProjection() != this.map.getProjection() && (a = a.transform(this.map.getProjectionObject(), this.ovmap.getProjectionObject()));
        b = this.ovmap.getResolution() / this.map.getResolution();
        return b > this.minRatio && b <= this.maxRatio && this.ovmap.getExtent().containsBounds(a)
      },
      updateOverview: function () {
        var a = this.map.getResolution(),
            b = this.ovmap.getResolution(),
            c = b / a;
        c > this.maxRatio ?
          b = this.minRatio * a : c <= this.minRatio && (b = this.maxRatio * a);
        this.ovmap.getProjection() != this.map.getProjection() ? (a = this.map.center.clone(), a.transform(this.map.getProjectionObject(), this.ovmap.getProjectionObject()))  : a = this.map.center;
        this.ovmap.setCenter(a, this.ovmap.getZoomForResolution(b * this.resolutionFactor));
        this.updateRectToMap()
      },
      createMap: function () {
        var a = OpenLayers.Util.extend({
          controls: [
          ],
          maxResolution: 'auto',
          fallThrough: !1
        }, this.mapOptions);
        this.ovmap = new OpenLayers.Map(this.mapDiv, a);
        this.ovmap.viewPortDiv.appendChild(this.extentRectangle);
        OpenLayers.Event.stopObserving(window, 'unload', this.ovmap.unloadDestroy);
        this.ovmap.addLayers(this.layers);
        this.ovmap.zoomToMaxExtent();
        this.wComp = (this.wComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle, 'border-left-width')) + parseInt(OpenLayers.Element.getStyle(this.extentRectangle, 'border-right-width'))) ? this.wComp : 2;
        this.hComp = (this.hComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle, 'border-top-width')) + parseInt(OpenLayers.Element.getStyle(this.extentRectangle, 'border-bottom-width'))) ?
          this.hComp : 2;
        this.handlers.drag = new OpenLayers.Handler.Drag(this, {
          move: this.rectDrag,
          done: this.updateMapToRect
        }, {
          map: this.ovmap
        });
        this.handlers.click = new OpenLayers.Handler.Click(this, {
          click: this.mapDivClick
        }, {
          single: !0,
          'double': !1,
          stopSingle: !0,
          stopDouble: !0,
          pixelTolerance: 1,
          map: this.ovmap
        });
        this.handlers.click.activate();
        this.rectEvents = new OpenLayers.Events(this, this.extentRectangle, null, !0);
        this.rectEvents.register('mouseover', this, function () {
          !this.handlers.drag.active && !this.map.dragging && this.handlers.drag.activate()
        });
        this.rectEvents.register('mouseout', this, function () {
          this.handlers.drag.dragging || this.handlers.drag.deactivate()
        });
        if (this.ovmap.getProjection() != this.map.getProjection()) {
          var a = this.map.getProjectionObject().getUnits() || this.map.units || this.map.baseLayer.units,
              b = this.ovmap.getProjectionObject().getUnits() || this.ovmap.units || this.ovmap.baseLayer.units;
          this.resolutionFactor = a && b ? OpenLayers.INCHES_PER_UNIT[a] / OpenLayers.INCHES_PER_UNIT[b] : 1
        }
      },
      updateRectToMap: function () {
        var a = this.getRectBoundsFromMapBounds(this.ovmap.getProjection() !=
                                                this.map.getProjection() ? this.map.getExtent().transform(this.map.getProjectionObject(), this.ovmap.getProjectionObject())  : this.map.getExtent());
        a && this.setRectPxBounds(a)
      },
      updateMapToRect: function () {
        var a = this.getMapBoundsFromRectBounds(this.rectPxBounds);
        this.ovmap.getProjection() != this.map.getProjection() && (a = a.transform(this.ovmap.getProjectionObject(), this.map.getProjectionObject()));
        this.map.panTo(a.getCenterLonLat())
      },
      setRectPxBounds: function (a) {
        var b = Math.max(a.top, 0),
            c = Math.max(a.left, 0),
            d = Math.min(a.top + Math.abs(a.getHeight()), this.ovmap.size.h - this.hComp),
            a = Math.min(a.left + a.getWidth(), this.ovmap.size.w - this.wComp),
            e = Math.max(a - c, 0),
            f = Math.max(d - b, 0);
        e < this.minRectSize || f < this.minRectSize ? (this.extentRectangle.className = this.displayClass + this.minRectDisplayClass, e = c + e / 2 - this.minRectSize / 2, this.extentRectangle.style.top = Math.round(b + f / 2 - this.minRectSize / 2) + 'px', this.extentRectangle.style.left = Math.round(e) + 'px', this.extentRectangle.style.height = this.minRectSize + 'px', this.extentRectangle.style.width = this.minRectSize + 'px')  : (this.extentRectangle.className = this.displayClass + 'ExtentRectangle', this.extentRectangle.style.top = Math.round(b) + 'px', this.extentRectangle.style.left = Math.round(c) + 'px', this.extentRectangle.style.height = Math.round(f) + 'px', this.extentRectangle.style.width = Math.round(e) + 'px');
        this.rectPxBounds = new OpenLayers.Bounds(Math.round(c), Math.round(d), Math.round(a), Math.round(b))
      },
      getRectBoundsFromMapBounds: function (a) {
        var b = this.getOverviewPxFromLonLat({
          lon: a.left,
          lat: a.bottom
        }),
            a = this.getOverviewPxFromLonLat({
              lon: a.right,
              lat: a.top
            }),
            c = null;
        b && a && (c = new OpenLayers.Bounds(b.x, b.y, a.x, a.y));
        return c
      },
      getMapBoundsFromRectBounds: function (a) {
        var b = this.getLonLatFromOverviewPx({
          x: a.left,
          y: a.bottom
        }),
            a = this.getLonLatFromOverviewPx({
              x: a.right,
              y: a.top
            });
        return new OpenLayers.Bounds(b.lon, b.lat, a.lon, a.lat)
      },
      getLonLatFromOverviewPx: function (a) {
        var b = this.ovmap.size,
            c = this.ovmap.getResolution(),
            d = this.ovmap.getExtent().getCenterLonLat();
        return {
          lon: d.lon + (a.x - b.w / 2) * c,
          lat: d.lat - (a.y - b.h / 2) * c
        }
      },
      getOverviewPxFromLonLat: function (a) {
        var b = this.ovmap.getResolution(),
            c = this.ovmap.getExtent();
        if (c) return {
          x: Math.round(1 / b * (a.lon - c.left)),
          y: Math.round(1 / b * (c.top - a.lat))
        }
          },
      CLASS_NAME: 'OpenLayers.Control.OverviewMap'
    });
    OpenLayers.Layer.Google = OpenLayers.Class(OpenLayers.Layer.EventPane, OpenLayers.Layer.FixedZoomLevels, {
      MIN_ZOOM_LEVEL: 0,
      MAX_ZOOM_LEVEL: 21,
      RESOLUTIONS: [
        1.40625,
        0.703125,
        0.3515625,
        0.17578125,
        0.087890625,
        0.0439453125,
        0.02197265625,
        0.010986328125,
        0.0054931640625,
        0.00274658203125,
        0.001373291015625,
        0.0006866455078125,
        0.00034332275390625,
        0.000171661376953125,
        0.0000858306884765625,
        0.00004291534423828125,
        0.00002145767211914062,
        0.00001072883605957031,
        0.00000536441802978515,
        0.00000268220901489257,
        0.000001341104507446289,
        6.705522537231445e-7
      ],
      type: null,
      wrapDateLine: !0,
      sphericalMercator: !1,
      version: null,
      initialize: function (a, b) {
        b = b || {
        };
        b.version || (b.version = 'function' === typeof GMap2 ? '2' : '3');
        var c = OpenLayers.Layer.Google['v' + b.version.replace(/\./g, '_')];
        if (c) OpenLayers.Util.applyDefaults(b, c);
        else throw 'Unsupported Google Maps API version: ' + b.version;
        OpenLayers.Util.applyDefaults(b, c.DEFAULTS);
        b.maxExtent && (b.maxExtent = b.maxExtent.clone());
        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, [
          a,
          b
        ]);
        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, [
          a,
          b
        ]);
        this.sphericalMercator && (OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator), this.initMercatorParameters())
      },
      clone: function () {
        return new OpenLayers.Layer.Google(this.name, this.getOptions())
      },
      setVisibility: function (a) {
        var b = null == this.opacity ? 1 : this.opacity;
        OpenLayers.Layer.EventPane.prototype.setVisibility.apply(this, arguments);
        this.setOpacity(b)
      },
      display: function (a) {
        this._dragging || this.setGMapVisibility(a);
        OpenLayers.Layer.EventPane.prototype.display.apply(this, arguments)
      },
      moveTo: function (a, b, c) {
        this._dragging = c;
        OpenLayers.Layer.EventPane.prototype.moveTo.apply(this, arguments);
        delete this._dragging
      },
      setOpacity: function (a) {
        a !== this.opacity && (null != this.map && this.map.events.triggerEvent('changelayer', {
          layer: this,
          property: 'opacity'
        }), this.opacity = a);
        if (this.getVisibility()) {
          var b = this.getMapContainer();
          OpenLayers.Util.modifyDOMElement(b, null, null, null, null, null, null, a)
        }
      },
      destroy: function () {
        if (this.map) {
          this.setGMapVisibility(!1);
          var a = OpenLayers.Layer.Google.cache[this.map.id];
          a && 1 >= a.count && this.removeGMapElements()
        }
        OpenLayers.Layer.EventPane.prototype.destroy.apply(this, arguments)
      },
      removeGMapElements: function () {
        var a = OpenLayers.Layer.Google.cache[this.map.id];
        if (a) {
          var b = this.mapObject && this.getMapContainer();
          b && b.parentNode && b.parentNode.removeChild(b);
          (b = a.termsOfUse) && b.parentNode && b.parentNode.removeChild(b);
          (a = a.poweredBy) && a.parentNode && a.parentNode.removeChild(a)
        }
      },
      removeMap: function (a) {
        this.visibility && this.mapObject && this.setGMapVisibility(!1);
        var b = OpenLayers.Layer.Google.cache[a.id];
        b && (1 >= b.count ? (this.removeGMapElements(), delete OpenLayers.Layer.Google.cache[a.id])  : --b.count);
        delete this.termsOfUse;
        delete this.poweredBy;
        delete this.mapObject;
        delete this.dragObject;
        OpenLayers.Layer.EventPane.prototype.removeMap.apply(this, arguments)
      },
      getOLBoundsFromMapObjectBounds: function (a) {
        var b = null;
        null != a && (b = a.getSouthWest(), a = a.getNorthEast(), this.sphericalMercator ? (b = this.forwardMercator(b.lng(), b.lat()), a = this.forwardMercator(a.lng(), a.lat()))  : (b = new OpenLayers.LonLat(b.lng(), b.lat()), a = new OpenLayers.LonLat(a.lng(), a.lat())), b = new OpenLayers.Bounds(b.lon, b.lat, a.lon, a.lat));
        return b
      },
      getWarningHTML: function () {
        return OpenLayers.i18n('googleWarning')
      },
      getMapObjectCenter: function () {
        return this.mapObject.getCenter()
      },
      getMapObjectZoom: function () {
        return this.mapObject.getZoom()
      },
      getLongitudeFromMapObjectLonLat: function (a) {
        return this.sphericalMercator ? this.forwardMercator(a.lng(), a.lat()).lon : a.lng()
      },
      getLatitudeFromMapObjectLonLat: function (a) {
        return this.sphericalMercator ? this.forwardMercator(a.lng(), a.lat()).lat : a.lat()
      },
      getXFromMapObjectPixel: function (a) {
        return a.x
      },
      getYFromMapObjectPixel: function (a) {
        return a.y
      },
      CLASS_NAME: 'OpenLayers.Layer.Google'
    });
    OpenLayers.Layer.Google.cache = {
    };
    OpenLayers.Layer.Google.v2 = {
      termsOfUse: null,
      poweredBy: null,
      dragObject: null,
      loadMapObject: function () {
        this.type || (this.type = G_NORMAL_MAP);
        var a,
            b,
            c,
            d = OpenLayers.Layer.Google.cache[this.map.id];
        if (d) a = d.mapObject,
          b = d.termsOfUse,
          c = d.poweredBy,
          ++d.count;
        else {
          var d = this.map.viewPortDiv,
              e = document.createElement('div');
          e.id = this.map.id + '_GMap2Container';
          e.style.position = 'absolute';
          e.style.width = '100%';
          e.style.height = '100%';
          d.appendChild(e);
          try {
            a = new GMap2(e),
              b = e.lastChild,
              d.appendChild(b),
              b.style.zIndex = '1100',
              b.style.right = '',
              b.style.bottom = '',
              b.className = 'olLayerGoogleCopyright',
              c = e.lastChild,
              d.appendChild(c),
              c.style.zIndex = '1100',
              c.style.right = '',
              c.style.bottom = '',
              c.className = 'olLayerGooglePoweredBy gmnoprint'
          } catch (f) {
            throw f;
          }
          OpenLayers.Layer.Google.cache[this.map.id] = {
            mapObject: a,
            termsOfUse: b,
            poweredBy: c,
            count: 1
          }
        }
        this.mapObject = a;
        this.termsOfUse = b;
        this.poweredBy = c;
        - 1 === OpenLayers.Util.indexOf(this.mapObject.getMapTypes(), this.type) && this.mapObject.addMapType(this.type);
        'function' == typeof a.getDragObject ?
          this.dragObject = a.getDragObject()  : this.dragPanMapObject = null;
        !1 === this.isBaseLayer && this.setGMapVisibility('none' !== this.div.style.display)
      },
      onMapResize: function () {
        if (this.visibility && this.mapObject.isLoaded()) this.mapObject.checkResize();
        else {
          if (!this._resized) var a = this,
              b = GEvent.addListener(this.mapObject, 'load', function () {
                GEvent.removeListener(b);
                delete a._resized;
                a.mapObject.checkResize();
                a.moveTo(a.map.getCenter(), a.map.getZoom())
              });
          this._resized = !0
        }
      },
      setGMapVisibility: function (a) {
        var b = OpenLayers.Layer.Google.cache[this.map.id];
        if (b) {
          var c = this.mapObject.getContainer();
          !0 === a ? (this.mapObject.setMapType(this.type), c.style.display = '', this.termsOfUse.style.left = '', this.termsOfUse.style.display = '', this.poweredBy.style.display = '', b.displayed = this.id)  : (b.displayed === this.id && delete b.displayed, b.displayed || (c.style.display = 'none', this.termsOfUse.style.display = 'none', this.termsOfUse.style.left = '-9999px', this.poweredBy.style.display = 'none'))
        }
      },
      getMapContainer: function () {
        return this.mapObject.getContainer()
      },
      getMapObjectBoundsFromOLBounds: function (a) {
        var b = null;
        null != a && (b = this.sphericalMercator ? this.inverseMercator(a.bottom, a.left)  : new OpenLayers.LonLat(a.bottom, a.left), a = this.sphericalMercator ? this.inverseMercator(a.top, a.right)  : new OpenLayers.LonLat(a.top, a.right), b = new GLatLngBounds(new GLatLng(b.lat, b.lon), new GLatLng(a.lat, a.lon)));
        return b
      },
      setMapObjectCenter: function (a, b) {
        this.mapObject.setCenter(a, b)
      },
      dragPanMapObject: function (a, b) {
        this.dragObject.moveBy(new GSize( - a, b))
      },
      getMapObjectLonLatFromMapObjectPixel: function (a) {
        return this.mapObject.fromContainerPixelToLatLng(a)
      },
      getMapObjectPixelFromMapObjectLonLat: function (a) {
        return this.mapObject.fromLatLngToContainerPixel(a)
      },
      getMapObjectZoomFromMapObjectBounds: function (a) {
        return this.mapObject.getBoundsZoomLevel(a)
      },
      getMapObjectLonLatFromLonLat: function (a, b) {
        var c;
        this.sphericalMercator ? (c = this.inverseMercator(a, b), c = new GLatLng(c.lat, c.lon))  : c = new GLatLng(b, a);
        return c
      },
      getMapObjectPixelFromXY: function (a, b) {
        return new GPoint(a, b)
      }
    };
    OpenLayers.Format.WFST = function (a) {
      var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Format.WFST.DEFAULTS),
          b = OpenLayers.Format.WFST['v' + a.version.replace(/\./g, '_')];
      if (!b) throw 'Unsupported WFST version: ' + a.version;
      return new b(a)
    };
    OpenLayers.Format.WFST.DEFAULTS = {
      version: '1.0.0'
    };
    OpenLayers.Format.WFST.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
      namespaces: {
        xlink: 'http://www.w3.org/1999/xlink',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance',
        wfs: 'http://www.opengis.net/wfs',
        gml: 'http://www.opengis.net/gml',
        ogc: 'http://www.opengis.net/ogc',
        ows: 'http://www.opengis.net/ows'
      },
      defaultPrefix: 'wfs',
      version: null,
      schemaLocations: null,
      srsName: null,
      extractAttributes: !0,
      xy: !0,
      stateName: null,
      initialize: function (a) {
        this.stateName = {
        };
        this.stateName[OpenLayers.State.INSERT] = 'wfs:Insert';
        this.stateName[OpenLayers.State.UPDATE] = 'wfs:Update';
        this.stateName[OpenLayers.State.DELETE] = 'wfs:Delete';
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ])
      },
      getSrsName: function (a, b) {
        var c = b && b.srsName;
        c || (c = a && a.layer ? a.layer.projection.getCode()  : this.srsName);
        return c
      },
      read: function (a, b) {
        b = b || {
        };
        OpenLayers.Util.applyDefaults(b, {
          output: 'features'
        });
        'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        a && 9 == a.nodeType && (a = a.documentElement);
        var c = {
        };
        a && this.readNode(a, c, !0);
        c.features && 'features' === b.output && (c = c.features);
        return c
      },
      readers: {
        wfs: {
          FeatureCollection: function (a, b) {
            b.features = [
            ];
            this.readChildNodes(a, b)
          }
        }
      },
      write: function (a, b) {
        var c = this.writeNode('wfs:Transaction', {
          features: a,
          options: b
        }),
            d = this.schemaLocationAttr();
        d && this.setAttributeNS(c, this.namespaces.xsi, 'xsi:schemaLocation', d);
        return OpenLayers.Format.XML.prototype.write.apply(this, [
          c
        ])
      },
      writers: {
        wfs: {
          GetFeature: function (a) {
            var b = this.createElementNSPlus('wfs:GetFeature', {
              attributes: {
                service: 'WFS',
                version: this.version,
                handle: a && a.handle,
                outputFormat: a && a.outputFormat,
                maxFeatures: a && a.maxFeatures,
                'xsi:schemaLocation': this.schemaLocationAttr(a)
              }
            });
            if ('string' == typeof this.featureType) this.writeNode('Query', a, b);
            else for (var c = 0, d = this.featureType.length; c < d; c++) a.featureType = this.featureType[c],
              this.writeNode('Query', a, b);
            return b
          },
          Transaction: function (a) {
            var a = a || {
            },
                b = a.options || {
                },
                c = this.createElementNSPlus('wfs:Transaction', {
                  attributes: {
                    service: 'WFS',
                    version: this.version,
                    handle: b.handle
                  }
                }),
                d,
                e = a.features;
            if (e) {
              !0 === b.multi && OpenLayers.Util.extend(this.geometryTypes, {
                'OpenLayers.Geometry.Point': 'MultiPoint',
                'OpenLayers.Geometry.LineString': !0 === this.multiCurve ? 'MultiCurve' : 'MultiLineString',
                'OpenLayers.Geometry.Polygon': !0 === this.multiSurface ? 'MultiSurface' : 'MultiPolygon'
              });
              var f,
                  g,
                  a = 0;
              for (d = e.length; a < d; ++a) g = e[a],
                (f = this.stateName[g.state]) && this.writeNode(f, {
                feature: g,
                options: b
              }, c);
              !0 === b.multi && this.setGeometryTypes()
            }
            if (b.nativeElements) {
              a = 0;
              for (d = b.nativeElements.length; a < d; ++a) this.writeNode('wfs:Native', b.nativeElements[a], c)
                }
            return c
          },
          Native: function (a) {
            return this.createElementNSPlus('wfs:Native', {
              attributes: {
                vendorId: a.vendorId,
                safeToIgnore: a.safeToIgnore
              },
              value: a.value
            })
          },
          Insert: function (a) {
            var b = a.feature,
                a = a.options,
                a = this.createElementNSPlus('wfs:Insert', {
                  attributes: {
                    handle: a && a.handle
                  }
                });
            this.srsName = this.getSrsName(b);
            this.writeNode('feature:_typeName', b, a);
            return a
          },
          Update: function (a) {
            var b = a.feature,
                a = a.options,
                a = this.createElementNSPlus('wfs:Update', {
                  attributes: {
                    handle: a && a.handle,
                    typeName: (this.featureNS ? this.featurePrefix + ':' : '') + this.featureType
                  }
                });
            this.featureNS && a.setAttribute('xmlns:' +
                                             this.featurePrefix, this.featureNS);
            var c = b.modified;
            if (null !== this.geometryName && (!c || void 0 !== c.geometry)) this.srsName = this.getSrsName(b),
              this.writeNode('Property', {
              name: this.geometryName,
              value: b.geometry
            }, a);
            for (var d in b.attributes) void 0 !== b.attributes[d] && (!c || !c.attributes || c.attributes && void 0 !== c.attributes[d]) && this.writeNode('Property', {
              name: d,
              value: b.attributes[d]
            }, a);
            this.writeNode('ogc:Filter', new OpenLayers.Filter.FeatureId({
              fids: [
                b.fid
              ]
            }), a);
            return a
          },
          Property: function (a) {
            var b = this.createElementNSPlus('wfs:Property');
            this.writeNode('Name', a.name, b);
            null !== a.value && this.writeNode('Value', a.value, b);
            return b
          },
          Name: function (a) {
            return this.createElementNSPlus('wfs:Name', {
              value: a
            })
          },
          Value: function (a) {
            var b;
            a instanceof OpenLayers.Geometry ? (b = this.createElementNSPlus('wfs:Value'), a = this.writeNode('feature:_geometry', a).firstChild, b.appendChild(a))  : b = this.createElementNSPlus('wfs:Value', {
              value: a
            });
            return b
          },
          Delete: function (a) {
            var b = a.feature,
                a = a.options,
                a = this.createElementNSPlus('wfs:Delete', {
                  attributes: {
                    handle: a && a.handle,
                    typeName: (this.featureNS ? this.featurePrefix + ':' : '') + this.featureType
                  }
                });
            this.featureNS && a.setAttribute('xmlns:' + this.featurePrefix, this.featureNS);
            this.writeNode('ogc:Filter', new OpenLayers.Filter.FeatureId({
              fids: [
                b.fid
              ]
            }), a);
            return a
          }
        }
      },
      schemaLocationAttr: function (a) {
        var a = OpenLayers.Util.extend({
          featurePrefix: this.featurePrefix,
          schema: this.schema
        }, a),
            b = OpenLayers.Util.extend({
            }, this.schemaLocations);
        a.schema && (b[a.featurePrefix] = a.schema);
        var a = [
        ],
            c,
            d;
        for (d in b) (c = this.namespaces[d]) && a.push(c + ' ' + b[d]);
        return a.join(' ') || void 0
      },
      setFilterProperty: function (a) {
        if (a.filters) for (var b = 0, c = a.filters.length; b < c; ++b) OpenLayers.Format.WFST.v1.prototype.setFilterProperty.call(this, a.filters[b]);
        else a instanceof OpenLayers.Filter.Spatial && !a.property && (a.property = this.geometryName)
          },
      CLASS_NAME: 'OpenLayers.Format.WFST.v1'
    });
    OpenLayers.Format.OGCExceptionReport = OpenLayers.Class(OpenLayers.Format.XML, {
      namespaces: {
        ogc: 'http://www.opengis.net/ogc'
      },
      regExes: {
        trimSpace: /^\s*|\s*$/g,
        removeSpace: /\s*/g,
        splitSpace: /\s+/,
        trimComma: /\s*,\s*/g
      },
      defaultPrefix: 'ogc',
      read: function (a) {
        'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        var b = {
          exceptionReport: null
        };
        a.documentElement && (this.readChildNodes(a, b), null === b.exceptionReport && (b = (new OpenLayers.Format.OWSCommon).read(a)));
        return b
      },
      readers: {
        ogc: {
          ServiceExceptionReport: function (a, b) {
            b.exceptionReport = {
              exceptions: [
              ]
            };
            this.readChildNodes(a, b.exceptionReport)
          },
          ServiceException: function (a, b) {
            var c = {
              code: a.getAttribute('code'),
              locator: a.getAttribute('locator'),
              text: this.getChildValue(a)
            };
            b.exceptions.push(c)
          }
        }
      },
      CLASS_NAME: 'OpenLayers.Format.OGCExceptionReport'
    });
    OpenLayers.Format.XML.VersionedOGC = OpenLayers.Class(OpenLayers.Format.XML, {
      defaultVersion: null,
      version: null,
      profile: null,
      errorProperty: null,
      name: null,
      stringifyOutput: !1,
      parser: null,
      initialize: function (a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ]);
        a = this.CLASS_NAME;
        this.name = a.substring(a.lastIndexOf('.') + 1)
      },
      getVersion: function (a, b) {
        var c;
        a ? (c = this.version, c || (c = a.getAttribute('version'), c || (c = this.defaultVersion)))  : c = b && b.version || this.version || this.defaultVersion;
        return c
      },
      getParser: function (a) {
        var a = a || this.defaultVersion,
            b = this.profile ? '_' + this.profile : '';
        if (!this.parser || this.parser.VERSION != a) {
          var c = OpenLayers.Format[this.name]['v' + a.replace(/\./g, '_') + b];
          if (!c) throw 'Can\'t find a ' + this.name + ' parser for version ' + a + b;
          this.parser = new c(this.options)
        }
        return this.parser
      },
      write: function (a, b) {
        this.parser = this.getParser(this.getVersion(null, b));
        var c = this.parser.write(a, b);
        return !1 === this.stringifyOutput ? c : OpenLayers.Format.XML.prototype.write.apply(this, [
          c
        ])
      },
      read: function (a, b) {
        'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        var c = this.getVersion(a.documentElement);
        this.parser = this.getParser(c);
        var d = this.parser.read(a, b);
        if (null !== this.errorProperty && void 0 === d[this.errorProperty]) {
          var e = new OpenLayers.Format.OGCExceptionReport;
          d.error = e.read(a)
        }
        d.version = c;
        return d
      },
      CLASS_NAME: 'OpenLayers.Format.XML.VersionedOGC'
    });
    OpenLayers.Filter.FeatureId = OpenLayers.Class(OpenLayers.Filter, {
      fids: null,
      type: 'FID',
      initialize: function (a) {
        this.fids = [
        ];
        OpenLayers.Filter.prototype.initialize.apply(this, [
          a
        ])
      },
      evaluate: function (a) {
        for (var b = 0, c = this.fids.length; b < c; b++) if ((a.fid || a.id) == this.fids[b]) return !0;
        return !1
      },
      clone: function () {
        var a = new OpenLayers.Filter.FeatureId;
        OpenLayers.Util.extend(a, this);
        a.fids = this.fids.slice();
        return a
      },
      CLASS_NAME: 'OpenLayers.Filter.FeatureId'
    });
    OpenLayers.Format.Filter = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
      defaultVersion: '1.0.0',
      CLASS_NAME: 'OpenLayers.Format.Filter'
    });
    OpenLayers.Filter.Function = OpenLayers.Class(OpenLayers.Filter, {
      name: null,
      params: null,
      CLASS_NAME: 'OpenLayers.Filter.Function'
    });
    OpenLayers.Format.Filter.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
      namespaces: {
        ogc: 'http://www.opengis.net/ogc',
        gml: 'http://www.opengis.net/gml',
        xlink: 'http://www.w3.org/1999/xlink',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance'
      },
      defaultPrefix: 'ogc',
      schemaLocation: null,
      initialize: function (a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ])
      },
      read: function (a) {
        var b = {
        };
        this.readers.ogc.Filter.apply(this, [
          a,
          b
        ]);
        return b.filter
      },
      readers: {
        ogc: {
          _expression: function (a) {
            for (var b = '', c = a.firstChild; c; c = c.nextSibling) switch (c.nodeType) {
              case 1:
                a = this.readNode(c);
                a.property ? b += '${' + a.property + '}' : void 0 !== a.value && (b += a.value);
                break;
              case 3:
              case 4:
                b += c.nodeValue
            }
            return b
          },
          Filter: function (a, b) {
            var c = {
              fids: [
              ],
              filters: [
              ]
            };
            this.readChildNodes(a, c);
            0 < c.fids.length ? b.filter = new OpenLayers.Filter.FeatureId({
              fids: c.fids
            })  : 0 < c.filters.length && (b.filter = c.filters[0])
          },
          FeatureId: function (a, b) {
            var c = a.getAttribute('fid');
            c && b.fids.push(c)
          },
          And: function (a, b) {
            var c = new OpenLayers.Filter.Logical({
              type: OpenLayers.Filter.Logical.AND
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          Or: function (a, b) {
            var c = new OpenLayers.Filter.Logical({
              type: OpenLayers.Filter.Logical.OR
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          Not: function (a, b) {
            var c = new OpenLayers.Filter.Logical({
              type: OpenLayers.Filter.Logical.NOT
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsLessThan: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.LESS_THAN
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsGreaterThan: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.GREATER_THAN
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsLessThanOrEqualTo: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsGreaterThanOrEqualTo: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsBetween: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.BETWEEN
            });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          Literal: function (a, b) {
            b.value = OpenLayers.String.numericIf(this.getChildValue(a))
          },
          PropertyName: function (a, b) {
            b.property = this.getChildValue(a)
          },
          LowerBoundary: function (a, b) {
            b.lowerBoundary = OpenLayers.String.numericIf(this.readers.ogc._expression.call(this, a))
          },
          UpperBoundary: function (a, b) {
            b.upperBoundary = OpenLayers.String.numericIf(this.readers.ogc._expression.call(this, a))
          },
          Intersects: function (a, b) {
            this.readSpatial(a, b, OpenLayers.Filter.Spatial.INTERSECTS)
          },
          Within: function (a, b) {
            this.readSpatial(a, b, OpenLayers.Filter.Spatial.WITHIN)
          },
          Contains: function (a, b) {
            this.readSpatial(a, b, OpenLayers.Filter.Spatial.CONTAINS)
          },
          DWithin: function (a, b) {
            this.readSpatial(a, b, OpenLayers.Filter.Spatial.DWITHIN)
          },
          Distance: function (a, b) {
            b.distance = parseInt(this.getChildValue(a));
            b.distanceUnits = a.getAttribute('units')
          },
          Function: function () {
          }
        }
      },
      readSpatial: function (a, b, c) {
        c = new OpenLayers.Filter.Spatial({
          type: c
        });
        this.readChildNodes(a, c);
        c.value = c.components[0];
        delete c.components;
        b.filters.push(c)
      },
      writeOgcExpression: function (a, b) {
        if (a instanceof OpenLayers.Filter.Function) {
          var c = this.writeNode('Function', a, b);
          b.appendChild(c)
        } else this.writeNode('Literal', a, b);
        return b
      },
      write: function (a) {
        return this.writers.ogc.Filter.apply(this, [
          a
        ])
      },
      writeFeatureIdNodes: function (a, b) {
        for (var c = 0, d = a.fids.length; c < d; ++c) this.writeNode('FeatureId', a.fids[c], b)
          },
      writers: {
        ogc: {
          Filter: function (a) {
            var b = this.createElementNSPlus('ogc:Filter');
            'FID' === a.type ? OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, a, b)  : this.writeNode(this.getFilterType(a), a, b);
            return b
          },
          FeatureId: function (a) {
            return this.createElementNSPlus('ogc:FeatureId', {
              attributes: {
                fid: a
              }
            })
          },
          And: function (a) {
            for (var b = this.createElementNSPlus('ogc:And'), c, d = 0, e = a.filters.length; d < e; ++d) c = a.filters[d],
              'FID' === c.type ? OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, c, b)  : this.writeNode(this.getFilterType(c), c, b);
            return b
          },
          Or: function (a) {
            for (var b = this.createElementNSPlus('ogc:Or'), c, d = 0, e = a.filters.length; d < e; ++d) c = a.filters[d],
              'FID' === c.type ? OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, c, b)  : this.writeNode(this.getFilterType(c), c, b);
            return b
          },
          Not: function (a) {
            var b = this.createElementNSPlus('ogc:Not'),
                a = a.filters[0];
            'FID' === a.type ? OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, a, b)  : this.writeNode(this.getFilterType(a), a, b);
            return b
          },
          PropertyIsLessThan: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsLessThan');
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsGreaterThan: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsGreaterThan');
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsLessThanOrEqualTo: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsLessThanOrEqualTo');
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsGreaterThanOrEqualTo: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsGreaterThanOrEqualTo');
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsBetween: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsBetween');
            this.writeNode('PropertyName', a, b);
            this.writeNode('LowerBoundary', a, b);
            this.writeNode('UpperBoundary', a, b);
            return b
          },
          PropertyName: function (a) {
            return this.createElementNSPlus('ogc:PropertyName', {
              value: a.property
            })
          },
          Literal: function (a) {
            return this.createElementNSPlus('ogc:Literal', {
              value: a
            })
          },
          LowerBoundary: function (a) {
            var b = this.createElementNSPlus('ogc:LowerBoundary');
            this.writeOgcExpression(a.lowerBoundary, b);
            return b
          },
          UpperBoundary: function (a) {
            var b = this.createElementNSPlus('ogc:UpperBoundary');
            this.writeNode('Literal', a.upperBoundary, b);
            return b
          },
          INTERSECTS: function (a) {
            return this.writeSpatial(a, 'Intersects')
          },
          WITHIN: function (a) {
            return this.writeSpatial(a, 'Within')
          },
          CONTAINS: function (a) {
            return this.writeSpatial(a, 'Contains')
          },
          DWITHIN: function (a) {
            var b = this.writeSpatial(a, 'DWithin');
            this.writeNode('Distance', a, b);
            return b
          },
          Distance: function (a) {
            return this.createElementNSPlus('ogc:Distance', {
              attributes: {
                units: a.distanceUnits
              },
              value: a.distance
            })
          },
          Function: function (a) {
            for (var b = this.createElementNSPlus('ogc:Function', {
              attributes: {
                name: a.name
              }
            }), a = a.params, c = 0, d = a.length; c < d; c++) this.writeOgcExpression(a[c], b);
            return b
          }
        }
      },
      getFilterType: function (a) {
        var b = this.filterMap[a.type];
        if (!b) throw 'Filter writing not supported for rule type: ' + a.type;
        return b
      },
      filterMap: {
        '&&': 'And',
        '||': 'Or',
        '!': 'Not',
        '==': 'PropertyIsEqualTo',
        '!=': 'PropertyIsNotEqualTo',
        '<': 'PropertyIsLessThan',
        '>': 'PropertyIsGreaterThan',
        '<=': 'PropertyIsLessThanOrEqualTo',
        '>=': 'PropertyIsGreaterThanOrEqualTo',
        '..': 'PropertyIsBetween',
        '~': 'PropertyIsLike',
        BBOX: 'BBOX',
        DWITHIN: 'DWITHIN',
        WITHIN: 'WITHIN',
        CONTAINS: 'CONTAINS',
        INTERSECTS: 'INTERSECTS',
        FID: 'FeatureId'
      },
      CLASS_NAME: 'OpenLayers.Format.Filter.v1'
    });
    OpenLayers.Format.GML = OpenLayers.Class(OpenLayers.Format.XML, {
      featureNS: 'http://mapserver.gis.umn.edu/mapserver',
      featurePrefix: 'feature',
      featureName: 'featureMember',
      layerName: 'features',
      geometryName: 'geometry',
      collectionName: 'FeatureCollection',
      gmlns: 'http://www.opengis.net/gml',
      extractAttributes: !0,
      xy: !0,
      initialize: function (a) {
        this.regExes = {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        };
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ])
      },
      read: function (a) {
        'string' ==
          typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        for (var a = this.getElementsByTagNameNS(a.documentElement, this.gmlns, this.featureName), b = [
        ], c = 0; c < a.length; c++) {
          var d = this.parseFeature(a[c]);
          d && b.push(d)
        }
        return b
      },
      parseFeature: function (a) {
        for (var b = 'MultiPolygon Polygon MultiLineString LineString MultiPoint Point Envelope'.split(' '), c, d, e, f = 0; f < b.length; ++f) if (c = b[f], d = this.getElementsByTagNameNS(a, this.gmlns, c), 0 < d.length) {
          if (e = this.parseGeometry[c.toLowerCase()]) e = e.apply(this, [
            d[0]
          ]),
            this.internalProjection && this.externalProjection && e.transform(this.externalProjection, this.internalProjection);
          else throw new TypeError('Unsupported geometry type: ' + c);
          break
        }
        var g;
        c = this.getElementsByTagNameNS(a, this.gmlns, 'Box');
        for (f = 0; f < c.length; ++f) b = c[f],
          d = this.parseGeometry.box.apply(this, [
          b
        ]),
          b = b.parentNode,
          'boundedBy' === (b.localName || b.nodeName.split(':').pop()) ? g = d : e = d.toGeometry();
        var h;
        this.extractAttributes && (h = this.parseAttributes(a));
        h = new OpenLayers.Feature.Vector(e, h);
        h.bounds = g;
        h.gml = {
          featureType: a.firstChild.nodeName.split(':') [1],
          featureNS: a.firstChild.namespaceURI,
          featureNSPrefix: a.firstChild.prefix
        };
        for (var a = a.firstChild, i; a && !(1 == a.nodeType && (i = a.getAttribute('fid') || a.getAttribute('id'))); ) a = a.nextSibling;
        h.fid = i;
        return h
      },
      parseGeometry: {
        point: function (a) {
          var b,
              c;
          c = [
          ];
          b = this.getElementsByTagNameNS(a, this.gmlns, 'pos');
          0 < b.length && (c = b[0].firstChild.nodeValue, c = c.replace(this.regExes.trimSpace, ''), c = c.split(this.regExes.splitSpace));
          0 == c.length && (b = this.getElementsByTagNameNS(a, this.gmlns, 'coordinates'), 0 < b.length && (c = b[0].firstChild.nodeValue, c = c.replace(this.regExes.removeSpace, ''), c = c.split(',')));
          0 == c.length && (b = this.getElementsByTagNameNS(a, this.gmlns, 'coord'), 0 < b.length && (a = this.getElementsByTagNameNS(b[0], this.gmlns, 'X'), b = this.getElementsByTagNameNS(b[0], this.gmlns, 'Y'), 0 < a.length && 0 < b.length && (c = [
            a[0].firstChild.nodeValue,
            b[0].firstChild.nodeValue
          ])));
          2 == c.length && (c[2] = null);
          return this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2])  : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
        },
        multipoint: function (a) {
          var a = this.getElementsByTagNameNS(a, this.gmlns, 'Point'),
              b = [
              ];
          if (0 < a.length) for (var c, d = 0; d < a.length; ++d) (c = this.parseGeometry.point.apply(this, [
            a[d]
          ])) && b.push(c);
          return new OpenLayers.Geometry.MultiPoint(b)
        },
        linestring: function (a, b) {
          var c,
              d;
          d = [
          ];
          var e = [
          ];
          c = this.getElementsByTagNameNS(a, this.gmlns, 'posList');
          if (0 < c.length) {
            d = this.getChildValue(c[0]);
            d = d.replace(this.regExes.trimSpace, '');
            d = d.split(this.regExes.splitSpace);
            var f = parseInt(c[0].getAttribute('dimension')),
                g,
                h,
                i;
            for (c = 0; c < d.length / f; ++c) g = c * f,
              h = d[g],
              i = d[g + 1],
              g = 2 == f ? null : d[g + 2],
              this.xy ? e.push(new OpenLayers.Geometry.Point(h, i, g))  : e.push(new OpenLayers.Geometry.Point(i, h, g))
              }
          if (0 == d.length && (c = this.getElementsByTagNameNS(a, this.gmlns, 'coordinates'), 0 < c.length)) {
            d = this.getChildValue(c[0]);
            d = d.replace(this.regExes.trimSpace, '');
            d = d.replace(this.regExes.trimComma, ',');
            f = d.split(this.regExes.splitSpace);
            for (c = 0; c < f.length; ++c) d = f[c].split(','),
              2 == d.length && (d[2] = null),
              this.xy ? e.push(new OpenLayers.Geometry.Point(d[0], d[1], d[2]))  : e.push(new OpenLayers.Geometry.Point(d[1], d[0], d[2]))
              }
          d = null;
          0 != e.length && (d = b ? new OpenLayers.Geometry.LinearRing(e)  : new OpenLayers.Geometry.LineString(e));
          return d
        },
        multilinestring: function (a) {
          var a = this.getElementsByTagNameNS(a, this.gmlns, 'LineString'),
              b = [
              ];
          if (0 < a.length) for (var c, d = 0; d < a.length; ++d) (c = this.parseGeometry.linestring.apply(this, [
            a[d]
          ])) && b.push(c);
          return new OpenLayers.Geometry.MultiLineString(b)
        },
        polygon: function (a) {
          var a = this.getElementsByTagNameNS(a, this.gmlns, 'LinearRing'),
              b = [
              ];
          if (0 < a.length) for (var c, d = 0; d < a.length; ++d) (c = this.parseGeometry.linestring.apply(this, [
            a[d],
            !0
          ])) && b.push(c);
          return new OpenLayers.Geometry.Polygon(b)
        },
        multipolygon: function (a) {
          var a = this.getElementsByTagNameNS(a, this.gmlns, 'Polygon'),
              b = [
              ];
          if (0 < a.length) for (var c, d = 0; d < a.length; ++d) (c = this.parseGeometry.polygon.apply(this, [
            a[d]
          ])) && b.push(c);
          return new OpenLayers.Geometry.MultiPolygon(b)
        },
        envelope: function (a) {
          var b = [
          ],
              c,
              d,
              e = this.getElementsByTagNameNS(a, this.gmlns, 'lowerCorner');
          if (0 < e.length) {
            c = [
            ];
            0 < e.length && (c = e[0].firstChild.nodeValue, c = c.replace(this.regExes.trimSpace, ''), c = c.split(this.regExes.splitSpace));
            2 == c.length && (c[2] = null);
            var f = this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2])  : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
            }
          a = this.getElementsByTagNameNS(a, this.gmlns, 'upperCorner');
          if (0 < a.length) {
            c = [
            ];
            0 < a.length && (c = a[0].firstChild.nodeValue, c = c.replace(this.regExes.trimSpace, ''), c = c.split(this.regExes.splitSpace));
            2 == c.length && (c[2] = null);
            var g = this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2])  : new OpenLayers.Geometry.Point(c[1], c[0], c[2])
            }
          f && g && (b.push(new OpenLayers.Geometry.Point(f.x, f.y)), b.push(new OpenLayers.Geometry.Point(g.x, f.y)), b.push(new OpenLayers.Geometry.Point(g.x, g.y)), b.push(new OpenLayers.Geometry.Point(f.x, g.y)), b.push(new OpenLayers.Geometry.Point(f.x, f.y)), b = new OpenLayers.Geometry.LinearRing(b), d = new OpenLayers.Geometry.Polygon([b]));
          return d
        },
        box: function (a) {
          var b = this.getElementsByTagNameNS(a, this.gmlns, 'coordinates'),
              c = a = null;
          0 < b.length && (b = b[0].firstChild.nodeValue, b = b.split(' '), 2 == b.length && (a = b[0].split(','), c = b[1].split(',')));
          if (null !== a && null !== c) return new OpenLayers.Bounds(parseFloat(a[0]), parseFloat(a[1]), parseFloat(c[0]), parseFloat(c[1]))
            }
      },
      parseAttributes: function (a) {
        for (var b = {
        }, a = a.firstChild, c, d, e; a; ) {
          if (1 == a.nodeType) {
            a = a.childNodes;
            for (c = 0; c < a.length; ++c) if (d = a[c], 1 == d.nodeType) if (e = d.childNodes, 1 == e.length) {
              if (e = e[0], 3 == e.nodeType || 4 == e.nodeType) d = d.prefix ? d.nodeName.split(':') [1] : d.nodeName,
                e = e.nodeValue.replace(this.regExes.trimSpace, ''),
                b[d] = e
                } else b[d.nodeName.split(':').pop()] = null;
            break
          }
          a = a.nextSibling
        }
        return b
      },
      write: function (a) {
        OpenLayers.Util.isArray(a) || (a = [
          a
        ]);
        for (var b = this.createElementNS('http://www.opengis.net/wfs', 'wfs:' + this.collectionName), c = 0; c < a.length; c++) b.appendChild(this.createFeatureXML(a[c]));
        return OpenLayers.Format.XML.prototype.write.apply(this, [
          b
        ])
      },
      createFeatureXML: function (a) {
        var b = this.buildGeometryNode(a.geometry),
            c = this.createElementNS(this.featureNS, this.featurePrefix + ':' + this.geometryName);
        c.appendChild(b);
        var b = this.createElementNS(this.gmlns, 'gml:' + this.featureName),
            d = this.createElementNS(this.featureNS, this.featurePrefix + ':' + this.layerName);
        d.setAttribute('fid', a.fid || a.id);
        d.appendChild(c);
        for (var e in a.attributes) {
          var c = this.createTextNode(a.attributes[e]),
              f = this.createElementNS(this.featureNS, this.featurePrefix + ':' + e.substring(e.lastIndexOf(':') + 1));
          f.appendChild(c);
          d.appendChild(f)
        }
        b.appendChild(d);
        return b
      },
      buildGeometryNode: function (a) {
        this.externalProjection && this.internalProjection && (a = a.clone(), a.transform(this.internalProjection, this.externalProjection));
        var b = a.CLASS_NAME;
        return this.buildGeometry[b.substring(b.lastIndexOf('.') + 1).toLowerCase()].apply(this, [
          a
        ])
      },
      buildGeometry: {
        point: function (a) {
          var b = this.createElementNS(this.gmlns, 'gml:Point');
          b.appendChild(this.buildCoordinatesNode(a));
          return b
        },
        multipoint: function (a) {
          for (var b = this.createElementNS(this.gmlns, 'gml:MultiPoint'), a = a.components, c, d, e = 0; e < a.length; e++) c = this.createElementNS(this.gmlns, 'gml:pointMember'),
            d = this.buildGeometry.point.apply(this, [
            a[e]
          ]),
            c.appendChild(d),
            b.appendChild(c);
          return b
        },
        linestring: function (a) {
          var b = this.createElementNS(this.gmlns, 'gml:LineString');
          b.appendChild(this.buildCoordinatesNode(a));
          return b
        },
        multilinestring: function (a) {
          for (var b = this.createElementNS(this.gmlns, 'gml:MultiLineString'), a = a.components, c, d, e = 0; e < a.length; ++e) c = this.createElementNS(this.gmlns, 'gml:lineStringMember'),
            d = this.buildGeometry.linestring.apply(this, [
            a[e]
          ]),
            c.appendChild(d),
            b.appendChild(c);
          return b
        },
        linearring: function (a) {
          var b = this.createElementNS(this.gmlns, 'gml:LinearRing');
          b.appendChild(this.buildCoordinatesNode(a));
          return b
        },
        polygon: function (a) {
          for (var b = this.createElementNS(this.gmlns, 'gml:Polygon'), a = a.components, c, d, e = 0; e < a.length; ++e) c = 0 == e ? 'outerBoundaryIs' : 'innerBoundaryIs',
            c = this.createElementNS(this.gmlns, 'gml:' + c),
            d = this.buildGeometry.linearring.apply(this, [
            a[e]
          ]),
            c.appendChild(d),
            b.appendChild(c);
          return b
        },
        multipolygon: function (a) {
          for (var b = this.createElementNS(this.gmlns, 'gml:MultiPolygon'), a = a.components, c, d, e = 0; e < a.length; ++e) c = this.createElementNS(this.gmlns, 'gml:polygonMember'),
            d = this.buildGeometry.polygon.apply(this, [
            a[e]
          ]),
            c.appendChild(d),
            b.appendChild(c);
          return b
        },
        bounds: function (a) {
          var b = this.createElementNS(this.gmlns, 'gml:Box');
          b.appendChild(this.buildCoordinatesNode(a));
          return b
        }
      },
      buildCoordinatesNode: function (a) {
        var b = this.createElementNS(this.gmlns, 'gml:coordinates');
        b.setAttribute('decimal', '.');
        b.setAttribute('cs', ',');
        b.setAttribute('ts', ' ');
        var c = [
        ];
        if (a instanceof OpenLayers.Bounds) c.push(a.left + ',' + a.bottom),
          c.push(a.right + ',' + a.top);
        else for (var a = a.components ? a.components : [
          a
        ], d = 0; d < a.length; d++) c.push(a[d].x + ',' + a[d].y);
        c = this.createTextNode(c.join(' '));
        b.appendChild(c);
        return b
      },
      CLASS_NAME: 'OpenLayers.Format.GML'
    });
    OpenLayers.Format.GML || (OpenLayers.Format.GML = {
    });
    OpenLayers.Format.GML.Base = OpenLayers.Class(OpenLayers.Format.XML, {
      namespaces: {
        gml: 'http://www.opengis.net/gml',
        xlink: 'http://www.w3.org/1999/xlink',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance',
        wfs: 'http://www.opengis.net/wfs'
      },
      defaultPrefix: 'gml',
      schemaLocation: null,
      featureType: null,
      featureNS: null,
      geometryName: 'geometry',
      extractAttributes: !0,
      srsName: null,
      xy: !0,
      geometryTypes: null,
      singleFeatureType: null,
      regExes: {
        trimSpace: /^\s*|\s*$/g,
        removeSpace: /\s*/g,
        splitSpace: /\s+/,
        trimComma: /\s*,\s*/g,
        featureMember: /^(.*:)?featureMembers?$/
      },
      initialize: function (a) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ]);
        this.setGeometryTypes();
        a && a.featureNS && this.setNamespace('feature', a.featureNS);
        this.singleFeatureType = !a || typeof a.featureType === 'string'
      },
      read: function (a) {
        typeof a == 'string' && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        if (a && a.nodeType == 9) a = a.documentElement;
        var b = [
        ];
        this.readNode(a, {
          features: b
        }, true);
        if (b.length == 0) {
          var c = this.getElementsByTagNameNS(a, this.namespaces.gml, 'featureMember');
          if (c.length) for (var a = 0, d = c.length; a < d; ++a) this.readNode(c[a], {
            features: b
          }, true);
          else {
            c = this.getElementsByTagNameNS(a, this.namespaces.gml, 'featureMembers');
            c.length && this.readNode(c[0], {
              features: b
            }, true)
          }
        }
        return b
      },
      readNode: function (a, b, c) {
        if (c === true && this.autoConfig === true) {
          this.featureType = null;
          delete this.namespaceAlias[this.featureNS];
          delete this.namespaces.feature;
          this.featureNS = null
        }
        if (!this.featureNS && !(a.prefix in this.namespaces) && a.parentNode.namespaceURI == this.namespaces.gml && this.regExes.featureMember.test(a.parentNode.nodeName)) {
          this.featureType = a.nodeName.split(':').pop();
          this.setNamespace('feature', a.namespaceURI);
          this.featureNS = a.namespaceURI;
          this.autoConfig = true
        }
        return OpenLayers.Format.XML.prototype.readNode.apply(this, [
          a,
          b
        ])
      },
      readers: {
        gml: {
          featureMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          featureMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          name: function (a, b) {
            b.name = this.getChildValue(a)
          },
          boundedBy: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            if (c.components && c.components.length > 0) b.bounds = c.components[0]
              },
          Point: function (a, b) {
            var c = {
              points: [
              ]
            };
            this.readChildNodes(a, c);
            if (!b.components) b.components = [
            ];
            b.components.push(c.points[0])
          },
          coordinates: function (a, b) {
            for (var c = this.getChildValue(a).replace(this.regExes.trimSpace, ''), c = c.replace(this.regExes.trimComma, ','), c = c.split(this.regExes.splitSpace), d, e = c.length, f = Array(e), g = 0; g < e; ++g) {
              d = c[g].split(',');
              f[g] = this.xy ? new OpenLayers.Geometry.Point(d[0], d[1], d[2])  : new OpenLayers.Geometry.Point(d[1], d[0], d[2])
            }
            b.points = f
          },
          coord: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            if (!b.points) b.points = [
            ];
            b.points.push(new OpenLayers.Geometry.Point(c.x, c.y, c.z))
          },
          X: function (a, b) {
            b.x = this.getChildValue(a)
          },
          Y: function (a, b) {
            b.y = this.getChildValue(a)
          },
          Z: function (a, b) {
            b.z = this.getChildValue(a)
          },
          MultiPoint: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            b.components = [
              new OpenLayers.Geometry.MultiPoint(c.components)
            ]
          },
          pointMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          LineString: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            if (!b.components) b.components = [
            ];
            b.components.push(new OpenLayers.Geometry.LineString(c.points))
          },
          MultiLineString: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            b.components = [
              new OpenLayers.Geometry.MultiLineString(c.components)
            ]
          },
          lineStringMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          Polygon: function (a, b) {
            var c = {
              outer: null,
              inner: [
              ]
            };
            this.readChildNodes(a, c);
            c.inner.unshift(c.outer);
            if (!b.components) b.components = [
            ];
            b.components.push(new OpenLayers.Geometry.Polygon(c.inner))
          },
          LinearRing: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            b.components = [
              new OpenLayers.Geometry.LinearRing(c.points)
            ]
          },
          MultiPolygon: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            b.components = [
              new OpenLayers.Geometry.MultiPolygon(c.components)
            ]
          },
          polygonMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          GeometryCollection: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            b.components = [
              new OpenLayers.Geometry.Collection(c.components)
            ]
          },
          geometryMember: function (a, b) {
            this.readChildNodes(a, b)
          }
        },
        feature: {
          '*': function (a, b) {
            var c,
                d = a.localName || a.nodeName.split(':').pop();
            b.features ? !this.singleFeatureType && OpenLayers.Util.indexOf(this.featureType, d) !== - 1 ? c = '_typeName' : d === this.featureType && (c = '_typeName')  : a.childNodes.length == 0 || a.childNodes.length == 1 && a.firstChild.nodeType == 3 ? this.extractAttributes && (c = '_attribute')  : c = '_geometry';
            c && this.readers.feature[c].apply(this, [
              a,
              b
            ])
          },
          _typeName: function (a, b) {
            var c = {
              components: [
              ],
              attributes: {
              }
            };
            this.readChildNodes(a, c);
            if (c.name) c.attributes.name = c.name;
            var d = new OpenLayers.Feature.Vector(c.components[0], c.attributes);
            if (!this.singleFeatureType) {
              d.type = a.nodeName.split(':').pop();
              d.namespace = a.namespaceURI
            }
            var e = a.getAttribute('fid') || this.getAttributeNS(a, this.namespaces.gml, 'id');
            if (e) d.fid = e;
            this.internalProjection && (this.externalProjection && d.geometry) && d.geometry.transform(this.externalProjection, this.internalProjection);
            if (c.bounds) d.bounds = c.bounds;
            b.features.push(d)
          },
          _geometry: function (a, b) {
            if (!this.geometryName) this.geometryName = a.nodeName.split(':').pop();
            this.readChildNodes(a, b)
          },
          _attribute: function (a, b) {
            var c = a.localName || a.nodeName.split(':').pop(),
                d = this.getChildValue(a);
            b.attributes[c] = d
          }
        },
        wfs: {
          FeatureCollection: function (a, b) {
            this.readChildNodes(a, b)
          }
        }
      },
      write: function (a) {
        a = this.writeNode('gml:' + (OpenLayers.Util.isArray(a) ? 'featureMembers' : 'featureMember'), a);
        this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [
          a
        ])
      },
      writers: {
        gml: {
          featureMember: function (a) {
            var b = this.createElementNSPlus('gml:featureMember');
            this.writeNode('feature:_typeName', a, b);
            return b
          },
          MultiPoint: function (a) {
            for (var b = this.createElementNSPlus('gml:MultiPoint'), a = a.components || [
              a
            ], c = 0, d = a.length; c < d; ++c) this.writeNode('pointMember', a[c], b);
            return b
          },
          pointMember: function (a) {
            var b = this.createElementNSPlus('gml:pointMember');
            this.writeNode('Point', a, b);
            return b
          },
          MultiLineString: function (a) {
            for (var b = this.createElementNSPlus('gml:MultiLineString'), a = a.components || [
              a
            ], c = 0, d = a.length; c < d; ++c) this.writeNode('lineStringMember', a[c], b);
            return b
          },
          lineStringMember: function (a) {
            var b = this.createElementNSPlus('gml:lineStringMember');
            this.writeNode('LineString', a, b);
            return b
          },
          MultiPolygon: function (a) {
            for (var b = this.createElementNSPlus('gml:MultiPolygon'), a = a.components || [
              a
            ], c = 0, d = a.length; c < d; ++c) this.writeNode('polygonMember', a[c], b);
            return b
          },
          polygonMember: function (a) {
            var b = this.createElementNSPlus('gml:polygonMember');
            this.writeNode('Polygon', a, b);
            return b
          },
          GeometryCollection: function (a) {
            for (var b = this.createElementNSPlus('gml:GeometryCollection'), c = 0, d = a.components.length; c < d; ++c) this.writeNode('geometryMember', a.components[c], b);
            return b
          },
          geometryMember: function (a) {
            var b = this.createElementNSPlus('gml:geometryMember'),
                a = this.writeNode('feature:_geometry', a);
            b.appendChild(a.firstChild);
            return b
          }
        },
        feature: {
          _typeName: function (a) {
            var b = this.createElementNSPlus('feature:' + this.featureType, {
              attributes: {
                fid: a.fid
              }
            });
            a.geometry && this.writeNode('feature:_geometry', a.geometry, b);
            for (var c in a.attributes) {
              var d = a.attributes[c];
              d != null && this.writeNode('feature:_attribute', {
                name: c,
                value: d
              }, b)
            }
            return b
          },
          _geometry: function (a) {
            this.externalProjection && this.internalProjection && (a = a.clone().transform(this.internalProjection, this.externalProjection));
            var b = this.createElementNSPlus('feature:' + this.geometryName),
                a = this.writeNode('gml:' + this.geometryTypes[a.CLASS_NAME], a, b);
            this.srsName && a.setAttribute('srsName', this.srsName);
            return b
          },
          _attribute: function (a) {
            return this.createElementNSPlus('feature:' + a.name, {
              value: a.value
            })
          }
        },
        wfs: {
          FeatureCollection: function (a) {
            for (var b = this.createElementNSPlus('wfs:FeatureCollection'), c = 0, d = a.length; c < d; ++c) this.writeNode('gml:featureMember', a[c], b);
            return b
          }
        }
      },
      setGeometryTypes: function () {
        this.geometryTypes = {
          'OpenLayers.Geometry.Point': 'Point',
          'OpenLayers.Geometry.MultiPoint': 'MultiPoint',
          'OpenLayers.Geometry.LineString': 'LineString',
          'OpenLayers.Geometry.MultiLineString': 'MultiLineString',
          'OpenLayers.Geometry.Polygon': 'Polygon',
          'OpenLayers.Geometry.MultiPolygon': 'MultiPolygon',
          'OpenLayers.Geometry.Collection': 'GeometryCollection'
        }
      },
      CLASS_NAME: 'OpenLayers.Format.GML.Base'
    });
    OpenLayers.Format.GML.v3 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
      schemaLocation: 'http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd',
      curve: !1,
      multiCurve: !0,
      surface: !1,
      multiSurface: !0,
      initialize: function (a) {
        OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [
          a
        ])
      },
      readers: {
        gml: OpenLayers.Util.applyDefaults({
          featureMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          Curve: function (a, b) {
            var c = {
              points: [
              ]
            };
            this.readChildNodes(a, c);
            b.components || (b.components = [
            ]);
            b.components.push(new OpenLayers.Geometry.LineString(c.points))
          },
          segments: function (a, b) {
            this.readChildNodes(a, b)
          },
          LineStringSegment: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            c.points && Array.prototype.push.apply(b.points, c.points)
          },
          pos: function (a, b) {
            var c = this.getChildValue(a).replace(this.regExes.trimSpace, '').split(this.regExes.splitSpace),
                c = this.xy ? new OpenLayers.Geometry.Point(c[0], c[1], c[2])  : new OpenLayers.Geometry.Point(c[1], c[0], c[2]);
            b.points = [
              c
            ]
          },
          posList: function (a, b) {
            for (var c = this.getChildValue(a).replace(this.regExes.trimSpace, '').split(this.regExes.splitSpace), d = parseInt(a.getAttribute('dimension')) || 2, e, f, g, h = Array(c.length / d), i = 0, j = c.length; i < j; i += d) e = c[i],
              f = c[i + 1],
              g = 2 == d ? void 0 : c[i + 2],
              h[i / d] = this.xy ? new OpenLayers.Geometry.Point(e, f, g)  : new OpenLayers.Geometry.Point(f, e, g);
            b.points = h
          },
          Surface: function (a, b) {
            this.readChildNodes(a, b)
          },
          patches: function (a, b) {
            this.readChildNodes(a, b)
          },
          PolygonPatch: function (a, b) {
            this.readers.gml.Polygon.apply(this, [
              a,
              b
            ])
          },
          exterior: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            b.outer = c.components[0]
          },
          interior: function (a, b) {
            var c = {
            };
            this.readChildNodes(a, c);
            b.inner.push(c.components[0])
          },
          MultiCurve: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            0 < c.components.length && (b.components = [
              new OpenLayers.Geometry.MultiLineString(c.components)
            ])
          },
          curveMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          MultiSurface: function (a, b) {
            var c = {
              components: [
              ]
            };
            this.readChildNodes(a, c);
            0 < c.components.length && (b.components = [
              new OpenLayers.Geometry.MultiPolygon(c.components)
            ])
          },
          surfaceMember: function (a, b) {
            this.readChildNodes(a, b)
          },
          surfaceMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          pointMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          lineStringMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          polygonMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          geometryMembers: function (a, b) {
            this.readChildNodes(a, b)
          },
          Envelope: function (a, b) {
            var c = {
              points: Array(2)
            };
            this.readChildNodes(a, c);
            b.components || (b.components = [
            ]);
            var d = c.points[0],
                c = c.points[1];
            b.components.push(new OpenLayers.Bounds(d.x, d.y, c.x, c.y))
          },
          lowerCorner: function (a, b) {
            var c = {
            };
            this.readers.gml.pos.apply(this, [
              a,
              c
            ]);
            b.points[0] = c.points[0]
          },
          upperCorner: function (a, b) {
            var c = {
            };
            this.readers.gml.pos.apply(this, [
              a,
              c
            ]);
            b.points[1] = c.points[0]
          }
        }, OpenLayers.Format.GML.Base.prototype.readers.gml),
        feature: OpenLayers.Format.GML.Base.prototype.readers.feature,
        wfs: OpenLayers.Format.GML.Base.prototype.readers.wfs
      },
      write: function (a) {
        a = this.writeNode('gml:' + (OpenLayers.Util.isArray(a) ? 'featureMembers' : 'featureMember'), a);
        this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
        return OpenLayers.Format.XML.prototype.write.apply(this, [
          a
        ])
      },
      writers: {
        gml: OpenLayers.Util.applyDefaults({
          featureMembers: function (a) {
            for (var b = this.createElementNSPlus('gml:featureMembers'), c = 0, d = a.length; c < d; ++c) this.writeNode('feature:_typeName', a[c], b);
            return b
          },
          Point: function (a) {
            var b = this.createElementNSPlus('gml:Point');
            this.writeNode('pos', a, b);
            return b
          },
          pos: function (a) {
            return this.createElementNSPlus('gml:pos', {
              value: this.xy ? a.x +
              ' ' + a.y : a.y + ' ' + a.x
            })
          },
          LineString: function (a) {
            var b = this.createElementNSPlus('gml:LineString');
            this.writeNode('posList', a.components, b);
            return b
          },
          Curve: function (a) {
            var b = this.createElementNSPlus('gml:Curve');
            this.writeNode('segments', a, b);
            return b
          },
          segments: function (a) {
            var b = this.createElementNSPlus('gml:segments');
            this.writeNode('LineStringSegment', a, b);
            return b
          },
          LineStringSegment: function (a) {
            var b = this.createElementNSPlus('gml:LineStringSegment');
            this.writeNode('posList', a.components, b);
            return b
          },
          posList: function (a) {
            for (var b = a.length, c = Array(b), d, e = 0; e < b; ++e) d = a[e],
              c[e] = this.xy ? d.x + ' ' + d.y : d.y + ' ' + d.x;
            return this.createElementNSPlus('gml:posList', {
              value: c.join(' ')
            })
          },
          Surface: function (a) {
            var b = this.createElementNSPlus('gml:Surface');
            this.writeNode('patches', a, b);
            return b
          },
          patches: function (a) {
            var b = this.createElementNSPlus('gml:patches');
            this.writeNode('PolygonPatch', a, b);
            return b
          },
          PolygonPatch: function (a) {
            var b = this.createElementNSPlus('gml:PolygonPatch', {
              attributes: {
                interpolation: 'planar'
              }
            });
            this.writeNode('exterior', a.components[0], b);
            for (var c = 1, d = a.components.length; c < d; ++c) this.writeNode('interior', a.components[c], b);
            return b
          },
          Polygon: function (a) {
            var b = this.createElementNSPlus('gml:Polygon');
            this.writeNode('exterior', a.components[0], b);
            for (var c = 1, d = a.components.length; c < d; ++c) this.writeNode('interior', a.components[c], b);
            return b
          },
          exterior: function (a) {
            var b = this.createElementNSPlus('gml:exterior');
            this.writeNode('LinearRing', a, b);
            return b
          },
          interior: function (a) {
            var b = this.createElementNSPlus('gml:interior');
            this.writeNode('LinearRing', a, b);
            return b
          },
          LinearRing: function (a) {
            var b = this.createElementNSPlus('gml:LinearRing');
            this.writeNode('posList', a.components, b);
            return b
          },
          MultiCurve: function (a) {
            for (var b = this.createElementNSPlus('gml:MultiCurve'), a = a.components || [
              a
            ], c = 0, d = a.length; c < d; ++c) this.writeNode('curveMember', a[c], b);
            return b
          },
          curveMember: function (a) {
            var b = this.createElementNSPlus('gml:curveMember');
            this.curve ? this.writeNode('Curve', a, b)  : this.writeNode('LineString', a, b);
            return b
          },
          MultiSurface: function (a) {
            for (var b = this.createElementNSPlus('gml:MultiSurface'), a = a.components || [
              a
            ], c = 0, d = a.length; c < d; ++c) this.writeNode('surfaceMember', a[c], b);
            return b
          },
          surfaceMember: function (a) {
            var b = this.createElementNSPlus('gml:surfaceMember');
            this.surface ? this.writeNode('Surface', a, b)  : this.writeNode('Polygon', a, b);
            return b
          },
          Envelope: function (a) {
            var b = this.createElementNSPlus('gml:Envelope');
            this.writeNode('lowerCorner', a, b);
            this.writeNode('upperCorner', a, b);
            this.srsName && b.setAttribute('srsName', this.srsName);
            return b
          },
          lowerCorner: function (a) {
            return this.createElementNSPlus('gml:lowerCorner', {
              value: this.xy ? a.left + ' ' + a.bottom : a.bottom + ' ' + a.left
            })
          },
          upperCorner: function (a) {
            return this.createElementNSPlus('gml:upperCorner', {
              value: this.xy ? a.right + ' ' + a.top : a.top + ' ' + a.right
            })
          }
        }, OpenLayers.Format.GML.Base.prototype.writers.gml),
        feature: OpenLayers.Format.GML.Base.prototype.writers.feature,
        wfs: OpenLayers.Format.GML.Base.prototype.writers.wfs
      },
      setGeometryTypes: function () {
        this.geometryTypes = {
          'OpenLayers.Geometry.Point': 'Point',
          'OpenLayers.Geometry.MultiPoint': 'MultiPoint',
          'OpenLayers.Geometry.LineString': !0 ===
          this.curve ? 'Curve' : 'LineString',
          'OpenLayers.Geometry.MultiLineString': !1 === this.multiCurve ? 'MultiLineString' : 'MultiCurve',
          'OpenLayers.Geometry.Polygon': !0 === this.surface ? 'Surface' : 'Polygon',
          'OpenLayers.Geometry.MultiPolygon': !1 === this.multiSurface ? 'MultiPolygon' : 'MultiSurface',
          'OpenLayers.Geometry.Collection': 'GeometryCollection'
        }
      },
      CLASS_NAME: 'OpenLayers.Format.GML.v3'
    });
    OpenLayers.Format.Filter.v1_1_0 = OpenLayers.Class(OpenLayers.Format.GML.v3, OpenLayers.Format.Filter.v1, {
      VERSION: '1.1.0',
      schemaLocation: 'http://www.opengis.net/ogc/filter/1.1.0/filter.xsd',
      initialize: function (a) {
        OpenLayers.Format.GML.v3.prototype.initialize.apply(this, [
          a
        ])
      },
      readers: {
        ogc: OpenLayers.Util.applyDefaults({
          PropertyIsEqualTo: function (a, b) {
            var c = a.getAttribute('matchCase'),
                c = new OpenLayers.Filter.Comparison({
                  type: OpenLayers.Filter.Comparison.EQUAL_TO,
                  matchCase: !('false' === c || '0' === c)
                });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsNotEqualTo: function (a, b) {
            var c = a.getAttribute('matchCase'),
                c = new OpenLayers.Filter.Comparison({
                  type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                  matchCase: !('false' === c || '0' === c)
                });
            this.readChildNodes(a, c);
            b.filters.push(c)
          },
          PropertyIsLike: function (a, b) {
            var c = new OpenLayers.Filter.Comparison({
              type: OpenLayers.Filter.Comparison.LIKE
            });
            this.readChildNodes(a, c);
            var d = a.getAttribute('wildCard'),
                e = a.getAttribute('singleChar'),
                f = a.getAttribute('escapeChar');
            c.value2regex(d, e, f);
            b.filters.push(c)
          }
        }, OpenLayers.Format.Filter.v1.prototype.readers.ogc),
        gml: OpenLayers.Format.GML.v3.prototype.readers.gml,
        feature: OpenLayers.Format.GML.v3.prototype.readers.feature
      },
      writers: {
        ogc: OpenLayers.Util.applyDefaults({
          PropertyIsEqualTo: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsEqualTo', {
              attributes: {
                matchCase: a.matchCase
              }
            });
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsNotEqualTo: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsNotEqualTo', {
              attributes: {
                matchCase: a.matchCase
              }
            });
            this.writeNode('PropertyName', a, b);
            this.writeOgcExpression(a.value, b);
            return b
          },
          PropertyIsLike: function (a) {
            var b = this.createElementNSPlus('ogc:PropertyIsLike', {
              attributes: {
                matchCase: a.matchCase,
                wildCard: '*',
                singleChar: '.',
                escapeChar: '!'
              }
            });
            this.writeNode('PropertyName', a, b);
            this.writeNode('Literal', a.regex2value(), b);
            return b
          },
          BBOX: function (a) {
            var b = this.createElementNSPlus('ogc:BBOX');
            a.property && this.writeNode('PropertyName', a, b);
            var c = this.writeNode('gml:Envelope', a.value);
            a.projection && c.setAttribute('srsName', a.projection);
            b.appendChild(c);
            return b
          },
          SortBy: function (a) {
            for (var b = this.createElementNSPlus('ogc:SortBy'), c = 0, d = a.length; c < d; c++) this.writeNode('ogc:SortProperty', a[c], b);
            return b
          },
          SortProperty: function (a) {
            var b = this.createElementNSPlus('ogc:SortProperty');
            this.writeNode('ogc:PropertyName', a, b);
            this.writeNode('ogc:SortOrder', 'DESC' == a.order ? 'DESC' : 'ASC', b);
            return b
          },
          SortOrder: function (a) {
            return this.createElementNSPlus('ogc:SortOrder', {
              value: a
            })
          }
        }, OpenLayers.Format.Filter.v1.prototype.writers.ogc),
        gml: OpenLayers.Format.GML.v3.prototype.writers.gml,
        feature: OpenLayers.Format.GML.v3.prototype.writers.feature
      },
      writeSpatial: function (a, b) {
        var c = this.createElementNSPlus('ogc:' + b);
        this.writeNode('PropertyName', a, c);
        if (a.value instanceof OpenLayers.Filter.Function) this.writeNode('Function', a.value, c);
        else {
          var d;
          d = a.value instanceof OpenLayers.Geometry ? this.writeNode('feature:_geometry', a.value).firstChild : this.writeNode('gml:Envelope', a.value);
          a.projection && d.setAttribute('srsName', a.projection);
          c.appendChild(d)
        }
        return c
      },
      CLASS_NAME: 'OpenLayers.Format.Filter.v1_1_0'
    });
    OpenLayers.Format.OWSCommon = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
      defaultVersion: '1.0.0',
      getVersion: function (a) {
        var b = this.version;
        b || ((a = a.getAttribute('xmlns:ows')) && '1.1' === a.substring(a.lastIndexOf('/') + 1) && (b = '1.1.0'), b || (b = this.defaultVersion));
        return b
      },
      CLASS_NAME: 'OpenLayers.Format.OWSCommon'
    });
    OpenLayers.Format.OWSCommon.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
      regExes: {
        trimSpace: /^\s*|\s*$/g,
        removeSpace: /\s*/g,
        splitSpace: /\s+/,
        trimComma: /\s*,\s*/g
      },
      read: function (a, b) {
        OpenLayers.Util.applyDefaults(b, this.options);
        var c = {
        };
        this.readChildNodes(a, c);
        return c
      },
      readers: {
        ows: {
          Exception: function (a, b) {
            var c = {
              code: a.getAttribute('exceptionCode'),
              locator: a.getAttribute('locator'),
              texts: [
              ]
            };
            b.exceptions.push(c);
            this.readChildNodes(a, c)
          },
          ExceptionText: function (a, b) {
            var c = this.getChildValue(a);
            b.texts.push(c)
          },
          ServiceIdentification: function (a, b) {
            b.serviceIdentification = {
            };
            this.readChildNodes(a, b.serviceIdentification)
          },
          Title: function (a, b) {
            b.title = this.getChildValue(a)
          },
          Abstract: function (a, b) {
            b['abstract'] = this.getChildValue(a)
          },
          Keywords: function (a, b) {
            b.keywords = {
            };
            this.readChildNodes(a, b.keywords)
          },
          Keyword: function (a, b) {
            b[this.getChildValue(a)] = !0
          },
          ServiceType: function (a, b) {
            b.serviceType = {
              codeSpace: a.getAttribute('codeSpace'),
              value: this.getChildValue(a)
            }
          },
          ServiceTypeVersion: function (a, b) {
            b.serviceTypeVersion = this.getChildValue(a)
          },
          Fees: function (a, b) {
            b.fees = this.getChildValue(a)
          },
          AccessConstraints: function (a, b) {
            b.accessConstraints = this.getChildValue(a)
          },
          ServiceProvider: function (a, b) {
            b.serviceProvider = {
            };
            this.readChildNodes(a, b.serviceProvider)
          },
          ProviderName: function (a, b) {
            b.providerName = this.getChildValue(a)
          },
          ProviderSite: function (a, b) {
            b.providerSite = this.getAttributeNS(a, this.namespaces.xlink, 'href')
          },
          ServiceContact: function (a, b) {
            b.serviceContact = {
            };
            this.readChildNodes(a, b.serviceContact)
          },
          IndividualName: function (a, b) {
            b.individualName = this.getChildValue(a)
          },
          PositionName: function (a, b) {
            b.positionName = this.getChildValue(a)
          },
          ContactInfo: function (a, b) {
            b.contactInfo = {
            };
            this.readChildNodes(a, b.contactInfo)
          },
          Phone: function (a, b) {
            b.phone = {
            };
            this.readChildNodes(a, b.phone)
          },
          Voice: function (a, b) {
            b.voice = this.getChildValue(a)
          },
          Address: function (a, b) {
            b.address = {
            };
            this.readChildNodes(a, b.address)
          },
          DeliveryPoint: function (a, b) {
            b.deliveryPoint = this.getChildValue(a)
          },
          City: function (a, b) {
            b.city = this.getChildValue(a)
          },
          AdministrativeArea: function (a, b) {
            b.administrativeArea = this.getChildValue(a)
          },
          PostalCode: function (a, b) {
            b.postalCode = this.getChildValue(a)
          },
          Country: function (a, b) {
            b.country = this.getChildValue(a)
          },
          ElectronicMailAddress: function (a, b) {
            b.electronicMailAddress = this.getChildValue(a)
          },
          Role: function (a, b) {
            b.role = this.getChildValue(a)
          },
          OperationsMetadata: function (a, b) {
            b.operationsMetadata = {
            };
            this.readChildNodes(a, b.operationsMetadata)
          },
          Operation: function (a, b) {
            var c = a.getAttribute('name');
            b[c] = {
            };
            this.readChildNodes(a, b[c])
          },
          DCP: function (a, b) {
            b.dcp = {
            };
            this.readChildNodes(a, b.dcp)
          },
          HTTP: function (a, b) {
            b.http = {
            };
            this.readChildNodes(a, b.http)
          },
          Get: function (a, b) {
            b.get || (b.get = [
            ]);
            var c = {
              url: this.getAttributeNS(a, this.namespaces.xlink, 'href')
            };
            this.readChildNodes(a, c);
            b.get.push(c)
          },
          Post: function (a, b) {
            b.post || (b.post = [
            ]);
            var c = {
              url: this.getAttributeNS(a, this.namespaces.xlink, 'href')
            };
            this.readChildNodes(a, c);
            b.post.push(c)
          },
          Parameter: function (a, b) {
            b.parameters || (b.parameters = {
            });
            var c = a.getAttribute('name');
            b.parameters[c] = {
            };
            this.readChildNodes(a, b.parameters[c])
          },
          Constraint: function (a, b) {
            b.constraints || (b.constraints = {
            });
            var c = a.getAttribute('name');
            b.constraints[c] = {
            };
            this.readChildNodes(a, b.constraints[c])
          },
          Value: function (a, b) {
            b[this.getChildValue(a)] = !0
          },
          OutputFormat: function (a, b) {
            b.formats.push({
              value: this.getChildValue(a)
            });
            this.readChildNodes(a, b)
          },
          WGS84BoundingBox: function (a, b) {
            var c = {
            };
            c.crs = a.getAttribute('crs');
            b.BoundingBox ? b.BoundingBox.push(c)  : (b.projection = c.crs, c = b);
            this.readChildNodes(a, c)
          },
          BoundingBox: function (a, b) {
            this.readers.ows.WGS84BoundingBox.apply(this, [
              a,
              b
            ])
          },
          LowerCorner: function (a, b) {
            var c = this.getChildValue(a).replace(this.regExes.trimSpace, ''),
                c = c.replace(this.regExes.trimComma, ','),
                c = c.split(this.regExes.splitSpace);
            b.left = c[0];
            b.bottom = c[1]
          },
          UpperCorner: function (a, b) {
            var c = this.getChildValue(a).replace(this.regExes.trimSpace, ''),
                c = c.replace(this.regExes.trimComma, ','),
                c = c.split(this.regExes.splitSpace);
            b.right = c[0];
            b.top = c[1];
            b.bounds = new OpenLayers.Bounds(b.left, b.bottom, b.right, b.top);
            delete b.left;
            delete b.bottom;
            delete b.right;
            delete b.top
          },
          Language: function (a, b) {
            b.language = this.getChildValue(a)
          }
        }
      },
      writers: {
        ows: {
          BoundingBox: function (a) {
            var b = this.createElementNSPlus('ows:BoundingBox', {
              attributes: {
                crs: a.projection
              }
            });
            this.writeNode('ows:LowerCorner', a, b);
            this.writeNode('ows:UpperCorner', a, b);
            return b
          },
          LowerCorner: function (a) {
            return this.createElementNSPlus('ows:LowerCorner', {
              value: a.bounds.left + ' ' + a.bounds.bottom
            })
          },
          UpperCorner: function (a) {
            return this.createElementNSPlus('ows:UpperCorner', {
              value: a.bounds.right + ' ' + a.bounds.top
            })
          },
          Identifier: function (a) {
            return this.createElementNSPlus('ows:Identifier', {
              value: a
            })
          },
          Title: function (a) {
            return this.createElementNSPlus('ows:Title', {
              value: a
            })
          },
          Abstract: function (a) {
            return this.createElementNSPlus('ows:Abstract', {
              value: a
            })
          },
          OutputFormat: function (a) {
            return this.createElementNSPlus('ows:OutputFormat', {
              value: a
            })
          }
        }
      },
      CLASS_NAME: 'OpenLayers.Format.OWSCommon.v1'
    });
    OpenLayers.Format.OWSCommon.v1_0_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1, {
      namespaces: {
        ows: 'http://www.opengis.net/ows',
        xlink: 'http://www.w3.org/1999/xlink'
      },
      readers: {
        ows: OpenLayers.Util.applyDefaults({
          ExceptionReport: function (a, b) {
            b.success = !1;
            b.exceptionReport = {
              version: a.getAttribute('version'),
              language: a.getAttribute('language'),
              exceptions: [
              ]
            };
            this.readChildNodes(a, b.exceptionReport)
          }
        }, OpenLayers.Format.OWSCommon.v1.prototype.readers.ows)
      },
      writers: {
        ows: OpenLayers.Format.OWSCommon.v1.prototype.writers.ows
      },
      CLASS_NAME: 'OpenLayers.Format.OWSCommon.v1_0_0'
    });
    OpenLayers.Format.WFST.v1_1_0 = OpenLayers.Class(OpenLayers.Format.Filter.v1_1_0, OpenLayers.Format.WFST.v1, {
      version: '1.1.0',
      schemaLocations: {
        wfs: 'http://schemas.opengis.net/wfs/1.1.0/wfs.xsd'
      },
      initialize: function (a) {
        OpenLayers.Format.Filter.v1_1_0.prototype.initialize.apply(this, [
          a
        ]);
        OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [
          a
        ])
      },
      readNode: function (a, b) {
        return OpenLayers.Format.GML.v3.prototype.readNode.apply(this, [
          a,
          b
        ])
      },
      readers: {
        wfs: OpenLayers.Util.applyDefaults({
          FeatureCollection: function (a, b) {
            b.numberOfFeatures = parseInt(a.getAttribute('numberOfFeatures'));
            OpenLayers.Format.WFST.v1.prototype.readers.wfs.FeatureCollection.apply(this, arguments)
          },
          TransactionResponse: function (a, b) {
            b.insertIds = [
            ];
            b.success = !1;
            this.readChildNodes(a, b)
          },
          TransactionSummary: function (a, b) {
            b.success = !0
          },
          InsertResults: function (a, b) {
            this.readChildNodes(a, b)
          },
          Feature: function (a, b) {
            var c = {
              fids: [
              ]
            };
            this.readChildNodes(a, c);
            b.insertIds.push(c.fids[0])
          }
        }, OpenLayers.Format.WFST.v1.prototype.readers.wfs),
        gml: OpenLayers.Format.GML.v3.prototype.readers.gml,
        feature: OpenLayers.Format.GML.v3.prototype.readers.feature,
        ogc: OpenLayers.Format.Filter.v1_1_0.prototype.readers.ogc,
        ows: OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows
      },
      writers: {
        wfs: OpenLayers.Util.applyDefaults({
          GetFeature: function (a) {
            var b = OpenLayers.Format.WFST.v1.prototype.writers.wfs.GetFeature.apply(this, arguments);
            a && this.setAttributes(b, {
              resultType: a.resultType,
              startIndex: a.startIndex,
              count: a.count
            });
            return b
          },
          Query: function (a) {
            var a = OpenLayers.Util.extend({
              featureNS: this.featureNS,
              featurePrefix: this.featurePrefix,
              featureType: this.featureType,
              srsName: this.srsName
            }, a),
                b = a.featurePrefix,
                c = this.createElementNSPlus('wfs:Query', {
                  attributes: {
                    typeName: (b ? b + ':' : '') + a.featureType,
                    srsName: a.srsName
                  }
                });
            a.featureNS && c.setAttribute('xmlns:' + b, a.featureNS);
            if (a.propertyNames) for (var b = 0, d = a.propertyNames.length; b < d; b++) this.writeNode('wfs:PropertyName', {
              property: a.propertyNames[b]
            }, c);
            a.filter && (OpenLayers.Format.WFST.v1_1_0.prototype.setFilterProperty.call(this, a.filter), this.writeNode('ogc:Filter', a.filter, c));
            return c
          },
          PropertyName: function (a) {
            return this.createElementNSPlus('wfs:PropertyName', {
              value: a.property
            })
          }
        }, OpenLayers.Format.WFST.v1.prototype.writers.wfs),
        gml: OpenLayers.Format.GML.v3.prototype.writers.gml,
        feature: OpenLayers.Format.GML.v3.prototype.writers.feature,
        ogc: OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc
      },
      CLASS_NAME: 'OpenLayers.Format.WFST.v1_1_0'
    });
    OpenLayers.Protocol = OpenLayers.Class({
      format: null,
      options: null,
      autoDestroy: !0,
      defaultFilter: null,
      initialize: function (a) {
        a = a || {
        };
        OpenLayers.Util.extend(this, a);
        this.options = a
      },
      mergeWithDefaultFilter: function (a) {
        return a && this.defaultFilter ? new OpenLayers.Filter.Logical({
          type: OpenLayers.Filter.Logical.AND,
          filters: [
            this.defaultFilter,
            a
          ]
        })  : a || this.defaultFilter || void 0
      },
      destroy: function () {
        this.format = this.options = null
      },
      read: function (a) {
        a = a || {
        };
        a.filter = this.mergeWithDefaultFilter(a.filter)
      },
      create: function () {
      },
      update: function () {
      },
      'delete': function () {
      },
      commit: function () {
      },
      abort: function () {
      },
      createCallback: function (a, b, c) {
        return OpenLayers.Function.bind(function () {
          a.apply(this, [
            b,
            c
          ])
        }, this)
      },
      CLASS_NAME: 'OpenLayers.Protocol'
    });
    OpenLayers.Protocol.Response = OpenLayers.Class({
      code: null,
      requestType: null,
      last: !0,
      features: null,
      data: null,
      reqFeatures: null,
      priv: null,
      error: null,
      initialize: function (a) {
        OpenLayers.Util.extend(this, a)
      },
      success: function () {
        return 0 < this.code
      },
      CLASS_NAME: 'OpenLayers.Protocol.Response'
    });
    OpenLayers.Protocol.Response.SUCCESS = 1;
    OpenLayers.Protocol.Response.FAILURE = 0;
    OpenLayers.Protocol.Script = OpenLayers.Class(OpenLayers.Protocol, {
      url: null,
      params: null,
      callback: null,
      callbackTemplate: 'OpenLayers.Protocol.Script.registry.${id}',
      callbackKey: 'callback',
      callbackPrefix: '',
      scope: null,
      format: null,
      pendingRequests: null,
      srsInBBOX: !1,
      initialize: function (a) {
        a = a || {
        };
        this.params = {
        };
        this.pendingRequests = {
        };
        OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
        this.format || (this.format = new OpenLayers.Format.GeoJSON);
        if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
          var b = new OpenLayers.Format.QueryStringFilter({
            srsInBBOX: this.srsInBBOX
          });
          this.filterToParams = function (a, d) {
            return b.write(a, d)
          }
        }
      },
      read: function (a) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        a = OpenLayers.Util.applyDefaults(a, this.options);
        a.params = OpenLayers.Util.applyDefaults(a.params, this.options.params);
        a.filter && this.filterToParams && (a.params = this.filterToParams(a.filter, a.params));
        var b = new OpenLayers.Protocol.Response({
          requestType: 'read'
        }),
            c = this.createRequest(a.url, a.params, OpenLayers.Function.bind(function (c) {
              b.data = c;
              this.handleRead(b, a)
            }, this));
        b.priv = c;
        return b
      },
      createRequest: function (a, b, c) {
        var c = OpenLayers.Protocol.Script.register(c),
            d = OpenLayers.String.format(this.callbackTemplate, {
              id: c
            }),
            b = OpenLayers.Util.extend({
            }, b);
        b[this.callbackKey] = this.callbackPrefix + d;
        a = OpenLayers.Util.urlAppend(a, OpenLayers.Util.getParameterString(b));
        b = document.createElement('script');
        b.type = 'text/javascript';
        b.src = a;
        b.id = 'OpenLayers_Protocol_Script_' + c;
        this.pendingRequests[b.id] = b;
        document.getElementsByTagName('head') [0].appendChild(b);
        return b
      },
      destroyRequest: function (a) {
        OpenLayers.Protocol.Script.unregister(a.id.split('_').pop());
        delete this.pendingRequests[a.id];
        a.parentNode && a.parentNode.removeChild(a)
      },
      handleRead: function (a, b) {
        this.handleResponse(a, b)
      },
      handleResponse: function (a, b) {
        b.callback && (a.data ? (a.features = this.parseFeatures(a.data), a.code = OpenLayers.Protocol.Response.SUCCESS)  : a.code = OpenLayers.Protocol.Response.FAILURE, this.destroyRequest(a.priv), b.callback.call(b.scope, a))
      },
      parseFeatures: function (a) {
        return this.format.read(a)
      },
      abort: function (a) {
        if (a) this.destroyRequest(a.priv);
        else for (var b in this.pendingRequests) this.destroyRequest(this.pendingRequests[b])
          },
      destroy: function () {
        this.abort();
        delete this.params;
        delete this.format;
        OpenLayers.Protocol.prototype.destroy.apply(this)
      },
      CLASS_NAME: 'OpenLayers.Protocol.Script'
    }); (function () {
      var a = OpenLayers.Protocol.Script,
          b = 0;
      a.registry = {
      };
      a.register = function (c) {
        var d = 'c' + ++b;
        a.registry[d] = function () {
          c.apply(this, arguments)
        };
        return d
      };
      a.unregister = function (b) {
        delete a.registry[b]
      }
    }) ();
    OpenLayers.Control.Panel = OpenLayers.Class(OpenLayers.Control, {
      controls: null,
      autoActivate: !0,
      defaultControl: null,
      saveState: !1,
      allowDepress: !1,
      activeState: null,
      initialize: function (a) {
        OpenLayers.Control.prototype.initialize.apply(this, [
          a
        ]);
        this.controls = [
        ];
        this.activeState = {
        }
      },
      destroy: function () {
        this.map && this.map.events.unregister('buttonclick', this, this.onButtonClick);
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        for (var a, b = this.controls.length - 1; 0 <= b; b--) a = this.controls[b],
          a.events && a.events.un({
          activate: this.iconOn,
          deactivate: this.iconOff
        }),
          a.panel_div = null;
        this.activeState = null
      },
      activate: function () {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
          for (var a, b = 0, c = this.controls.length; b < c; b++) a = this.controls[b],
            (a === this.defaultControl || this.saveState && this.activeState[a.id]) && a.activate();
          !0 === this.saveState && (this.defaultControl = null);
          this.redraw();
          return !0
        }
        return !1
      },
      deactivate: function () {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
          for (var a, b = 0, c = this.controls.length; b < c; b++) a = this.controls[b],
            this.activeState[a.id] = a.deactivate();
          this.redraw();
          return !0
        }
        return !1
      },
      draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.outsideViewport ? (this.events.attachToElement(this.div), this.events.register('buttonclick', this, this.onButtonClick))  : this.map.events.register('buttonclick', this, this.onButtonClick);
        this.addControlsToMap(this.controls);
        return this.div
      },
      redraw: function () {
        for (var a = this.div.childNodes.length - 1; 0 <= a; a--) this.div.removeChild(this.div.childNodes[a]);
        this.div.innerHTML = '';
        if (this.active) for (var a = 0, b = this.controls.length; a < b; a++) this.div.appendChild(this.controls[a].panel_div)
          },
      activateControl: function (a) {
        if (!this.active) return !1;
        if (a.type == OpenLayers.Control.TYPE_BUTTON) a.trigger();
        else if (a.type == OpenLayers.Control.TYPE_TOGGLE) a.active ? a.deactivate()  : a.activate();
        else if (this.allowDepress && a.active) a.deactivate();
        else {
          for (var b, c = 0, d = this.controls.length; c < d; c++) b = this.controls[c],
            b != a && (b.type === OpenLayers.Control.TYPE_TOOL || null == b.type) && b.deactivate();
          a.activate()
        }
      },
      addControls: function (a) {
        OpenLayers.Util.isArray(a) || (a = [
          a
        ]);
        this.controls = this.controls.concat(a);
        for (var b = 0, c = a.length; b < c; b++) {
          var d = a[b],
              e = this.createControlMarkup(d);
          OpenLayers.Element.addClass(e, d.displayClass + 'ItemInactive');
          OpenLayers.Element.addClass(e, 'olButton');
          '' != d.title && !e.title && (e.title = d.title);
          d.panel_div = e
        }
        this.map && (this.addControlsToMap(a), this.redraw())
      },
      createControlMarkup: function () {
        return document.createElement('div')
      },
      addControlsToMap: function (a) {
        for (var b, c = 0, d = a.length; c < d; c++) b = a[c],
          !0 === b.autoActivate ? (b.autoActivate = !1, this.map.addControl(b), b.autoActivate = !0)  : (this.map.addControl(b), b.deactivate()),
          b.events.on({
          activate: this.iconOn,
          deactivate: this.iconOff
        })
          },
      iconOn: function () {
        var a = this.panel_div;
        a.className = a.className.replace(RegExp('\\b(' + this.displayClass + 'Item)Inactive\\b'), '$1Active')
      },
      iconOff: function () {
        var a = this.panel_div;
        a.className = a.className.replace(RegExp('\\b(' + this.displayClass + 'Item)Active\\b'), '$1Inactive')
      },
      onButtonClick: function (a) {
        for (var b = this.controls, a = a.buttonElement, c = b.length - 1; 0 <= c; --c) if (b[c].panel_div === a) {
          this.activateControl(b[c]);
          break
        }
      },
      getControlsBy: function (a, b) {
        var c = 'function' == typeof b.test;
        return OpenLayers.Array.filter(this.controls, function (d) {
          return d[a] == b || c && b.test(d[a])
        })
      },
      getControlsByName: function (a) {
        return this.getControlsBy('name', a)
      },
      getControlsByClass: function (a) {
        return this.getControlsBy('CLASS_NAME', a)
      },
      CLASS_NAME: 'OpenLayers.Control.Panel'
    });
    OpenLayers.Control.ZoomIn = OpenLayers.Class(OpenLayers.Control, {
      type: OpenLayers.Control.TYPE_BUTTON,
      trigger: function () {
        this.map.zoomIn()
      },
      CLASS_NAME: 'OpenLayers.Control.ZoomIn'
    });
    OpenLayers.Control.ZoomOut = OpenLayers.Class(OpenLayers.Control, {
      type: OpenLayers.Control.TYPE_BUTTON,
      trigger: function () {
        this.map.zoomOut()
      },
      CLASS_NAME: 'OpenLayers.Control.ZoomOut'
    });
    OpenLayers.Control.ZoomToMaxExtent = OpenLayers.Class(OpenLayers.Control, {
      type: OpenLayers.Control.TYPE_BUTTON,
      trigger: function () {
        this.map && this.map.zoomToMaxExtent()
      },
      CLASS_NAME: 'OpenLayers.Control.ZoomToMaxExtent'
    });
    OpenLayers.Control.ZoomPanel = OpenLayers.Class(OpenLayers.Control.Panel, {
      initialize: function (a) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [
          a
        ]);
        this.addControls([new OpenLayers.Control.ZoomIn,
                          new OpenLayers.Control.ZoomToMaxExtent,
                          new OpenLayers.Control.ZoomOut])
      },
      CLASS_NAME: 'OpenLayers.Control.ZoomPanel'
    });
    OpenLayers.Format.ArcXML = OpenLayers.Class(OpenLayers.Format.XML, {
      fontStyleKeys: 'antialiasing blockout font fontcolor fontsize fontstyle glowing interval outline printmode shadow transparency'.split(' '),
      request: null,
      response: null,
      initialize: function (a) {
        this.request = new OpenLayers.Format.ArcXML.Request;
        this.response = new OpenLayers.Format.ArcXML.Response;
        if (a) if ('feature' == a.requesttype) {
          this.request.get_image = null;
          var b = this.request.get_feature.query;
          this.addCoordSys(b.featurecoordsys, a.featureCoordSys);
          this.addCoordSys(b.filtercoordsys, a.filterCoordSys);
          a.polygon ? (b.isspatial = !0, b.spatialfilter.polygon = a.polygon)  : a.envelope && (b.isspatial = !0, b.spatialfilter.envelope = {
            minx: 0,
            miny: 0,
            maxx: 0,
            maxy: 0
          }, this.parseEnvelope(b.spatialfilter.envelope, a.envelope))
        } else 'image' == a.requesttype ? (this.request.get_feature = null, b = this.request.get_image.properties, this.parseEnvelope(b.envelope, a.envelope), this.addLayers(b.layerlist, a.layers), this.addImageSize(b.imagesize, a.tileSize), this.addCoordSys(b.featurecoordsys, a.featureCoordSys), this.addCoordSys(b.filtercoordsys, a.filterCoordSys))  : this.request = null;
        OpenLayers.Format.XML.prototype.initialize.apply(this, [
          a
        ])
      },
      parseEnvelope: function (a, b) {
        b && 4 == b.length && (a.minx = b[0], a.miny = b[1], a.maxx = b[2], a.maxy = b[3])
      },
      addLayers: function (a, b) {
        for (var c = 0, d = b.length; c < d; c++) a.push(b[c])
          },
      addImageSize: function (a, b) {
        null !== b && (a.width = b.w, a.height = b.h, a.printwidth = b.w, a.printheight = b.h)
      },
      addCoordSys: function (a, b) {
        'string' == typeof b ? (a.id = parseInt(b), a.string = b)  : 'object' == typeof b && null !== b.proj && (a.id = b.proj.srsProjNumber, a.string = b.proj.srsCode)
      },
      iserror: function (a) {
        var b = null;
        a ? (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]), a = a.documentElement.getElementsByTagName('ERROR'), b = null !== a && 0 < a.length)  : b = '' !== this.response.error;
        return b
      },
      read: function (a) {
        'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
          a
        ]));
        var b = null;
        a && a.documentElement && (b = 'ARCXML' == a.documentElement.nodeName ? a.documentElement : a.documentElement.getElementsByTagName('ARCXML') [0]);
        if (!b || 'parsererror' === b.firstChild.nodeName) {
          var c,
              d;
          try {
            c = a.firstChild.nodeValue,
              d = a.firstChild.childNodes[1].firstChild.nodeValue
          } catch (e) {
          }
          throw {
            message: 'Error parsing the ArcXML request',
            error: c,
            source: d
          };
        }
        return this.parseResponse(b)
      },
      write: function (a) {
        a || (a = this.request);
        var b = this.createElementNS('', 'ARCXML');
        b.setAttribute('version', '1.1');
        var c = this.createElementNS('', 'REQUEST');
        if (null != a.get_image) {
          var d = this.createElementNS('', 'GET_IMAGE');
          c.appendChild(d);
          var e = this.createElementNS('', 'PROPERTIES');
          d.appendChild(e);
          a = a.get_image.properties;
          null != a.featurecoordsys && (d = this.createElementNS('', 'FEATURECOORDSYS'), e.appendChild(d), 0 === a.featurecoordsys.id ? d.setAttribute('string', a.featurecoordsys.string)  : d.setAttribute('id', a.featurecoordsys.id));
          null != a.filtercoordsys && (d = this.createElementNS('', 'FILTERCOORDSYS'), e.appendChild(d), 0 === a.filtercoordsys.id ? d.setAttribute('string', a.filtercoordsys.string)  : d.setAttribute('id', a.filtercoordsys.id));
          null != a.envelope && (d = this.createElementNS('', 'ENVELOPE'), e.appendChild(d), d.setAttribute('minx', a.envelope.minx), d.setAttribute('miny', a.envelope.miny), d.setAttribute('maxx', a.envelope.maxx), d.setAttribute('maxy', a.envelope.maxy));
          d = this.createElementNS('', 'IMAGESIZE');
          e.appendChild(d);
          d.setAttribute('height', a.imagesize.height);
          d.setAttribute('width', a.imagesize.width);
          if (a.imagesize.height != a.imagesize.printheight || a.imagesize.width != a.imagesize.printwidth) d.setAttribute('printheight', a.imagesize.printheight),
            d.setArrtibute('printwidth', a.imagesize.printwidth);
          null != a.background && (d = this.createElementNS('', 'BACKGROUND'), e.appendChild(d), d.setAttribute('color', a.background.color.r + ',' + a.background.color.g + ',' + a.background.color.b), null !== a.background.transcolor && d.setAttribute('transcolor', a.background.transcolor.r + ',' + a.background.transcolor.g + ',' + a.background.transcolor.b));
          if (null != a.layerlist && 0 < a.layerlist.length) {
            d = this.createElementNS('', 'LAYERLIST');
            e.appendChild(d);
            for (e = 0; e < a.layerlist.length; e++) {
              var f = this.createElementNS('', 'LAYERDEF');
              d.appendChild(f);
              f.setAttribute('id', a.layerlist[e].id);
              f.setAttribute('visible', a.layerlist[e].visible);
              if ('object' == typeof a.layerlist[e].query) {
                var g = a.layerlist[e].query;
                if (0 > g.where.length) continue;
                var h = null,
                    h = 'boolean' == typeof g.spatialfilter && g.spatialfilter ? this.createElementNS('', 'SPATIALQUERY')  : this.createElementNS('', 'QUERY');
                h.setAttribute('where', g.where);
                'number' == typeof g.accuracy && 0 < g.accuracy && h.setAttribute('accuracy', g.accuracy);
                'number' == typeof g.featurelimit && 2000 > g.featurelimit && h.setAttribute('featurelimit', g.featurelimit);
                'string' == typeof g.subfields && '#ALL#' != g.subfields && h.setAttribute('subfields', g.subfields);
                'string' == typeof g.joinexpression && 0 < g.joinexpression.length && h.setAttribute('joinexpression', g.joinexpression);
                'string' == typeof g.jointables && 0 < g.jointables.length && h.setAttribute('jointables', g.jointables);
                f.appendChild(h)
              }
              'object' == typeof a.layerlist[e].renderer && this.addRenderer(f, a.layerlist[e].renderer)
            }
          }
        } else if (null != a.get_feature && (d = this.createElementNS('', 'GET_FEATURES'), d.setAttribute('outputmode', 'newxml'), d.setAttribute('checkesc', 'true'), a.get_feature.geometry ? d.setAttribute('geometry', a.get_feature.geometry)  : d.setAttribute('geometry', 'false'), a.get_feature.compact && d.setAttribute('compact', a.get_feature.compact), 'number' == a.get_feature.featurelimit && d.setAttribute('featurelimit', a.get_feature.featurelimit), d.setAttribute('globalenvelope', 'true'), c.appendChild(d), null != a.get_feature.layer && 0 < a.get_feature.layer.length && (e = this.createElementNS('', 'LAYER'), e.setAttribute('id', a.get_feature.layer), d.appendChild(e)), a = a.get_feature.query, null != a)) e = null,
          e = a.isspatial ? this.createElementNS('', 'SPATIALQUERY')  : this.createElementNS('', 'QUERY'),
          d.appendChild(e),
          'number' == typeof a.accuracy && e.setAttribute('accuracy', a.accuracy),
          null != a.featurecoordsys && (d = this.createElementNS('', 'FEATURECOORDSYS'), 0 == a.featurecoordsys.id ? d.setAttribute('string', a.featurecoordsys.string)  : d.setAttribute('id', a.featurecoordsys.id), e.appendChild(d)),
          null != a.filtercoordsys && (d = this.createElementNS('', 'FILTERCOORDSYS'), 0 === a.filtercoordsys.id ? d.setAttribute('string', a.filtercoordsys.string)  : d.setAttribute('id', a.filtercoordsys.id), e.appendChild(d)),
          0 < a.buffer && (d = this.createElementNS('', 'BUFFER'), d.setAttribute('distance', a.buffer), e.appendChild(d)),
          a.isspatial && (d = this.createElementNS('', 'SPATIALFILTER'), d.setAttribute('relation', a.spatialfilter.relation), e.appendChild(d), a.spatialfilter.envelope ? (f = this.createElementNS('', 'ENVELOPE'), f.setAttribute('minx', a.spatialfilter.envelope.minx), f.setAttribute('miny', a.spatialfilter.envelope.miny), f.setAttribute('maxx', a.spatialfilter.envelope.maxx), f.setAttribute('maxy', a.spatialfilter.envelope.maxy), d.appendChild(f))  : 'object' == typeof a.spatialfilter.polygon && d.appendChild(this.writePolygonGeometry(a.spatialfilter.polygon))),
          null != a.where && 0 < a.where.length && e.setAttribute('where', a.where);
        b.appendChild(c);
        return OpenLayers.Format.XML.prototype.write.apply(this, [
          b
        ])
      },
      addGroupRenderer: function (a, b) {
        var c = this.createElementNS('', 'GROUPRENDERER');
        a.appendChild(c);
        for (var d = 0; d < b.length; d++) this.addRenderer(c, b[d])
          },
      addRenderer: function (a, b) {
        if (OpenLayers.Util.isArray(b)) this.addGroupRenderer(a, b);
        else {
          var c = this.createElementNS('', b.type.toUpperCase() + 'RENDERER');
          a.appendChild(c);
          'VALUEMAPRENDERER' == c.tagName ? this.addValueMapRenderer(c, b)  : 'VALUEMAPLABELRENDERER' == c.tagName ? this.addValueMapLabelRenderer(c, b)  : 'SIMPLELABELRENDERER' == c.tagName ? this.addSimpleLabelRenderer(c, b)  : 'SCALEDEPENDENTRENDERER' == c.tagName && this.addScaleDependentRenderer(c, b)
        }
      },
      addScaleDependentRenderer: function (a, b) {
        ('string' == typeof b.lower || 'number' == typeof b.lower) && a.setAttribute('lower', b.lower);
        ('string' == typeof b.upper || 'number' == typeof b.upper) && a.setAttribute('upper', b.upper);
        this.addRenderer(a, b.renderer)
      },
      addValueMapLabelRenderer: function (a, b) {
        a.setAttribute('lookupfield', b.lookupfield);
        a.setAttribute('labelfield', b.labelfield);
        if ('object' == typeof b.exacts) for (var c = 0, d = b.exacts.length; c < d; c++) {
          var e = b.exacts[c],
              f = this.createElementNS('', 'EXACT');
          'string' == typeof e.value && f.setAttribute('value', e.value);
          'string' == typeof e.label && f.setAttribute('label', e.label);
          'string' == typeof e.method && f.setAttribute('method', e.method);
          a.appendChild(f);
          if ('object' == typeof e.symbol) {
            var g = null;
            'text' == e.symbol.type && (g = this.createElementNS('', 'TEXTSYMBOL'));
            if (null != g) {
              for (var h = this.fontStyleKeys, i = 0, j = h.length; i < j; i++) {
                var k = h[i];
                e.symbol[k] && g.setAttribute(k, e.symbol[k])
              }
              f.appendChild(g)
            }
          }
        }
      },
      addValueMapRenderer: function (a, b) {
        a.setAttribute('lookupfield', b.lookupfield);
        if ('object' == typeof b.ranges) for (var c = 0, d = b.ranges.length; c < d; c++) {
          var e = b.ranges[c],
              f = this.createElementNS('', 'RANGE');
          f.setAttribute('lower', e.lower);
          f.setAttribute('upper', e.upper);
          a.appendChild(f);
          if ('object' == typeof e.symbol) {
            var g = null;
            'simplepolygon' == e.symbol.type && (g = this.createElementNS('', 'SIMPLEPOLYGONSYMBOL'));
            null != g && ('string' == typeof e.symbol.boundarycolor && g.setAttribute('boundarycolor', e.symbol.boundarycolor), 'string' == typeof e.symbol.fillcolor && g.setAttribute('fillcolor', e.symbol.fillcolor), 'number' == typeof e.symbol.filltransparency && g.setAttribute('filltransparency', e.symbol.filltransparency), f.appendChild(g))
          }
        } else if ('object' == typeof b.exacts) {
          c = 0;
          for (d = b.exacts.length; c < d; c++) e = b.exacts[c],
            f = this.createElementNS('', 'EXACT'),
            'string' == typeof e.value && f.setAttribute('value', e.value),
            'string' == typeof e.label && f.setAttribute('label', e.label),
            'string' == typeof e.method && f.setAttribute('method', e.method),
            a.appendChild(f),
            'object' == typeof e.symbol && (g = null, 'simplemarker' == e.symbol.type && (g = this.createElementNS('', 'SIMPLEMARKERSYMBOL')), null != g && ('string' == typeof e.symbol.antialiasing && g.setAttribute('antialiasing', e.symbol.antialiasing), 'string' == typeof e.symbol.color && g.setAttribute('color', e.symbol.color), 'string' == typeof e.symbol.outline && g.setAttribute('outline', e.symbol.outline), 'string' == typeof e.symbol.overlap && g.setAttribute('overlap', e.symbol.overlap), 'string' == typeof e.symbol.shadow && g.setAttribute('shadow', e.symbol.shadow), 'number' == typeof e.symbol.transparency && g.setAttribute('transparency', e.symbol.transparency), 'string' == typeof e.symbol.usecentroid && g.setAttribute('usecentroid', e.symbol.usecentroid), 'number' == typeof e.symbol.width && g.setAttribute('width', e.symbol.width), f.appendChild(g)))
            }
      },
      addSimpleLabelRenderer: function (a, b) {
        a.setAttribute('field', b.field);
        for (var c = 'featureweight howmanylabels labelbufferratio labelpriorities labelweight linelabelposition rotationalangles'.split(' '), d = 0, e = c.length; d < e; d++) {
          var f = c[d];
          b[f] && a.setAttribute(f, b[f])
        }
        if ('text' == b.symbol.type) {
          var g = b.symbol,
              h = this.createElementNS('', 'TEXTSYMBOL');
          a.appendChild(h);
          c = this.fontStyleKeys;
          d = 0;
          for (e = c.length; d < e; d++) f = c[d],
            g[f] && h.setAttribute(f, b[f])
            }
      },
      writePolygonGeometry: function (a) {
        if (!(a instanceof OpenLayers.Geometry.Polygon)) throw {
          message: 'Cannot write polygon geometry to ArcXML with an ' + a.CLASS_NAME + ' object.',
          geometry: a
        };
        for (var b = this.createElementNS('', 'POLYGON'), c = 0, d = a.components.length; c < d; c++) {
          for (var e = a.components[c], f = this.createElementNS('', 'RING'), g = 0, h = e.components.length; g < h; g++) {
            var i = e.components[g],
                j = this.createElementNS('', 'POINT');
            j.setAttribute('x', i.x);
            j.setAttribute('y', i.y);
            f.appendChild(j)
          }
          b.appendChild(f)
        }
        return b
      },
      parseResponse: function (a) {
        'string' == typeof a && (a = (new OpenLayers.Format.XML).read(a));
        var b = new OpenLayers.Format.ArcXML.Response,
            c = a.getElementsByTagName('ERROR');
        if (null != c && 0 < c.length) b.error = this.getChildValue(c, 'Unknown error.');
        else {
          c = a.getElementsByTagName('RESPONSE');
          if (null == c || 0 == c.length) return b.error = 'No RESPONSE tag found in ArcXML response.',
            b;
          var d = c[0].firstChild.nodeName;
          '#text' == d && (d = c[0].firstChild.nextSibling.nodeName);
          if ('IMAGE' ==
              d) c = a.getElementsByTagName('ENVELOPE'),
            a = a.getElementsByTagName('OUTPUT'),
            null == c || 0 == c.length ? b.error = 'No ENVELOPE tag found in ArcXML response.' : null == a || 0 == a.length ? b.error = 'No OUTPUT tag found in ArcXML response.' : (c = this.parseAttributes(c[0]), d = this.parseAttributes(a[0]), b.image = 'string' == typeof d.type ? {
            envelope: c,
            output: {
              type: d.type,
              data: this.getChildValue(a[0])
            }
          }
       : {
            envelope: c,
            output: d
          });
          else if ('FEATURES' == d) {
            if (a = c[0].getElementsByTagName('FEATURES'), c = a[0].getElementsByTagName('FEATURECOUNT'), b.features.featurecount = c[0].getAttribute('count'), 0 < b.features.featurecount) {
              c = a[0].getElementsByTagName('ENVELOPE');
              b.features.envelope = this.parseAttributes(c[0], 'number');
              a = a[0].getElementsByTagName('FEATURE');
              for (c = 0; c < a.length; c++) {
                for (var d = new OpenLayers.Feature.Vector, e = a[c].getElementsByTagName('FIELD'), f = 0; f < e.length; f++) {
                  var g = e[f].getAttribute('name'),
                      h = e[f].getAttribute('value');
                  d.attributes[g] = h
                }
                e = a[c].getElementsByTagName('POLYGON');
                if (0 < e.length) {
                  e = e[0].getElementsByTagName('RING');
                  f = [
                  ];
                  for (g = 0; g < e.length; g++) {
                    h = [
                    ];
                    h.push(this.parsePointGeometry(e[g]));
                    for (var i = e[g].getElementsByTagName('HOLE'), j = 0; j < i.length; j++) h.push(this.parsePointGeometry(i[j]));
                    f.push(new OpenLayers.Geometry.Polygon(h))
                  }
                  d.geometry = 1 == f.length ? f[0] : new OpenLayers.Geometry.MultiPolygon(f)
                }
                b.features.feature.push(d)
              }
            }
          } else b.error = 'Unidentified response type.'
            }
        return b
      },
      parseAttributes: function (a, b) {
        for (var c = {
        }, d = 0; d < a.attributes.length; d++) c[a.attributes[d].nodeName] = 'number' == b ? parseFloat(a.attributes[d].nodeValue)  :
        a.attributes[d].nodeValue;
        return c
      },
      parsePointGeometry: function (a) {
        var b = [
        ],
            c = a.getElementsByTagName('COORDS');
        if (0 < c.length) {
          a = this.getChildValue(c[0]);
          a = a.split(/;/);
          for (c = 0; c < a.length; c++) {
            var d = a[c].split(/ /);
            b.push(new OpenLayers.Geometry.Point(d[0], d[1]))
          }
        } else if (a = a.getElementsByTagName('POINT'), 0 < a.length) for (c = 0; c < a.length; c++) b.push(new OpenLayers.Geometry.Point(parseFloat(a[c].getAttribute('x')), parseFloat(a[c].getAttribute('y'))));
        return new OpenLayers.Geometry.LinearRing(b)
      },
      CLASS_NAME: 'OpenLayers.Format.ArcXML'
    });
    OpenLayers.Format.ArcXML.Request = OpenLayers.Class({
      initialize: function () {
        return OpenLayers.Util.extend(this, {
          get_image: {
            properties: {
              background: null,
              draw: !0,
              envelope: {
                minx: 0,
                miny: 0,
                maxx: 0,
                maxy: 0
              },
              featurecoordsys: {
                id: 0,
                string: '',
                datumtransformid: 0,
                datumtransformstring: ''
              },
              filtercoordsys: {
                id: 0,
                string: '',
                datumtransformid: 0,
                datumtransformstring: ''
              },
              imagesize: {
                height: 0,
                width: 0,
                dpi: 96,
                printheight: 0,
                printwidth: 0,
                scalesymbols: !1
              },
              layerlist: [
              ],
              output: {
                baseurl: '',
                legendbaseurl: '',
                legendname: '',
                legendpath: '',
                legendurl: '',
                name: '',
                path: '',
                type: 'jpg',
                url: ''
              }
            }
          },
          get_feature: {
            layer: '',
            query: {
              isspatial: !1,
              featurecoordsys: {
                id: 0,
                string: '',
                datumtransformid: 0,
                datumtransformstring: ''
              },
              filtercoordsys: {
                id: 0,
                string: '',
                datumtransformid: 0,
                datumtransformstring: ''
              },
              buffer: 0,
              where: '',
              spatialfilter: {
                relation: 'envelope_intersection',
                envelope: null
              }
            }
          },
          environment: {
            separators: {
              cs: ' ',
              ts: ';'
            }
          },
          layer: [
          ],
          workspaces: [
          ]
        })
      },
      CLASS_NAME: 'OpenLayers.Format.ArcXML.Request'
    });
    OpenLayers.Format.ArcXML.Response = OpenLayers.Class({
      initialize: function () {
        return OpenLayers.Util.extend(this, {
          image: {
            envelope: null,
            output: ''
          },
          features: {
            featurecount: 0,
            envelope: null,
            feature: [
            ]
          },
          error: ''
        })
      },
      CLASS_NAME: 'OpenLayers.Format.ArcXML.Response'
    });
    OpenLayers.ProxyHost = '';
    OpenLayers.Request = {
      DEFAULT_CONFIG: {
        method: 'GET',
        url: window.location.href,
        async: !0,
        user: void 0,
        password: void 0,
        params: null,
        proxy: OpenLayers.ProxyHost,
        headers: {
      },
      data: null,
      callback: function () {
      },
      success: null,
      failure: null,
      scope: null
    },
      URL_SPLIT_REGEX: /([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,
        events: new OpenLayers.Events(this),
          makeSameOrigin: function (a, b) {
            var c = 0 !== a.indexOf('http'),
                d = !c && a.match(this.URL_SPLIT_REGEX);
            if (d) {
              var e = window.location,
                  c = d[1] == e.protocol && d[3] == e.hostname,
                  d = d[4],
                  e = e.port;
              if (80 != d && '' != d || '80' != e && '' != e) c = c && d == e
                }
            c || (b ? a = 'function' == typeof b ? b(a)  : b + encodeURIComponent(a)  : OpenLayers.Console.warn(OpenLayers.i18n('proxyNeeded'), {
              url: a
            }));
            return a
          },
            issue: function (a) {
              var b = OpenLayers.Util.extend(this.DEFAULT_CONFIG, {
                proxy: OpenLayers.ProxyHost
              }),
                  a = OpenLayers.Util.applyDefaults(a, b),
                  b = !1,
                  c;
              for (c in a.headers) a.headers.hasOwnProperty(c) && 'x-requested-with' === c.toLowerCase() && (b = !0);
              !1 === b && (a.headers['X-Requested-With'] = 'XMLHttpRequest');
              var d = new OpenLayers.Request.XMLHttpRequest,
                  e = OpenLayers.Util.urlAppend(a.url, OpenLayers.Util.getParameterString(a.params || {
                  })),
                  e = OpenLayers.Request.makeSameOrigin(e, a.proxy);
              d.open(a.method, e, a.async, a.user, a.password);
              for (var f in a.headers) d.setRequestHeader(f, a.headers[f]);
              var g = this.events,
                  h = this;
              d.onreadystatechange = function () {
                d.readyState == OpenLayers.Request.XMLHttpRequest.DONE && !1 !== g.triggerEvent('complete', {
                  request: d,
                  config: a,
                  requestUrl: e
                }) && h.runCallbacks({
                  request: d,
                  config: a,
                  requestUrl: e
                })
              };
              !1 === a.async ? d.send(a.data)  : window.setTimeout(function () {
                0 !==
                  d.readyState && d.send(a.data)
              }, 0);
              return d
            },
              runCallbacks: function (a) {
                var b = a.request,
                    c = a.config,
                    d = c.scope ? OpenLayers.Function.bind(c.callback, c.scope)  : c.callback,
                    e;
                c.success && (e = c.scope ? OpenLayers.Function.bind(c.success, c.scope)  : c.success);
                var f;
                c.failure && (f = c.scope ? OpenLayers.Function.bind(c.failure, c.scope)  : c.failure);
                'file:' == OpenLayers.Util.createUrlObject(c.url).protocol && b.responseText && (b.status = 200);
                d(b);
                if (!b.status || 200 <= b.status && 300 > b.status) this.events.triggerEvent('success', a),
                  e && e(b);
                if (b.status && (200 > b.status || 300 <= b.status)) this.events.triggerEvent('failure', a),
                  f && f(b)
                  },
                    GET: function (a) {
                      a = OpenLayers.Util.extend(a, {
                        method: 'GET'
                      });
                      return OpenLayers.Request.issue(a)
                    },
                      POST: function (a) {
                        a = OpenLayers.Util.extend(a, {
                          method: 'POST'
                        });
                        a.headers = a.headers ? a.headers : {
                        };
                        'CONTENT-TYPE' in OpenLayers.Util.upperCaseObject(a.headers) || (a.headers['Content-Type'] = 'application/xml');
                        return OpenLayers.Request.issue(a)
                      },
                        PUT: function (a) {
                          a = OpenLayers.Util.extend(a, {
                            method: 'PUT'
                          });
                          a.headers = a.headers ?
                            a.headers : {
                          };
                          'CONTENT-TYPE' in OpenLayers.Util.upperCaseObject(a.headers) || (a.headers['Content-Type'] = 'application/xml');
                          return OpenLayers.Request.issue(a)
                        },
                          DELETE: function (a) {
                            a = OpenLayers.Util.extend(a, {
                              method: 'DELETE'
                            });
                            return OpenLayers.Request.issue(a)
                          },
                            HEAD: function (a) {
                              a = OpenLayers.Util.extend(a, {
                                method: 'HEAD'
                              });
                              return OpenLayers.Request.issue(a)
                            },
                              OPTIONS: function (a) {
                                a = OpenLayers.Util.extend(a, {
                                  method: 'OPTIONS'
                                });
                                return OpenLayers.Request.issue(a)
                              }
      };
      OpenLayers.Layer.ArcIMS = OpenLayers.Class(OpenLayers.Layer.Grid, {
        DEFAULT_PARAMS: {
          ClientVersion: '9.2',
          ServiceName: ''
        },
        featureCoordSys: '4326',
        filterCoordSys: '4326',
        layers: null,
        async: !0,
        name: 'ArcIMS',
        isBaseLayer: !0,
        DEFAULT_OPTIONS: {
          tileSize: new OpenLayers.Size(512, 512),
          featureCoordSys: '4326',
          filterCoordSys: '4326',
          layers: null,
          isBaseLayer: !0,
          async: !0,
          name: 'ArcIMS'
        },
        initialize: function (a, b, c) {
          this.tileSize = new OpenLayers.Size(512, 512);
          this.params = OpenLayers.Util.applyDefaults({
            ServiceName: c.serviceName
          }, this.DEFAULT_PARAMS);
          this.options = OpenLayers.Util.applyDefaults(c, this.DEFAULT_OPTIONS);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            a,
            b,
            this.params,
            c
          ]);
          if (this.transparent && (this.isBaseLayer || (this.isBaseLayer = !1), 'image/jpeg' == this.format)) this.format = OpenLayers.Util.alphaHack() ? 'image/gif' : 'image/png';
          null === this.options.layers && (this.options.layers = [
          ])
        },
        getURL: function (a) {
          var b = '',
              a = this.adjustBounds(a),
              a = new OpenLayers.Format.ArcXML(OpenLayers.Util.extend(this.options, {
                requesttype: 'image',
                envelope: a.toArray(),
                tileSize: this.tileSize
              })),
              a = new OpenLayers.Request.POST({
                url: this.getFullRequestString(),
                data: a.write(),
                async: !1
              });
          if (null != a) {
            b = a.responseXML;
            if (!b || !b.documentElement) b = a.responseText;
            b = this.getUrlOrImage((new OpenLayers.Format.ArcXML).read(b).image.output)
          }
          return b
        },
        getURLasync: function (a, b, c) {
          a = this.adjustBounds(a);
          a = new OpenLayers.Format.ArcXML(OpenLayers.Util.extend(this.options, {
            requesttype: 'image',
            envelope: a.toArray(),
            tileSize: this.tileSize
          }));
          OpenLayers.Request.POST({
            url: this.getFullRequestString(),
            async: !0,
            data: a.write(),
            callback: function (a) {
              var e = a.responseXML;
              if (!e || !e.documentElement) e = a.responseText;
              a = (new OpenLayers.Format.ArcXML).read(e);
              b.call(c, this.getUrlOrImage(a.image.output))
            },
            scope: this
          })
        },
        getUrlOrImage: function (a) {
          var b = '';
          a.url ? b = a.url : a.data && (b = 'data:image/' + a.type + ';base64,' + a.data);
          return b
        },
        setLayerQuery: function (a, b) {
          for (var c = 0; c < this.options.layers.length; c++) if (a == this.options.layers[c].id) {
            this.options.layers[c].query = b;
            return
          }
          this.options.layers.push({
            id: a,
            visible: !0,
            query: b
          })
        },
        getFeatureInfo: function (a, b, c) {
          var d = c.buffer || 1,
              e = c.callback || function () {
              },
              f = c.scope || window,
              g = {
              };
          OpenLayers.Util.extend(g, this.options);
          g.requesttype = 'feature';
          a instanceof OpenLayers.LonLat ? (g.polygon = null, g.envelope = [
            a.lon - d,
            a.lat - d,
            a.lon + d,
            a.lat + d
          ])  : a instanceof OpenLayers.Geometry.Polygon && (g.envelope = null, g.polygon = a);
          var h = new OpenLayers.Format.ArcXML(g);
          OpenLayers.Util.extend(h.request.get_feature, c);
          h.request.get_feature.layer = b.id;
          'number' == typeof b.query.accuracy ? h.request.get_feature.query.accuracy = b.query.accuracy : (a = this.map.getCenter(), c = this.map.getViewPortPxFromLonLat(a), c.x++, c = this.map.getLonLatFromPixel(c), h.request.get_feature.query.accuracy = c.lon - a.lon);
          h.request.get_feature.query.where = b.query.where;
          h.request.get_feature.query.spatialfilter.relation = 'area_intersection';
          OpenLayers.Request.POST({
            url: this.getFullRequestString({
              CustomService: 'Query'
            }),
            data: h.write(),
            callback: function (a) {
              a = h.parseResponse(a.responseText);
              h.iserror() ? e.call(f, null)  : e.call(f, a.features)
            }
          })
        },
        clone: function (a) {
          null ==
            a && (a = new OpenLayers.Layer.ArcIMS(this.name, this.url, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        CLASS_NAME: 'OpenLayers.Layer.ArcIMS'
      });
      OpenLayers.Format.OWSCommon.v1_1_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1, {
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          xlink: 'http://www.w3.org/1999/xlink'
        },
        readers: {
          ows: OpenLayers.Util.applyDefaults({
            ExceptionReport: function (a, b) {
              b.exceptionReport = {
                version: a.getAttribute('version'),
                language: a.getAttribute('xml:lang'),
                exceptions: [
                ]
              };
              this.readChildNodes(a, b.exceptionReport)
            },
            AllowedValues: function (a, b) {
              b.allowedValues = {
              };
              this.readChildNodes(a, b.allowedValues)
            },
            AnyValue: function (a, b) {
              b.anyValue = !0
            },
            DataType: function (a, b) {
              b.dataType = this.getChildValue(a)
            },
            Range: function (a, b) {
              b.range = {
              };
              this.readChildNodes(a, b.range)
            },
            MinimumValue: function (a, b) {
              b.minValue = this.getChildValue(a)
            },
            MaximumValue: function (a, b) {
              b.maxValue = this.getChildValue(a)
            },
            Identifier: function (a, b) {
              b.identifier = this.getChildValue(a)
            },
            SupportedCRS: function (a, b) {
              b.supportedCRS = this.getChildValue(a)
            }
          }, OpenLayers.Format.OWSCommon.v1.prototype.readers.ows)
        },
        writers: {
          ows: OpenLayers.Util.applyDefaults({
            Range: function (a) {
              var b = this.createElementNSPlus('ows:Range', {
                attributes: {
                  'ows:rangeClosure': a.closure
                }
              });
              this.writeNode('ows:MinimumValue', a.minValue, b);
              this.writeNode('ows:MaximumValue', a.maxValue, b);
              return b
            },
            MinimumValue: function (a) {
              return this.createElementNSPlus('ows:MinimumValue', {
                value: a
              })
            },
            MaximumValue: function (a) {
              return this.createElementNSPlus('ows:MaximumValue', {
                value: a
              })
            },
            Value: function (a) {
              return this.createElementNSPlus('ows:Value', {
                value: a
              })
            }
          }, OpenLayers.Format.OWSCommon.v1.prototype.writers.ows)
        },
        CLASS_NAME: 'OpenLayers.Format.OWSCommon.v1_1_0'
      });
      OpenLayers.Format.WCSGetCoverage = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          wcs: 'http://www.opengis.net/wcs/1.1',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        VERSION: '1.1.2',
        schemaLocation: 'http://www.opengis.net/wcs/1.1 http://schemas.opengis.net/wcs/1.1/wcsGetCoverage.xsd',
        write: function (a) {
          a = this.writeNode('wcs:GetCoverage', a);
          this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        writers: {
          wcs: {
            GetCoverage: function (a) {
              var b = this.createElementNSPlus('wcs:GetCoverage', {
                attributes: {
                  version: a.version || this.VERSION,
                  service: 'WCS'
                }
              });
              this.writeNode('ows:Identifier', a.identifier, b);
              this.writeNode('wcs:DomainSubset', a.domainSubset, b);
              this.writeNode('wcs:Output', a.output, b);
              return b
            },
            DomainSubset: function (a) {
              var b = this.createElementNSPlus('wcs:DomainSubset', {
              });
              this.writeNode('ows:BoundingBox', a.boundingBox, b);
              a.temporalSubset && this.writeNode('wcs:TemporalSubset', a.temporalSubset, b);
              return b
            },
            TemporalSubset: function (a) {
              for (var b = this.createElementNSPlus('wcs:TemporalSubset', {
              }), c = 0, d = a.timePeriods.length; c < d; ++c) this.writeNode('wcs:TimePeriod', a.timePeriods[c], b);
              return b
            },
            TimePeriod: function (a) {
              var b = this.createElementNSPlus('wcs:TimePeriod', {
              });
              this.writeNode('wcs:BeginPosition', a.begin, b);
              this.writeNode('wcs:EndPosition', a.end, b);
              a.resolution && this.writeNode('wcs:TimeResolution', a.resolution, b);
              return b
            },
            BeginPosition: function (a) {
              return this.createElementNSPlus('wcs:BeginPosition', {
                value: a
              })
            },
            EndPosition: function (a) {
              return this.createElementNSPlus('wcs:EndPosition', {
                value: a
              })
            },
            TimeResolution: function (a) {
              return this.createElementNSPlus('wcs:TimeResolution', {
                value: a
              })
            },
            Output: function (a) {
              var b = this.createElementNSPlus('wcs:Output', {
                attributes: {
                  format: a.format,
                  store: a.store
                }
              });
              a.gridCRS && this.writeNode('wcs:GridCRS', a.gridCRS, b);
              return b
            },
            GridCRS: function (a) {
              var b = this.createElementNSPlus('wcs:GridCRS', {
              });
              this.writeNode('wcs:GridBaseCRS', a.baseCRS, b);
              a.type && this.writeNode('wcs:GridType', a.type, b);
              a.origin && this.writeNode('wcs:GridOrigin', a.origin, b);
              this.writeNode('wcs:GridOffsets', a.offsets, b);
              a.CS && this.writeNode('wcs:GridCS', a.CS, b);
              return b
            },
            GridBaseCRS: function (a) {
              return this.createElementNSPlus('wcs:GridBaseCRS', {
                value: a
              })
            },
            GridOrigin: function (a) {
              return this.createElementNSPlus('wcs:GridOrigin', {
                value: a
              })
            },
            GridType: function (a) {
              return this.createElementNSPlus('wcs:GridType', {
                value: a
              })
            },
            GridOffsets: function (a) {
              return this.createElementNSPlus('wcs:GridOffsets', {
                value: a
              })
            },
            GridCS: function (a) {
              return this.createElementNSPlus('wcs:GridCS', {
                value: a
              })
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WCSGetCoverage'
      });
      OpenLayers.Format.WPSExecute = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          gml: 'http://www.opengis.net/gml',
          wps: 'http://www.opengis.net/wps/1.0.0',
          wfs: 'http://www.opengis.net/wfs',
          ogc: 'http://www.opengis.net/ogc',
          wcs: 'http://www.opengis.net/wcs',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        VERSION: '1.0.0',
        schemaLocation: 'http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd',
        schemaLocationAttr: function () {
        },
        write: function (a) {
          var b;
          window.ActiveXObject ? this.xmldom = b = new ActiveXObject('Microsoft.XMLDOM')  : b = document.implementation.createDocument('', '', null);
          a = this.writeNode('wps:Execute', a, b);
          this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        writers: {
          wps: {
            Execute: function (a) {
              var b = this.createElementNSPlus('wps:Execute', {
                attributes: {
                  version: this.VERSION,
                  service: 'WPS'
                }
              });
              this.writeNode('ows:Identifier', a.identifier, b);
              this.writeNode('wps:DataInputs', a.dataInputs, b);
              this.writeNode('wps:ResponseForm', a.responseForm, b);
              return b
            },
            ResponseForm: function (a) {
              var b = this.createElementNSPlus('wps:ResponseForm', {
              });
              a.rawDataOutput && this.writeNode('wps:RawDataOutput', a.rawDataOutput, b);
              a.responseDocument && this.writeNode('wps:ResponseDocument', a.responseDocument, b);
              return b
            },
            ResponseDocument: function (a) {
              var b = this.createElementNSPlus('wps:ResponseDocument', {
                attributes: {
                  storeExecuteResponse: a.storeExecuteResponse,
                  lineage: a.lineage,
                  status: a.status
                }
              });
              a.output && this.writeNode('wps:Output', a.output, b);
              return b
            },
            Output: function (a) {
              var b = this.createElementNSPlus('wps:Output', {
                attributes: {
                  asReference: a.asReference
                }
              });
              this.writeNode('ows:Identifier', a.identifier, b);
              this.writeNode('ows:Title', a.title, b);
              this.writeNode('ows:Abstract', a['abstract'], b);
              return b
            },
            RawDataOutput: function (a) {
              var b = this.createElementNSPlus('wps:RawDataOutput', {
                attributes: {
                  mimeType: a.mimeType
                }
              });
              this.writeNode('ows:Identifier', a.identifier, b);
              return b
            },
            DataInputs: function (a) {
              for (var b = this.createElementNSPlus('wps:DataInputs', {
              }), c = 0, d = a.length; c < d; ++c) this.writeNode('wps:Input', a[c], b);
              return b
            },
            Input: function (a) {
              var b = this.createElementNSPlus('wps:Input', {
              });
              this.writeNode('ows:Identifier', a.identifier, b);
              a.title && this.writeNode('ows:Title', a.title, b);
              a.data && this.writeNode('wps:Data', a.data, b);
              a.reference && this.writeNode('wps:Reference', a.reference, b);
              return b
            },
            Data: function (a) {
              var b = this.createElementNSPlus('wps:Data', {
              });
              a.literalData ?
                this.writeNode('wps:LiteralData', a.literalData, b)  : a.complexData && this.writeNode('wps:ComplexData', a.complexData, b);
              return b
            },
            LiteralData: function (a) {
              return this.createElementNSPlus('wps:LiteralData', {
                attributes: {
                  uom: a.uom
                },
                value: a.value
              })
            },
            ComplexData: function (a) {
              var b = this.createElementNSPlus('wps:ComplexData', {
                attributes: {
                  mimeType: a.mimeType,
                  encoding: a.encoding,
                  schema: a.schema
                }
              }),
                  c = a.value;
              'string' === typeof c ? b.appendChild(this.getXMLDoc().createCDATASection(a.value))  : b.appendChild(c);
              return b
            },
            Reference: function (a) {
              var b = this.createElementNSPlus('wps:Reference', {
                attributes: {
                  mimeType: a.mimeType,
                  'xlink:href': a.href,
                  method: a.method,
                  encoding: a.encoding,
                  schema: a.schema
                }
              });
              a.body && this.writeNode('wps:Body', a.body, b);
              return b
            },
            Body: function (a) {
              var b = this.createElementNSPlus('wps:Body', {
              });
              a.wcs ? this.writeNode('wcs:GetCoverage', a.wcs, b)  : a.wfs ? (this.featureType = a.wfs.featureType, this.version = a.wfs.version, this.writeNode('wfs:GetFeature', a.wfs, b))  : this.writeNode('wps:Execute', a, b);
              return b
            }
          },
          wcs: OpenLayers.Format.WCSGetCoverage.prototype.writers.wcs,
          wfs: OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs,
          ogc: OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc,
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WPSExecute'
      });
      OpenLayers.Format.WFSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.1.0',
        errorProperty: 'service',
        CLASS_NAME: 'OpenLayers.Format.WFSCapabilities'
      });
      OpenLayers.Format.WFSCapabilities.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          wfs: 'http://www.opengis.net/wfs',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance',
          ows: 'http://www.opengis.net/ows'
        },
        defaultPrefix: 'wfs',
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          wfs: {
            WFS_Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            FeatureTypeList: function (a, b) {
              b.featureTypeList = {
                featureTypes: [
                ]
              };
              this.readChildNodes(a, b.featureTypeList)
            },
            FeatureType: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.featureTypes.push(c)
            },
            Name: function (a, b) {
              var c = this.getChildValue(a);
              c && (c = c.split(':'), b.name = c.pop(), 0 < c.length && (b.featureNS = this.lookupNamespaceURI(a, c[0])))
            },
            Title: function (a, b) {
              var c = this.getChildValue(a);
              c && (b.title = c)
            },
            Abstract: function (a, b) {
              var c = this.getChildValue(a);
              c && (b['abstract'] = c)
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.WFSCapabilities.v1'
      });
      OpenLayers.Format.WFSCapabilities.v1_1_0 = OpenLayers.Class(OpenLayers.Format.WFSCapabilities.v1, {
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        readers: {
          wfs: OpenLayers.Util.applyDefaults({
            DefaultSRS: function (a, b) {
              var c = this.getChildValue(a);
              c && (b.srs = c)
            }
          }, OpenLayers.Format.WFSCapabilities.v1.prototype.readers.wfs),
          ows: OpenLayers.Format.OWSCommon.v1.prototype.readers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WFSCapabilities.v1_1_0'
      });
      OpenLayers.Layer.Image = OpenLayers.Class(OpenLayers.Layer, {
        isBaseLayer: !0,
        url: null,
        extent: null,
        size: null,
        tile: null,
        aspectRatio: null,
        initialize: function (a, b, c, d, e) {
          this.url = b;
          this.maxExtent = this.extent = c;
          this.size = d;
          OpenLayers.Layer.prototype.initialize.apply(this, [
            a,
            e
          ]);
          this.aspectRatio = this.extent.getHeight() / this.size.h / (this.extent.getWidth() / this.size.w)
        },
        destroy: function () {
          this.tile && (this.removeTileMonitoringHooks(this.tile), this.tile.destroy(), this.tile = null);
          OpenLayers.Layer.prototype.destroy.apply(this, arguments)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.Image(this.name, this.url, this.extent, this.size, this.getOptions()));
          return a = OpenLayers.Layer.prototype.clone.apply(this, [
            a
          ])
        },
        setMap: function (a) {
          null == this.options.maxResolution && (this.options.maxResolution = this.aspectRatio * this.extent.getWidth() / this.size.w);
          OpenLayers.Layer.prototype.setMap.apply(this, arguments)
        },
        moveTo: function (a, b, c) {
          OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
          var d = null == this.tile;
          if (b || d) {
            this.setTileSize();
            var e = this.map.getLayerPxFromLonLat({
              lon: this.extent.left,
              lat: this.extent.top
            });
            d ? (this.tile = new OpenLayers.Tile.Image(this, e, this.extent, null, this.tileSize), this.addTileMonitoringHooks(this.tile))  : (this.tile.size = this.tileSize.clone(), this.tile.position = e.clone());
            this.tile.draw()
          }
        },
        setTileSize: function () {
          var a = this.extent.getWidth() / this.map.getResolution(),
              b = this.extent.getHeight() / this.map.getResolution();
          this.tileSize = new OpenLayers.Size(a, b)
        },
        addTileMonitoringHooks: function (a) {
          a.onLoadStart = function () {
            this.events.triggerEvent('loadstart')
          };
          a.events.register('loadstart', this, a.onLoadStart);
          a.onLoadEnd = function () {
            this.events.triggerEvent('loadend')
          };
          a.events.register('loadend', this, a.onLoadEnd);
          a.events.register('unload', this, a.onLoadEnd)
        },
        removeTileMonitoringHooks: function (a) {
          a.unload();
          a.events.un({
            loadstart: a.onLoadStart,
            loadend: a.onLoadEnd,
            unload: a.onLoadEnd,
            scope: this
          })
        },
        setUrl: function (a) {
          this.url = a;
          this.tile.draw()
        },
        getURL: function () {
          return this.url
        },
        CLASS_NAME: 'OpenLayers.Layer.Image'
      });
      OpenLayers.Strategy = OpenLayers.Class({
        layer: null,
        options: null,
        active: null,
        autoActivate: !0,
        autoDestroy: !0,
        initialize: function (a) {
          OpenLayers.Util.extend(this, a);
          this.options = a;
          this.active = !1
        },
        destroy: function () {
          this.deactivate();
          this.options = this.layer = null
        },
        setLayer: function (a) {
          this.layer = a
        },
        activate: function () {
          return !this.active ? this.active = !0 : !1
        },
        deactivate: function () {
          return this.active ? (this.active = !1, !0)  : !1
        },
        CLASS_NAME: 'OpenLayers.Strategy'
      });
      OpenLayers.Strategy.Save = OpenLayers.Class(OpenLayers.Strategy, {
        events: null,
        auto: !1,
        timer: null,
        initialize: function (a) {
          OpenLayers.Strategy.prototype.initialize.apply(this, [
            a
          ]);
          this.events = new OpenLayers.Events(this)
        },
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.call(this);
          if (a && this.auto) if ('number' === typeof this.auto) this.timer = window.setInterval(OpenLayers.Function.bind(this.save, this), 1000 * this.auto);
            else this.layer.events.on({
              featureadded: this.triggerSave,
              afterfeaturemodified: this.triggerSave,
              scope: this
            });
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && this.auto && ('number' === typeof this.auto ? window.clearInterval(this.timer)  : this.layer.events.un({
            featureadded: this.triggerSave,
            afterfeaturemodified: this.triggerSave,
            scope: this
          }));
          return a
        },
        triggerSave: function (a) {
          var b = a.feature;
          (b.state === OpenLayers.State.INSERT || b.state === OpenLayers.State.UPDATE || b.state === OpenLayers.State.DELETE) && this.save([a.feature])
        },
        save: function (a) {
          a || (a = this.layer.features);
          this.events.triggerEvent('start', {
            features: a
          });
          var b = this.layer.projection,
              c = this.layer.map.getProjectionObject();
          if (!c.equals(b)) {
            for (var d = a.length, e = Array(d), f, g, h = 0; h < d; ++h) f = a[h],
              g = f.clone(),
              g.fid = f.fid,
              g.state = f.state,
              f.url && (g.url = f.url),
              g._original = f,
              g.geometry.transform(c, b),
              e[h] = g;
            a = e
          }
          this.layer.protocol.commit(a, {
            callback: this.onCommit,
            scope: this
          })
        },
        onCommit: function (a) {
          var b = {
            response: a
          };
          if (a.success()) {
            for (var c = a.reqFeatures, d, e = [
            ], f = a.insertIds || [
            ], g = 0, h = 0, i = c.length; h < i; ++h) if (d = c[h], d = d._original || d, a = d.state) a == OpenLayers.State.DELETE ? e.push(d)  : a == OpenLayers.State.INSERT && (d.fid = f[g], ++g),
              d.state = null;
            0 < e.length && this.layer.destroyFeatures(e);
            this.events.triggerEvent('success', b)
          } else this.events.triggerEvent('fail', b)
            },
        CLASS_NAME: 'OpenLayers.Strategy.Save'
      });
      OpenLayers.Format.GPX = OpenLayers.Class(OpenLayers.Format.XML, {
        defaultDesc: 'No description available',
        extractWaypoints: !0,
        extractTracks: !0,
        extractRoutes: !0,
        extractAttributes: !0,
        namespaces: {
          gpx: 'http://www.topografix.com/GPX/1/1',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        schemaLocation: 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd',
        creator: 'OpenLayers',
        initialize: function (a) {
          this.externalProjection = new OpenLayers.Projection('EPSG:4326');
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          var b = [
          ];
          if (this.extractTracks) for (var c = a.getElementsByTagName('trk'), d = 0, e = c.length; d < e; d++) {
            var f = {
            };
            this.extractAttributes && (f = this.parseAttributes(c[d]));
            for (var g = this.getElementsByTagNameNS(c[d], c[d].namespaceURI, 'trkseg'), h = 0, i = g.length; h < i; h++) {
              var j = this.extractSegment(g[h], 'trkpt');
              b.push(new OpenLayers.Feature.Vector(j, f))
            }
          }
          if (this.extractRoutes) {
            e = a.getElementsByTagName('rte');
            c = 0;
            for (d = e.length; c < d; c++) f = {
            },
              this.extractAttributes && (f = this.parseAttributes(e[c])),
              g = this.extractSegment(e[c], 'rtept'),
              b.push(new OpenLayers.Feature.Vector(g, f))
              }
          if (this.extractWaypoints) {
            a = a.getElementsByTagName('wpt');
            c = 0;
            for (e = a.length; c < e; c++) f = {
            },
              this.extractAttributes && (f = this.parseAttributes(a[c])),
              d = new OpenLayers.Geometry.Point(a[c].getAttribute('lon'), a[c].getAttribute('lat')),
              b.push(new OpenLayers.Feature.Vector(d, f))
              }
          if (this.internalProjection && this.externalProjection) {
            f = 0;
            for (a = b.length; f <
                 a; f++) b[f].geometry.transform(this.externalProjection, this.internalProjection)
              }
          return b
        },
        extractSegment: function (a, b) {
          for (var c = this.getElementsByTagNameNS(a, a.namespaceURI, b), d = [
          ], e = 0, f = c.length; e < f; e++) d.push(new OpenLayers.Geometry.Point(c[e].getAttribute('lon'), c[e].getAttribute('lat')));
          return new OpenLayers.Geometry.LineString(d)
        },
        parseAttributes: function (a) {
          for (var b = {
          }, a = a.firstChild, c, d; a; ) {
            if (1 == a.nodeType && a.firstChild && (c = a.firstChild, 3 == c.nodeType || 4 == c.nodeType)) d = a.prefix ? a.nodeName.split(':') [1] :
            a.nodeName,
              'trkseg' != d && 'rtept' != d && (b[d] = c.nodeValue);
            a = a.nextSibling
          }
          return b
        },
        write: function (a, b) {
          var a = OpenLayers.Util.isArray(a) ? a : [
            a
          ],
              c = this.createElementNS(this.namespaces.gpx, 'gpx');
          c.setAttribute('version', '1.1');
          c.setAttribute('creator', this.creator);
          this.setAttributes(c, {
            'xsi:schemaLocation': this.schemaLocation
          });
          b && 'object' == typeof b && c.appendChild(this.buildMetadataNode(b));
          for (var d = 0, e = a.length; d < e; d++) c.appendChild(this.buildFeatureNode(a[d]));
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            c
          ])
        },
        buildMetadataNode: function (a) {
          for (var b = [
            'name',
            'desc',
            'author'
          ], c = this.createElementNSPlus('gpx:metadata'), d = 0; d < b.length; d++) {
            var e = b[d];
            if (a[e]) {
              var f = this.createElementNSPlus('gpx:' + e);
              f.appendChild(this.createTextNode(a[e]));
              c.appendChild(f)
            }
          }
          return c
        },
        buildFeatureNode: function (a) {
          var b = a.geometry,
              b = b.clone();
          this.internalProjection && this.externalProjection && b.transform(this.internalProjection, this.externalProjection);
          if ('OpenLayers.Geometry.Point' == b.CLASS_NAME) {
            var c = this.buildWptNode(b);
            this.appendAttributesNode(c, a);
            return c
          }
          c = this.createElementNSPlus('gpx:trk');
          this.appendAttributesNode(c, a);
          for (var a = this.buildTrkSegNode(b), a = OpenLayers.Util.isArray(a) ? a : [
            a
          ], b = 0, d = a.length; b < d; b++) c.appendChild(a[b]);
          return c
        },
        buildTrkSegNode: function (a) {
          var b,
              c,
              d,
              e;
          if ('OpenLayers.Geometry.LineString' == a.CLASS_NAME || 'OpenLayers.Geometry.LinearRing' == a.CLASS_NAME) {
            b = this.createElementNSPlus('gpx:trkseg');
            c = 0;
            for (d = a.components.length; c < d; c++) e = a.components[c],
              b.appendChild(this.buildTrkPtNode(e));
            return b
          }
          b = [
          ];
          c = 0;
          for (d = a.components.length; c < d; c++) b.push(this.buildTrkSegNode(a.components[c]));
          return b
        },
        buildTrkPtNode: function (a) {
          var b = this.createElementNSPlus('gpx:trkpt');
          b.setAttribute('lon', a.x);
          b.setAttribute('lat', a.y);
          return b
        },
        buildWptNode: function (a) {
          var b = this.createElementNSPlus('gpx:wpt');
          b.setAttribute('lon', a.x);
          b.setAttribute('lat', a.y);
          return b
        },
        appendAttributesNode: function (a, b) {
          var c = this.createElementNSPlus('gpx:name');
          c.appendChild(this.createTextNode(b.attributes.name || b.id));
          a.appendChild(c);
          c = this.createElementNSPlus('gpx:desc');
          c.appendChild(this.createTextNode(b.attributes.description || this.defaultDesc));
          a.appendChild(c)
        },
        CLASS_NAME: 'OpenLayers.Format.GPX'
      });
      OpenLayers.Format.WMSDescribeLayer = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.1.1',
        getVersion: function (a, b) {
          var c = OpenLayers.Format.XML.VersionedOGC.prototype.getVersion.apply(this, arguments);
          if ('1.1.1' == c || '1.1.0' == c) c = '1.1';
          return c
        },
        CLASS_NAME: 'OpenLayers.Format.WMSDescribeLayer'
      });
      OpenLayers.Format.WMSDescribeLayer.v1_1 = OpenLayers.Class(OpenLayers.Format.WMSDescribeLayer, {
        initialize: function (a) {
          OpenLayers.Format.WMSDescribeLayer.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          for (var a = a.documentElement.childNodes, b = [
          ], c, d, e = 0; e < a.length; ++e) if (c = a[e], d = c.nodeName, 'LayerDescription' == d) {
            d = c.getAttribute('name');
            var f = '',
                g = '',
                h = '';
            c.getAttribute('owsType') ? (f = c.getAttribute('owsType'), g = c.getAttribute('owsURL'))  :
            '' != c.getAttribute('wfs') ? (f = 'WFS', g = c.getAttribute('wfs'))  : '' != c.getAttribute('wcs') && (f = 'WCS', g = c.getAttribute('wcs'));
            c = c.getElementsByTagName('Query');
            0 < c.length && ((h = c[0].getAttribute('typeName')) || (h = c[0].getAttribute('typename')));
            b.push({
              layerName: d,
              owsType: f,
              owsURL: g,
              typeName: h
            })
          }
          return b
        },
        CLASS_NAME: 'OpenLayers.Format.WMSDescribeLayer.v1_1'
      });
      OpenLayers.Layer.OSM = OpenLayers.Class(OpenLayers.Layer.XYZ, {
        name: 'OpenStreetMap',
        url: [
          'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png',
          'http://b.tile.openstreetmap.org/${z}/${x}/${y}.png',
          'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'
        ],
        attribution: 'Data CC-By-SA by <a href=\'http://openstreetmap.org/\'>OpenStreetMap</a>',
        sphericalMercator: !0,
        wrapDateLine: !0,
        tileOptions: null,
        initialize: function (a, b, c) {
          OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
          this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
          }, this.options && this.options.tileOptions)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.OSM(this.name, this.url, this.getOptions()));
          return a = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [
            a
          ])
        },
        CLASS_NAME: 'OpenLayers.Layer.OSM'
      });
      OpenLayers.Renderer.Canvas = OpenLayers.Class(OpenLayers.Renderer, {
        hitDetection: !0,
        hitOverflow: 0,
        canvas: null,
        features: null,
        pendingRedraw: !1,
        cachedSymbolBounds: {
        },
        initialize: function (a, b) {
          OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
          this.root = document.createElement('canvas');
          this.container.appendChild(this.root);
          this.canvas = this.root.getContext('2d');
          this.features = {
          };
          this.hitDetection && (this.hitCanvas = document.createElement('canvas'), this.hitContext = this.hitCanvas.getContext('2d'))
        },
        setExtent: function () {
          OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
          return !1
        },
        eraseGeometry: function (a, b) {
          this.eraseFeatures(this.features[b][0])
        },
        supported: function () {
          return OpenLayers.CANVAS_SUPPORTED
        },
        setSize: function (a) {
          this.size = a.clone();
          var b = this.root;
          b.style.width = a.w + 'px';
          b.style.height = a.h + 'px';
          b.width = a.w;
          b.height = a.h;
          this.resolution = null;
          this.hitDetection && (b = this.hitCanvas, b.style.width = a.w + 'px', b.style.height = a.h + 'px', b.width = a.w, b.height = a.h)
        },
        drawFeature: function (a, b) {
          var c;
          if (a.geometry) {
            b = this.applyDefaultSymbolizer(b || a.style);
            c = a.geometry.getBounds();
            var d;
            this.map.baseLayer && this.map.baseLayer.wrapDateLine && (d = this.map.getMaxExtent());
            d = c && c.intersectsBounds(this.extent, {
              worldBounds: d
            });
            (c = 'none' !== b.display && !!c && d) ? this.features[a.id] = [
              a,
              b
            ] : delete this.features[a.id];
            this.pendingRedraw = !0
          }
          this.pendingRedraw && !this.locked && (this.redraw(), this.pendingRedraw = !1);
          return c
        },
        drawGeometry: function (a, b, c) {
          var d = a.CLASS_NAME;
          if ('OpenLayers.Geometry.Collection' ==
              d || 'OpenLayers.Geometry.MultiPoint' == d || 'OpenLayers.Geometry.MultiLineString' == d || 'OpenLayers.Geometry.MultiPolygon' == d) for (d = 0; d < a.components.length; d++) this.drawGeometry(a.components[d], b, c);
          else switch (a.CLASS_NAME) {
            case 'OpenLayers.Geometry.Point':
              this.drawPoint(a, b, c);
              break;
            case 'OpenLayers.Geometry.LineString':
              this.drawLineString(a, b, c);
              break;
            case 'OpenLayers.Geometry.LinearRing':
              this.drawLinearRing(a, b, c);
              break;
            case 'OpenLayers.Geometry.Polygon':
              this.drawPolygon(a, b, c)
          }
        },
        drawExternalGraphic: function (a, b, c) {
          var d = new Image;
          b.graphicTitle && (d.title = b.graphicTitle);
          var e = b.graphicWidth || b.graphicHeight,
              f = b.graphicHeight || b.graphicWidth,
              e = e ? e : 2 * b.pointRadius,
              f = f ? f : 2 * b.pointRadius,
              g = void 0 != b.graphicXOffset ? b.graphicXOffset : - (0.5 * e),
                h = void 0 != b.graphicYOffset ? b.graphicYOffset : - (0.5 * f),
                  i = b.graphicOpacity || b.fillOpacity;
          d.onload = OpenLayers.Function.bind(function () {
            if (this.features[c]) {
              var b = this.getLocalXY(a),
                  k = b[0],
                  b = b[1];
              if (!isNaN(k) && !isNaN(b)) {
                var k = k + g | 0,
                    b = b + h | 0,
                    l = this.canvas;
                l.globalAlpha = i;
                var m = OpenLayers.Renderer.Canvas.drawImageScaleFactor || (OpenLayers.Renderer.Canvas.drawImageScaleFactor = /android 2.1/.test(navigator.userAgent.toLowerCase()) ? 320 / window.screen.width : 1);
                l.drawImage(d, k * m, b * m, e * m, f * m);
                if (this.hitDetection) {
                  this.setHitContextStyle('fill', c);
                  this.hitContext.fillRect(k, b, e, f)
                }
              }
            }
          }, this);
          d.src = b.externalGraphic
        },
        drawNamedSymbol: function (a, b, c) {
          var d,
              e,
              f,
              g;
          f = Math.PI / 180;
          var h = OpenLayers.Renderer.symbol[b.graphicName];
          if (!h) throw Error(b.graphicName + ' is not a valid symbol name');
          if (h.length && !(2 > h.length) && (a = this.getLocalXY(a), e = a[0], g = a[1], !isNaN(e) && !isNaN(g))) {
            this.canvas.lineCap = 'round';
            this.canvas.lineJoin = 'round';
            this.hitDetection && (this.hitContext.lineCap = 'round', this.hitContext.lineJoin = 'round');
            if (b.graphicName in this.cachedSymbolBounds) d = this.cachedSymbolBounds[b.graphicName];
            else {
              d = new OpenLayers.Bounds;
              for (a = 0; a < h.length; a += 2) d.extend(new OpenLayers.LonLat(h[a], h[a + 1]));
              this.cachedSymbolBounds[b.graphicName] = d
            }
            this.canvas.save();
            this.hitDetection && this.hitContext.save();
            this.canvas.translate(e, g);
            this.hitDetection && this.hitContext.translate(e, g);
            a = f * b.rotation;
            isNaN(a) || (this.canvas.rotate(a), this.hitDetection && this.hitContext.rotate(a));
            f = 2 * b.pointRadius / Math.max(d.getWidth(), d.getHeight());
            this.canvas.scale(f, f);
            this.hitDetection && this.hitContext.scale(f, f);
            a = d.getCenterLonLat().lon;
            d = d.getCenterLonLat().lat;
            this.canvas.translate( - a, - d);
            this.hitDetection && this.hitContext.translate( - a, - d);
            g = b.strokeWidth;
            b.strokeWidth = g / f;
            if (!1 !== b.fill) {
              this.setCanvasStyle('fill', b);
              this.canvas.beginPath();
              for (a = 0; a < h.length; a += 2) d = h[a],
                e = h[a + 1],
                0 == a && this.canvas.moveTo(d, e),
                this.canvas.lineTo(d, e);
              this.canvas.closePath();
              this.canvas.fill();
              if (this.hitDetection) {
                this.setHitContextStyle('fill', c, b);
                this.hitContext.beginPath();
                for (a = 0; a < h.length; a += 2) d = h[a],
                  e = h[a + 1],
                  0 == a && this.canvas.moveTo(d, e),
                  this.hitContext.lineTo(d, e);
                this.hitContext.closePath();
                this.hitContext.fill()
              }
            }
            if (!1 !== b.stroke) {
              this.setCanvasStyle('stroke', b);
              this.canvas.beginPath();
              for (a = 0; a < h.length; a += 2) d = h[a],
                e = h[a + 1],
                0 == a && this.canvas.moveTo(d, e),
                this.canvas.lineTo(d, e);
              this.canvas.closePath();
              this.canvas.stroke();
              if (this.hitDetection) {
                this.setHitContextStyle('stroke', c, b, f);
                this.hitContext.beginPath();
                for (a = 0; a < h.length; a += 2) d = h[a],
                  e = h[a + 1],
                  0 == a && this.hitContext.moveTo(d, e),
                  this.hitContext.lineTo(d, e);
                this.hitContext.closePath();
                this.hitContext.stroke()
              }
            }
            b.strokeWidth = g;
            this.canvas.restore();
            this.hitDetection && this.hitContext.restore();
            this.setCanvasStyle('reset')
          }
        },
        setCanvasStyle: function (a, b) {
          'fill' ===
            a ? (this.canvas.globalAlpha = b.fillOpacity, this.canvas.fillStyle = b.fillColor)  : 'stroke' === a ? (this.canvas.globalAlpha = b.strokeOpacity, this.canvas.strokeStyle = b.strokeColor, this.canvas.lineWidth = b.strokeWidth)  : (this.canvas.globalAlpha = 0, this.canvas.lineWidth = 1)
        },
        featureIdToHex: function (a) {
          a = Number(a.split('_').pop()) + 1;
          16777216 <= a && (this.hitOverflow = a - 16777215, a = a % 16777216 + 1);
          var a = '000000' + a.toString(16),
              b = a.length;
          return a = '#' + a.substring(b - 6, b)
        },
        setHitContextStyle: function (a, b, c, d) {
          b = this.featureIdToHex(b);
          'fill' == a ? (this.hitContext.globalAlpha = 1, this.hitContext.fillStyle = b)  : 'stroke' == a ? (this.hitContext.globalAlpha = 1, this.hitContext.strokeStyle = b, 'undefined' === typeof d ? this.hitContext.lineWidth = c.strokeWidth + 2 : isNaN(d) || (this.hitContext.lineWidth = c.strokeWidth + 2 / d))  : (this.hitContext.globalAlpha = 0, this.hitContext.lineWidth = 1)
        },
        drawPoint: function (a, b, c) {
          if (!1 !== b.graphic) if (b.externalGraphic) this.drawExternalGraphic(a, b, c);
            else if (b.graphicName && 'circle' != b.graphicName) this.drawNamedSymbol(a, b, c);
            else {
              var d = this.getLocalXY(a),
                  a = d[0],
                  d = d[1];
              if (!isNaN(a) && !isNaN(d)) {
                var e = 2 * Math.PI,
                    f = b.pointRadius;
                !1 !== b.fill && (this.setCanvasStyle('fill', b), this.canvas.beginPath(), this.canvas.arc(a, d, f, 0, e, !0), this.canvas.fill(), this.hitDetection && (this.setHitContextStyle('fill', c, b), this.hitContext.beginPath(), this.hitContext.arc(a, d, f, 0, e, !0), this.hitContext.fill()));
                !1 !== b.stroke && (this.setCanvasStyle('stroke', b), this.canvas.beginPath(), this.canvas.arc(a, d, f, 0, e, !0), this.canvas.stroke(), this.hitDetection && (this.setHitContextStyle('stroke', c, b), this.hitContext.beginPath(), this.hitContext.arc(a, d, f, 0, e, !0), this.hitContext.stroke()), this.setCanvasStyle('reset'))
              }
            }
        },
        drawLineString: function (a, b, c) {
          b = OpenLayers.Util.applyDefaults({
            fill: !1
          }, b);
          this.drawLinearRing(a, b, c)
        },
        drawLinearRing: function (a, b, c) {
          !1 !== b.fill && (this.setCanvasStyle('fill', b), this.renderPath(this.canvas, a, b, c, 'fill'), this.hitDetection && (this.setHitContextStyle('fill', c, b), this.renderPath(this.hitContext, a, b, c, 'fill')));
          !1 !== b.stroke && (this.setCanvasStyle('stroke', b), this.renderPath(this.canvas, a, b, c, 'stroke'), this.hitDetection && (this.setHitContextStyle('stroke', c, b), this.renderPath(this.hitContext, a, b, c, 'stroke')));
          this.setCanvasStyle('reset')
        },
        renderPath: function (a, b, c, d, e) {
          b = b.components;
          c = b.length;
          a.beginPath();
          var d = this.getLocalXY(b[0]),
              f = d[1];
          if (!isNaN(d[0]) && !isNaN(f)) {
            a.moveTo(d[0], d[1]);
            for (d = 1; d < c; ++d) f = this.getLocalXY(b[d]),
              a.lineTo(f[0], f[1]);
            'fill' === e ? a.fill()  : a.stroke()
          }
        },
        drawPolygon: function (a, b, c) {
          var a = a.components,
              d = a.length;
          this.drawLinearRing(a[0], b, c);
          for (var e = 1; e <
               d; ++e) this.canvas.globalCompositeOperation = 'destination-out',
            this.hitDetection && (this.hitContext.globalCompositeOperation = 'destination-out'),
            this.drawLinearRing(a[e], OpenLayers.Util.applyDefaults({
            stroke: !1,
            fillOpacity: 1
          }, b), c),
            this.canvas.globalCompositeOperation = 'source-over',
            this.hitDetection && (this.hitContext.globalCompositeOperation = 'source-over'),
            this.drawLinearRing(a[e], OpenLayers.Util.applyDefaults({
            fill: !1
          }, b), c)
            },
        drawText: function (a, b) {
          var c = this.getLocalXY(a);
          this.setCanvasStyle('reset');
          this.canvas.fillStyle = b.fontColor;
          this.canvas.globalAlpha = b.fontOpacity || 1;
          var d = [
            b.fontStyle ? b.fontStyle : 'normal',
            'normal',
            b.fontWeight ? b.fontWeight : 'normal',
            b.fontSize ? b.fontSize : '1em',
            b.fontFamily ? b.fontFamily : 'sans-serif'
          ].join(' '),
              e = b.label.split('\n'),
              f = e.length;
          if (this.canvas.fillText) {
            this.canvas.font = d;
            this.canvas.textAlign = OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[0]] || 'center';
            this.canvas.textBaseline = OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[1]] || 'middle';
            var g = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];
            null == g && (g = - 0.5);
            d = this.canvas.measureText('Mg').height || this.canvas.measureText('xx').width;
            c[1] += d * g * (f - 1);
            for (g = 0; g < f; g++) b.labelOutlineWidth && (this.canvas.save(), this.canvas.strokeStyle = b.labelOutlineColor, this.canvas.lineWidth = b.labelOutlineWidth, this.canvas.strokeText(e[g], c[0], c[1] + d * g + 1), this.canvas.restore()),
              this.canvas.fillText(e[g], c[0], c[1] + d * g)
              } else if (this.canvas.mozDrawText) {
                this.canvas.mozTextStyle = d;
                var h = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[0]];
                null == h && (h = - 0.5);
                g = OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];
                null == g && (g = - 0.5);
                d = this.canvas.mozMeasureText('xx');
                c[1] += d * (1 + g * f);
                for (g = 0; g < f; g++) {
                  var i = c[0] + h * this.canvas.mozMeasureText(e[g]),
                      j = c[1] + g * d;
                  this.canvas.translate(i, j);
                  this.canvas.mozDrawText(e[g]);
                  this.canvas.translate( - i, - j)
                }
              }
          this.setCanvasStyle('reset')
        },
        getLocalXY: function (a) {
          var b = this.getResolution(),
              c = this.extent;
          return [(a.x - this.featureDx) / b + - c.left / b,
                  c.top / b - a.y / b]
        },
        clear: function () {
          var a = this.root.height,
              b = this.root.width;
          this.canvas.clearRect(0, 0, b, a);
          this.features = {
          };
          this.hitDetection && this.hitContext.clearRect(0, 0, b, a)
        },
        getFeatureIdFromEvent: function (a) {
          var b;
          if (this.hitDetection && 'none' !== this.root.style.display && !this.map.dragging && (a = a.xy, a = this.hitContext.getImageData(a.x | 0, a.y | 0, 1, 1).data, 255 === a[3] && (a = a[2] + 256 * (a[1] + 256 * a[0])))) {
            a = 'OpenLayers.Feature.Vector_' + (a - 1 + this.hitOverflow);
            try {
              b = this.features[a][0]
            } catch (c) {
            }
          }
          return b
        },
        eraseFeatures: function (a) {
          OpenLayers.Util.isArray(a) || (a = [
            a
          ]);
          for (var b = 0; b < a.length; ++b) delete this.features[a[b].id];
          this.redraw()
        },
        redraw: function () {
          if (!this.locked) {
            var a = this.root.height,
                b = this.root.width;
            this.canvas.clearRect(0, 0, b, a);
            this.hitDetection && this.hitContext.clearRect(0, 0, b, a);
            var a = [
            ],
                c,
                d,
                e = this.map.baseLayer && this.map.baseLayer.wrapDateLine && this.map.getMaxExtent(),
                f;
            for (f in this.features) this.features.hasOwnProperty(f) && (b = this.features[f][0], c = b.geometry, this.calculateFeatureDx(c.getBounds(), e), d = this.features[f][1], this.drawGeometry(c, d, b.id), d.label && a.push([b,
          d]));
            b = 0;
            for (c = a.length; b < c; ++b) f = a[b],
              this.drawText(f[0].geometry.getCentroid(), f[1])
              }
        },
        CLASS_NAME: 'OpenLayers.Renderer.Canvas'
      });
      OpenLayers.Renderer.Canvas.LABEL_ALIGN = {
        l: 'left',
        r: 'right',
        t: 'top',
        b: 'bottom'
      };
      OpenLayers.Renderer.Canvas.LABEL_FACTOR = {
        l: 0,
        r: - 1,
        t: 0,
        b: - 1
      };
      OpenLayers.Renderer.Canvas.drawImageScaleFactor = null;
      OpenLayers.Format.OSM = OpenLayers.Class(OpenLayers.Format.XML, {
        checkTags: !1,
        interestingTagsExclude: null,
        areaTags: null,
        initialize: function (a) {
          for (var b = {
            interestingTagsExclude: 'source source_ref source:ref history attribution created_by'.split(' '),
            areaTags: 'area building leisure tourism ruins historic landuse military natural sport'.split(' ')
          }, b = OpenLayers.Util.extend(b, a), c = {
          }, a = 0; a < b.interestingTagsExclude.length; a++) c[b.interestingTagsExclude[a]] = !0;
          b.interestingTagsExclude = c;
          c = {
          };
          for (a = 0; a < b.areaTags.length; a++) c[b.areaTags[a]] = !0;
          b.areaTags = c;
          this.externalProjection = new OpenLayers.Projection('EPSG:4326');
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            b
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          for (var b = this.getNodes(a), c = this.getWays(a), a = Array(c.length), d = 0; d < c.length; d++) {
            for (var e = Array(c[d].nodes.length), f = this.isWayArea(c[d]) ? 1 : 0, g = 0; g < c[d].nodes.length; g++) {
              var h = b[c[d].nodes[g]],
                  i = new OpenLayers.Geometry.Point(h.lon, h.lat);
              i.osm_id = parseInt(c[d].nodes[g]);
              e[g] = i;
              h.used = !0
            }
            h = null;
            h = f ? new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(e))  : new OpenLayers.Geometry.LineString(e);
            this.internalProjection && this.externalProjection && h.transform(this.externalProjection, this.internalProjection);
            e = new OpenLayers.Feature.Vector(h, c[d].tags);
            e.osm_id = parseInt(c[d].id);
            e.fid = 'way.' + e.osm_id;
            a[d] = e
          }
          for (var j in b) {
            h = b[j];
            if (!h.used || this.checkTags) {
              c = null;
              if (this.checkTags) {
                c = this.getTags(h.node, !0);
                if (h.used && !c[1]) continue;
                c = c[0]
              } else c = this.getTags(h.node);
              e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(h.lon, h.lat), c);
              this.internalProjection && this.externalProjection && e.geometry.transform(this.externalProjection, this.internalProjection);
              e.osm_id = parseInt(j);
              e.fid = 'node.' + e.osm_id;
              a.push(e)
            }
            h.node = null
          }
          return a
        },
        getNodes: function (a) {
          for (var a = a.getElementsByTagName('node'), b = {
          }, c = 0; c < a.length; c++) {
            var d = a[c],
                e = d.getAttribute('id');
            b[e] = {
              lat: d.getAttribute('lat'),
              lon: d.getAttribute('lon'),
              node: d
            }
          }
          return b
        },
        getWays: function (a) {
          for (var a = a.getElementsByTagName('way'), b = [
          ], c = 0; c < a.length; c++) {
            var d = a[c],
                e = {
                  id: d.getAttribute('id')
                };
            e.tags = this.getTags(d);
            d = d.getElementsByTagName('nd');
            e.nodes = Array(d.length);
            for (var f = 0; f < d.length; f++) e.nodes[f] = d[f].getAttribute('ref');
            b.push(e)
          }
          return b
        },
        getTags: function (a, b) {
          for (var c = a.getElementsByTagName('tag'), d = {
          }, e = !1, f = 0; f < c.length; f++) {
            var g = c[f].getAttribute('k');
            d[g] = c[f].getAttribute('v');
            b && (this.interestingTagsExclude[g] || (e = !0))
          }
          return b ? [
            d,
            e
          ] : d
        },
        isWayArea: function (a) {
          var b = !1,
              c = !1;
          a.nodes[0] == a.nodes[a.nodes.length - 1] && (b = !0);
          if (this.checkTags) for (var d in a.tags) if (this.areaTags[d]) {
            c = !0;
            break
          }
          return b && (this.checkTags ? c : !0)
        },
        write: function (a) {
          OpenLayers.Util.isArray(a) || (a = [
            a
          ]);
          this.osm_id = 1;
          this.created_nodes = {
          };
          var b = this.createElementNS(null, 'osm');
          b.setAttribute('version', '0.5');
          b.setAttribute('generator', 'OpenLayers ' + OpenLayers.VERSION_NUMBER);
          for (var c = a.length - 1; 0 <= c; c--) for (var d = this.createFeatureNodes(a[c]), e = 0; e < d.length; e++) b.appendChild(d[e]);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ])
        },
        createFeatureNodes: function (a) {
          var b = [
          ],
              c = a.geometry.CLASS_NAME,
              c = c.substring(c.lastIndexOf('.') + 1),
              c = c.toLowerCase();
          (c = this.createXML[c]) && (b = c.apply(this, [
            a
          ]));
          return b
        },
        createXML: {
          point: function (a) {
            var b = null,
                c = a.geometry ? a.geometry : a;
            this.internalProjection && this.externalProjection && (c = c.clone(), c.transform(this.internalProjection, this.externalProjection));
            var d = !1;
            a.osm_id ? (b = a.osm_id, this.created_nodes[b] && (d = !0))  : (b = - this.osm_id, this.osm_id++);
            var e = d ? this.created_nodes[b] : this.createElementNS(null, 'node');
            this.created_nodes[b] = e;
            e.setAttribute('id', b);
            e.setAttribute('lon', c.x);
            e.setAttribute('lat', c.y);
            a.attributes && this.serializeTags(a, e);
            this.setState(a, e);
            return d ? [
            ] : [
              e
            ]
          },
          linestring: function (a) {
            var b,
                c = [
                ],
                d = a.geometry;
            a.osm_id ? b = a.osm_id : (b = - this.osm_id, this.osm_id++);
            var e = this.createElementNS(null, 'way');
            e.setAttribute('id', b);
            for (b = 0; b < d.components.length; b++) {
              var f = this.createXML.point.apply(this, [
                d.components[b]
              ]);
              if (f.length) {
                var f = f[0],
                    g = f.getAttribute('id');
                c.push(f)
              } else g = d.components[b].osm_id,
                f = this.created_nodes[g];
              this.setState(a, f);
              f = this.createElementNS(null, 'nd');
              f.setAttribute('ref', g);
              e.appendChild(f)
            }
            this.serializeTags(a, e);
            c.push(e);
            return c
          },
          polygon: function (a) {
            var b = OpenLayers.Util.extend({
              area: 'yes'
            }, a.attributes),
                b = new OpenLayers.Feature.Vector(a.geometry.components[0], b);
            b.osm_id = a.osm_id;
            return this.createXML.linestring.apply(this, [
              b
            ])
          }
        },
        serializeTags: function (a, b) {
          for (var c in a.attributes) {
            var d = this.createElementNS(null, 'tag');
            d.setAttribute('k', c);
            d.setAttribute('v', a.attributes[c]);
            b.appendChild(d)
          }
        },
        setState: function (a, b) {
          if (a.state) {
            var c = null;
            switch (a.state) {
              case OpenLayers.State.UPDATE:
              case OpenLayers.State.DELETE:
                c = 'delete'
            }
            c && b.setAttribute('action', c)
          }
        },
        CLASS_NAME: 'OpenLayers.Format.OSM'
      });
      OpenLayers.Layer.Bing = OpenLayers.Class(OpenLayers.Layer.XYZ, {
        key: null,
        serverResolutions: [
          156543.03390625,
          78271.516953125,
          39135.7584765625,
          19567.87923828125,
          9783.939619140625,
          4891.9698095703125,
          2445.9849047851562,
          1222.9924523925781,
          611.4962261962891,
          305.74811309814453,
          152.87405654907226,
          76.43702827453613,
          38.218514137268066,
          19.109257068634033,
          9.554628534317017,
          4.777314267158508,
          2.388657133579254,
          1.194328566789627,
          0.5971642833948135,
          0.29858214169740677,
          0.14929107084870338,
          0.07464553542435169
        ],
        attributionTemplate: '<span class="olBingAttribution ${type}"><div><a target="_blank" href="http://www.bing.com/maps/"><img src="${logo}" /></a></div>${copyrights}<a style="white-space: nowrap" target="_blank" href="http://www.microsoft.com/maps/product/terms.html">Terms of Use</a></span>',
        metadata: null,
        type: 'Road',
        culture: 'en-US',
        metadataParams: null,
        tileOptions: null,
        initialize: function (a) {
          a = OpenLayers.Util.applyDefaults({
            sphericalMercator: !0
          }, a);
          OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [
            a.name || 'Bing ' + (a.type || this.type),
            null,
            a
          ]);
          this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
          }, this.options.tileOptions);
          this.loadMetadata()
        },
        loadMetadata: function () {
          this._callbackId = '_callback_' + this.id.replace(/\./g, '_');
          window[this._callbackId] = OpenLayers.Function.bind(OpenLayers.Layer.Bing.processMetadata, this);
          var a = OpenLayers.Util.applyDefaults({
            key: this.key,
            jsonp: this._callbackId,
            include: 'ImageryProviders'
          }, this.metadataParams),
              a = 'http://dev.virtualearth.net/REST/v1/Imagery/Metadata/' + this.type + '?' + OpenLayers.Util.getParameterString(a),
              b = document.createElement('script');
          b.type = 'text/javascript';
          b.src = a;
          b.id = this._callbackId;
          document.getElementsByTagName('head') [0].appendChild(b)
        },
        initLayer: function () {
          var a = this.metadata.resourceSets[0].resources[0],
              b = a.imageUrl.replace('{quadkey}', '${quadkey}'),
              b = b.replace('{culture}', this.culture);
          this.url = [
          ];
          for (var c = 0; c < a.imageUrlSubdomains.length; ++c) this.url.push(b.replace('{subdomain}', a.imageUrlSubdomains[c]));
          this.addOptions({
            maxResolution: Math.min(this.serverResolutions[a.zoomMin], this.maxResolution || Number.POSITIVE_INFINITY),
            numZoomLevels: Math.min(a.zoomMax + 1 - a.zoomMin, this.numZoomLevels)
          }, !0)
        },
        getURL: function (a) {
          if (this.url) {
            for (var b = this.getXYZ(a), a = b.x, c = b.y, b = b.z, d = [
            ], e = b; 0 < e; --e) {
              var f = '0',
                  g = 1 << e - 1;
              0 != (a & g) && f++;
              0 != (c & g) && (f++, f++);
              d.push(f)
            }
            d = d.join('');
            a = this.selectUrl('' + a + c + b, this.url);
            return OpenLayers.String.format(a, {
              quadkey: d
            })
          }
        },
        updateAttribution: function () {
          var a = this.metadata;
          if (a.resourceSets && this.map && this.map.center) {
            var b = a.resourceSets[0].resources[0],
                c = this.map.getExtent().transform(this.map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326')),
                b = b.imageryProviders,
                d = OpenLayers.Util.indexOf(this.serverResolutions, this.getServerResolution()),
                e = '',
                f,
                g,
                h,
                i,
                j,
                k,
                l;
            g = 0;
            for (h = b.length; g < h; ++g) {
              f = b[g];
              i = 0;
              for (j = f.coverageAreas.length; i <
                   j; ++i) l = f.coverageAreas[i],
                k = OpenLayers.Bounds.fromArray(l.bbox, !0),
                c.intersectsBounds(k) && (d <= l.zoomMax && d >= l.zoomMin) && (e += f.attribution + ' ')
                }
            this.attribution = OpenLayers.String.format(this.attributionTemplate, {
              type: this.type.toLowerCase(),
              logo: a.brandLogoUri,
              copyrights: e
            });
            this.map && this.map.events.triggerEvent('changelayer', {
              layer: this,
              property: 'attribution'
            })
          }
        },
        setMap: function () {
          OpenLayers.Layer.XYZ.prototype.setMap.apply(this, arguments);
          this.updateAttribution();
          this.map.events.register('moveend', this, this.updateAttribution)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.Bing(this.options));
          return a = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [
            a
          ])
        },
        destroy: function () {
          this.map && this.map.events.unregister('moveend', this, this.updateAttribution);
          OpenLayers.Layer.XYZ.prototype.destroy.apply(this, arguments)
        },
        CLASS_NAME: 'OpenLayers.Layer.Bing'
      });
      OpenLayers.Layer.Bing.processMetadata = function (a) {
        this.metadata = a;
        this.initLayer();
        a = document.getElementById(this._callbackId);
        a.parentNode.removeChild(a);
        window[this._callbackId] = void 0;
        delete this._callbackId
      };
      OpenLayers.Layer.PointGrid = OpenLayers.Class(OpenLayers.Layer.Vector, {
        dx: null,
        dy: null,
        ratio: 1.5,
        maxFeatures: 250,
        rotation: 0,
        origin: null,
        gridBounds: null,
        initialize: function (a) {
          a = a || {
          };
          OpenLayers.Layer.Vector.prototype.initialize.apply(this, [
            a.name,
            a
          ])
        },
        setMap: function (a) {
          OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
          a.events.register('moveend', this, this.onMoveEnd)
        },
        removeMap: function (a) {
          a.events.unregister('moveend', this, this.onMoveEnd);
          OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments)
        },
        setRatio: function (a) {
          this.ratio = a;
          this.updateGrid(!0)
        },
        setMaxFeatures: function (a) {
          this.maxFeatures = a;
          this.updateGrid(!0)
        },
        setSpacing: function (a, b) {
          this.dx = a;
          this.dy = b || a;
          this.updateGrid(!0)
        },
        setOrigin: function (a) {
          this.origin = a;
          this.updateGrid(!0)
        },
        getOrigin: function () {
          this.origin || (this.origin = this.map.getExtent().getCenterLonLat());
          return this.origin
        },
        setRotation: function (a) {
          this.rotation = a;
          this.updateGrid(!0)
        },
        onMoveEnd: function () {
          this.updateGrid()
        },
        getViewBounds: function () {
          var a = this.map.getExtent();
          if (this.rotation) {
            var b = this.getOrigin(),
                b = new OpenLayers.Geometry.Point(b.lon, b.lat),
                a = a.toGeometry();
            a.rotate( - this.rotation, b);
            a = a.getBounds()
          }
          return a
        },
        updateGrid: function (a) {
          if (a || this.invalidBounds()) {
            var b = this.getViewBounds(),
                c = this.getOrigin(),
                a = new OpenLayers.Geometry.Point(c.lon, c.lat),
                d = b.getWidth(),
                e = b.getHeight(),
                f = d / e,
                g = Math.sqrt(this.dx * this.dy * this.maxFeatures / f),
                d = Math.min(d * this.ratio, g * f),
                e = Math.min(e * this.ratio, g),
                b = b.getCenterLonLat();
            this.gridBounds = new OpenLayers.Bounds(b.lon -
                                                    d / 2, b.lat - e / 2, b.lon + d / 2, b.lat + e / 2);
            for (var b = Math.floor(e / this.dy), d = Math.floor(d / this.dx), e = c.lon + this.dx * Math.ceil((this.gridBounds.left - c.lon) / this.dx), c = c.lat + this.dy * Math.ceil((this.gridBounds.bottom - c.lat) / this.dy), g = Array(b * d), h, i = 0; i < d; ++i) for (var f = e + i * this.dx, j = 0; j < b; ++j) h = c + j * this.dy,
              h = new OpenLayers.Geometry.Point(f, h),
              this.rotation && h.rotate(this.rotation, a),
              g[i * b + j] = new OpenLayers.Feature.Vector(h);
            this.destroyFeatures(this.features, {
              silent: !0
            });
            this.addFeatures(g, {
              silent: !0
            })
          }
        },
        invalidBounds: function () {
          return !this.gridBounds || !this.gridBounds.containsBounds(this.getViewBounds())
        },
        CLASS_NAME: 'OpenLayers.Layer.PointGrid'
      });
      OpenLayers.Filter.Spatial = OpenLayers.Class(OpenLayers.Filter, {
        type: null,
        property: null,
        value: null,
        distance: null,
        distanceUnits: null,
        evaluate: function (a) {
          var b = !1;
          switch (this.type) {
            case OpenLayers.Filter.Spatial.BBOX:
            case OpenLayers.Filter.Spatial.INTERSECTS:
              if (a.geometry) {
                var c = this.value;
                'OpenLayers.Bounds' == this.value.CLASS_NAME && (c = this.value.toGeometry());
                a.geometry.intersects(c) && (b = !0)
              }
              break;
            default:
              throw Error('evaluate is not implemented for this filter type.');
          }
          return b
        },
        clone: function () {
          var a = OpenLayers.Util.applyDefaults({
            value: this.value && this.value.clone && this.value.clone()
          }, this);
          return new OpenLayers.Filter.Spatial(a)
        },
        CLASS_NAME: 'OpenLayers.Filter.Spatial'
      });
      OpenLayers.Filter.Spatial.BBOX = 'BBOX';
      OpenLayers.Filter.Spatial.INTERSECTS = 'INTERSECTS';
      OpenLayers.Filter.Spatial.DWITHIN = 'DWITHIN';
      OpenLayers.Filter.Spatial.WITHIN = 'WITHIN';
      OpenLayers.Filter.Spatial.CONTAINS = 'CONTAINS';
      OpenLayers.Format.SLD = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        profile: null,
        defaultVersion: '1.0.0',
        stringifyOutput: !0,
        namedLayersAsArray: !1,
        CLASS_NAME: 'OpenLayers.Format.SLD'
      });
      OpenLayers.Format.GML.v2 = OpenLayers.Class(OpenLayers.Format.GML.Base, {
        schemaLocation: 'http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd',
        initialize: function (a) {
          OpenLayers.Format.GML.Base.prototype.initialize.apply(this, [
            a
          ])
        },
        readers: {
          gml: OpenLayers.Util.applyDefaults({
            outerBoundaryIs: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.outer = c.components[0]
            },
            innerBoundaryIs: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.inner.push(c.components[0])
            },
            Box: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.components || (b.components = [
              ]);
              var d = c.points[0],
                  c = c.points[1];
              b.components.push(new OpenLayers.Bounds(d.x, d.y, c.x, c.y))
            }
          }, OpenLayers.Format.GML.Base.prototype.readers.gml),
          feature: OpenLayers.Format.GML.Base.prototype.readers.feature,
          wfs: OpenLayers.Format.GML.Base.prototype.readers.wfs
        },
        write: function (a) {
          a = this.writeNode(OpenLayers.Util.isArray(a) ? 'wfs:FeatureCollection' : 'gml:featureMember', a);
          this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        writers: {
          gml: OpenLayers.Util.applyDefaults({
            Point: function (a) {
              var b = this.createElementNSPlus('gml:Point');
              this.writeNode('coordinates', [
                a
              ], b);
              return b
            },
            coordinates: function (a) {
              for (var b = a.length, c = Array(b), d, e = 0; e < b; ++e) d = a[e],
                c[e] = this.xy ? d.x + ',' + d.y : d.y + ',' + d.x,
                void 0 != d.z && (c[e] += ',' + d.z);
              return this.createElementNSPlus('gml:coordinates', {
                attributes: {
                  decimal: '.',
                  cs: ',',
                  ts: ' '
                },
                value: 1 == b ? c[0] : c.join(' ')
              })
            },
            LineString: function (a) {
              var b = this.createElementNSPlus('gml:LineString');
              this.writeNode('coordinates', a.components, b);
              return b
            },
            Polygon: function (a) {
              var b = this.createElementNSPlus('gml:Polygon');
              this.writeNode('outerBoundaryIs', a.components[0], b);
              for (var c = 1; c < a.components.length; ++c) this.writeNode('innerBoundaryIs', a.components[c], b);
              return b
            },
            outerBoundaryIs: function (a) {
              var b = this.createElementNSPlus('gml:outerBoundaryIs');
              this.writeNode('LinearRing', a, b);
              return b
            },
            innerBoundaryIs: function (a) {
              var b = this.createElementNSPlus('gml:innerBoundaryIs');
              this.writeNode('LinearRing', a, b);
              return b
            },
            LinearRing: function (a) {
              var b = this.createElementNSPlus('gml:LinearRing');
              this.writeNode('coordinates', a.components, b);
              return b
            },
            Box: function (a) {
              var b = this.createElementNSPlus('gml:Box');
              this.writeNode('coordinates', [
                {
                  x: a.left,
                  y: a.bottom
                },
                {
                  x: a.right,
                  y: a.top
                }
              ], b);
              this.srsName && b.setAttribute('srsName', this.srsName);
              return b
            }
          }, OpenLayers.Format.GML.Base.prototype.writers.gml),
          feature: OpenLayers.Format.GML.Base.prototype.writers.feature,
          wfs: OpenLayers.Format.GML.Base.prototype.writers.wfs
        },
        CLASS_NAME: 'OpenLayers.Format.GML.v2'
      });
      OpenLayers.Format.Filter.v1_0_0 = OpenLayers.Class(OpenLayers.Format.GML.v2, OpenLayers.Format.Filter.v1, {
        VERSION: '1.0.0',
        schemaLocation: 'http://www.opengis.net/ogc/filter/1.0.0/filter.xsd',
        initialize: function (a) {
          OpenLayers.Format.GML.v2.prototype.initialize.apply(this, [
            a
          ])
        },
        readers: {
          ogc: OpenLayers.Util.applyDefaults({
            PropertyIsEqualTo: function (a, b) {
              var c = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO
              });
              this.readChildNodes(a, c);
              b.filters.push(c)
            },
            PropertyIsNotEqualTo: function (a, b) {
              var c = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO
              });
              this.readChildNodes(a, c);
              b.filters.push(c)
            },
            PropertyIsLike: function (a, b) {
              var c = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE
              });
              this.readChildNodes(a, c);
              var d = a.getAttribute('wildCard'),
                  e = a.getAttribute('singleChar'),
                  f = a.getAttribute('escape');
              c.value2regex(d, e, f);
              b.filters.push(c)
            }
          }, OpenLayers.Format.Filter.v1.prototype.readers.ogc),
          gml: OpenLayers.Format.GML.v2.prototype.readers.gml,
          feature: OpenLayers.Format.GML.v2.prototype.readers.feature
        },
        writers: {
          ogc: OpenLayers.Util.applyDefaults({
            PropertyIsEqualTo: function (a) {
              var b = this.createElementNSPlus('ogc:PropertyIsEqualTo');
              this.writeNode('PropertyName', a, b);
              this.writeOgcExpression(a.value, b);
              return b
            },
            PropertyIsNotEqualTo: function (a) {
              var b = this.createElementNSPlus('ogc:PropertyIsNotEqualTo');
              this.writeNode('PropertyName', a, b);
              this.writeOgcExpression(a.value, b);
              return b
            },
            PropertyIsLike: function (a) {
              var b = this.createElementNSPlus('ogc:PropertyIsLike', {
                attributes: {
                  wildCard: '*',
                  singleChar: '.',
                  escape: '!'
                }
              });
              this.writeNode('PropertyName', a, b);
              this.writeNode('Literal', a.regex2value(), b);
              return b
            },
            BBOX: function (a) {
              var b = this.createElementNSPlus('ogc:BBOX');
              a.property && this.writeNode('PropertyName', a, b);
              var c = this.writeNode('gml:Box', a.value, b);
              a.projection && c.setAttribute('srsName', a.projection);
              return b
            }
          }, OpenLayers.Format.Filter.v1.prototype.writers.ogc),
          gml: OpenLayers.Format.GML.v2.prototype.writers.gml,
          feature: OpenLayers.Format.GML.v2.prototype.writers.feature
        },
        writeSpatial: function (a, b) {
          var c = this.createElementNSPlus('ogc:' + b);
          this.writeNode('PropertyName', a, c);
          if (a.value instanceof OpenLayers.Filter.Function) this.writeNode('Function', a.value, c);
          else {
            var d;
            d = a.value instanceof OpenLayers.Geometry ? this.writeNode('feature:_geometry', a.value).firstChild : this.writeNode('gml:Box', a.value);
            a.projection && d.setAttribute('srsName', a.projection);
            c.appendChild(d)
          }
          return c
        },
        CLASS_NAME: 'OpenLayers.Format.Filter.v1_0_0'
      });
      OpenLayers.Format.WFST.v1_0_0 = OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0, OpenLayers.Format.WFST.v1, {
        version: '1.0.0',
        srsNameInQuery: !1,
        schemaLocations: {
          wfs: 'http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd'
        },
        initialize: function (a) {
          OpenLayers.Format.Filter.v1_0_0.prototype.initialize.apply(this, [
            a
          ]);
          OpenLayers.Format.WFST.v1.prototype.initialize.apply(this, [
            a
          ])
        },
        readNode: function (a, b) {
          return OpenLayers.Format.GML.v2.prototype.readNode.apply(this, [
            a,
            b
          ])
        },
        readers: {
          wfs: OpenLayers.Util.applyDefaults({
            WFS_TransactionResponse: function (a, b) {
              b.insertIds = [
              ];
              b.success = !1;
              this.readChildNodes(a, b)
            },
            InsertResult: function (a, b) {
              var c = {
                fids: [
                ]
              };
              this.readChildNodes(a, c);
              b.insertIds.push(c.fids[0])
            },
            TransactionResult: function (a, b) {
              this.readChildNodes(a, b)
            },
            Status: function (a, b) {
              this.readChildNodes(a, b)
            },
            SUCCESS: function (a, b) {
              b.success = !0
            }
          }, OpenLayers.Format.WFST.v1.prototype.readers.wfs),
          gml: OpenLayers.Format.GML.v2.prototype.readers.gml,
          feature: OpenLayers.Format.GML.v2.prototype.readers.feature,
          ogc: OpenLayers.Format.Filter.v1_0_0.prototype.readers.ogc
        },
        writers: {
          wfs: OpenLayers.Util.applyDefaults({
            Query: function (a) {
              var a = OpenLayers.Util.extend({
                featureNS: this.featureNS,
                featurePrefix: this.featurePrefix,
                featureType: this.featureType,
                srsName: this.srsName,
                srsNameInQuery: this.srsNameInQuery
              }, a),
                  b = a.featurePrefix,
                  c = this.createElementNSPlus('wfs:Query', {
                    attributes: {
                      typeName: (b ? b + ':' : '') + a.featureType
                    }
                  });
              a.srsNameInQuery && a.srsName && c.setAttribute('srsName', a.srsName);
              a.featureNS && c.setAttribute('xmlns:' + b, a.featureNS);
              if (a.propertyNames) for (var b = 0, d = a.propertyNames.length; b <
                                        d; b++) this.writeNode('ogc:PropertyName', {
                property: a.propertyNames[b]
              }, c);
              a.filter && (this.setFilterProperty(a.filter), this.writeNode('ogc:Filter', a.filter, c));
              return c
            }
          }, OpenLayers.Format.WFST.v1.prototype.writers.wfs),
          gml: OpenLayers.Format.GML.v2.prototype.writers.gml,
          feature: OpenLayers.Format.GML.v2.prototype.writers.feature,
          ogc: OpenLayers.Format.Filter.v1_0_0.prototype.writers.ogc
        },
        CLASS_NAME: 'OpenLayers.Format.WFST.v1_0_0'
      });
      OpenLayers.Layer.TMS = OpenLayers.Class(OpenLayers.Layer.Grid, {
        serviceVersion: '1.0.0',
        layername: null,
        type: null,
        isBaseLayer: !0,
        tileOrigin: null,
        serverResolutions: null,
        zoomOffset: 0,
        initialize: function (a, b, c) {
          var d = [
          ];
          d.push(a, b, {
          }, c);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, d)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.TMS(this.name, this.url, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.getServerResolution(),
              c = Math.round((a.left - this.tileOrigin.lon) / (b * this.tileSize.w)),
              a = Math.round((a.bottom - this.tileOrigin.lat) / (b * this.tileSize.h)),
              c = this.serviceVersion + '/' + this.layername + '/' + this.getServerZoom() + '/' + c + '/' + a + '.' + this.type,
              a = this.url;
          OpenLayers.Util.isArray(a) && (a = this.selectUrl(c, a));
          return a + c
        },
        setMap: function (a) {
          OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
          this.tileOrigin || (this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left, this.map.maxExtent.bottom))
        },
        CLASS_NAME: 'OpenLayers.Layer.TMS'
      });
      OpenLayers.Strategy.Fixed = OpenLayers.Class(OpenLayers.Strategy, {
        preload: !1,
        activate: function () {
          if (OpenLayers.Strategy.prototype.activate.apply(this, arguments)) {
            this.layer.events.on({
              refresh: this.load,
              scope: this
            });
            if (!0 == this.layer.visibility || this.preload) this.load();
            else this.layer.events.on({
              visibilitychanged: this.load,
              scope: this
            });
            return !0
          }
          return !1
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && this.layer.events.un({
            refresh: this.load,
            visibilitychanged: this.load,
            scope: this
          });
          return a
        },
        load: function (a) {
          var b = this.layer;
          b.events.triggerEvent('loadstart');
          b.protocol.read(OpenLayers.Util.applyDefaults({
            callback: OpenLayers.Function.bind(this.merge, this, b.map.getProjectionObject()),
            filter: b.filter
          }, a));
          b.events.un({
            visibilitychanged: this.load,
            scope: this
          })
        },
        merge: function (a, b) {
          var c = this.layer;
          c.destroyFeatures();
          var d = b.features;
          if (d && 0 < d.length) {
            if (!a.equals(c.projection)) for (var e, f = 0, g = d.length; f < g; ++f) (e = d[f].geometry) && e.transform(c.projection, a);
            c.addFeatures(d)
          }
          c.events.triggerEvent('loadend')
        },
        CLASS_NAME: 'OpenLayers.Strategy.Fixed'
      });
      OpenLayers.Control.Zoom = OpenLayers.Class(OpenLayers.Control, {
        zoomInText: '+',
        zoomInId: 'olZoomInLink',
        zoomOutText: '-',
        zoomOutId: 'olZoomOutLink',
        draw: function () {
          var a = OpenLayers.Control.prototype.draw.apply(this),
              b = this.getOrCreateLinks(a),
              c = b.zoomIn,
              b = b.zoomOut,
              d = this.map.events;
          b.parentNode !== a && (d = this.events, d.attachToElement(b.parentNode));
          d.register('buttonclick', this, this.onZoomClick);
          this.zoomInLink = c;
          this.zoomOutLink = b;
          return a
        },
        getOrCreateLinks: function (a) {
          var b = document.getElementById(this.zoomInId),
              c = document.getElementById(this.zoomOutId);
          b || (b = document.createElement('a'), b.href = '#zoomIn', b.appendChild(document.createTextNode(this.zoomInText)), b.className = 'olControlZoomIn', a.appendChild(b));
          OpenLayers.Element.addClass(b, 'olButton');
          c || (c = document.createElement('a'), c.href = '#zoomOut', c.appendChild(document.createTextNode(this.zoomOutText)), c.className = 'olControlZoomOut', a.appendChild(c));
          OpenLayers.Element.addClass(c, 'olButton');
          return {
            zoomIn: b,
            zoomOut: c
          }
        },
        onZoomClick: function (a) {
          a = a.buttonElement;
          a === this.zoomInLink ? this.map.zoomIn()  : a === this.zoomOutLink && this.map.zoomOut()
        },
        destroy: function () {
          this.map && this.map.events.unregister('buttonclick', this, this.onZoomClick);
          delete this.zoomInLink;
          delete this.zoomOutLink;
          OpenLayers.Control.prototype.destroy.apply(this)
        },
        CLASS_NAME: 'OpenLayers.Control.Zoom'
      });
      OpenLayers.Layer.PointTrack = OpenLayers.Class(OpenLayers.Layer.Vector, {
        dataFrom: null,
        styleFrom: null,
        addNodes: function (a, b) {
          if (2 > a.length) throw Error('At least two point features have to be added to create a line from');
          for (var c = Array(a.length - 1), d, e, f, g = 0, h = a.length; g < h; g++) {
            d = a[g];
            if (f = d.geometry) {
              if ('OpenLayers.Geometry.Point' != f.CLASS_NAME) throw new TypeError('Only features with point geometries are supported.');
            } else f = d.lonlat,
              f = new OpenLayers.Geometry.Point(f.lon, f.lat);
            if (0 < g) {
              d = null != this.dataFrom ?
                a[g + this.dataFrom].data || a[g + this.dataFrom].attributes : null;
              var i = null != this.styleFrom ? a[g + this.styleFrom].style : null;
              e = new OpenLayers.Geometry.LineString([e,
                                                      f]);
              c[g - 1] = new OpenLayers.Feature.Vector(e, d, i)
            }
            e = f
          }
          this.addFeatures(c, b)
        },
        CLASS_NAME: 'OpenLayers.Layer.PointTrack'
      });
      OpenLayers.Layer.PointTrack.SOURCE_NODE = - 1;
      OpenLayers.Layer.PointTrack.TARGET_NODE = 0;
      OpenLayers.Layer.PointTrack.dataFrom = {
        SOURCE_NODE: - 1,
        TARGET_NODE: 0
      };
      OpenLayers.Protocol.WFS = function (a) {
        var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Protocol.WFS.DEFAULTS),
            b = OpenLayers.Protocol.WFS['v' + a.version.replace(/\./g, '_')];
        if (!b) throw 'Unsupported WFS version: ' + a.version;
        return new b(a)
      };
      OpenLayers.Protocol.WFS.fromWMSLayer = function (a, b) {
        var c,
            d;
        c = a.params.LAYERS;
        c = (OpenLayers.Util.isArray(c) ? c[0] : c).split(':');
        1 < c.length && (d = c[0]);
        c = c.pop();
        d = {
          url: a.url,
          featureType: c,
          featurePrefix: d,
          srsName: a.projection && a.projection.getCode() || a.map && a.map.getProjectionObject().getCode(),
          version: '1.1.0'
        };
        return new OpenLayers.Protocol.WFS(OpenLayers.Util.applyDefaults(b, d))
      };
      OpenLayers.Protocol.WFS.DEFAULTS = {
        version: '1.0.0'
      };
      OpenLayers.Control.Pan = OpenLayers.Class(OpenLayers.Control, {
        slideFactor: 50,
        slideRatio: null,
        direction: null,
        type: OpenLayers.Control.TYPE_BUTTON,
        initialize: function (a, b) {
          this.direction = a;
          this.CLASS_NAME += this.direction;
          OpenLayers.Control.prototype.initialize.apply(this, [
            b
          ])
        },
        trigger: function () {
          var a = OpenLayers.Function.bind(function (a) {
            return this.slideRatio ? this.map.getSize() [a] * this.slideRatio : this.slideFactor
          }, this);
          switch (this.direction) {
            case OpenLayers.Control.Pan.NORTH:
              this.map.pan(0, - a('h'));
              break;
            case OpenLayers.Control.Pan.SOUTH:
              this.map.pan(0, a('h'));
              break;
            case OpenLayers.Control.Pan.WEST:
              this.map.pan( - a('w'), 0);
              break;
            case OpenLayers.Control.Pan.EAST:
              this.map.pan(a('w'), 0)
          }
        },
        CLASS_NAME: 'OpenLayers.Control.Pan'
      });
      OpenLayers.Control.Pan.NORTH = 'North';
      OpenLayers.Control.Pan.SOUTH = 'South';
      OpenLayers.Control.Pan.EAST = 'East';
      OpenLayers.Control.Pan.WEST = 'West';
      OpenLayers.Format.CSWGetDomain = function (a) {
        var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Format.CSWGetDomain.DEFAULTS),
            b = OpenLayers.Format.CSWGetDomain['v' + a.version.replace(/\./g, '_')];
        if (!b) throw 'Unsupported CSWGetDomain version: ' + a.version;
        return new b(a)
      };
      OpenLayers.Format.CSWGetDomain.DEFAULTS = {
        version: '2.0.2'
      };
      OpenLayers.Format.CSWGetDomain.v2_0_2 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance',
          csw: 'http://www.opengis.net/cat/csw/2.0.2'
        },
        defaultPrefix: 'csw',
        version: '2.0.2',
        schemaLocation: 'http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd',
        PropertyName: null,
        ParameterName: null,
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 ==
            a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          csw: {
            GetDomainResponse: function (a, b) {
              this.readChildNodes(a, b)
            },
            DomainValues: function (a, b) {
              OpenLayers.Util.isArray(b.DomainValues) || (b.DomainValues = [
              ]);
              for (var c = a.attributes, d = {
              }, e = 0, f = c.length; e < f; ++e) d[c[e].name] = c[e].nodeValue;
              this.readChildNodes(a, d);
              b.DomainValues.push(d)
            },
            PropertyName: function (a, b) {
              b.PropertyName = this.getChildValue(a)
            },
            ParameterName: function (a, b) {
              b.ParameterName = this.getChildValue(a)
            },
            ListOfValues: function (a, b) {
              OpenLayers.Util.isArray(b.ListOfValues) || (b.ListOfValues = [
              ]);
              this.readChildNodes(a, b.ListOfValues)
            },
            Value: function (a, b) {
              for (var c = a.attributes, d = {
              }, e = 0, f = c.length; e < f; ++e) d[c[e].name] = c[e].nodeValue;
              d.value = this.getChildValue(a);
              b.push({
                Value: d
              })
            },
            ConceptualScheme: function (a, b) {
              b.ConceptualScheme = {
              };
              this.readChildNodes(a, b.ConceptualScheme)
            },
            Name: function (a, b) {
              b.Name = this.getChildValue(a)
            },
            Document: function (a, b) {
              b.Document = this.getChildValue(a)
            },
            Authority: function (a, b) {
              b.Authority = this.getChildValue(a)
            },
            RangeOfValues: function (a, b) {
              b.RangeOfValues = {
              };
              this.readChildNodes(a, b.RangeOfValues)
            },
            MinValue: function (a, b) {
              for (var c = a.attributes, d = {
              }, e = 0, f = c.length; e < f; ++e) d[c[e].name] = c[e].nodeValue;
              d.value = this.getChildValue(a);
              b.MinValue = d
            },
            MaxValue: function (a, b) {
              for (var c = a.attributes, d = {
              }, e = 0, f = c.length; e < f; ++e) d[c[e].name] = c[e].nodeValue;
              d.value = this.getChildValue(a);
              b.MaxValue = d
            }
          }
        },
        write: function (a) {
          a = this.writeNode('csw:GetDomain', a);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        writers: {
          csw: {
            GetDomain: function (a) {
              var b = this.createElementNSPlus('csw:GetDomain', {
                attributes: {
                  service: 'CSW',
                  version: this.version
                }
              });
              if (a.PropertyName || this.PropertyName) this.writeNode('csw:PropertyName', a.PropertyName || this.PropertyName, b);
              else if (a.ParameterName || this.ParameterName) this.writeNode('csw:ParameterName', a.ParameterName || this.ParameterName, b);
              this.readChildNodes(b, a);
              return b
            },
            PropertyName: function (a) {
              return this.createElementNSPlus('csw:PropertyName', {
                value: a
              })
            },
            ParameterName: function (a) {
              return this.createElementNSPlus('csw:ParameterName', {
                value: a
              })
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.CSWGetDomain.v2_0_2'
      });
      OpenLayers.Format.ArcXML.Features = OpenLayers.Class(OpenLayers.Format.XML, {
        read: function (a) {
          return (new OpenLayers.Format.ArcXML).read(a).features.feature
        }
      });
      OpenLayers.Date = {
        toISOString: function () {
          if ('toISOString' in Date.prototype) return function (a) {
            return a.toISOString()
          };
          var a = function (a, c) {
            for (var d = a + ''; d.length < c; ) d = '0' + d;
            return d
          };
          return function (b) {
            return isNaN(b.getTime()) ? 'Invalid Date' : b.getUTCFullYear() + '-' + a(b.getUTCMonth() + 1, 2) + '-' + a(b.getUTCDate(), 2) + 'T' + a(b.getUTCHours(), 2) + ':' + a(b.getUTCMinutes(), 2) + ':' + a(b.getUTCSeconds(), 2) + '.' + a(b.getUTCMilliseconds(), 3) + 'Z'
          }
        }(),
        parse: function (a) {
          var b;
          if ((a = a.match(/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/)) && (a[1] || a[7])) {
            b = parseInt(a[1], 10) || 0;
            var c = parseInt(a[2], 10) - 1 || 0,
                d = parseInt(a[3], 10) || 1;
            b = new Date(Date.UTC(b, c, d));
            if (c = a[7]) {
              var d = parseInt(a[4], 10),
                  e = parseInt(a[5], 10),
                  f = parseFloat(a[6]),
                  g = f | 0,
                  f = Math.round(1000 * (f - g));
              b.setUTCHours(d, e, g, f);
              'Z' !== c && (c = parseInt(c, 10), a = parseInt(a[8], 10) || 0, b = new Date(b.getTime() + - 1000 * (60 * 60 * c + 60 * a)))
            }
          } else b = new Date('invalid');
          return b
        }
      }; (function () {
        function a() {
          this._object = f && !i ? new f : new window.ActiveXObject('Microsoft.XMLHTTP');
          this._listeners = [
          ]
        }
        function b() {
          return new a
        }
        function c(a) {
          b.onreadystatechange && b.onreadystatechange.apply(a);
          a.dispatchEvent({
            type: 'readystatechange',
            bubbles: !1,
            cancelable: !1,
            timeStamp: new Date + 0
          })
        }
        function d(a) {
          try {
            a.responseText = a._object.responseText
          } catch (b) {
          }
          try {
            var c;
            var d = a._object,
                e = d.responseXML,
                f = d.responseText;
            h && (f && e && !e.documentElement && d.getResponseHeader('Content-Type').match(/[^\/]+\/[^\+]+\+xml/)) && (e = new window.ActiveXObject('Microsoft.XMLDOM'), e.async = !1, e.validateOnParse = !1, e.loadXML(f));
            c = e && (h && 0 != e.parseError || !e.documentElement || e.documentElement && 'parsererror' == e.documentElement.tagName) ? null : e;
            a.responseXML = c
          } catch (g) {
          }
          try {
            a.status = a._object.status
          } catch (i) {
          }
          try {
            a.statusText = a._object.statusText
          } catch (r) {
          }
        }
        function e(a) {
          a._object.onreadystatechange = new window.Function
        }
        var f = window.XMLHttpRequest,
            g = !!window.controllers,
            h = window.document.all && !window.opera,
            i = h && window.navigator.userAgent.match(/MSIE 7.0/);
        b.prototype = a.prototype;
        g && f.wrapped && (b.wrapped = f.wrapped);
        b.UNSENT = 0;
        b.OPENED = 1;
        b.HEADERS_RECEIVED = 2;
        b.LOADING = 3;
        b.DONE = 4;
        b.prototype.readyState = b.UNSENT;
        b.prototype.responseText = '';
        b.prototype.responseXML = null;
        b.prototype.status = 0;
        b.prototype.statusText = '';
        b.prototype.priority = 'NORMAL';
        b.prototype.onreadystatechange = null;
        b.onreadystatechange = null;
        b.onopen = null;
        b.onsend = null;
        b.onabort = null;
        b.prototype.open = function (a, f, i, m, n) {
          delete this._headers;
          arguments.length < 3 && (i = true);
          this._async = i;
          var o = this,
              p = this.readyState,
              q;
          if (h && i) {
            q = function () {
              if (p != b.DONE) {
                e(o);
                o.abort()
              }
            };
            window.attachEvent('onunload', q)
          }
          b.onopen && b.onopen.apply(this, arguments);
          arguments.length > 4 ? this._object.open(a, f, i, m, n)  : arguments.length > 3 ? this._object.open(a, f, i, m)  : this._object.open(a, f, i);
          this.readyState = b.OPENED;
          c(this);
          this._object.onreadystatechange = function () {
            if (!g || i) {
              o.readyState = o._object.readyState;
              d(o);
              if (o._aborted) o.readyState = b.UNSENT;
              else {
                if (o.readyState == b.DONE) {
                  delete o._data;
                  e(o);
                  h && i && window.detachEvent('onunload', q)
                }
                p != o.readyState && c(o);
                p = o.readyState
              }
            }
          }
        };
        b.prototype.send = function (a) {
          b.onsend && b.onsend.apply(this, arguments);
          arguments.length || (a = null);
          if (a && a.nodeType) {
            a = window.XMLSerializer ? (new window.XMLSerializer).serializeToString(a)  : a.xml;
            this._headers['Content-Type'] || this._object.setRequestHeader('Content-Type', 'application/xml')
          }
          this._data = a;
          a: {
            this._object.send(this._data);
            if (g && !this._async) {
              this.readyState = b.OPENED;
              for (d(this); this.readyState < b.DONE; ) {
                this.readyState++;
                c(this);
                if (this._aborted) break a
                  }
            }
          }
        };
        b.prototype.abort = function () {
          b.onabort && b.onabort.apply(this, arguments);
          if (this.readyState > b.UNSENT) this._aborted = true;
          this._object.abort();
          e(this);
          this.readyState = b.UNSENT;
          delete this._data
        };
        b.prototype.getAllResponseHeaders = function () {
          return this._object.getAllResponseHeaders()
        };
        b.prototype.getResponseHeader = function (a) {
          return this._object.getResponseHeader(a)
        };
        b.prototype.setRequestHeader = function (a, b) {
          if (!this._headers) this._headers = {
          };
          this._headers[a] = b;
          return this._object.setRequestHeader(a, b)
        };
        b.prototype.addEventListener = function (a, b, c) {
          for (var d = 0, e; e = this._listeners[d]; d++) if (e[0] == a && e[1] == b && e[2] == c) return;
          this._listeners.push([a,
                                b,
                                c])
        };
        b.prototype.removeEventListener = function (a, b, c) {
          for (var d = 0, e; e = this._listeners[d]; d++) if (e[0] == a && e[1] == b && e[2] == c) break;
          e && this._listeners.splice(d, 1)
        };
        b.prototype.dispatchEvent = function (a) {
          a = {
            type: a.type,
            target: this,
            currentTarget: this,
            eventPhase: 2,
            bubbles: a.bubbles,
            cancelable: a.cancelable,
            timeStamp: a.timeStamp,
            stopPropagation: function () {
            },
            preventDefault: function () {
            },
            initEvent: function () {
            }
          };
          a.type == 'readystatechange' && this.onreadystatechange && (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [
            a
          ]);
          for (var b = 0, c; c = this._listeners[b]; b++) c[0] == a.type && !c[2] && (c[1].handleEvent || c[1]).apply(this, [
            a
          ])
            };
        b.prototype.toString = function () {
          return '[object XMLHttpRequest]'
        };
        b.toString = function () {
          return '[XMLHttpRequest]'
        };
        window.Function.prototype.apply || (window.Function.prototype.apply = function (a, b) {
          b || (b = [
          ]);
          a.__func = this;
          a.__func(b[0], b[1], b[2], b[3], b[4]);
          delete a.__func
        });
        OpenLayers.Request.XMLHttpRequest = b
      }) ();
      OpenLayers.Format.KML = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          kml: 'http://www.opengis.net/kml/2.2',
          gx: 'http://www.google.com/kml/ext/2.2'
        },
        kmlns: 'http://earth.google.com/kml/2.0',
        placemarksDesc: 'No description available',
        foldersName: 'OpenLayers export',
        foldersDesc: 'Exported on ' + new Date,
        extractAttributes: !0,
        kvpAttributes: !1,
        extractStyles: !1,
        extractTracks: !1,
        trackAttributes: null,
        internalns: null,
        features: null,
        styles: null,
        styleBaseUrl: '',
        fetched: null,
        maxDepth: 0,
        initialize: function (a) {
          this.regExes = {
            trimSpace: /^\s*|\s*$/g,
            removeSpace: /\s*/g,
            splitSpace: /\s+/,
            trimComma: /\s*,\s*/g,
            kmlColor: /(\w{2})(\w{2})(\w{2})(\w{2})/,
            kmlIconPalette: /root:\/\/icons\/palette-(\d+)(\.\w+)/,
            straightBracket: /\$\[(.*?)\]/g
          };
          this.externalProjection = new OpenLayers.Projection('EPSG:4326');
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          this.features = [
          ];
          this.styles = {
          };
          this.fetched = {
          };
          return this.parseData(a, {
            depth: 0,
            styleBaseUrl: this.styleBaseUrl
          })
        },
        parseData: function (a, b) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          for (var c = [
            'Link',
            'NetworkLink',
            'Style',
            'StyleMap',
            'Placemark'
          ], d = 0, e = c.length; d < e; ++d) {
            var f = c[d],
                g = this.getElementsByTagNameNS(a, '*', f);
            if (0 != g.length) switch (f.toLowerCase()) {
              case 'link':
              case 'networklink':
                this.parseLinks(g, b);
                break;
              case 'style':
                this.extractStyles && this.parseStyles(g, b);
                break;
              case 'stylemap':
                this.extractStyles && this.parseStyleMaps(g, b);
                break;
              case 'placemark':
                this.parseFeatures(g, b)
            }
          }
          return this.features
        },
        parseLinks: function (a, b) {
          if (b.depth >= this.maxDepth) return !1;
          var c = OpenLayers.Util.extend({
          }, b);
          c.depth++;
          for (var d = 0, e = a.length; d < e; d++) {
            var f = this.parseProperty(a[d], '*', 'href');
            f && !this.fetched[f] && (this.fetched[f] = !0, (f = this.fetchLink(f)) && this.parseData(f, c))
          }
        },
        fetchLink: function (a) {
          if (a = OpenLayers.Request.GET({
            url: a,
            async: !1
          })) return a.responseText
            },
        parseStyles: function (a, b) {
          for (var c = 0, d = a.length; c < d; c++) {
            var e = this.parseStyle(a[c]);
            e && (this.styles[(b.styleBaseUrl || '') + '#' + e.id] = e)
          }
        },
        parseKmlColor: function (a) {
          var b = null;
          a && (a = a.match(this.regExes.kmlColor)) && (b = {
            color: '#' + a[4] + a[3] + a[2],
            opacity: parseInt(a[1], 16) / 255
          });
          return b
        },
        parseStyle: function (a) {
          for (var b = {
          }, c = [
            'LineStyle',
            'PolyStyle',
            'IconStyle',
            'BalloonStyle',
            'LabelStyle'
          ], d, e, f = 0, g = c.length; f < g; ++f) if (d = c[f], e = this.getElementsByTagNameNS(a, '*', d) [0]) switch (d.toLowerCase()) {
            case 'linestyle':
              d = this.parseProperty(e, '*', 'color');
              if (d = this.parseKmlColor(d)) b.strokeColor = d.color,
                b.strokeOpacity = d.opacity;
              (d = this.parseProperty(e, '*', 'width')) && (b.strokeWidth = d);
              break;
            case 'polystyle':
              d = this.parseProperty(e, '*', 'color');
              if (d = this.parseKmlColor(d)) b.fillOpacity = d.opacity,
                b.fillColor = d.color;
              '0' == this.parseProperty(e, '*', 'fill') && (b.fillColor = 'none');
              '0' == this.parseProperty(e, '*', 'outline') && (b.strokeWidth = '0');
              break;
            case 'iconstyle':
              var h = parseFloat(this.parseProperty(e, '*', 'scale') || 1);
              d = 32 * h;
              var i = 32 * h,
                  j = this.getElementsByTagNameNS(e, '*', 'Icon') [0];
              if (j) {
                var k = this.parseProperty(j, '*', 'href');
                if (k) {
                  var l = this.parseProperty(j, '*', 'w'),
                      m = this.parseProperty(j, '*', 'h');
                  OpenLayers.String.startsWith(k, 'http://maps.google.com/mapfiles/kml') && (!l && !m) && (m = l = 64, h /= 2);
                  l = l || m;
                  m = m || l;
                  l && (d = parseInt(l) * h);
                  m && (i = parseInt(m) * h);
                  if (m = k.match(this.regExes.kmlIconPalette)) l = m[1],
                    m = m[2],
                    k = this.parseProperty(j, '*', 'x'),
                    j = this.parseProperty(j, '*', 'y'),
                    k = 'http://maps.google.com/mapfiles/kml/pal' + l + '/icon' + (8 * (j ? 7 - j / 32 : 7) + (k ? k / 32 : 0)) + m;
                  b.graphicOpacity = 1;
                  b.externalGraphic = k
                }
              }
              if (e = this.getElementsByTagNameNS(e, '*', 'hotSpot') [0]) k = parseFloat(e.getAttribute('x')),
                j = parseFloat(e.getAttribute('y')),
                l = e.getAttribute('xunits'),
                'pixels' == l ? b.graphicXOffset = - k * h : 'insetPixels' == l ? b.graphicXOffset = - d + k * h : 'fraction' == l && (b.graphicXOffset = - d * k),
                e = e.getAttribute('yunits'),
                'pixels' == e ? b.graphicYOffset = - i + j * h + 1 : 'insetPixels' == e ? b.graphicYOffset = - (j * h) + 1 : 'fraction' == e && (b.graphicYOffset = - i * (1 - j) + 1);
              b.graphicWidth = d;
              b.graphicHeight = i;
              break;
            case 'balloonstyle':
              (e = OpenLayers.Util.getXmlNodeValue(e)) && (b.balloonStyle = e.replace(this.regExes.straightBracket, '${$1}'));
              break;
            case 'labelstyle':
              if (d = this.parseProperty(e, '*', 'color'), d = this.parseKmlColor(d)) b.fontColor = d.color,
                b.fontOpacity = d.opacity
                }
          !b.strokeColor && b.fillColor && (b.strokeColor = b.fillColor);
          if ((a = a.getAttribute('id')) && b) b.id = a;
          return b
        },
        parseStyleMaps: function (a, b) {
          for (var c = 0, d = a.length; c < d; c++) for (var e = a[c], f = this.getElementsByTagNameNS(e, '*', 'Pair'), e = e.getAttribute('id'), g = 0, h = f.length; g < h; g++) {
            var i = f[g],
                j = this.parseProperty(i, '*', 'key');
            (i = this.parseProperty(i, '*', 'styleUrl')) && 'normal' == j && (this.styles[(b.styleBaseUrl || '') + '#' + e] = this.styles[(b.styleBaseUrl || '') + i])
          }
        },
        parseFeatures: function (a, b) {
          for (var c = [
          ], d = 0, e = a.length; d < e; d++) {
            var f = a[d],
                g = this.parseFeature.apply(this, [
                  f
                ]);
            if (g) {
              this.extractStyles && (g.attributes && g.attributes.styleUrl) && (g.style = this.getStyle(g.attributes.styleUrl, b));
              if (this.extractStyles) {
                var h = this.getElementsByTagNameNS(f, '*', 'Style') [0];
                if (h && (h = this.parseStyle(h))) g.style = OpenLayers.Util.extend(g.style, h)
                  }
              if (this.extractTracks) {
                if ((f = this.getElementsByTagNameNS(f, this.namespaces.gx, 'Track')) && 0 < f.length) g = {
                  features: [
                  ],
                  feature: g
                },
                  this.readNode(f[0], g),
                  0 < g.features.length && c.push.apply(c, g.features)
                  } else c.push(g)
                    } else throw 'Bad Placemark: ' + d;
          }
          this.features = this.features.concat(c)
        },
        readers: {
          kml: {
            when: function (a, b) {
              b.whens.push(OpenLayers.Date.parse(this.getChildValue(a)))
            },
            _trackPointAttribute: function (a, b) {
              var c = a.nodeName.split(':').pop();
              b.attributes[c].push(this.getChildValue(a))
            }
          },
          gx: {
            Track: function (a, b) {
              var c = {
                whens: [
                ],
                points: [
                ],
                angles: [
                ]
              };
              if (this.trackAttributes) {
                var d;
                c.attributes = {
                };
                for (var e = 0, f = this.trackAttributes.length; e <
                     f; ++e) d = this.trackAttributes[e],
                  c.attributes[d] = [
                ],
                  d in this.readers.kml || (this.readers.kml[d] = this.readers.kml._trackPointAttribute)
                  }
              this.readChildNodes(a, c);
              if (c.whens.length !== c.points.length) throw Error('gx:Track with unequal number of when (' + c.whens.length + ') and gx:coord (' + c.points.length + ') elements.');
              var g = 0 < c.angles.length;
              if (g && c.whens.length !== c.angles.length) throw Error('gx:Track with unequal number of when (' + c.whens.length + ') and gx:angles (' + c.angles.length + ') elements.');
              for (var h, i, e = 0, f = c.whens.length; e < f; ++e) {
                h = b.feature.clone();
                h.fid = b.feature.fid || b.feature.id;
                i = c.points[e];
                h.geometry = i;
                'z' in i && (h.attributes.altitude = i.z);
                this.internalProjection && this.externalProjection && h.geometry.transform(this.externalProjection, this.internalProjection);
                if (this.trackAttributes) {
                  i = 0;
                  for (var j = this.trackAttributes.length; i < j; ++i) h.attributes[d] = c.attributes[this.trackAttributes[i]][e]
                    }
                h.attributes.when = c.whens[e];
                h.attributes.trackId = b.feature.id;
                g && (i = c.angles[e], h.attributes.heading = parseFloat(i[0]), h.attributes.tilt = parseFloat(i[1]), h.attributes.roll = parseFloat(i[2]));
                b.features.push(h)
              }
            },
            coord: function (a, b) {
              var c = this.getChildValue(a).replace(this.regExes.trimSpace, '').split(/\s+/),
                  d = new OpenLayers.Geometry.Point(c[0], c[1]);
              2 < c.length && (d.z = parseFloat(c[2]));
              b.points.push(d)
            },
            angles: function (a, b) {
              var c = this.getChildValue(a).replace(this.regExes.trimSpace, '').split(/\s+/);
              b.angles.push(c)
            }
          }
        },
        parseFeature: function (a) {
          for (var b = [
            'MultiGeometry',
            'Polygon',
            'LineString',
            'Point'
          ], c, d, e, f = 0, g = b.length; f < g; ++f) if (c = b[f], this.internalns = a.namespaceURI ? a.namespaceURI : this.kmlns, d = this.getElementsByTagNameNS(a, this.internalns, c), 0 < d.length) {
            if (b = this.parseGeometry[c.toLowerCase()]) e = b.apply(this, [
              d[0]
            ]),
              this.internalProjection && this.externalProjection && e.transform(this.externalProjection, this.internalProjection);
            else throw new TypeError('Unsupported geometry type: ' + c);
            break
          }
          var h;
          this.extractAttributes && (h = this.parseAttributes(a));
          c = new OpenLayers.Feature.Vector(e, h);
          a = a.getAttribute('id') || a.getAttribute('name');
          null != a && (c.fid = a);
          return c
        },
        getStyle: function (a, b) {
          var c = OpenLayers.Util.removeTail(a),
              d = OpenLayers.Util.extend({
              }, b);
          d.depth++;
          d.styleBaseUrl = c;
          !this.styles[a] && !OpenLayers.String.startsWith(a, '#') && d.depth <= this.maxDepth && !this.fetched[c] && (c = this.fetchLink(c)) && this.parseData(c, d);
          return OpenLayers.Util.extend({
          }, this.styles[a])
        },
        parseGeometry: {
          point: function (a) {
            var b = this.getElementsByTagNameNS(a, this.internalns, 'coordinates'),
                a = [
                ];
            if (0 < b.length) var c = b[0].firstChild.nodeValue,
                c = c.replace(this.regExes.removeSpace, ''),
                a = c.split(',');
            b = null;
            if (1 < a.length) 2 == a.length && (a[2] = null),
              b = new OpenLayers.Geometry.Point(a[0], a[1], a[2]);
            else throw 'Bad coordinate string: ' + c;
            return b
          },
          linestring: function (a, b) {
            var c = this.getElementsByTagNameNS(a, this.internalns, 'coordinates'),
                d = null;
            if (0 < c.length) {
              for (var c = this.getChildValue(c[0]), c = c.replace(this.regExes.trimSpace, ''), c = c.replace(this.regExes.trimComma, ','), d = c.split(this.regExes.splitSpace), e = d.length, f = Array(e), g, h, i = 0; i < e; ++i) if (g = d[i].split(','), h = g.length, 1 < h) 2 == g.length && (g[2] = null),
                f[i] = new OpenLayers.Geometry.Point(g[0], g[1], g[2]);
                else throw 'Bad LineString point coordinates: ' + d[i];
              if (e) d = b ? new OpenLayers.Geometry.LinearRing(f)  : new OpenLayers.Geometry.LineString(f);
              else throw 'Bad LineString coordinates: ' + c;
            }
            return d
          },
          polygon: function (a) {
            var a = this.getElementsByTagNameNS(a, this.internalns, 'LinearRing'),
                b = a.length,
                c = Array(b);
            if (0 < b) for (var d = 0, e = a.length; d < e; ++d) if (b = this.parseGeometry.linestring.apply(this, [
              a[d],
              !0
            ])) c[d] = b;
              else throw 'Bad LinearRing geometry: ' + d;
            return new OpenLayers.Geometry.Polygon(c)
          },
          multigeometry: function (a) {
            for (var b, c = [
            ], d = a.childNodes, e = 0, f = d.length; e < f; ++e) a = d[e],
              1 == a.nodeType && (b = this.parseGeometry[(a.prefix ? a.nodeName.split(':') [1] : a.nodeName).toLowerCase()]) && c.push(b.apply(this, [
              a
            ]));
            return new OpenLayers.Geometry.Collection(c)
          }
        },
        parseAttributes: function (a) {
          var b = {
          },
              c = a.getElementsByTagName('ExtendedData');
          c.length && (b = this.parseExtendedData(c[0]));
          for (var d, e, f, a = a.childNodes, c = 0, g = a.length; c < g; ++c) if (d = a[c], 1 == d.nodeType && (e = d.childNodes, 1 <= e.length && 3 >= e.length)) {
            switch (e.length) {
              case 1:
                f = e[0];
                break;
              case 2:
                f = e[0];
                e = e[1];
                f = 3 == f.nodeType || 4 == f.nodeType ? f : e;
                break;
              default:
                f = e[1]
            }
            if (3 == f.nodeType || 4 == f.nodeType) if (d = d.prefix ? d.nodeName.split(':') [1] : d.nodeName, f = OpenLayers.Util.getXmlNodeValue(f)) f = f.replace(this.regExes.trimSpace, ''),
              b[d] = f
              }
          return b
        },
        parseExtendedData: function (a) {
          var b = {
          },
              c,
              d,
              e,
              f,
              g = a.getElementsByTagName('Data');
          c = 0;
          for (d = g.length; c < d; c++) {
            e = g[c];
            f = e.getAttribute('name');
            var h = {
            },
                i = e.getElementsByTagName('value');
            i.length && (h.value = this.getChildValue(i[0]));
            this.kvpAttributes ? b[f] = h.value : (e = e.getElementsByTagName('displayName'), e.length && (h.displayName = this.getChildValue(e[0])), b[f] = h)
          }
          a = a.getElementsByTagName('SimpleData');
          c = 0;
          for (d = a.length; c < d; c++) h = {
          },
            e = a[c],
            f = e.getAttribute('name'),
            h.value = this.getChildValue(e),
            this.kvpAttributes ? b[f] = h.value : (h.displayName = f, b[f] = h);
          return b
        },
        parseProperty: function (a, b, c) {
          var d,
              a = this.getElementsByTagNameNS(a, b, c);
          try {
            d = OpenLayers.Util.getXmlNodeValue(a[0])
          } catch (e) {
            d = null
          }
          return d
        },
        write: function (a) {
          OpenLayers.Util.isArray(a) || (a = [
            a
          ]);
          for (var b = this.createElementNS(this.kmlns, 'kml'), c = this.createFolderXML(), d = 0, e = a.length; d < e; ++d) c.appendChild(this.createPlacemarkXML(a[d]));
          b.appendChild(c);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ])
        },
        createFolderXML: function () {
          var a = this.createElementNS(this.kmlns, 'Folder');
          if (this.foldersName) {
            var b = this.createElementNS(this.kmlns, 'name'),
                c = this.createTextNode(this.foldersName);
            b.appendChild(c);
            a.appendChild(b)
          }
          this.foldersDesc && (b = this.createElementNS(this.kmlns, 'description'), c = this.createTextNode(this.foldersDesc), b.appendChild(c), a.appendChild(b));
          return a
        },
        createPlacemarkXML: function (a) {
          var b = this.createElementNS(this.kmlns, 'name');
          b.appendChild(this.createTextNode(a.style && a.style.label ? a.style.label : a.attributes.name || a.id));
          var c = this.createElementNS(this.kmlns, 'description');
          c.appendChild(this.createTextNode(a.attributes.description || this.placemarksDesc));
          var d = this.createElementNS(this.kmlns, 'Placemark');
          null !=
            a.fid && d.setAttribute('id', a.fid);
          d.appendChild(b);
          d.appendChild(c);
          b = this.buildGeometryNode(a.geometry);
          d.appendChild(b);
          a.attributes && (a = this.buildExtendedData(a.attributes)) && d.appendChild(a);
          return d
        },
        buildGeometryNode: function (a) {
          var b = a.CLASS_NAME,
              b = this.buildGeometry[b.substring(b.lastIndexOf('.') + 1).toLowerCase()],
              c = null;
          b && (c = b.apply(this, [
            a
          ]));
          return c
        },
        buildGeometry: {
          point: function (a) {
            var b = this.createElementNS(this.kmlns, 'Point');
            b.appendChild(this.buildCoordinatesNode(a));
            return b
          },
          multipoint: function (a) {
            return this.buildGeometry.collection.apply(this, [
              a
            ])
          },
          linestring: function (a) {
            var b = this.createElementNS(this.kmlns, 'LineString');
            b.appendChild(this.buildCoordinatesNode(a));
            return b
          },
          multilinestring: function (a) {
            return this.buildGeometry.collection.apply(this, [
              a
            ])
          },
          linearring: function (a) {
            var b = this.createElementNS(this.kmlns, 'LinearRing');
            b.appendChild(this.buildCoordinatesNode(a));
            return b
          },
          polygon: function (a) {
            for (var b = this.createElementNS(this.kmlns, 'Polygon'), a = a.components, c, d, e = 0, f = a.length; e < f; ++e) c = 0 == e ? 'outerBoundaryIs' : 'innerBoundaryIs',
              c = this.createElementNS(this.kmlns, c),
              d = this.buildGeometry.linearring.apply(this, [
              a[e]
            ]),
              c.appendChild(d),
              b.appendChild(c);
            return b
          },
          multipolygon: function (a) {
            return this.buildGeometry.collection.apply(this, [
              a
            ])
          },
          collection: function (a) {
            for (var b = this.createElementNS(this.kmlns, 'MultiGeometry'), c, d = 0, e = a.components.length; d < e; ++d) (c = this.buildGeometryNode.apply(this, [
              a.components[d]
            ])) && b.appendChild(c);
            return b
          }
        },
        buildCoordinatesNode: function (a) {
          var b = this.createElementNS(this.kmlns, 'coordinates'),
              c;
          if (c = a.components) {
            for (var d = c.length, e = Array(d), f = 0; f < d; ++f) a = c[f],
              e[f] = this.buildCoordinates(a);
            c = e.join(' ')
          } else c = this.buildCoordinates(a);
          c = this.createTextNode(c);
          b.appendChild(c);
          return b
        },
        buildCoordinates: function (a) {
          this.internalProjection && this.externalProjection && (a = a.clone(), a.transform(this.internalProjection, this.externalProjection));
          return a.x + ',' + a.y
        },
        buildExtendedData: function (a) {
          var b = this.createElementNS(this.kmlns, 'ExtendedData'),
              c;
          for (c in a) if (a[c] && 'name' != c && 'description' !=
                           c && 'styleUrl' != c) {
            var d = this.createElementNS(this.kmlns, 'Data');
            d.setAttribute('name', c);
            var e = this.createElementNS(this.kmlns, 'value');
            if ('object' == typeof a[c]) {
              if (a[c].value && e.appendChild(this.createTextNode(a[c].value)), a[c].displayName) {
                var f = this.createElementNS(this.kmlns, 'displayName');
                f.appendChild(this.getXMLDoc().createCDATASection(a[c].displayName));
                d.appendChild(f)
              }
            } else e.appendChild(this.createTextNode(a[c]));
            d.appendChild(e);
            b.appendChild(d)
          }
          return this.isSimpleContent(b) ? null : b
        },
        CLASS_NAME: 'OpenLayers.Format.KML'
      });
      OpenLayers.Popup = OpenLayers.Class({
        events: null,
        id: '',
        lonlat: null,
        div: null,
        contentSize: null,
        size: null,
        contentHTML: null,
        backgroundColor: '',
        opacity: '',
        border: '',
        contentDiv: null,
        groupDiv: null,
        closeDiv: null,
        autoSize: !1,
        minSize: null,
        maxSize: null,
        displayClass: 'olPopup',
        contentDisplayClass: 'olPopupContent',
        padding: 0,
        disableFirefoxOverflowHack: !1,
        fixPadding: function () {
          'number' == typeof this.padding && (this.padding = new OpenLayers.Bounds(this.padding, this.padding, this.padding, this.padding))
        },
        panMapIfOutOfView: !1,
        keepInMap: !1,
        closeOnMove: !1,
        map: null,
        initialize: function (a, b, c, d, e, f) {
          null == a && (a = OpenLayers.Util.createUniqueID(this.CLASS_NAME + '_'));
          this.id = a;
          this.lonlat = b;
          this.contentSize = null != c ? c : new OpenLayers.Size(OpenLayers.Popup.WIDTH, OpenLayers.Popup.HEIGHT);
          null != d && (this.contentHTML = d);
          this.backgroundColor = OpenLayers.Popup.COLOR;
          this.opacity = OpenLayers.Popup.OPACITY;
          this.border = OpenLayers.Popup.BORDER;
          this.div = OpenLayers.Util.createDiv(this.id, null, null, null, null, null, 'hidden');
          this.div.className = this.displayClass;
          this.groupDiv = OpenLayers.Util.createDiv(this.id + '_GroupDiv', null, null, null, 'relative', null, 'hidden');
          a = this.div.id + '_contentDiv';
          this.contentDiv = OpenLayers.Util.createDiv(a, null, this.contentSize.clone(), null, 'relative');
          this.contentDiv.className = this.contentDisplayClass;
          this.groupDiv.appendChild(this.contentDiv);
          this.div.appendChild(this.groupDiv);
          e && this.addCloseBox(f);
          this.registerEvents()
        },
        destroy: function () {
          this.border = this.opacity = this.backgroundColor = this.contentHTML = this.size = this.lonlat = this.id = null;
          this.closeOnMove && this.map && this.map.events.unregister('movestart', this, this.hide);
          this.events.destroy();
          this.events = null;
          this.closeDiv && (OpenLayers.Event.stopObservingElement(this.closeDiv), this.groupDiv.removeChild(this.closeDiv));
          this.closeDiv = null;
          this.div.removeChild(this.groupDiv);
          this.groupDiv = null;
          null != this.map && this.map.removePopup(this);
          this.panMapIfOutOfView = this.padding = this.maxSize = this.minSize = this.autoSize = this.div = this.map = null
        },
        draw: function (a) {
          null == a && null != this.lonlat && null !=
            this.map && (a = this.map.getLayerPxFromLonLat(this.lonlat));
          this.closeOnMove && this.map.events.register('movestart', this, this.hide);
          !this.disableFirefoxOverflowHack && 'firefox' == OpenLayers.BROWSER_NAME && (this.map.events.register('movestart', this, function () {
            var a = document.defaultView.getComputedStyle(this.contentDiv, null).getPropertyValue('overflow');
            'hidden' != a && (this.contentDiv._oldOverflow = a, this.contentDiv.style.overflow = 'hidden')
          }), this.map.events.register('moveend', this, function () {
            var a = this.contentDiv._oldOverflow;
            a && (this.contentDiv.style.overflow = a, this.contentDiv._oldOverflow = null)
          }));
          this.moveTo(a);
          !this.autoSize && !this.size && this.setSize(this.contentSize);
          this.setBackgroundColor();
          this.setOpacity();
          this.setBorder();
          this.setContentHTML();
          this.panMapIfOutOfView && this.panIntoView();
          return this.div
        },
        updatePosition: function () {
          if (this.lonlat && this.map) {
            var a = this.map.getLayerPxFromLonLat(this.lonlat);
            a && this.moveTo(a)
          }
        },
        moveTo: function (a) {
          null != a && null != this.div && (this.div.style.left = a.x + 'px', this.div.style.top = a.y + 'px')
        },
        visible: function () {
          return OpenLayers.Element.visible(this.div)
        },
        toggle: function () {
          this.visible() ? this.hide()  : this.show()
        },
        show: function () {
          this.div.style.display = '';
          this.panMapIfOutOfView && this.panIntoView()
        },
        hide: function () {
          this.div.style.display = 'none'
        },
        setSize: function (a) {
          this.size = a.clone();
          var b = this.getContentDivPadding(),
              c = b.left + b.right,
              d = b.top + b.bottom;
          this.fixPadding();
          c += this.padding.left + this.padding.right;
          d += this.padding.top + this.padding.bottom;
          if (this.closeDiv) var e = parseInt(this.closeDiv.style.width),
              c = c + (e + b.right);
          this.size.w += c;
          this.size.h += d;
          'msie' == OpenLayers.BROWSER_NAME && (this.contentSize.w += b.left + b.right, this.contentSize.h += b.bottom + b.top);
          null != this.div && (this.div.style.width = this.size.w + 'px', this.div.style.height = this.size.h + 'px');
          null != this.contentDiv && (this.contentDiv.style.width = a.w + 'px', this.contentDiv.style.height = a.h + 'px')
        },
        updateSize: function () {
          var a = '<div class=\'' + this.contentDisplayClass + '\'>' + this.contentDiv.innerHTML + '</div>',
              b = this.map ? this.map.div : document.body,
              c = OpenLayers.Util.getRenderedDimensions(a, null, {
                displayClass: this.displayClass,
                containerElement: b
              }),
              d = this.getSafeContentSize(c),
              e = null;
          d.equals(c) ? e = c : (c = {
            w: d.w < c.w ? d.w : null,
            h: d.h < c.h ? d.h : null
          }, c.w && c.h ? e = d : (a = OpenLayers.Util.getRenderedDimensions(a, c, {
            displayClass: this.contentDisplayClass,
            containerElement: b
          }), 'hidden' != OpenLayers.Element.getStyle(this.contentDiv, 'overflow') && a.equals(d) && (d = OpenLayers.Util.getScrollbarWidth(), c.w ? a.h += d : a.w += d), e = this.getSafeContentSize(a)));
          this.setSize(e)
        },
        setBackgroundColor: function (a) {
          void 0 != a && (this.backgroundColor = a);
          null != this.div && (this.div.style.backgroundColor = this.backgroundColor)
        },
        setOpacity: function (a) {
          void 0 != a && (this.opacity = a);
          null != this.div && (this.div.style.opacity = this.opacity, this.div.style.filter = 'alpha(opacity=' + 100 * this.opacity + ')')
        },
        setBorder: function (a) {
          void 0 != a && (this.border = a);
          null != this.div && (this.div.style.border = this.border)
        },
        setContentHTML: function (a) {
          null != a && (this.contentHTML = a);
          null != this.contentDiv && (null != this.contentHTML && this.contentHTML != this.contentDiv.innerHTML) && (this.contentDiv.innerHTML = this.contentHTML, this.autoSize && (this.registerImageListeners(), this.updateSize()))
        },
        registerImageListeners: function () {
          for (var a = function () {
            null !== this.popup.id && (this.popup.updateSize(), this.popup.visible() && this.popup.panMapIfOutOfView && this.popup.panIntoView(), OpenLayers.Event.stopObserving(this.img, 'load', this.img._onImageLoad))
          }, b = this.contentDiv.getElementsByTagName('img'), c = 0, d = b.length; c < d; c++) {
            var e = b[c];
            if (0 == e.width || 0 == e.height) e._onImgLoad = OpenLayers.Function.bind(a, {
              popup: this,
              img: e
            }),
              OpenLayers.Event.observe(e, 'load', e._onImgLoad)
              }
        },
        getSafeContentSize: function (a) {
          var a = a.clone(),
              b = this.getContentDivPadding(),
              c = b.left + b.right,
              d = b.top + b.bottom;
          this.fixPadding();
          c += this.padding.left + this.padding.right;
          d += this.padding.top + this.padding.bottom;
          if (this.closeDiv) var e = parseInt(this.closeDiv.style.width),
              c = c + (e + b.right);
          this.minSize && (a.w = Math.max(a.w, this.minSize.w - c), a.h = Math.max(a.h, this.minSize.h - d));
          this.maxSize && (a.w = Math.min(a.w, this.maxSize.w - c), a.h = Math.min(a.h, this.maxSize.h -
                                                                                   d));
          if (this.map && this.map.size) {
            e = b = 0;
            if (this.keepInMap && !this.panMapIfOutOfView) switch (e = this.map.getPixelFromLonLat(this.lonlat), this.relativePosition) {
              case 'tr':
                b = e.x;
                e = this.map.size.h - e.y;
                break;
              case 'tl':
                b = this.map.size.w - e.x;
                e = this.map.size.h - e.y;
                break;
              case 'bl':
                b = this.map.size.w - e.x;
                e = e.y;
                break;
              case 'br':
                b = e.x;
                e = e.y;
                break;
              default:
                b = e.x,
                  e = this.map.size.h - e.y
            }
            d = this.map.size.h - this.map.paddingForPopups.top - this.map.paddingForPopups.bottom - d - e;
            a.w = Math.min(a.w, this.map.size.w - this.map.paddingForPopups.left -
                           this.map.paddingForPopups.right - c - b);
            a.h = Math.min(a.h, d)
          }
          return a
        },
        getContentDivPadding: function () {
          var a = this._contentDivPadding;
          if (!a && (null == this.div.parentNode && (this.div.style.display = 'none', document.body.appendChild(this.div)), this._contentDivPadding = a = new OpenLayers.Bounds(OpenLayers.Element.getStyle(this.contentDiv, 'padding-left'), OpenLayers.Element.getStyle(this.contentDiv, 'padding-bottom'), OpenLayers.Element.getStyle(this.contentDiv, 'padding-right'), OpenLayers.Element.getStyle(this.contentDiv, 'padding-top')), this.div.parentNode == document.body)) document.body.removeChild(this.div),
            this.div.style.display = '';
          return a
        },
        addCloseBox: function (a) {
          this.closeDiv = OpenLayers.Util.createDiv(this.id + '_close', null, {
            w: 17,
            h: 17
          });
          this.closeDiv.className = 'olPopupCloseBox';
          var b = this.getContentDivPadding();
          this.closeDiv.style.right = b.right + 'px';
          this.closeDiv.style.top = b.top + 'px';
          this.groupDiv.appendChild(this.closeDiv);
          a = a || function (a) {
            this.hide();
            OpenLayers.Event.stop(a)
          };
          OpenLayers.Event.observe(this.closeDiv, 'touchend', OpenLayers.Function.bindAsEventListener(a, this));
          OpenLayers.Event.observe(this.closeDiv, 'click', OpenLayers.Function.bindAsEventListener(a, this))
        },
        panIntoView: function () {
          var a = this.map.getSize(),
              b = this.map.getViewPortPxFromLayerPx(new OpenLayers.Pixel(parseInt(this.div.style.left), parseInt(this.div.style.top))),
              c = b.clone();
          b.x < this.map.paddingForPopups.left ? c.x = this.map.paddingForPopups.left : b.x + this.size.w > a.w - this.map.paddingForPopups.right && (c.x = a.w - this.map.paddingForPopups.right - this.size.w);
          b.y < this.map.paddingForPopups.top ? c.y = this.map.paddingForPopups.top : b.y + this.size.h > a.h - this.map.paddingForPopups.bottom && (c.y = a.h - this.map.paddingForPopups.bottom - this.size.h);
          this.map.pan(b.x - c.x, b.y - c.y)
        },
        registerEvents: function () {
          this.events = new OpenLayers.Events(this, this.div, null, !0);
          this.events.on({
            mousedown: this.onmousedown,
            mousemove: this.onmousemove,
            mouseup: this.onmouseup,
            click: this.onclick,
            mouseout: this.onmouseout,
            dblclick: this.ondblclick,
            touchstart: function (a) {
              OpenLayers.Event.stop(a, !0)
            },
            scope: this
          })
        },
        onmousedown: function (a) {
          this.mousedown = !0;
          OpenLayers.Event.stop(a, !0)
        },
        onmousemove: function (a) {
          this.mousedown && OpenLayers.Event.stop(a, !0)
        },
        onmouseup: function (a) {
          this.mousedown && (this.mousedown = !1, OpenLayers.Event.stop(a, !0))
        },
        onclick: function (a) {
          OpenLayers.Event.stop(a, !0)
        },
        onmouseout: function () {
          this.mousedown = !1
        },
        ondblclick: function (a) {
          OpenLayers.Event.stop(a, !0)
        },
        CLASS_NAME: 'OpenLayers.Popup'
      });
      OpenLayers.Popup.WIDTH = 200;
      OpenLayers.Popup.HEIGHT = 200;
      OpenLayers.Popup.COLOR = 'white';
      OpenLayers.Popup.OPACITY = 1;
      OpenLayers.Popup.BORDER = '0px';
      OpenLayers.Popup.Anchored = OpenLayers.Class(OpenLayers.Popup, {
        relativePosition: null,
        keepInMap: !0,
        anchor: null,
        initialize: function (a, b, c, d, e, f, g) {
          OpenLayers.Popup.prototype.initialize.apply(this, [
            a,
            b,
            c,
            d,
            f,
            g
          ]);
          this.anchor = null != e ? e : {
            size: new OpenLayers.Size(0, 0),
            offset: new OpenLayers.Pixel(0, 0)
          }
        },
        destroy: function () {
          this.relativePosition = this.anchor = null;
          OpenLayers.Popup.prototype.destroy.apply(this, arguments)
        },
        show: function () {
          this.updatePosition();
          OpenLayers.Popup.prototype.show.apply(this, arguments)
        },
        moveTo: function (a) {
          var b = this.relativePosition;
          this.relativePosition = this.calculateRelativePosition(a);
          a = this.calculateNewPx(a);
          OpenLayers.Popup.prototype.moveTo.apply(this, Array(a));
          this.relativePosition != b && this.updateRelativePosition()
        },
        setSize: function (a) {
          OpenLayers.Popup.prototype.setSize.apply(this, arguments);
          this.lonlat && this.map && this.moveTo(this.map.getLayerPxFromLonLat(this.lonlat))
        },
        calculateRelativePosition: function (a) {
          a = this.map.getLonLatFromLayerPx(a);
          a = this.map.getExtent().determineQuadrant(a);
          return OpenLayers.Bounds.oppositeQuadrant(a)
        },
        updateRelativePosition: function () {
        },
        calculateNewPx: function (a) {
          var a = a.offset(this.anchor.offset),
              b = this.size || this.contentSize,
              c = 't' == this.relativePosition.charAt(0);
          a.y += c ? - b.h : this.anchor.size.h;
          c = 'l' == this.relativePosition.charAt(1);
          a.x += c ? - b.w : this.anchor.size.w;
          return a
        },
        CLASS_NAME: 'OpenLayers.Popup.Anchored'
      }); /*
     Apache 2 

     Contains portions of Rico <http://openrico.org/>

     Copyright 2005 Sabre Airline Solutions  

     Licensed under the Apache License, Version 2.0 (the "License"); you
     may not use this file except in compliance with the License. You
     may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0  

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
     implied. See the License for the specific language governing
     permissions and limitations under the License. 
    */
      OpenLayers.Console.warn('OpenLayers.Rico is deprecated');
      OpenLayers.Rico = OpenLayers.Rico || {
      };
      OpenLayers.Rico.Color = OpenLayers.Class({
        initialize: function (a, b, c) {
          this.rgb = {
            r: a,
            g: b,
            b: c
          }
        },
        setRed: function (a) {
          this.rgb.r = a
        },
        setGreen: function (a) {
          this.rgb.g = a
        },
        setBlue: function (a) {
          this.rgb.b = a
        },
        setHue: function (a) {
          var b = this.asHSB();
          b.h = a;
          this.rgb = OpenLayers.Rico.Color.HSBtoRGB(b.h, b.s, b.b)
        },
        setSaturation: function (a) {
          var b = this.asHSB();
          b.s = a;
          this.rgb = OpenLayers.Rico.Color.HSBtoRGB(b.h, b.s, b.b)
        },
        setBrightness: function (a) {
          var b = this.asHSB();
          b.b = a;
          this.rgb = OpenLayers.Rico.Color.HSBtoRGB(b.h, b.s, b.b)
        },
        darken: function (a) {
          var b = this.asHSB();
          this.rgb = OpenLayers.Rico.Color.HSBtoRGB(b.h, b.s, Math.max(b.b - a, 0))
        },
        brighten: function (a) {
          var b = this.asHSB();
          this.rgb = OpenLayers.Rico.Color.HSBtoRGB(b.h, b.s, Math.min(b.b + a, 1))
        },
        blend: function (a) {
          this.rgb.r = Math.floor((this.rgb.r + a.rgb.r) / 2);
          this.rgb.g = Math.floor((this.rgb.g + a.rgb.g) / 2);
          this.rgb.b = Math.floor((this.rgb.b + a.rgb.b) / 2)
        },
        isBright: function () {
          this.asHSB();
          return 0.5 < this.asHSB().b
        },
        isDark: function () {
          return !this.isBright()
        },
        asRGB: function () {
          return 'rgb(' +
            this.rgb.r + ',' + this.rgb.g + ',' + this.rgb.b + ')'
        },
        asHex: function () {
          return '#' + this.rgb.r.toColorPart() + this.rgb.g.toColorPart() + this.rgb.b.toColorPart()
        },
        asHSB: function () {
          return OpenLayers.Rico.Color.RGBtoHSB(this.rgb.r, this.rgb.g, this.rgb.b)
        },
        toString: function () {
          return this.asHex()
        }
      });
      OpenLayers.Rico.Color.createFromHex = function (a) {
        if (4 == a.length) for (var b = a, a = '#', c = 1; 4 > c; c++) a += b.charAt(c) + b.charAt(c);
        0 == a.indexOf('#') && (a = a.substring(1));
        b = a.substring(0, 2);
        c = a.substring(2, 4);
        a = a.substring(4, 6);
        return new OpenLayers.Rico.Color(parseInt(b, 16), parseInt(c, 16), parseInt(a, 16))
      };
      OpenLayers.Rico.Color.createColorFromBackground = function (a) {
        var b = OpenLayers.Element.getStyle(OpenLayers.Util.getElement(a), 'backgroundColor');
        return 'transparent' == b && a.parentNode ? OpenLayers.Rico.Color.createColorFromBackground(a.parentNode)  : null == b ? new OpenLayers.Rico.Color(255, 255, 255)  : 0 == b.indexOf('rgb(') ? (a = b.substring(4, b.length - 1).split(','), new OpenLayers.Rico.Color(parseInt(a[0]), parseInt(a[1]), parseInt(a[2])))  : 0 == b.indexOf('#') ? OpenLayers.Rico.Color.createFromHex(b)  : new OpenLayers.Rico.Color(255, 255, 255)
      };
      OpenLayers.Rico.Color.HSBtoRGB = function (a, b, c) {
        var d = 0,
            e = 0,
            f = 0;
        if (0 == b) f = e = d = parseInt(255 * c + 0.5);
        else {
          var a = 6 * (a - Math.floor(a)),
              g = a - Math.floor(a),
              h = c * (1 - b),
              i = c * (1 - b * g),
              b = c * (1 - b * (1 - g));
          switch (parseInt(a)) {
            case 0:
              d = 255 * c + 0.5;
              e = 255 * b + 0.5;
              f = 255 * h + 0.5;
              break;
            case 1:
              d = 255 * i + 0.5;
              e = 255 * c + 0.5;
              f = 255 * h + 0.5;
              break;
            case 2:
              d = 255 * h + 0.5;
              e = 255 * c + 0.5;
              f = 255 * b + 0.5;
              break;
            case 3:
              d = 255 * h + 0.5;
              e = 255 * i + 0.5;
              f = 255 * c + 0.5;
              break;
            case 4:
              d = 255 * b + 0.5;
              e = 255 * h + 0.5;
              f = 255 * c + 0.5;
              break;
            case 5:
              d = 255 * c + 0.5,
                e = 255 * h + 0.5,
                f = 255 * i + 0.5
          }
        }
        return {
          r: parseInt(d),
          g: parseInt(e),
          b: parseInt(f)
        }
      };
      OpenLayers.Rico.Color.RGBtoHSB = function (a, b, c) {
        var d,
            e = a > b ? a : b;
        c > e && (e = c);
        var f = a < b ? a : b;
        c < f && (f = c);
        d = 0 != e ? (e - f) / e : 0;
        if (0 == d) a = 0;
        else {
          var g = (e - a) / (e - f),
              h = (e - b) / (e - f),
              c = (e - c) / (e - f),
              a = (a == e ? c - h : b == e ? 2 + g - c : 4 + h - g) / 6;
          0 > a && (a += 1)
        }
        return {
          h: a,
          s: d,
          b: e / 255
        }
      };
      OpenLayers.Console.warn('OpenLayers.Rico is deprecated');
      OpenLayers.Rico = OpenLayers.Rico || {
      };
      OpenLayers.Rico.Corner = {
        round: function (a, b) {
          a = OpenLayers.Util.getElement(a);
          this._setOptions(b);
          var c = this.options.color;
          'fromElement' == this.options.color && (c = this._background(a));
          var d = this.options.bgColor;
          'fromParent' == this.options.bgColor && (d = this._background(a.offsetParent));
          this._roundCornersImpl(a, c, d)
        },
        changeColor: function (a, b) {
          a.style.backgroundColor = b;
          for (var c = a.parentNode.getElementsByTagName('span'), d = 0; d < c.length; d++) c[d].style.backgroundColor = b
            },
        changeOpacity: function (a, b) {
          var c = 'alpha(opacity=' +
              100 * b + ')';
          a.style.opacity = b;
          a.style.filter = c;
          for (var d = a.parentNode.getElementsByTagName('span'), e = 0; e < d.length; e++) d[e].style.opacity = b,
            d[e].style.filter = c
            },
        reRound: function (a, b) {
          var c = a.parentNode.childNodes[2];
          a.parentNode.removeChild(a.parentNode.childNodes[0]);
          a.parentNode.removeChild(c);
          this.round(a.parentNode, b)
        },
        _roundCornersImpl: function (a, b, c) {
          this.options.border && this._renderBorder(a, c);
          this._isTopRounded() && this._roundTopCorners(a, b, c);
          this._isBottomRounded() && this._roundBottomCorners(a, b, c)
        },
        _renderBorder: function (a, b) {
          var c = '1px solid ' + this._borderColor(b);
          a.innerHTML = '<div ' + ('style=\'border-left: ' + c + ';' + ('border-right: ' + c) + '\'') + '>' + a.innerHTML + '</div>'
        },
        _roundTopCorners: function (a, b, c) {
          for (var d = this._createCorner(c), e = 0; e < this.options.numSlices; e++) d.appendChild(this._createCornerSlice(b, c, e, 'top'));
          a.style.paddingTop = 0;
          a.insertBefore(d, a.firstChild)
        },
        _roundBottomCorners: function (a, b, c) {
          for (var d = this._createCorner(c), e = this.options.numSlices - 1; 0 <= e; e--) d.appendChild(this._createCornerSlice(b, c, e, 'bottom'));
          a.style.paddingBottom = 0;
          a.appendChild(d)
        },
        _createCorner: function (a) {
          var b = document.createElement('div');
          b.style.backgroundColor = this._isTransparent() ? 'transparent' : a;
          return b
        },
        _createCornerSlice: function (a, b, c, d) {
          var e = document.createElement('span'),
              f = e.style;
          f.backgroundColor = a;
          f.display = 'block';
          f.height = '1px';
          f.overflow = 'hidden';
          f.fontSize = '1px';
          a = this._borderColor(a, b);
          this.options.border && 0 == c ? (f.borderTopStyle = 'solid', f.borderTopWidth = '1px', f.borderLeftWidth = '0px', f.borderRightWidth = '0px', f.borderBottomWidth = '0px', f.height = '0px', f.borderColor = a)  : a && (f.borderColor = a, f.borderStyle = 'solid', f.borderWidth = '0px 1px');
          !this.options.compact && c == this.options.numSlices - 1 && (f.height = '2px');
          this._setMargin(e, c, d);
          this._setBorder(e, c, d);
          return e
        },
        _setOptions: function (a) {
          this.options = {
            corners: 'all',
            color: 'fromElement',
            bgColor: 'fromParent',
            blend: !0,
            border: !1,
            compact: !1
          };
          OpenLayers.Util.extend(this.options, a || {
          });
          this.options.numSlices = this.options.compact ? 2 : 4;
          this._isTransparent() && (this.options.blend = !1)
        },
        _whichSideTop: function () {
          return this._hasString(this.options.corners, 'all', 'top') || 0 <= this.options.corners.indexOf('tl') && 0 <= this.options.corners.indexOf('tr') ? '' : 0 <= this.options.corners.indexOf('tl') ? 'left' : 0 <= this.options.corners.indexOf('tr') ? 'right' : ''
        },
        _whichSideBottom: function () {
          return this._hasString(this.options.corners, 'all', 'bottom') || 0 <= this.options.corners.indexOf('bl') && 0 <= this.options.corners.indexOf('br') ? '' : 0 <= this.options.corners.indexOf('bl') ? 'left' : 0 <= this.options.corners.indexOf('br') ?
            'right' : ''
        },
        _borderColor: function (a, b) {
          return 'transparent' == a ? b : this.options.border ? this.options.border : this.options.blend ? this._blend(b, a)  : ''
        },
        _setMargin: function (a, b, c) {
          b = this._marginSize(b);
          c = 'top' == c ? this._whichSideTop()  : this._whichSideBottom();
          'left' == c ? (a.style.marginLeft = b + 'px', a.style.marginRight = '0px')  : 'right' == c ? (a.style.marginRight = b + 'px', a.style.marginLeft = '0px')  : (a.style.marginLeft = b + 'px', a.style.marginRight = b + 'px')
        },
        _setBorder: function (a, b, c) {
          b = this._borderSize(b);
          c = 'top' == c ? this._whichSideTop()  :
          this._whichSideBottom();
          'left' == c ? (a.style.borderLeftWidth = b + 'px', a.style.borderRightWidth = '0px')  : 'right' == c ? (a.style.borderRightWidth = b + 'px', a.style.borderLeftWidth = '0px')  : (a.style.borderLeftWidth = b + 'px', a.style.borderRightWidth = b + 'px');
          !1 != this.options.border && (a.style.borderLeftWidth = b + 'px', a.style.borderRightWidth = b + 'px')
        },
        _marginSize: function (a) {
          if (this._isTransparent()) return 0;
          var b = [
            5,
            3,
            2,
            1
          ],
              c = [
                3,
                2,
                1,
                0
              ],
              d = [
                2,
                1
              ],
              e = [
                1,
                0
              ];
          return this.options.compact && this.options.blend ? e[a] : this.options.compact ?
            d[a] : this.options.blend ? c[a] : b[a]
        },
        _borderSize: function (a) {
          var b = [
            5,
            3,
            2,
            1
          ],
              c = [
                2,
                1,
                1,
                1
              ],
              d = [
                1,
                0
              ],
              e = [
                0,
                2,
                0,
                0
              ];
          return this.options.compact && (this.options.blend || this._isTransparent()) ? 1 : this.options.compact ? d[a] : this.options.blend ? c[a] : this.options.border ? e[a] : this._isTransparent() ? b[a] : 0
        },
        _hasString: function (a) {
          for (var b = 1; b < arguments.length; b++) if (0 <= a.indexOf(arguments[b])) return !0;
          return !1
        },
        _blend: function (a, b) {
          var c = OpenLayers.Rico.Color.createFromHex(a);
          c.blend(OpenLayers.Rico.Color.createFromHex(b));
          return c
        },
        _background: function (a) {
          try {
            return OpenLayers.Rico.Color.createColorFromBackground(a).asHex()
          } catch (b) {
            return '#ffffff'
          }
        },
        _isTransparent: function () {
          return 'transparent' == this.options.color
        },
        _isTopRounded: function () {
          return this._hasString(this.options.corners, 'all', 'top', 'tl', 'tr')
        },
        _isBottomRounded: function () {
          return this._hasString(this.options.corners, 'all', 'bottom', 'bl', 'br')
        },
        _hasSingleTextChild: function (a) {
          return 1 == a.childNodes.length && 3 == a.childNodes[0].nodeType
        }
      };
      OpenLayers.Popup.AnchoredBubble = OpenLayers.Class(OpenLayers.Popup.Anchored, {
        rounded: !1,
        initialize: function (a, b, c, d, e, f, g) {
          OpenLayers.Console.warn('AnchoredBubble is deprecated');
          this.padding = new OpenLayers.Bounds(0, OpenLayers.Popup.AnchoredBubble.CORNER_SIZE, 0, OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);
          OpenLayers.Popup.Anchored.prototype.initialize.apply(this, arguments)
        },
        draw: function (a) {
          OpenLayers.Popup.Anchored.prototype.draw.apply(this, arguments);
          this.setContentHTML();
          this.setBackgroundColor();
          this.setOpacity();
          return this.div
        },
        updateRelativePosition: function () {
          this.setRicoCorners()
        },
        setSize: function (a) {
          OpenLayers.Popup.Anchored.prototype.setSize.apply(this, arguments);
          this.setRicoCorners()
        },
        setBackgroundColor: function (a) {
          void 0 != a && (this.backgroundColor = a);
          null != this.div && null != this.contentDiv && (this.div.style.background = 'transparent', OpenLayers.Rico.Corner.changeColor(this.groupDiv, this.backgroundColor))
        },
        setOpacity: function (a) {
          OpenLayers.Popup.Anchored.prototype.setOpacity.call(this, a);
          null != this.div && null != this.groupDiv && OpenLayers.Rico.Corner.changeOpacity(this.groupDiv, this.opacity)
        },
        setBorder: function () {
          this.border = 0
        },
        setRicoCorners: function () {
          var a = {
            corners: this.getCornersToRound(this.relativePosition),
            color: this.backgroundColor,
            bgColor: 'transparent',
            blend: !1
          };
          this.rounded ? (OpenLayers.Rico.Corner.reRound(this.groupDiv, a), this.setBackgroundColor(), this.setOpacity())  : (OpenLayers.Rico.Corner.round(this.div, a), this.rounded = !0)
        },
        getCornersToRound: function () {
          var a = [
            'tl',
            'tr',
            'bl',
            'br'
          ],
              b = OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);
          OpenLayers.Util.removeItem(a, b);
          return a.join(' ')
        },
        CLASS_NAME: 'OpenLayers.Popup.AnchoredBubble'
      });
      OpenLayers.Popup.AnchoredBubble.CORNER_SIZE = 5;
      OpenLayers.Protocol.WFS.v1 = OpenLayers.Class(OpenLayers.Protocol, {
        version: null,
        srsName: 'EPSG:4326',
        featureType: null,
        featureNS: null,
        geometryName: 'the_geom',
        schema: null,
        featurePrefix: 'feature',
        formatOptions: null,
        readFormat: null,
        readOptions: null,
        initialize: function (a) {
          OpenLayers.Protocol.prototype.initialize.apply(this, [
            a
          ]);
          a.format || (this.format = OpenLayers.Format.WFST(OpenLayers.Util.extend({
            version: this.version,
            featureType: this.featureType,
            featureNS: this.featureNS,
            featurePrefix: this.featurePrefix,
            geometryName: this.geometryName,
            srsName: this.srsName,
            schema: this.schema
          }, this.formatOptions)));
          !a.geometryName && 1 < parseFloat(this.format.version) && this.setGeometryName(null)
        },
        destroy: function () {
          this.options && !this.options.format && this.format.destroy();
          this.format = null;
          OpenLayers.Protocol.prototype.destroy.apply(this)
        },
        read: function (a) {
          OpenLayers.Protocol.prototype.read.apply(this, arguments);
          a = OpenLayers.Util.extend({
          }, a);
          OpenLayers.Util.applyDefaults(a, this.options || {
          });
          var b = new OpenLayers.Protocol.Response({
            requestType: 'read'
          }),
              c = OpenLayers.Format.XML.prototype.write.apply(this.format, [
                this.format.writeNode('wfs:GetFeature', a)
              ]);
          b.priv = OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, b, a),
            params: a.params,
            headers: a.headers,
            data: c
          });
          return b
        },
        setFeatureType: function (a) {
          this.featureType = a;
          this.format.featureType = a
        },
        setGeometryName: function (a) {
          this.geometryName = a;
          this.format.geometryName = a
        },
        handleRead: function (a, b) {
          b = OpenLayers.Util.extend({
          }, b);
          OpenLayers.Util.applyDefaults(b, this.options);
          if (b.callback) {
            var c = a.priv;
            200 <= c.status && 300 > c.status ? (c = this.parseResponse(c, b.readOptions)) && !1 !== c.success ? (b.readOptions && 'object' == b.readOptions.output ? OpenLayers.Util.extend(a, c)  : a.features = c, a.code = OpenLayers.Protocol.Response.SUCCESS)  : (a.code = OpenLayers.Protocol.Response.FAILURE, a.error = c)  : a.code = OpenLayers.Protocol.Response.FAILURE;
            b.callback.call(b.scope, a)
          }
        },
        parseResponse: function (a, b) {
          var c = a.responseXML;
          if (!c || !c.documentElement) c = a.responseText;
          if (!c || 0 >= c.length) return null;
          c = null !== this.readFormat ? this.readFormat.read(c)  :
          this.format.read(c, b);
          if (!this.featureNS) {
            var d = this.readFormat || this.format;
            this.featureNS = d.featureNS;
            d.autoConfig = !1;
            this.geometryName || this.setGeometryName(d.geometryName)
          }
          return c
        },
        commit: function (a, b) {
          b = OpenLayers.Util.extend({
          }, b);
          OpenLayers.Util.applyDefaults(b, this.options);
          var c = new OpenLayers.Protocol.Response({
            requestType: 'commit',
            reqFeatures: a
          });
          c.priv = OpenLayers.Request.POST({
            url: b.url,
            headers: b.headers,
            data: this.format.write(a, b),
            callback: this.createCallback(this.handleCommit, c, b)
          });
          return c
        },
        handleCommit: function (a, b) {
          if (b.callback) {
            var c = a.priv,
                d = c.responseXML;
            if (!d || !d.documentElement) d = c.responseText;
            c = this.format.read(d) || {
            };
            a.insertIds = c.insertIds || [
            ];
            c.success ? a.code = OpenLayers.Protocol.Response.SUCCESS : (a.code = OpenLayers.Protocol.Response.FAILURE, a.error = c);
            b.callback.call(b.scope, a)
          }
        },
        filterDelete: function (a, b) {
          b = OpenLayers.Util.extend({
          }, b);
          OpenLayers.Util.applyDefaults(b, this.options);
          new OpenLayers.Protocol.Response({
            requestType: 'commit'
          });
          var c = this.format.createElementNSPlus('wfs:Transaction', {
            attributes: {
              service: 'WFS',
              version: this.version
            }
          }),
              d = this.format.createElementNSPlus('wfs:Delete', {
                attributes: {
                  typeName: (b.featureNS ? this.featurePrefix + ':' : '') + b.featureType
                }
              });
          b.featureNS && d.setAttribute('xmlns:' + this.featurePrefix, b.featureNS);
          var e = this.format.writeNode('ogc:Filter', a);
          d.appendChild(e);
          c.appendChild(d);
          c = OpenLayers.Format.XML.prototype.write.apply(this.format, [
            c
          ]);
          return OpenLayers.Request.POST({
            url: this.url,
            callback: b.callback || function () {
            },
            data: c
          })
        },
        abort: function (a) {
          a && a.priv.abort()
        },
        CLASS_NAME: 'OpenLayers.Protocol.WFS.v1'
      });
      OpenLayers.Spherical = OpenLayers.Spherical || {
      };
      OpenLayers.Spherical.DEFAULT_RADIUS = 6378137;
      OpenLayers.Spherical.computeDistanceBetween = function (a, b, c) {
        var c = c || OpenLayers.Spherical.DEFAULT_RADIUS,
            d = Math.sin(Math.PI * (b.lon - a.lon) / 360),
            e = Math.sin(Math.PI * (b.lat - a.lat) / 360),
            a = e * e + d * d * Math.cos(Math.PI * a.lat / 180) * Math.cos(Math.PI * b.lat / 180);
        return 2 * c * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      };
      OpenLayers.Spherical.computeHeading = function (a, b) {
        var c = Math.sin(Math.PI * (a.lon - b.lon) / 180) * Math.cos(Math.PI * b.lat / 180),
            d = Math.cos(Math.PI * a.lat / 180) * Math.sin(Math.PI * b.lat / 180) - Math.sin(Math.PI * a.lat / 180) * Math.cos(Math.PI * b.lat / 180) * Math.cos(Math.PI * (a.lon - b.lon) / 180);
        return 180 * Math.atan2(c, d) / Math.PI
      };
      OpenLayers.Control.CacheWrite = OpenLayers.Class(OpenLayers.Control, {
        layers: null,
        imageFormat: 'image/png',
        quotaRegEx: /quota/i,
        setMap: function (a) {
          OpenLayers.Control.prototype.setMap.apply(this, arguments);
          var b,
              c = this.layers || a.layers;
          for (b = c.length - 1; 0 <= b; --b) this.addLayer({
            layer: c[b]
          });
          if (!this.layers) a.events.on({
            addlayer: this.addLayer,
            removeLayer: this.removeLayer,
            scope: this
          })
            },
        addLayer: function (a) {
          a.layer.events.on({
            tileloadstart: this.makeSameOrigin,
            tileloaded: this.cache,
            scope: this
          })
        },
        removeLayer: function (a) {
          a.layer.events.un({
            tileloadstart: this.makeSameOrigin,
            tileloaded: this.cache,
            scope: this
          })
        },
        makeSameOrigin: function (a) {
          if (this.active && (a = a.tile, a instanceof OpenLayers.Tile.Image && !a.crossOriginKeyword && 'data:' !== a.url.substr(0, 5))) {
            var b = OpenLayers.Request.makeSameOrigin(a.url, OpenLayers.ProxyHost);
            OpenLayers.Control.CacheWrite.urlMap[b] = a.url;
            a.url = b
          }
        },
        cache: function (a) {
          if (this.active && window.localStorage && (a = a.tile, a instanceof OpenLayers.Tile.Image && 'data:' !== a.url.substr(0, 5))) try {
            var b = a.getCanvasContext();
            if (b) {
              var c = OpenLayers.Control.CacheWrite.urlMap;
              window.localStorage.setItem('olCache_' + (c[a.url] || a.url), b.canvas.toDataURL(this.imageFormat));
              delete c[a.url]
            }
          } catch (d) {
            (b = d.name || d.message) && this.quotaRegEx.test(b) ? this.events.triggerEvent('cachefull', {
              tile: a
            })  : OpenLayers.Console.error(d.toString())
          }
        },
        destroy: function () {
          if (this.layers || this.map) {
            var a,
                b = this.layers || this.map.layers;
            for (a = b.length - 1; 0 <= a; --a) this.removeLayer({
              layer: b[a]
            })
              }
          this.map && this.map.events.un({
            addlayer: this.addLayer,
            removeLayer: this.removeLayer,
            scope: this
          });
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        CLASS_NAME: 'OpenLayers.Control.CacheWrite'
      });
      OpenLayers.Control.CacheWrite.clearCache = function () {
        if (window.localStorage) {
          var a,
              b;
          for (a = window.localStorage.length - 1; 0 <= a; --a) b = window.localStorage.key(a),
            'olCache_' === b.substr(0, 8) && window.localStorage.removeItem(b)
            }
      };
      OpenLayers.Control.CacheWrite.urlMap = {
      };
      OpenLayers.Format.Context = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        layerOptions: null,
        layerParams: null,
        read: function (a, b) {
          var c = OpenLayers.Format.XML.VersionedOGC.prototype.read.apply(this, arguments);
          if (b && b.map) if (this.context = c, b.map instanceof OpenLayers.Map) c = this.mergeContextToMap(c, b.map);
            else {
              var d = b.map;
              if (OpenLayers.Util.isElement(d) || 'string' == typeof d) d = {
                div: d
              };
              c = this.contextToMap(c, d)
            }
          return c
        },
        getLayerFromContext: function (a) {
          var b,
              c,
              d = {
                queryable: a.queryable,
                visibility: a.visibility,
                maxExtent: a.maxExtent,
                metadata: OpenLayers.Util.applyDefaults(a.metadata, {
                  styles: a.styles,
                  formats: a.formats,
                  'abstract': a['abstract'],
                  dataURL: a.dataURL
                }),
                numZoomLevels: a.numZoomLevels,
                units: a.units,
                isBaseLayer: a.isBaseLayer,
                opacity: a.opacity,
                displayInLayerSwitcher: a.displayInLayerSwitcher,
                singleTile: a.singleTile,
                tileSize: a.tileSize ? new OpenLayers.Size(a.tileSize.width, a.tileSize.height)  : void 0,
                minScale: a.minScale || a.maxScaleDenominator,
                maxScale: a.maxScale || a.minScaleDenominator,
                srs: a.srs,
                dimensions: a.dimensions,
                metadataURL: a.metadataURL
              };
          this.layerOptions && OpenLayers.Util.applyDefaults(d, this.layerOptions);
          var e = {
            layers: a.name,
            transparent: a.transparent,
            version: a.version
          };
          if (a.formats && 0 < a.formats.length) {
            e.format = a.formats[0].value;
            b = 0;
            for (c = a.formats.length; b < c; b++) {
              var f = a.formats[b];
              if (!0 == f.current) {
                e.format = f.value;
                break
              }
            }
          }
          if (a.styles && 0 < a.styles.length) {
            b = 0;
            for (c = a.styles.length; b < c; b++) if (f = a.styles[b], !0 == f.current) {
              f.href ? e.sld = f.href : f.body ? e.sld_body = f.body : e.styles = f.name;
              break
            }
          }
          this.layerParams && OpenLayers.Util.applyDefaults(e, this.layerParams);
          b = null;
          c = a.service;
          c == OpenLayers.Format.Context.serviceTypes.WFS ? (d.strategies = [
            new OpenLayers.Strategy.BBOX
          ], d.protocol = new OpenLayers.Protocol.WFS({
            url: a.url,
            featurePrefix: a.name.split(':') [0],
            featureType: a.name.split(':').pop()
          }), b = new OpenLayers.Layer.Vector(a.title || a.name, d))  : c == OpenLayers.Format.Context.serviceTypes.KML ? (d.strategies = [
            new OpenLayers.Strategy.Fixed
          ], d.protocol = new OpenLayers.Protocol.HTTP({
            url: a.url,
            format: new OpenLayers.Format.KML
          }), b = new OpenLayers.Layer.Vector(a.title || a.name, d))  : c == OpenLayers.Format.Context.serviceTypes.GML ? (d.strategies = [
            new OpenLayers.Strategy.Fixed
          ], d.protocol = new OpenLayers.Protocol.HTTP({
            url: a.url,
            format: new OpenLayers.Format.GML
          }), b = new OpenLayers.Layer.Vector(a.title || a.name, d))  : a.features ? (b = new OpenLayers.Layer.Vector(a.title || a.name, d), b.addFeatures(a.features))  : !0 !== a.categoryLayer && (b = new OpenLayers.Layer.WMS(a.title || a.name, a.url, e, d));
          return b
        },
        getLayersFromContext: function (a) {
          for (var b = [
          ], c = 0, d = a.length; c < d; c++) {
            var e = this.getLayerFromContext(a[c]);
            null !== e && b.push(e)
          }
          return b
        },
        contextToMap: function (a, b) {
          b = OpenLayers.Util.applyDefaults({
            maxExtent: a.maxExtent,
            projection: a.projection,
            units: a.units
          }, b);
          b.maxExtent && (b.maxResolution = b.maxExtent.getWidth() / OpenLayers.Map.TILE_WIDTH);
          b.metadata = {
            contactInformation: a.contactInformation,
            'abstract': a['abstract'],
            keywords: a.keywords,
            logo: a.logo,
            descriptionURL: a.descriptionURL
          };
          var c = new OpenLayers.Map(b);
          c.addLayers(this.getLayersFromContext(a.layersContext));
          c.setCenter(a.bounds.getCenterLonLat(), c.getZoomForExtent(a.bounds, !0));
          return c
        },
        mergeContextToMap: function (a, b) {
          b.addLayers(this.getLayersFromContext(a.layersContext));
          return b
        },
        write: function (a, b) {
          a = this.toContext(a);
          return OpenLayers.Format.XML.VersionedOGC.prototype.write.apply(this, arguments)
        },
        CLASS_NAME: 'OpenLayers.Format.Context'
      });
      OpenLayers.Format.Context.serviceTypes = {
        WMS: 'urn:ogc:serviceType:WMS',
        WFS: 'urn:ogc:serviceType:WFS',
        WCS: 'urn:ogc:serviceType:WCS',
        GML: 'urn:ogc:serviceType:GML',
        SLD: 'urn:ogc:serviceType:SLD',
        FES: 'urn:ogc:serviceType:FES',
        KML: 'urn:ogc:serviceType:KML'
      };
      OpenLayers.Format.WMC = OpenLayers.Class(OpenLayers.Format.Context, {
        defaultVersion: '1.1.0',
        layerToContext: function (a) {
          var b = this.getParser(),
              c = {
                queryable: a.queryable,
                visibility: a.visibility,
                name: a.params.LAYERS,
                title: a.name,
                'abstract': a.metadata['abstract'],
                dataURL: a.metadata.dataURL,
                metadataURL: a.metadataURL,
                server: {
                  version: a.params.VERSION,
                  url: a.url
                },
                maxExtent: a.maxExtent,
                transparent: a.params.TRANSPARENT,
                numZoomLevels: a.numZoomLevels,
                units: a.units,
                isBaseLayer: a.isBaseLayer,
                opacity: 1 == a.opacity ? void 0 :
                a.opacity,
                displayInLayerSwitcher: a.displayInLayerSwitcher,
                singleTile: a.singleTile,
                tileSize: a.singleTile || !a.tileSize ? void 0 : {
                  width: a.tileSize.w,
                  height: a.tileSize.h
                },
                minScale: a.options.resolutions || a.options.scales || a.options.maxResolution || a.options.minScale ? a.minScale : void 0,
                maxScale: a.options.resolutions || a.options.scales || a.options.minResolution || a.options.maxScale ? a.maxScale : void 0,
                formats: [
                ],
                styles: [
                ],
                srs: a.srs,
                dimensions: a.dimensions
              };
          a.metadata.servertitle && (c.server.title = a.metadata.servertitle);
          if (a.metadata.formats && 0 < a.metadata.formats.length) for (var d = 0, e = a.metadata.formats.length; d < e; d++) {
            var f = a.metadata.formats[d];
            c.formats.push({
              value: f.value,
              current: f.value == a.params.FORMAT
            })
          } else c.formats.push({
            value: a.params.FORMAT,
            current: !0
          });
          if (a.metadata.styles && 0 < a.metadata.styles.length) {
            d = 0;
            for (e = a.metadata.styles.length; d < e; d++) b = a.metadata.styles[d],
              b.current = b.href == a.params.SLD || b.body == a.params.SLD_BODY || b.name == a.params.STYLES ? !0 : !1,
              c.styles.push(b)
              } else c.styles.push({
                href: a.params.SLD,
                body: a.params.SLD_BODY,
                name: a.params.STYLES || b.defaultStyleName,
                title: b.defaultStyleTitle,
                current: !0
              });
          return c
        },
        toContext: function (a) {
          var b = {
          },
              c = a.layers;
          if ('OpenLayers.Map' == a.CLASS_NAME) {
            var d = a.metadata || {
            };
            b.size = a.getSize();
            b.bounds = a.getExtent();
            b.projection = a.projection;
            b.title = a.title;
            b.keywords = d.keywords;
            b['abstract'] = d['abstract'];
            b.logo = d.logo;
            b.descriptionURL = d.descriptionURL;
            b.contactInformation = d.contactInformation;
            b.maxExtent = a.maxExtent
          } else OpenLayers.Util.applyDefaults(b, a),
            void 0 !=
              b.layers && delete b.layers;
          void 0 == b.layersContext && (b.layersContext = [
          ]);
          if (void 0 != c && OpenLayers.Util.isArray(c)) {
            a = 0;
            for (d = c.length; a < d; a++) {
              var e = c[a];
              e instanceof OpenLayers.Layer.WMS && b.layersContext.push(this.layerToContext(e))
            }
          }
          return b
        },
        CLASS_NAME: 'OpenLayers.Format.WMC'
      });
      OpenLayers.Format.WMC.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          ol: 'http://openlayers.org/context',
          wmc: 'http://www.opengis.net/context',
          sld: 'http://www.opengis.net/sld',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        schemaLocation: '',
        getNamespacePrefix: function (a) {
          var b = null;
          if (null == a) b = this.namespaces[this.defaultPrefix];
          else for (b in this.namespaces) if (this.namespaces[b] == a) break;
          return b
        },
        defaultPrefix: 'wmc',
        rootPrefix: null,
        defaultStyleName: '',
        defaultStyleTitle: 'Default',
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a = a.documentElement;
          this.rootPrefix = a.prefix;
          var b = {
            version: a.getAttribute('version')
          };
          this.runChildNodes(b, a);
          return b
        },
        runChildNodes: function (a, b) {
          for (var c = b.childNodes, d, e, f, g = 0, h = c.length; g < h; ++g) d = c[g],
            1 == d.nodeType && (e = this.getNamespacePrefix(d.namespaceURI), f = d.nodeName.split(':').pop(), (e = this['read_' + e + '_' + f]) && e.apply(this, [
            a,
            d
          ]))
            },
        read_wmc_General: function (a, b) {
          this.runChildNodes(a, b)
        },
        read_wmc_BoundingBox: function (a, b) {
          a.projection = b.getAttribute('SRS');
          a.bounds = new OpenLayers.Bounds(b.getAttribute('minx'), b.getAttribute('miny'), b.getAttribute('maxx'), b.getAttribute('maxy'))
        },
        read_wmc_LayerList: function (a, b) {
          a.layersContext = [
          ];
          this.runChildNodes(a, b)
        },
        read_wmc_Layer: function (a, b) {
          var c = {
            visibility: '1' != b.getAttribute('hidden'),
            queryable: '1' == b.getAttribute('queryable'),
            formats: [
            ],
            styles: [
            ],
            metadata: {
            }
          };
          this.runChildNodes(c, b);
          a.layersContext.push(c)
        },
        read_wmc_Extension: function (a, b) {
          this.runChildNodes(a, b)
        },
        read_ol_units: function (a, b) {
          a.units = this.getChildValue(b)
        },
        read_ol_maxExtent: function (a, b) {
          var c = new OpenLayers.Bounds(b.getAttribute('minx'), b.getAttribute('miny'), b.getAttribute('maxx'), b.getAttribute('maxy'));
          a.maxExtent = c
        },
        read_ol_transparent: function (a, b) {
          a.transparent = this.getChildValue(b)
        },
        read_ol_numZoomLevels: function (a, b) {
          a.numZoomLevels = parseInt(this.getChildValue(b))
        },
        read_ol_opacity: function (a, b) {
          a.opacity = parseFloat(this.getChildValue(b))
        },
        read_ol_singleTile: function (a, b) {
          a.singleTile = 'true' == this.getChildValue(b)
        },
        read_ol_tileSize: function (a, b) {
          var c = {
            width: b.getAttribute('width'),
            height: b.getAttribute('height')
          };
          a.tileSize = c
        },
        read_ol_isBaseLayer: function (a, b) {
          a.isBaseLayer = 'true' == this.getChildValue(b)
        },
        read_ol_displayInLayerSwitcher: function (a, b) {
          a.displayInLayerSwitcher = 'true' == this.getChildValue(b)
        },
        read_wmc_Server: function (a, b) {
          a.version = b.getAttribute('version');
          a.url = this.getOnlineResource_href(b);
          a.metadata.servertitle = b.getAttribute('title')
        },
        read_wmc_FormatList: function (a, b) {
          this.runChildNodes(a, b)
        },
        read_wmc_Format: function (a, b) {
          var c = {
            value: this.getChildValue(b)
          };
          '1' == b.getAttribute('current') && (c.current = !0);
          a.formats.push(c)
        },
        read_wmc_StyleList: function (a, b) {
          this.runChildNodes(a, b)
        },
        read_wmc_Style: function (a, b) {
          var c = {
          };
          this.runChildNodes(c, b);
          '1' == b.getAttribute('current') && (c.current = !0);
          a.styles.push(c)
        },
        read_wmc_SLD: function (a, b) {
          this.runChildNodes(a, b)
        },
        read_sld_StyledLayerDescriptor: function (a, b) {
          var c = OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ]);
          a.body = c
        },
        read_sld_FeatureTypeStyle: function (a, b) {
          var c = OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ]);
          a.body = c
        },
        read_wmc_OnlineResource: function (a, b) {
          a.href = this.getAttributeNS(b, this.namespaces.xlink, 'href')
        },
        read_wmc_Name: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.name = c)
        },
        read_wmc_Title: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.title = c)
        },
        read_wmc_MetadataURL: function (a, b) {
          a.metadataURL = this.getOnlineResource_href(b)
        },
        read_wmc_KeywordList: function (a, b) {
          a.keywords = [
          ];
          this.runChildNodes(a.keywords, b)
        },
        read_wmc_Keyword: function (a, b) {
          a.push(this.getChildValue(b))
        },
        read_wmc_Abstract: function (a, b) {
          var c = this.getChildValue(b);
          c && (a['abstract'] = c)
        },
        read_wmc_LogoURL: function (a, b) {
          a.logo = {
            width: b.getAttribute('width'),
            height: b.getAttribute('height'),
            format: b.getAttribute('format'),
            href: this.getOnlineResource_href(b)
          }
        },
        read_wmc_DescriptionURL: function (a, b) {
          a.descriptionURL = this.getOnlineResource_href(b)
        },
        read_wmc_ContactInformation: function (a, b) {
          var c = {
          };
          this.runChildNodes(c, b);
          a.contactInformation = c
        },
        read_wmc_ContactPersonPrimary: function (a, b) {
          var c = {
          };
          this.runChildNodes(c, b);
          a.personPrimary = c
        },
        read_wmc_ContactPerson: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.person = c)
        },
        read_wmc_ContactOrganization: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.organization = c)
        },
        read_wmc_ContactPosition: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.position = c)
        },
        read_wmc_ContactAddress: function (a, b) {
          var c = {
          };
          this.runChildNodes(c, b);
          a.contactAddress = c
        },
        read_wmc_AddressType: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.type = c)
        },
        read_wmc_Address: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.address = c)
        },
        read_wmc_City: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.city = c)
        },
        read_wmc_StateOrProvince: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.stateOrProvince = c)
        },
        read_wmc_PostCode: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.postcode = c)
        },
        read_wmc_Country: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.country = c)
        },
        read_wmc_ContactVoiceTelephone: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.phone = c)
        },
        read_wmc_ContactFacsimileTelephone: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.fax = c)
        },
        read_wmc_ContactElectronicMailAddress: function (a, b) {
          var c = this.getChildValue(b);
          c && (a.email = c)
        },
        read_wmc_DataURL: function (a, b) {
          a.dataURL = this.getOnlineResource_href(b)
        },
        read_wmc_LegendURL: function (a, b) {
          var c = {
            width: b.getAttribute('width'),
            height: b.getAttribute('height'),
            format: b.getAttribute('format'),
            href: this.getOnlineResource_href(b)
          };
          a.legend = c
        },
        read_wmc_DimensionList: function (a, b) {
          a.dimensions = {
          };
          this.runChildNodes(a.dimensions, b)
        },
        read_wmc_Dimension: function (a, b) {
          var c = {
            name: b.getAttribute('name').toLowerCase(),
            units: b.getAttribute('units') || '',
            unitSymbol: b.getAttribute('unitSymbol') || '',
            userValue: b.getAttribute('userValue') || '',
            nearestValue: '1' === b.getAttribute('nearestValue'),
            multipleValues: '1' === b.getAttribute('multipleValues'),
            current: '1' === b.getAttribute('current'),
            'default': b.getAttribute('default') || ''
          },
              d = this.getChildValue(b);
          c.values = d.split(',');
          a[c.name] = c
        },
        write: function (a, b) {
          var c = this.createElementDefaultNS('ViewContext');
          this.setAttributes(c, {
            version: this.VERSION,
            id: b && 'string' == typeof b.id ? b.id : OpenLayers.Util.createUniqueID('OpenLayers_Context_')
          });
          this.setAttributeNS(c, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          c.appendChild(this.write_wmc_General(a));
          c.appendChild(this.write_wmc_LayerList(a));
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            c
          ])
        },
        createElementDefaultNS: function (a, b, c) {
          a = this.createElementNS(this.namespaces[this.defaultPrefix], a);
          b && a.appendChild(this.createTextNode(b));
          c && this.setAttributes(a, c);
          return a
        },
        setAttributes: function (a, b) {
          var c,
              d;
          for (d in b) c = b[d].toString(),
            c.match(/[A-Z]/) ? this.setAttributeNS(a, null, d, c)  : a.setAttribute(d, c)
            },
        write_wmc_General: function (a) {
          var b = this.createElementDefaultNS('General');
          a.size && b.appendChild(this.createElementDefaultNS('Window', null, {
            width: a.size.w,
            height: a.size.h
          }));
          var c = a.bounds;
          b.appendChild(this.createElementDefaultNS('BoundingBox', null, {
            minx: c.left.toPrecision(18),
            miny: c.bottom.toPrecision(18),
            maxx: c.right.toPrecision(18),
            maxy: c.top.toPrecision(18),
            SRS: a.projection
          }));
          b.appendChild(this.createElementDefaultNS('Title', a.title));
          a.keywords && b.appendChild(this.write_wmc_KeywordList(a.keywords));
          a['abstract'] && b.appendChild(this.createElementDefaultNS('Abstract', a['abstract']));
          a.logo && b.appendChild(this.write_wmc_URLType('LogoURL', a.logo.href, a.logo));
          a.descriptionURL && b.appendChild(this.write_wmc_URLType('DescriptionURL', a.descriptionURL));
          a.contactInformation && b.appendChild(this.write_wmc_ContactInformation(a.contactInformation));
          b.appendChild(this.write_ol_MapExtension(a));
          return b
        },
        write_wmc_KeywordList: function (a) {
          for (var b = this.createElementDefaultNS('KeywordList'), c = 0, d = a.length; c < d; c++) b.appendChild(this.createElementDefaultNS('Keyword', a[c]));
          return b
        },
        write_wmc_ContactInformation: function (a) {
          var b = this.createElementDefaultNS('ContactInformation');
          a.personPrimary && b.appendChild(this.write_wmc_ContactPersonPrimary(a.personPrimary));
          a.position && b.appendChild(this.createElementDefaultNS('ContactPosition', a.position));
          a.contactAddress && b.appendChild(this.write_wmc_ContactAddress(a.contactAddress));
          a.phone && b.appendChild(this.createElementDefaultNS('ContactVoiceTelephone', a.phone));
          a.fax && b.appendChild(this.createElementDefaultNS('ContactFacsimileTelephone', a.fax));
          a.email && b.appendChild(this.createElementDefaultNS('ContactElectronicMailAddress', a.email));
          return b
        },
        write_wmc_ContactPersonPrimary: function (a) {
          var b = this.createElementDefaultNS('ContactPersonPrimary');
          a.person && b.appendChild(this.createElementDefaultNS('ContactPerson', a.person));
          a.organization && b.appendChild(this.createElementDefaultNS('ContactOrganization', a.organization));
          return b
        },
        write_wmc_ContactAddress: function (a) {
          var b = this.createElementDefaultNS('ContactAddress');
          a.type && b.appendChild(this.createElementDefaultNS('AddressType', a.type));
          a.address && b.appendChild(this.createElementDefaultNS('Address', a.address));
          a.city && b.appendChild(this.createElementDefaultNS('City', a.city));
          a.stateOrProvince && b.appendChild(this.createElementDefaultNS('StateOrProvince', a.stateOrProvince));
          a.postcode && b.appendChild(this.createElementDefaultNS('PostCode', a.postcode));
          a.country && b.appendChild(this.createElementDefaultNS('Country', a.country));
          return b
        },
        write_ol_MapExtension: function (a) {
          var b = this.createElementDefaultNS('Extension');
          if (a = a.maxExtent) {
            var c = this.createElementNS(this.namespaces.ol, 'ol:maxExtent');
            this.setAttributes(c, {
              minx: a.left.toPrecision(18),
              miny: a.bottom.toPrecision(18),
              maxx: a.right.toPrecision(18),
              maxy: a.top.toPrecision(18)
            });
            b.appendChild(c)
          }
          return b
        },
        write_wmc_LayerList: function (a) {
          for (var b = this.createElementDefaultNS('LayerList'), c = 0, d = a.layersContext.length; c < d; ++c) b.appendChild(this.write_wmc_Layer(a.layersContext[c]));
          return b
        },
        write_wmc_Layer: function (a) {
          var b = this.createElementDefaultNS('Layer', null, {
            queryable: a.queryable ? '1' : '0',
            hidden: a.visibility ? '0' : '1'
          });
          b.appendChild(this.write_wmc_Server(a));
          b.appendChild(this.createElementDefaultNS('Name', a.name));
          b.appendChild(this.createElementDefaultNS('Title', a.title));
          a['abstract'] && b.appendChild(this.createElementDefaultNS('Abstract', a['abstract']));
          a.dataURL && b.appendChild(this.write_wmc_URLType('DataURL', a.dataURL));
          a.metadataURL && b.appendChild(this.write_wmc_URLType('MetadataURL', a.metadataURL));
          return b
        },
        write_wmc_LayerExtension: function (a) {
          var b = this.createElementDefaultNS('Extension'),
              c = a.maxExtent,
              d = this.createElementNS(this.namespaces.ol, 'ol:maxExtent');
          this.setAttributes(d, {
            minx: c.left.toPrecision(18),
            miny: c.bottom.toPrecision(18),
            maxx: c.right.toPrecision(18),
            maxy: c.top.toPrecision(18)
          });
          b.appendChild(d);
          a.tileSize && !a.singleTile && (c = this.createElementNS(this.namespaces.ol, 'ol:tileSize'), this.setAttributes(c, a.tileSize), b.appendChild(c));
          for (var c = 'transparent numZoomLevels units isBaseLayer opacity displayInLayerSwitcher singleTile'.split(' '), e = 0, f = c.length; e < f; ++e) (d = this.createOLPropertyNode(a, c[e])) && b.appendChild(d);
          return b
        },
        createOLPropertyNode: function (a, b) {
          var c = null;
          null != a[b] && (c = this.createElementNS(this.namespaces.ol, 'ol:' + b), c.appendChild(this.createTextNode(a[b].toString())));
          return c
        },
        write_wmc_Server: function (a) {
          var a = a.server,
              b = this.createElementDefaultNS('Server'),
              c = {
                service: 'OGC:WMS',
                version: a.version
              };
          a.title && (c.title = a.title);
          this.setAttributes(b, c);
          b.appendChild(this.write_wmc_OnlineResource(a.url));
          return b
        },
        write_wmc_URLType: function (a, b, c) {
          a = this.createElementDefaultNS(a);
          a.appendChild(this.write_wmc_OnlineResource(b));
          if (c) for (var b = [
            'width',
            'height',
            'format'
          ], d = 0; d < b.length; d++) b[d] in c && a.setAttribute(b[d], c[b[d]]);
          return a
        },
        write_wmc_DimensionList: function (a) {
          var b = this.createElementDefaultNS('DimensionList'),
              c;
          for (c in a.dimensions) {
            var d = {
            },
                e = a.dimensions[c],
                f;
            for (f in e) d[f] = 'boolean' == typeof e[f] ? Number(e[f])  : e[f];
            e = '';
            d.values && (e = d.values.join(','), delete d.values);
            b.appendChild(this.createElementDefaultNS('Dimension', e, d))
          }
          return b
        },
        write_wmc_FormatList: function (a) {
          for (var b = this.createElementDefaultNS('FormatList'), c = 0, d = a.formats.length; c < d; c++) {
            var e = a.formats[c];
            b.appendChild(this.createElementDefaultNS('Format', e.value, e.current && !0 == e.current ? {
              current: '1'
            }
                                                      :
                                                      null))
          }
          return b
        },
        write_wmc_StyleList: function (a) {
          var b = this.createElementDefaultNS('StyleList');
          if ((a = a.styles) && OpenLayers.Util.isArray(a)) for (var c, d = 0, e = a.length; d < e; d++) {
            var f = a[d],
                g = this.createElementDefaultNS('Style', null, f.current && !0 == f.current ? {
                  current: '1'
                }
                                                : null);
            f.href ? (c = this.createElementDefaultNS('SLD'), f.name && c.appendChild(this.createElementDefaultNS('Name', f.name)), f.title && c.appendChild(this.createElementDefaultNS('Title', f.title)), f.legend && c.appendChild(this.write_wmc_URLType('LegendURL', f.legend.href, f.legend)), f = this.write_wmc_OnlineResource(f.href), c.appendChild(f), g.appendChild(c))  : f.body ? (c = this.createElementDefaultNS('SLD'), f.name && c.appendChild(this.createElementDefaultNS('Name', f.name)), f.title && c.appendChild(this.createElementDefaultNS('Title', f.title)), f.legend && c.appendChild(this.write_wmc_URLType('LegendURL', f.legend.href, f.legend)), f = OpenLayers.Format.XML.prototype.read.apply(this, [
              f.body
            ]).documentElement, c.ownerDocument && c.ownerDocument.importNode && (f = c.ownerDocument.importNode(f, !0)), c.appendChild(f), g.appendChild(c))  : (g.appendChild(this.createElementDefaultNS('Name', f.name)), g.appendChild(this.createElementDefaultNS('Title', f.title)), f['abstract'] && g.appendChild(this.createElementDefaultNS('Abstract', f['abstract'])), f.legend && g.appendChild(this.write_wmc_URLType('LegendURL', f.legend.href, f.legend)));
            b.appendChild(g)
          }
          return b
        },
        write_wmc_OnlineResource: function (a) {
          var b = this.createElementDefaultNS('OnlineResource');
          this.setAttributeNS(b, this.namespaces.xlink, 'xlink:type', 'simple');
          this.setAttributeNS(b, this.namespaces.xlink, 'xlink:href', a);
          return b
        },
        getOnlineResource_href: function (a) {
          var b = {
          },
              a = a.getElementsByTagName('OnlineResource');
          0 < a.length && this.read_wmc_OnlineResource(b, a[0]);
          return b.href
        },
        CLASS_NAME: 'OpenLayers.Format.WMC.v1'
      });
      OpenLayers.Control.PanPanel = OpenLayers.Class(OpenLayers.Control.Panel, {
        slideFactor: 50,
        slideRatio: null,
        initialize: function (a) {
          OpenLayers.Control.Panel.prototype.initialize.apply(this, [
            a
          ]);
          a = {
            slideFactor: this.slideFactor,
            slideRatio: this.slideRatio
          };
          this.addControls([new OpenLayers.Control.Pan(OpenLayers.Control.Pan.NORTH, a),
                            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.SOUTH, a),
                            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.EAST, a),
                            new OpenLayers.Control.Pan(OpenLayers.Control.Pan.WEST, a)])
        },
        CLASS_NAME: 'OpenLayers.Control.PanPanel'
      });
      OpenLayers.Kinetic = OpenLayers.Class({
        threshold: 0,
        deceleration: 0.0035,
        nbPoints: 100,
        delay: 200,
        points: void 0,
        timerId: void 0,
        initialize: function (a) {
        OpenLayers.Util.extend(this, a)
      },
                                            begin: function () {
        OpenLayers.Animation.stop(this.timerId);
        this.timerId = void 0;
        this.points = [
        ]
      },
        update: function (a) {
          this.points.unshift({
            xy: a,
            tick: (new Date).getTime()
          });
          this.points.length > this.nbPoints && this.points.pop()
        },
          end: function (a) {
            for (var b, c = (new Date).getTime(), d = 0, e = this.points.length, f; d < e; d++) {
              f = this.points[d];
              if (c -
                  f.tick > this.delay) break;
              b = f
            }
            if (b && (d = (new Date).getTime() - b.tick, c = Math.sqrt(Math.pow(a.x - b.xy.x, 2) + Math.pow(a.y - b.xy.y, 2)), d = c / d, !(0 == d || d < this.threshold))) return c = Math.asin((a.y - b.xy.y) / c),
              b.xy.x <= a.x && (c = Math.PI - c),
              {
              speed: d,
              theta: c
            }
              },
                move: function (a, b) {
                  var c = a.speed,
                      d = Math.cos(a.theta),
                      e = - Math.sin(a.theta),
                      f = (new Date).getTime(),
                      g = 0,
                      h = 0;
                  this.timerId = OpenLayers.Animation.start(OpenLayers.Function.bind(function () {
                    if (null != this.timerId) {
                      var a = (new Date).getTime() - f,
                          j = - this.deceleration * Math.pow(a, 2) / 2 + c * a,
                          k = j * d,
                          j = j * e,
                          l,
                          m;
                      l = !1;
                      0 >= - this.deceleration * a + c && (OpenLayers.Animation.stop(this.timerId), this.timerId = null, l = !0);
                      a = k - g;
                      m = j - h;
                      g = k;
                      h = j;
                      b(a, m, l)
                    }
                  }, this))
                },
                  CLASS_NAME: 'OpenLayers.Kinetic'
      });
      OpenLayers.Layer.GeoRSS = OpenLayers.Class(OpenLayers.Layer.Markers, {
        location: null,
        features: null,
        formatOptions: null,
        selectedFeature: null,
        icon: null,
        popupSize: null,
        useFeedTitle: !0,
        initialize: function (a, b, c) {
          OpenLayers.Layer.Markers.prototype.initialize.apply(this, [
            a,
            c
          ]);
          this.location = b;
          this.features = [
          ]
        },
        destroy: function () {
          OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
          this.clearFeatures();
          this.features = null
        },
        loadRSS: function () {
          this.loaded || (this.events.triggerEvent('loadstart'), OpenLayers.Request.GET({
            url: this.location,
            success: this.parseData,
            scope: this
          }), this.loaded = !0)
        },
        moveTo: function (a, b, c) {
          OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
          this.visibility && !this.loaded && this.loadRSS()
        },
        parseData: function (a) {
          var b = a.responseXML;
          if (!b || !b.documentElement) b = OpenLayers.Format.XML.prototype.read(a.responseText);
          if (this.useFeedTitle) {
            a = null;
            try {
              a = b.getElementsByTagNameNS('*', 'title') [0].firstChild.nodeValue
            } catch (c) {
              a = b.getElementsByTagName('title') [0].firstChild.nodeValue
            }
            a && this.setName(a)
          }
          a = {
          };
          OpenLayers.Util.extend(a, this.formatOptions);
          this.map && !this.projection.equals(this.map.getProjectionObject()) && (a.externalProjection = this.projection, a.internalProjection = this.map.getProjectionObject());
          for (var b = (new OpenLayers.Format.GeoRSS(a)).read(b), a = 0, d = b.length; a < d; a++) {
            var e = {
            },
                f = b[a];
            if (f.geometry) {
              var g = f.attributes.title ? f.attributes.title : 'Untitled',
                  h = f.attributes.description ? f.attributes.description : 'No description.',
                  i = f.attributes.link ? f.attributes.link : '',
                  f = f.geometry.getBounds().getCenterLonLat();
              e.icon = null == this.icon ? OpenLayers.Marker.defaultIcon()  : this.icon.clone();
              e.popupSize = this.popupSize ? this.popupSize.clone()  : new OpenLayers.Size(250, 120);
              if (g || h) {
                e.title = g;
                e.description = h;
                var j = '<div class="olLayerGeoRSSClose">[x]</div>',
                    j = j + '<div class="olLayerGeoRSSTitle">';
                i && (j += '<a class="link" href="' + i + '" target="_blank">');
                j += g;
                i && (j += '</a>');
                j += '</div>';
                j += '<div style="" class="olLayerGeoRSSDescription">';
                j += h;
                j += '</div>';
                e.popupContentHTML = j
              }
              f = new OpenLayers.Feature(this, f, e);
              this.features.push(f);
              e = f.createMarker();
              e.events.register('click', f, this.markerClick);
              this.addMarker(e)
            }
          }
          this.events.triggerEvent('loadend')
        },
        markerClick: function (a) {
          var b = this == this.layer.selectedFeature;
          this.layer.selectedFeature = !b ? this : null;
          for (var c = 0, d = this.layer.map.popups.length; c < d; c++) this.layer.map.removePopup(this.layer.map.popups[c]);
          b || (b = this.createPopup(), OpenLayers.Event.observe(b.div, 'click', OpenLayers.Function.bind(function () {
            for (var a = 0, b = this.layer.map.popups.length; a < b; a++) this.layer.map.removePopup(this.layer.map.popups[a])
              }, this)), this.layer.map.addPopup(b));
          OpenLayers.Event.stop(a)
        },
        clearFeatures: function () {
          if (null != this.features) for (; 0 < this.features.length; ) {
            var a = this.features[0];
            OpenLayers.Util.removeItem(this.features, a);
            a.destroy()
          }
        },
        CLASS_NAME: 'OpenLayers.Layer.GeoRSS'
      });
      OpenLayers.Format.SLD.v1 = OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0, {
        namespaces: {
          sld: 'http://www.opengis.net/sld',
          ogc: 'http://www.opengis.net/ogc',
          gml: 'http://www.opengis.net/gml',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        defaultPrefix: 'sld',
        schemaLocation: null,
        multipleSymbolizers: !1,
        featureTypeCounter: null,
        defaultSymbolizer: {
          fillColor: '#808080',
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeOpacity: 1,
          strokeWidth: 1,
          strokeDashstyle: 'solid',
          pointRadius: 3,
          graphicName: 'square'
        },
        read: function (a, b) {
          var b = OpenLayers.Util.applyDefaults(b, this.options),
              c = {
                namedLayers: !0 === b.namedLayersAsArray ? [
                ] : {
                }
              };
          this.readChildNodes(a, c);
          return c
        },
        readers: OpenLayers.Util.applyDefaults({
          sld: {
            StyledLayerDescriptor: function (a, b) {
              b.version = a.getAttribute('version');
              this.readChildNodes(a, b)
            },
            Name: function (a, b) {
              b.name = this.getChildValue(a)
            },
            Title: function (a, b) {
              b.title = this.getChildValue(a)
            },
            Abstract: function (a, b) {
              b.description = this.getChildValue(a)
            },
            NamedLayer: function (a, b) {
              var c = {
                userStyles: [
                ],
                namedStyles: [
                ]
              };
              this.readChildNodes(a, c);
              for (var d = 0, e = c.userStyles.length; d < e; ++d) c.userStyles[d].layerName = c.name;
              OpenLayers.Util.isArray(b.namedLayers) ? b.namedLayers.push(c)  : b.namedLayers[c.name] = c
            },
            NamedStyle: function (a, b) {
              b.namedStyles.push(this.getChildName(a.firstChild))
            },
            UserStyle: function (a, b) {
              var c = {
                defaultsPerSymbolizer: !0,
                rules: [
                ]
              };
              this.featureTypeCounter = - 1;
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (delete c.defaultsPerSymbolizer, c = new OpenLayers.Style2(c))  : c = new OpenLayers.Style(this.defaultSymbolizer, c);
              b.userStyles.push(c)
            },
            IsDefault: function (a, b) {
              '1' == this.getChildValue(a) && (b.isDefault = !0)
            },
            FeatureTypeStyle: function (a, b) {
              ++this.featureTypeCounter;
              var c = {
                rules: this.multipleSymbolizers ? b.rules : [
                ]
              };
              this.readChildNodes(a, c);
              this.multipleSymbolizers || (b.rules = c.rules)
            },
            Rule: function (a, b) {
              var c;
              this.multipleSymbolizers && (c = {
                symbolizers: [
                ]
              });
              c = new OpenLayers.Rule(c);
              this.readChildNodes(a, c);
              b.rules.push(c)
            },
            ElseFilter: function (a, b) {
              b.elseFilter = !0
            },
            MinScaleDenominator: function (a, b) {
              b.minScaleDenominator = parseFloat(this.getChildValue(a))
            },
            MaxScaleDenominator: function (a, b) {
              b.maxScaleDenominator = parseFloat(this.getChildValue(a))
            },
            TextSymbolizer: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (c.zIndex = this.featureTypeCounter, b.symbolizers.push(new OpenLayers.Symbolizer.Text(c)))  : b.symbolizer.Text = OpenLayers.Util.applyDefaults(c, b.symbolizer.Text)
            },
            LabelPlacement: function (a, b) {
              this.readChildNodes(a, b)
            },
            PointPlacement: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              c.labelRotation = c.rotation;
              delete c.rotation;
              var d,
                  e = b.labelAnchorPointX,
                  f = b.labelAnchorPointY;
              e <= 1 / 3 ? d = 'l' : e > 1 / 3 && e < 2 / 3 ? d = 'c' : e >= 2 / 3 && (d = 'r');
              f <= 1 / 3 ? d += 'b' : f > 1 / 3 && f < 2 / 3 ? d += 'm' : f >= 2 / 3 && (d += 't');
              c.labelAlign = d;
              OpenLayers.Util.applyDefaults(b, c)
            },
            AnchorPoint: function (a, b) {
              this.readChildNodes(a, b)
            },
            AnchorPointX: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.labelAnchorPointX = c)
            },
            AnchorPointY: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.labelAnchorPointY = c)
            },
            Displacement: function (a, b) {
              this.readChildNodes(a, b)
            },
            DisplacementX: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.labelXOffset = c)
            },
            DisplacementY: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.labelYOffset = c)
            },
            LinePlacement: function (a, b) {
              this.readChildNodes(a, b)
            },
            PerpendicularOffset: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.labelPerpendicularOffset = c)
            },
            Label: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.label = c)
            },
            Font: function (a, b) {
              this.readChildNodes(a, b)
            },
            Halo: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.haloRadius = c.haloRadius;
              b.haloColor = c.fillColor;
              b.haloOpacity = c.fillOpacity
            },
            Radius: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              null != c && (b.haloRadius = c)
            },
            RasterSymbolizer: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (c.zIndex = this.featureTypeCounter, b.symbolizers.push(new OpenLayers.Symbolizer.Raster(c)))  : b.symbolizer.Raster = OpenLayers.Util.applyDefaults(c, b.symbolizer.Raster)
            },
            Geometry: function (a, b) {
              b.geometry = {
              };
              this.readChildNodes(a, b.geometry)
            },
            ColorMap: function (a, b) {
              b.colorMap = [
              ];
              this.readChildNodes(a, b.colorMap)
            },
            ColorMapEntry: function (a, b) {
              var c = a.getAttribute('quantity'),
                  d = a.getAttribute('opacity');
              b.push({
                color: a.getAttribute('color'),
                quantity: null !== c ? parseFloat(c)  : void 0,
                label: a.getAttribute('label') || void 0,
                opacity: null !== d ? parseFloat(d)  : void 0
              })
            },
            LineSymbolizer: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (c.zIndex = this.featureTypeCounter, b.symbolizers.push(new OpenLayers.Symbolizer.Line(c)))  :
              b.symbolizer.Line = OpenLayers.Util.applyDefaults(c, b.symbolizer.Line)
            },
            PolygonSymbolizer: function (a, b) {
              var c = {
                fill: !1,
                stroke: !1
              };
              this.multipleSymbolizers || (c = b.symbolizer.Polygon || c);
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (c.zIndex = this.featureTypeCounter, b.symbolizers.push(new OpenLayers.Symbolizer.Polygon(c)))  : b.symbolizer.Polygon = c
            },
            PointSymbolizer: function (a, b) {
              var c = {
                fill: !1,
                stroke: !1,
                graphic: !1
              };
              this.multipleSymbolizers || (c = b.symbolizer.Point || c);
              this.readChildNodes(a, c);
              this.multipleSymbolizers ? (c.zIndex = this.featureTypeCounter, b.symbolizers.push(new OpenLayers.Symbolizer.Point(c)))  : b.symbolizer.Point = c
            },
            Stroke: function (a, b) {
              b.stroke = !0;
              this.readChildNodes(a, b)
            },
            Fill: function (a, b) {
              b.fill = !0;
              this.readChildNodes(a, b)
            },
            CssParameter: function (a, b) {
              var c = a.getAttribute('name'),
                  d = this.cssMap[c];
              b.label && ('fill' === c ? d = 'fontColor' : 'fill-opacity' === c && (d = 'fontOpacity'));
              d && (c = this.readers.ogc._expression.call(this, a)) && (b[d] = c)
            },
            Graphic: function (a, b) {
              b.graphic = !0;
              var c = {
              };
              this.readChildNodes(a, c);
              for (var d = 'stroke strokeColor strokeWidth strokeOpacity strokeLinecap fill fillColor fillOpacity graphicName rotation graphicFormat'.split(' '), e, f, g = 0, h = d.length; g < h; ++g) e = d[g],
                f = c[e],
                void 0 != f && (b[e] = f);
              void 0 != c.opacity && (b.graphicOpacity = c.opacity);
              void 0 != c.size && (isNaN(c.size / 2) ? b.graphicWidth = c.size : b.pointRadius = c.size / 2);
              void 0 != c.href && (b.externalGraphic = c.href);
              void 0 != c.rotation && (b.rotation = c.rotation)
            },
            ExternalGraphic: function (a, b) {
              this.readChildNodes(a, b)
            },
            Mark: function (a, b) {
              this.readChildNodes(a, b)
            },
            WellKnownName: function (a, b) {
              b.graphicName = this.getChildValue(a)
            },
            Opacity: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.opacity = c)
            },
            Size: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.size = c)
            },
            Rotation: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.rotation = c)
            },
            OnlineResource: function (a, b) {
              b.href = this.getAttributeNS(a, this.namespaces.xlink, 'href')
            },
            Format: function (a, b) {
              b.graphicFormat = this.getChildValue(a)
            }
          }
        }, OpenLayers.Format.Filter.v1_0_0.prototype.readers),
        cssMap: {
          stroke: 'strokeColor',
          'stroke-opacity': 'strokeOpacity',
          'stroke-width': 'strokeWidth',
          'stroke-linecap': 'strokeLinecap',
          'stroke-dasharray': 'strokeDashstyle',
          fill: 'fillColor',
          'fill-opacity': 'fillOpacity',
          'font-family': 'fontFamily',
          'font-size': 'fontSize',
          'font-weight': 'fontWeight',
          'font-style': 'fontStyle'
        },
        getCssProperty: function (a) {
          var b = null,
              c;
          for (c in this.cssMap) if (this.cssMap[c] == a) {
            b = c;
            break
          }
          return b
        },
        getGraphicFormat: function (a) {
          var b,
              c;
          for (c in this.graphicFormats) if (this.graphicFormats[c].test(a)) {
            b = c;
            break
          }
          return b || this.defaultGraphicFormat
        },
        defaultGraphicFormat: 'image/png',
        graphicFormats: {
          'image/jpeg': /\.jpe?g$/i,
          'image/gif': /\.gif$/i,
          'image/png': /\.png$/i
        },
        write: function (a) {
          return this.writers.sld.StyledLayerDescriptor.apply(this, [
            a
          ])
        },
        writers: OpenLayers.Util.applyDefaults({
          sld: {
            _OGCExpression: function (a, b) {
              var c = this.createElementNSPlus(a),
                  d = 'string' == typeof b ? b.split('${')  : [
                    b
                  ];
              c.appendChild(this.createTextNode(d[0]));
              for (var e, f, g = 1, h = d.length; g < h; g++) e = d[g],
                f = e.indexOf('}'),
                0 < f ? (this.writeNode('ogc:PropertyName', {
                property: e.substring(0, f)
              }, c), c.appendChild(this.createTextNode(e.substring(++f))))  : c.appendChild(this.createTextNode('${' + e));
              return c
            },
            StyledLayerDescriptor: function (a) {
              var b = this.createElementNSPlus('sld:StyledLayerDescriptor', {
                attributes: {
                  version: this.VERSION,
                  'xsi:schemaLocation': this.schemaLocation
                }
              });
              b.setAttribute('xmlns:ogc', this.namespaces.ogc);
              b.setAttribute('xmlns:gml', this.namespaces.gml);
              a.name && this.writeNode('Name', a.name, b);
              a.title && this.writeNode('Title', a.title, b);
              a.description && this.writeNode('Abstract', a.description, b);
              if (OpenLayers.Util.isArray(a.namedLayers)) for (var c = 0, d = a.namedLayers.length; c < d; ++c) this.writeNode('NamedLayer', a.namedLayers[c], b);
              else for (c in a.namedLayers) this.writeNode('NamedLayer', a.namedLayers[c], b);
              return b
            },
            Name: function (a) {
              return this.createElementNSPlus('sld:Name', {
                value: a
              })
            },
            Title: function (a) {
              return this.createElementNSPlus('sld:Title', {
                value: a
              })
            },
            Abstract: function (a) {
              return this.createElementNSPlus('sld:Abstract', {
                value: a
              })
            },
            NamedLayer: function (a) {
              var b = this.createElementNSPlus('sld:NamedLayer');
              this.writeNode('Name', a.name, b);
              if (a.namedStyles) for (var c = 0, d = a.namedStyles.length; c < d; ++c) this.writeNode('NamedStyle', a.namedStyles[c], b);
              if (a.userStyles) {
                c = 0;
                for (d = a.userStyles.length; c < d; ++c) this.writeNode('UserStyle', a.userStyles[c], b)
                  }
              return b
            },
            NamedStyle: function (a) {
              var b = this.createElementNSPlus('sld:NamedStyle');
              this.writeNode('Name', a, b);
              return b
            },
            UserStyle: function (a) {
              var b = this.createElementNSPlus('sld:UserStyle');
              a.name && this.writeNode('Name', a.name, b);
              a.title && this.writeNode('Title', a.title, b);
              a.description && this.writeNode('Abstract', a.description, b);
              a.isDefault && this.writeNode('IsDefault', a.isDefault, b);
              if (this.multipleSymbolizers && a.rules) {
                for (var c = {
                  '0': [
                  ]
                }, d = [
                  0
                ], e, f, g, h, i, j = 0, k = a.rules.length; j < k; ++j) if (e = a.rules[j], e.symbolizers) {
                  f = {
                  };
                  for (var l = 0, m = e.symbolizers.length; l < m; ++l) g = e.symbolizers[l],
                    h = g.zIndex,
                    h in f || (i = e.clone(), i.symbolizers = [
                  ], f[h] = i),
                    f[h].symbolizers.push(g.clone());
                  for (h in f) h in c || (d.push(h), c[h] = [
                  ]),
                    c[h].push(f[h])
                    } else c[0].push(e.clone());
                d.sort();
                j = 0;
                for (k = d.length; j < k; ++j) e = c[d[j]],
                  0 < e.length && (i = a.clone(), i.rules = c[d[j]], this.writeNode('FeatureTypeStyle', i, b))
                  } else this.writeNode('FeatureTypeStyle', a, b);
              return b
            },
            IsDefault: function (a) {
              return this.createElementNSPlus('sld:IsDefault', {
                value: a ? '1' : '0'
              })
            },
            FeatureTypeStyle: function (a) {
              for (var b = this.createElementNSPlus('sld:FeatureTypeStyle'), c = 0, d = a.rules.length; c < d; ++c) this.writeNode('Rule', a.rules[c], b);
              return b
            },
            Rule: function (a) {
              var b = this.createElementNSPlus('sld:Rule');
              a.name && this.writeNode('Name', a.name, b);
              a.title && this.writeNode('Title', a.title, b);
              a.description && this.writeNode('Abstract', a.description, b);
              a.elseFilter ? this.writeNode('ElseFilter', null, b)  : a.filter && this.writeNode('ogc:Filter', a.filter, b);
              void 0 != a.minScaleDenominator && this.writeNode('MinScaleDenominator', a.minScaleDenominator, b);
              void 0 != a.maxScaleDenominator && this.writeNode('MaxScaleDenominator', a.maxScaleDenominator, b);
              var c,
                  d;
              if (this.multipleSymbolizers && a.symbolizers) for (var e = 0, f = a.symbolizers.length; e <
                                                                  f; ++e) d = a.symbolizers[e],
                c = d.CLASS_NAME.split('.').pop(),
                this.writeNode(c + 'Symbolizer', d, b);
              else for (var f = OpenLayers.Style.SYMBOLIZER_PREFIXES, e = 0, g = f.length; e < g; ++e) c = f[e],
                (d = a.symbolizer[c]) && this.writeNode(c + 'Symbolizer', d, b);
              return b
            },
            ElseFilter: function () {
              return this.createElementNSPlus('sld:ElseFilter')
            },
            MinScaleDenominator: function (a) {
              return this.createElementNSPlus('sld:MinScaleDenominator', {
                value: a
              })
            },
            MaxScaleDenominator: function (a) {
              return this.createElementNSPlus('sld:MaxScaleDenominator', {
                value: a
              })
            },
            LineSymbolizer: function (a) {
              var b = this.createElementNSPlus('sld:LineSymbolizer');
              this.writeNode('Stroke', a, b);
              return b
            },
            Stroke: function (a) {
              var b = this.createElementNSPlus('sld:Stroke');
              void 0 != a.strokeColor && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'strokeColor'
              }, b);
              void 0 != a.strokeOpacity && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'strokeOpacity'
              }, b);
              void 0 != a.strokeWidth && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'strokeWidth'
              }, b);
              void 0 != a.strokeDashstyle && 'solid' !==
                a.strokeDashstyle && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'strokeDashstyle'
              }, b);
              void 0 != a.strokeLinecap && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'strokeLinecap'
              }, b);
              return b
            },
            CssParameter: function (a) {
              return this.createElementNSPlus('sld:CssParameter', {
                attributes: {
                  name: this.getCssProperty(a.key)
                },
                value: a.symbolizer[a.key]
              })
            },
            TextSymbolizer: function (a) {
              var b = this.createElementNSPlus('sld:TextSymbolizer');
              null != a.label && this.writeNode('Label', a.label, b);
              (null != a.fontFamily || null != a.fontSize || null != a.fontWeight || null != a.fontStyle) && this.writeNode('Font', a, b);
              (null != a.labelAnchorPointX || null != a.labelAnchorPointY || null != a.labelAlign || null != a.labelXOffset || null != a.labelYOffset || null != a.labelRotation || null != a.labelPerpendicularOffset) && this.writeNode('LabelPlacement', a, b);
              (null != a.haloRadius || null != a.haloColor || null != a.haloOpacity) && this.writeNode('Halo', a, b);
              (null != a.fontColor || null != a.fontOpacity) && this.writeNode('Fill', {
                fillColor: a.fontColor,
                fillOpacity: a.fontOpacity
              }, b);
              return b
            },
            LabelPlacement: function (a) {
              var b = this.createElementNSPlus('sld:LabelPlacement');
              (null != a.labelAnchorPointX || null != a.labelAnchorPointY || null != a.labelAlign || null != a.labelXOffset || null != a.labelYOffset || null != a.labelRotation) && null == a.labelPerpendicularOffset && this.writeNode('PointPlacement', a, b);
              null != a.labelPerpendicularOffset && this.writeNode('LinePlacement', a, b);
              return b
            },
            LinePlacement: function (a) {
              var b = this.createElementNSPlus('sld:LinePlacement');
              this.writeNode('PerpendicularOffset', a.labelPerpendicularOffset, b);
              return b
            },
            PerpendicularOffset: function (a) {
              return this.createElementNSPlus('sld:PerpendicularOffset', {
                value: a
              })
            },
            PointPlacement: function (a) {
              var b = this.createElementNSPlus('sld:PointPlacement');
              (null != a.labelAnchorPointX || null != a.labelAnchorPointY || null != a.labelAlign) && this.writeNode('AnchorPoint', a, b);
              (null != a.labelXOffset || null != a.labelYOffset) && this.writeNode('Displacement', a, b);
              null != a.labelRotation && this.writeNode('Rotation', a.labelRotation, b);
              return b
            },
            AnchorPoint: function (a) {
              var b = this.createElementNSPlus('sld:AnchorPoint'),
                  c = a.labelAnchorPointX,
                  d = a.labelAnchorPointY;
              null != c && this.writeNode('AnchorPointX', c, b);
              null != d && this.writeNode('AnchorPointY', d, b);
              if (null == c && null == d) {
                var e = a.labelAlign.substr(0, 1),
                    a = a.labelAlign.substr(1, 1);
                'l' === e ? c = 0 : 'c' === e ? c = 0.5 : 'r' === e && (c = 1);
                'b' === a ? d = 0 : 'm' === a ? d = 0.5 : 't' === a && (d = 1);
                this.writeNode('AnchorPointX', c, b);
                this.writeNode('AnchorPointY', d, b)
              }
              return b
            },
            AnchorPointX: function (a) {
              return this.createElementNSPlus('sld:AnchorPointX', {
                value: a
              })
            },
            AnchorPointY: function (a) {
              return this.createElementNSPlus('sld:AnchorPointY', {
                value: a
              })
            },
            Displacement: function (a) {
              var b = this.createElementNSPlus('sld:Displacement');
              null != a.labelXOffset && this.writeNode('DisplacementX', a.labelXOffset, b);
              null != a.labelYOffset && this.writeNode('DisplacementY', a.labelYOffset, b);
              return b
            },
            DisplacementX: function (a) {
              return this.createElementNSPlus('sld:DisplacementX', {
                value: a
              })
            },
            DisplacementY: function (a) {
              return this.createElementNSPlus('sld:DisplacementY', {
                value: a
              })
            },
            Font: function (a) {
              var b = this.createElementNSPlus('sld:Font');
              a.fontFamily && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fontFamily'
              }, b);
              a.fontSize && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fontSize'
              }, b);
              a.fontWeight && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fontWeight'
              }, b);
              a.fontStyle && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fontStyle'
              }, b);
              return b
            },
            Label: function (a) {
              return this.writers.sld._OGCExpression.call(this, 'sld:Label', a)
            },
            Halo: function (a) {
              var b = this.createElementNSPlus('sld:Halo');
              a.haloRadius && this.writeNode('Radius', a.haloRadius, b);
              (a.haloColor || a.haloOpacity) && this.writeNode('Fill', {
                fillColor: a.haloColor,
                fillOpacity: a.haloOpacity
              }, b);
              return b
            },
            Radius: function (a) {
              return this.createElementNSPlus('sld:Radius', {
                value: a
              })
            },
            RasterSymbolizer: function (a) {
              var b = this.createElementNSPlus('sld:RasterSymbolizer');
              a.geometry && this.writeNode('Geometry', a.geometry, b);
              a.opacity && this.writeNode('Opacity', a.opacity, b);
              a.colorMap && this.writeNode('ColorMap', a.colorMap, b);
              return b
            },
            Geometry: function (a) {
              var b = this.createElementNSPlus('sld:Geometry');
              a.property && this.writeNode('ogc:PropertyName', a, b);
              return b
            },
            ColorMap: function (a) {
              for (var b = this.createElementNSPlus('sld:ColorMap'), c = 0, d = a.length; c < d; ++c) this.writeNode('ColorMapEntry', a[c], b);
              return b
            },
            ColorMapEntry: function (a) {
              var b = this.createElementNSPlus('sld:ColorMapEntry');
              b.setAttribute('color', a.color);
              void 0 !== a.opacity && b.setAttribute('opacity', parseFloat(a.opacity));
              void 0 !== a.quantity && b.setAttribute('quantity', parseFloat(a.quantity));
              void 0 !== a.label && b.setAttribute('label', a.label);
              return b
            },
            PolygonSymbolizer: function (a) {
              var b = this.createElementNSPlus('sld:PolygonSymbolizer');
              !1 !== a.fill && this.writeNode('Fill', a, b);
              !1 !== a.stroke && this.writeNode('Stroke', a, b);
              return b
            },
            Fill: function (a) {
              var b = this.createElementNSPlus('sld:Fill');
              a.fillColor && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fillColor'
              }, b);
              null != a.fillOpacity && this.writeNode('CssParameter', {
                symbolizer: a,
                key: 'fillOpacity'
              }, b);
              return b
            },
            PointSymbolizer: function (a) {
              var b = this.createElementNSPlus('sld:PointSymbolizer');
              this.writeNode('Graphic', a, b);
              return b
            },
            Graphic: function (a) {
              var b = this.createElementNSPlus('sld:Graphic');
              void 0 != a.externalGraphic ?
                this.writeNode('ExternalGraphic', a, b)  : this.writeNode('Mark', a, b);
              void 0 != a.graphicOpacity && this.writeNode('Opacity', a.graphicOpacity, b);
              void 0 != a.pointRadius ? this.writeNode('Size', 2 * a.pointRadius, b)  : void 0 != a.graphicWidth && this.writeNode('Size', a.graphicWidth, b);
              void 0 != a.rotation && this.writeNode('Rotation', a.rotation, b);
              return b
            },
            ExternalGraphic: function (a) {
              var b = this.createElementNSPlus('sld:ExternalGraphic');
              this.writeNode('OnlineResource', a.externalGraphic, b);
              this.writeNode('Format', a.graphicFormat || this.getGraphicFormat(a.externalGraphic), b);
              return b
            },
            Mark: function (a) {
              var b = this.createElementNSPlus('sld:Mark');
              a.graphicName && this.writeNode('WellKnownName', a.graphicName, b);
              !1 !== a.fill && this.writeNode('Fill', a, b);
              !1 !== a.stroke && this.writeNode('Stroke', a, b);
              return b
            },
            WellKnownName: function (a) {
              return this.createElementNSPlus('sld:WellKnownName', {
                value: a
              })
            },
            Opacity: function (a) {
              return this.createElementNSPlus('sld:Opacity', {
                value: a
              })
            },
            Size: function (a) {
              return this.writers.sld._OGCExpression.call(this, 'sld:Size', a)
            },
            Rotation: function (a) {
              return this.createElementNSPlus('sld:Rotation', {
                value: a
              })
            },
            OnlineResource: function (a) {
              return this.createElementNSPlus('sld:OnlineResource', {
                attributes: {
                  'xlink:type': 'simple',
                  'xlink:href': a
                }
              })
            },
            Format: function (a) {
              return this.createElementNSPlus('sld:Format', {
                value: a
              })
            }
          }
        }, OpenLayers.Format.Filter.v1_0_0.prototype.writers),
        CLASS_NAME: 'OpenLayers.Format.SLD.v1'
      });
      OpenLayers.Format.WMC.v1_1_0 = OpenLayers.Class(OpenLayers.Format.WMC.v1, {
        VERSION: '1.1.0',
        schemaLocation: 'http://www.opengis.net/context http://schemas.opengis.net/context/1.1.0/context.xsd',
        initialize: function (a) {
          OpenLayers.Format.WMC.v1.prototype.initialize.apply(this, [
            a
          ])
        },
        read_sld_MinScaleDenominator: function (a, b) {
          var c = parseFloat(this.getChildValue(b));
          0 < c && (a.maxScale = c)
        },
        read_sld_MaxScaleDenominator: function (a, b) {
          a.minScale = parseFloat(this.getChildValue(b))
        },
        read_wmc_SRS: function (a, b) {
          'srs' in a || (a.srs = {
          });
          a.srs[this.getChildValue(b)] = !0
        },
        write_wmc_Layer: function (a) {
          var b = OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(this, [
            a
          ]);
          if (a.maxScale) {
            var c = this.createElementNS(this.namespaces.sld, 'sld:MinScaleDenominator');
            c.appendChild(this.createTextNode(a.maxScale.toPrecision(16)));
            b.appendChild(c)
          }
          a.minScale && (c = this.createElementNS(this.namespaces.sld, 'sld:MaxScaleDenominator'), c.appendChild(this.createTextNode(a.minScale.toPrecision(16))), b.appendChild(c));
          if (a.srs) for (var d in a.srs) b.appendChild(this.createElementDefaultNS('SRS', d));
          b.appendChild(this.write_wmc_FormatList(a));
          b.appendChild(this.write_wmc_StyleList(a));
          a.dimensions && b.appendChild(this.write_wmc_DimensionList(a));
          b.appendChild(this.write_wmc_LayerExtension(a));
          return b
        },
        CLASS_NAME: 'OpenLayers.Format.WMC.v1_1_0'
      });
      OpenLayers.Format.XLS = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.1.0',
        stringifyOutput: !0,
        CLASS_NAME: 'OpenLayers.Format.XLS'
      });
      OpenLayers.Format.XLS.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          xls: 'http://www.opengis.net/xls',
          gml: 'http://www.opengis.net/gml',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        xy: !0,
        defaultPrefix: 'xls',
        schemaLocation: null,
        read: function (a, b) {
          OpenLayers.Util.applyDefaults(b, this.options);
          var c = {
          };
          this.readChildNodes(a, c);
          return c
        },
        readers: {
          xls: {
            XLS: function (a, b) {
              b.version = a.getAttribute('version');
              this.readChildNodes(a, b)
            },
            Response: function (a, b) {
              this.readChildNodes(a, b)
            },
            GeocodeResponse: function (a, b) {
              b.responseLists = [
              ];
              this.readChildNodes(a, b)
            },
            GeocodeResponseList: function (a, b) {
              var c = {
                features: [
                ],
                numberOfGeocodedAddresses: parseInt(a.getAttribute('numberOfGeocodedAddresses'))
              };
              b.responseLists.push(c);
              this.readChildNodes(a, c)
            },
            GeocodedAddress: function (a, b) {
              var c = new OpenLayers.Feature.Vector;
              b.features.push(c);
              this.readChildNodes(a, c);
              c.geometry = c.components[0]
            },
            GeocodeMatchCode: function (a, b) {
              b.attributes.matchCode = {
                accuracy: parseFloat(a.getAttribute('accuracy')),
                matchType: a.getAttribute('matchType')
              }
            },
            Address: function (a, b) {
              var c = {
                countryCode: a.getAttribute('countryCode'),
                addressee: a.getAttribute('addressee'),
                street: [
                ],
                place: [
                ]
              };
              b.attributes.address = c;
              this.readChildNodes(a, c)
            },
            freeFormAddress: function (a, b) {
              b.freeFormAddress = this.getChildValue(a)
            },
            StreetAddress: function (a, b) {
              this.readChildNodes(a, b)
            },
            Building: function (a, b) {
              b.building = {
                number: a.getAttribute('number'),
                subdivision: a.getAttribute('subdivision'),
                buildingName: a.getAttribute('buildingName')
              }
            },
            Street: function (a, b) {
              b.street.push(this.getChildValue(a))
            },
            Place: function (a, b) {
              b.place[a.getAttribute('type')] = this.getChildValue(a)
            },
            PostalCode: function (a, b) {
              b.postalCode = this.getChildValue(a)
            }
          },
          gml: OpenLayers.Format.GML.v3.prototype.readers.gml
        },
        write: function (a) {
          return this.writers.xls.XLS.apply(this, [
            a
          ])
        },
        writers: {
          xls: {
            XLS: function (a) {
              var b = this.createElementNSPlus('xls:XLS', {
                attributes: {
                  version: this.VERSION,
                  'xsi:schemaLocation': this.schemaLocation
                }
              });
              this.writeNode('RequestHeader', a.header, b);
              this.writeNode('Request', a, b);
              return b
            },
            RequestHeader: function () {
              return this.createElementNSPlus('xls:RequestHeader')
            },
            Request: function (a) {
              var b = this.createElementNSPlus('xls:Request', {
                attributes: {
                  methodName: 'GeocodeRequest',
                  requestID: a.requestID || '',
                  version: this.VERSION
                }
              });
              this.writeNode('GeocodeRequest', a.addresses, b);
              return b
            },
            GeocodeRequest: function (a) {
              for (var b = this.createElementNSPlus('xls:GeocodeRequest'), c = 0, d = a.length; c < d; c++) this.writeNode('Address', a[c], b);
              return b
            },
            Address: function (a) {
              var b = this.createElementNSPlus('xls:Address', {
                attributes: {
                  countryCode: a.countryCode
                }
              });
              a.freeFormAddress ? this.writeNode('freeFormAddress', a.freeFormAddress, b)  : (a.street && this.writeNode('StreetAddress', a, b), a.municipality && this.writeNode('Municipality', a.municipality, b), a.countrySubdivision && this.writeNode('CountrySubdivision', a.countrySubdivision, b), a.postalCode && this.writeNode('PostalCode', a.postalCode, b));
              return b
            },
            freeFormAddress: function (a) {
              return this.createElementNSPlus('freeFormAddress', {
                value: a
              })
            },
            StreetAddress: function (a) {
              var b = this.createElementNSPlus('xls:StreetAddress');
              a.building && this.writeNode(b, 'Building', a.building);
              a = a.street;
              OpenLayers.Util.isArray(a) || (a = [
                a
              ]);
              for (var c = 0, d = a.length; c < d; c++) this.writeNode('Street', a[c], b);
              return b
            },
            Building: function (a) {
              return this.createElementNSPlus('xls:Building', {
                attributes: {
                  number: a.number,
                  subdivision: a.subdivision,
                  buildingName: a.buildingName
                }
              })
            },
            Street: function (a) {
              return this.createElementNSPlus('xls:Street', {
                value: a
              })
            },
            Municipality: function (a) {
              return this.createElementNSPlus('xls:Place', {
                attributes: {
                  type: 'Municipality'
                },
                value: a
              })
            },
            CountrySubdivision: function (a) {
              return this.createElementNSPlus('xls:Place', {
                attributes: {
                  type: 'CountrySubdivision'
                },
                value: a
              })
            },
            PostalCode: function (a) {
              return this.createElementNSPlus('xls:PostalCode', {
                value: a
              })
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.XLS.v1'
      });
      OpenLayers.Format.XLS.v1_1_0 = OpenLayers.Class(OpenLayers.Format.XLS.v1, {
        VERSION: '1.1',
        schemaLocation: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/LocationUtilityService.xsd',
        CLASS_NAME: 'OpenLayers.Format.XLS.v1_1_0'
      });
      OpenLayers.Format.XLS.v1_1 = OpenLayers.Format.XLS.v1_1_0;
      OpenLayers.Format.SLD.v1_0_0 = OpenLayers.Class(OpenLayers.Format.SLD.v1, {
        VERSION: '1.0.0',
        schemaLocation: 'http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd',
        CLASS_NAME: 'OpenLayers.Format.SLD.v1_0_0'
      });
      OpenLayers.Format.OWSContext = OpenLayers.Class(OpenLayers.Format.Context, {
        defaultVersion: '0.3.1',
        getVersion: function (a, b) {
          var c = OpenLayers.Format.XML.VersionedOGC.prototype.getVersion.apply(this, arguments);
          '0.3.0' === c && (c = this.defaultVersion);
          return c
        },
        toContext: function (a) {
          var b = {
          };
          'OpenLayers.Map' == a.CLASS_NAME && (b.bounds = a.getExtent(), b.maxExtent = a.maxExtent, b.projection = a.projection, b.size = a.getSize(), b.layers = a.layers);
          return b
        },
        CLASS_NAME: 'OpenLayers.Format.OWSContext'
      });
      OpenLayers.Format.OWSContext.v0_3_1 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          owc: 'http://www.opengis.net/ows-context',
          gml: 'http://www.opengis.net/gml',
          kml: 'http://www.opengis.net/kml/2.2',
          ogc: 'http://www.opengis.net/ogc',
          ows: 'http://www.opengis.net/ows',
          sld: 'http://www.opengis.net/sld',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        VERSION: '0.3.1',
        schemaLocation: 'http://www.opengis.net/ows-context http://www.ogcnetwork.net/schemas/owc/0.3.1/owsContext.xsd',
        defaultPrefix: 'owc',
        extractAttributes: !0,
        xy: !0,
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        featureNS: 'http://mapserver.gis.umn.edu/mapserver',
        featureType: 'vector',
        geometryName: 'geometry',
        nestingLayerLookup: null,
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ]);
          OpenLayers.Format.GML.v2.prototype.setGeometryTypes.call(this)
        },
        setNestingPath: function (a) {
          if (a.layersContext) for (var b = 0, c = a.layersContext.length; b < c; b++) {
            var d = a.layersContext[b],
                e = [
                ],
                f = a.title || '';
            a.metadata && a.metadata.nestingPath && (e = a.metadata.nestingPath.slice());
            '' != f && e.push(f);
            d.metadata.nestingPath = e;
            d.layersContext && this.setNestingPath(d)
          }
        },
        decomposeNestingPath: function (a) {
          var b = [
          ];
          if (OpenLayers.Util.isArray(a)) {
            for (a = a.slice(); 0 < a.length; ) b.push(a.slice()),
              a.pop();
            b.reverse()
          }
          return b
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          this.setNestingPath({
            layersContext: b.layersContext
          });
          a = [
          ];
          this.processLayer(a, b);
          delete b.layersContext;
          b.layersContext = a;
          return b
        },
        processLayer: function (a, b) {
          if (b.layersContext) for (var c = 0, d = b.layersContext.length; c < d; c++) {
            var e = b.layersContext[c];
            a.push(e);
            e.layersContext && this.processLayer(a, e)
          }
        },
        write: function (a, b) {
          this.nestingLayerLookup = {
          };
          b = b || {
          };
          OpenLayers.Util.applyDefaults(b, a);
          var c = this.writeNode('OWSContext', b);
          this.nestingLayerLookup = null;
          this.setAttributeNS(c, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            c
          ])
        },
        readers: {
          kml: {
            Document: function (a, b) {
              b.features = (new OpenLayers.Format.KML({
                kmlns: this.namespaces.kml,
                extractStyles: !0
              })).read(a)
            }
          },
          owc: {
            OWSContext: function (a, b) {
              this.readChildNodes(a, b)
            },
            General: function (a, b) {
              this.readChildNodes(a, b)
            },
            ResourceList: function (a, b) {
              this.readChildNodes(a, b)
            },
            Layer: function (a, b) {
              var c = {
                metadata: {
                },
                visibility: '1' != a.getAttribute('hidden'),
                queryable: '1' == a.getAttribute('queryable'),
                opacity: null != a.getAttribute('opacity') ? parseFloat(a.getAttribute('opacity'))  : null,
                name: a.getAttribute('name'),
                categoryLayer: null == a.getAttribute('name'),
                formats: [
                ],
                styles: [
                ]
              };
              b.layersContext || (b.layersContext = [
              ]);
              b.layersContext.push(c);
              this.readChildNodes(a, c)
            },
            InlineGeometry: function (a, b) {
              b.features = [
              ];
              var c = this.getElementsByTagNameNS(a, this.namespaces.gml, 'featureMember'),
                  d;
              1 <= c.length && (d = c[0]);
              d && d.firstChild && (c = d.firstChild.nextSibling ? d.firstChild.nextSibling : d.firstChild, this.setNamespace('feature', c.namespaceURI), this.featureType = c.localName || c.nodeName.split(':').pop(), this.readChildNodes(a, b))
            },
            Server: function (a, b) {
              if (!b.service && !b.version || b.service != OpenLayers.Format.Context.serviceTypes.WMS) b.service = a.getAttribute('service'),
                b.version = a.getAttribute('version'),
                this.readChildNodes(a, b)
                },
            Name: function (a, b) {
              b.name = this.getChildValue(a);
              this.readChildNodes(a, b)
            },
            Title: function (a, b) {
              b.title = this.getChildValue(a);
              this.readChildNodes(a, b)
            },
            StyleList: function (a, b) {
              this.readChildNodes(a, b.styles)
            },
            Style: function (a, b) {
              var c = {
              };
              b.push(c);
              this.readChildNodes(a, c)
            },
            LegendURL: function (a, b) {
              var c = {
              };
              b.legend = c;
              this.readChildNodes(a, c)
            },
            OnlineResource: function (a, b) {
              b.url = this.getAttributeNS(a, this.namespaces.xlink, 'href');
              this.readChildNodes(a, b)
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows,
          gml: OpenLayers.Format.GML.v2.prototype.readers.gml,
          sld: OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld,
          feature: OpenLayers.Format.GML.v2.prototype.readers.feature
        },
        writers: {
          owc: {
            OWSContext: function (a) {
              var b = this.createElementNSPlus('OWSContext', {
                attributes: {
                  version: this.VERSION,
                  id: a.id || OpenLayers.Util.createUniqueID('OpenLayers_OWSContext_')
                }
              });
              this.writeNode('General', a, b);
              this.writeNode('ResourceList', a, b);
              return b
            },
            General: function (a) {
              var b = this.createElementNSPlus('General');
              this.writeNode('ows:BoundingBox', a, b);
              this.writeNode('ows:Title', a.title || 'OpenLayers OWSContext', b);
              return b
            },
            ResourceList: function (a) {
              for (var b = this.createElementNSPlus('ResourceList'), c = 0, d = a.layers.length; c < d; c++) {
                var e = a.layers[c],
                    f = this.decomposeNestingPath(e.metadata.nestingPath);
                this.writeNode('_Layer', {
                  layer: e,
                  subPaths: f
                }, b)
              }
              return b
            },
            Server: function (a) {
              var b = this.createElementNSPlus('Server', {
                attributes: {
                  version: a.version,
                  service: a.service
                }
              });
              this.writeNode('OnlineResource', a, b);
              return b
            },
            OnlineResource: function (a) {
              return this.createElementNSPlus('OnlineResource', {
                attributes: {
                  'xlink:href': a.url
                }
              })
            },
            InlineGeometry: function (a) {
              var b = this.createElementNSPlus('InlineGeometry');
              this.writeNode('gml:boundedBy', a.getDataExtent(), b);
              for (var c = 0, d = a.features.length; c < d; c++) this.writeNode('gml:featureMember', a.features[c], b);
              return b
            },
            StyleList: function (a) {
              for (var b = this.createElementNSPlus('StyleList'), c = 0, d = a.length; c < d; c++) this.writeNode('Style', a[c], b);
              return b
            },
            Style: function (a) {
              var b = this.createElementNSPlus('Style');
              this.writeNode('Name', a, b);
              this.writeNode('Title', a, b);
              a.legend && this.writeNode('LegendURL', a, b);
              return b
            },
            Name: function (a) {
              return this.createElementNSPlus('Name', {
                value: a.name
              })
            },
            Title: function (a) {
              return this.createElementNSPlus('Title', {
                value: a.title
              })
            },
            LegendURL: function (a) {
              var b = this.createElementNSPlus('LegendURL');
              this.writeNode('OnlineResource', a.legend, b);
              return b
            },
            _WMS: function (a) {
              var b = this.createElementNSPlus('Layer', {
                attributes: {
                  name: a.params.LAYERS,
                  queryable: a.queryable ? '1' : '0',
                  hidden: a.visibility ? '0' : '1',
                  opacity: a.hasOwnProperty('opacity') ? a.opacity : null
                }
              });
              this.writeNode('ows:Title', a.name, b);
              this.writeNode('ows:OutputFormat', a.params.FORMAT, b);
              this.writeNode('Server', {
                service: OpenLayers.Format.Context.serviceTypes.WMS,
                version: a.params.VERSION,
                url: a.url
              }, b);
              a.metadata.styles && 0 < a.metadata.styles.length && this.writeNode('StyleList', a.metadata.styles, b);
              return b
            },
            _Layer: function (a) {
              var b,
                  c,
                  d;
              b = a.layer;
              c = a.subPaths;
              d = null;
              0 < c.length ? (b = c[0].join('/'), c = b.lastIndexOf('/'), d = this.nestingLayerLookup[b], c = 0 < c ? b.substring(c + 1, b.length)  : b, d || (d = this.createElementNSPlus('Layer'), this.writeNode('ows:Title', c, d), this.nestingLayerLookup[b] = d), a.subPaths.shift(), this.writeNode('_Layer', a, d))  : (b instanceof OpenLayers.Layer.WMS ?
              d = this.writeNode('_WMS', b)  : b instanceof OpenLayers.Layer.Vector && (b.protocol instanceof OpenLayers.Protocol.WFS.v1 ? d = this.writeNode('_WFS', b)  : b.protocol instanceof OpenLayers.Protocol.HTTP ? b.protocol.format instanceof OpenLayers.Format.GML ? (b.protocol.format.version = '2.1.2', d = this.writeNode('_GML', b))  : b.protocol.format instanceof OpenLayers.Format.KML && (b.protocol.format.version = '2.2', d = this.writeNode('_KML', b))  : (this.setNamespace('feature', this.featureNS), d = this.writeNode('_InlineGeometry', b))), b.options.maxScale && this.writeNode('sld:MinScaleDenominator', b.options.maxScale, d), b.options.minScale && this.writeNode('sld:MaxScaleDenominator', b.options.minScale, d), this.nestingLayerLookup[b.name] = d);
              return d
            },
            _WFS: function (a) {
              var b = this.createElementNSPlus('Layer', {
                attributes: {
                  name: a.protocol.featurePrefix + ':' + a.protocol.featureType,
                  hidden: a.visibility ? '0' : '1'
                }
              });
              this.writeNode('ows:Title', a.name, b);
              this.writeNode('Server', {
                service: OpenLayers.Format.Context.serviceTypes.WFS,
                version: a.protocol.version,
                url: a.protocol.url
              }, b);
              return b
            },
            _InlineGeometry: function (a) {
              var b = this.createElementNSPlus('Layer', {
                attributes: {
                  name: this.featureType,
                  hidden: a.visibility ? '0' : '1'
                }
              });
              this.writeNode('ows:Title', a.name, b);
              this.writeNode('InlineGeometry', a, b);
              return b
            },
            _GML: function (a) {
              var b = this.createElementNSPlus('Layer');
              this.writeNode('ows:Title', a.name, b);
              this.writeNode('Server', {
                service: OpenLayers.Format.Context.serviceTypes.GML,
                url: a.protocol.url,
                version: a.protocol.format.version
              }, b);
              return b
            },
            _KML: function (a) {
              var b = this.createElementNSPlus('Layer');
              this.writeNode('ows:Title', a.name, b);
              this.writeNode('Server', {
                service: OpenLayers.Format.Context.serviceTypes.KML,
                version: a.protocol.format.version,
                url: a.protocol.url
              }, b);
              return b
            }
          },
          gml: OpenLayers.Util.applyDefaults({
            boundedBy: function (a) {
              var b = this.createElementNSPlus('gml:boundedBy');
              this.writeNode('gml:Box', a, b);
              return b
            }
          }, OpenLayers.Format.GML.v2.prototype.writers.gml),
          ows: OpenLayers.Format.OWSCommon.v1_0_0.prototype.writers.ows,
          sld: OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld,
          feature: OpenLayers.Format.GML.v2.prototype.writers.feature
        },
        CLASS_NAME: 'OpenLayers.Format.OWSContext.v0_3_1'
      });
      OpenLayers.Icon = OpenLayers.Class({
        url: null,
        size: null,
        offset: null,
        calculateOffset: null,
        imageDiv: null,
        px: null,
        initialize: function (a, b, c, d) {
          this.url = a;
          this.size = b || {
            w: 20,
            h: 20
          };
          this.offset = c || {
            x: - (this.size.w / 2),
            y: - (this.size.h / 2)
          };
          this.calculateOffset = d;
          a = OpenLayers.Util.createUniqueID('OL_Icon_');
          this.imageDiv = OpenLayers.Util.createAlphaImageDiv(a)
        },
        destroy: function () {
          this.erase();
          OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
          this.imageDiv.innerHTML = '';
          this.imageDiv = null
        },
        clone: function () {
          return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset)
        },
        setSize: function (a) {
          null != a && (this.size = a);
          this.draw()
        },
        setUrl: function (a) {
          null != a && (this.url = a);
          this.draw()
        },
        draw: function (a) {
          OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, 'absolute');
          this.moveTo(a);
          return this.imageDiv
        },
        erase: function () {
          null != this.imageDiv && null != this.imageDiv.parentNode && OpenLayers.Element.remove(this.imageDiv)
        },
        setOpacity: function (a) {
          OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a)
        },
        moveTo: function (a) {
          null != a && (this.px = a);
          null != this.imageDiv && (null == this.px ? this.display(!1)  : (this.calculateOffset && (this.offset = this.calculateOffset(this.size)), OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
            x: this.px.x + this.offset.x,
            y: this.px.y + this.offset.y
          })))
        },
        display: function (a) {
          this.imageDiv.style.display = a ? '' : 'none'
        },
        isDrawn: function () {
          return this.imageDiv && this.imageDiv.parentNode && 11 != this.imageDiv.parentNode.nodeType
        },
        CLASS_NAME: 'OpenLayers.Icon'
      });
      OpenLayers.Layer.TileCache = OpenLayers.Class(OpenLayers.Layer.Grid, {
        isBaseLayer: !0,
        format: 'image/png',
        serverResolutions: null,
        initialize: function (a, b, c, d) {
          this.layername = c;
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            a,
            b,
            {
            },
            d
          ]);
          this.extension = this.format.split('/') [1].toLowerCase();
          this.extension = 'jpg' == this.extension ? 'jpeg' : this.extension
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.TileCache(this.name, this.url, this.layername, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          function b(a, b) {
            for (var a = '' + a, c = [
            ], d = 0; d < b; ++d) c.push('0');
            return c.join('').substring(0, b - a.length) + a
          }
          var c = this.getServerResolution(),
              d = this.maxExtent,
              e = this.tileSize,
              f = Math.round((a.left - d.left) / (c * e.w)),
              a = Math.round((a.bottom - d.bottom) / (c * e.h)),
              c = null != this.serverResolutions ? OpenLayers.Util.indexOf(this.serverResolutions, c)  : this.map.getZoom(),
              f = [
                this.layername,
                b(c, 2),
                b(parseInt(f / 1000000), 3),
                b(parseInt(f / 1000) % 1000, 3),
                b(parseInt(f) % 1000, 3),
                b(parseInt(a / 1000000), 3),
                b(parseInt(a / 1000) % 1000, 3),
                b(parseInt(a) % 1000, 3) + '.' + this.extension
              ].join('/'),
              c = this.url;
          OpenLayers.Util.isArray(c) && (c = this.selectUrl(f, c));
          c = '/' == c.charAt(c.length - 1) ? c : c + '/';
          return c + f
        },
        CLASS_NAME: 'OpenLayers.Layer.TileCache'
      });
      OpenLayers.Layer.KaMap = OpenLayers.Class(OpenLayers.Layer.Grid, {
        isBaseLayer: !0,
        DEFAULT_PARAMS: {
          i: 'jpeg',
          map: ''
        },
        initialize: function (a, b, c, d) {
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
          this.params = OpenLayers.Util.applyDefaults(this.params, this.DEFAULT_PARAMS)
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.map.getResolution(),
              c = Math.round(10000 * this.map.getScale()) / 10000,
              d = Math.round(a.left / b);
          return this.getFullRequestString({
            t: - Math.round(a.top / b),
            l: d,
            s: c
          })
        },
        calculateGridLayout: function (a, b, c) {
          var b = c * this.tileSize.w,
              c = c * this.tileSize.h,
              d = a.left,
              e = Math.floor(d / b) - this.buffer,
              d = - (d / b - e) * this.tileSize.w,
              e = e * b,
              a = a.top,
              f = Math.ceil(a / c) + this.buffer;
          return {
            tilelon: b,
            tilelat: c,
            tileoffsetlon: e,
            tileoffsetlat: f * c,
            tileoffsetx: d,
            tileoffsety: - (f - a / c + 1) * this.tileSize.h
          }
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.KaMap(this.name, this.url, this.params, this.getOptions()));
          a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ]);
          null != this.tileSize && (a.tileSize = this.tileSize.clone());
          a.grid = [
          ];
          return a
        },
        getTileBounds: function (a) {
          var b = this.getResolution(),
              c = b * this.tileSize.w,
              b = b * this.tileSize.h,
              d = this.getLonLatFromViewPortPx(a),
              a = c * Math.floor(d.lon / c),
              d = b * Math.floor(d.lat / b);
          return new OpenLayers.Bounds(a, d, a + c, d + b)
        },
        CLASS_NAME: 'OpenLayers.Layer.KaMap'
      });
      OpenLayers.Control.TransformFeature = OpenLayers.Class(OpenLayers.Control, {
        geometryTypes: null,
        layer: null,
        preserveAspectRatio: !1,
        rotate: !0,
        feature: null,
        renderIntent: 'temporary',
        rotationHandleSymbolizer: null,
        box: null,
        center: null,
        scale: 1,
        ratio: 1,
        rotation: 0,
        handles: null,
        rotationHandles: null,
        dragControl: null,
        irregular: !1,
        initialize: function (a, b) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            b
          ]);
          this.layer = a;
          this.rotationHandleSymbolizer || (this.rotationHandleSymbolizer = {
            stroke: !1,
            pointRadius: 10,
            fillOpacity: 0,
            cursor: 'pointer'
          });
          this.createBox();
          this.createControl()
        },
        activate: function () {
          var a = !1;
          OpenLayers.Control.prototype.activate.apply(this, arguments) && (this.dragControl.activate(), this.layer.addFeatures([this.box]), this.rotate && this.layer.addFeatures(this.rotationHandles), this.layer.addFeatures(this.handles), a = !0);
          return a
        },
        deactivate: function () {
          var a = !1;
          OpenLayers.Control.prototype.deactivate.apply(this, arguments) && (this.layer.removeFeatures(this.handles), this.rotate && this.layer.removeFeatures(this.rotationHandles), this.layer.removeFeatures([this.box]), this.dragControl.deactivate(), a = !0);
          return a
        },
        setMap: function (a) {
          this.dragControl.setMap(a);
          OpenLayers.Control.prototype.setMap.apply(this, arguments)
        },
        setFeature: function (a, b) {
          var b = OpenLayers.Util.applyDefaults(b, {
            rotation: 0,
            scale: 1,
            ratio: 1
          }),
              c = this.rotation,
              d = this.center;
          OpenLayers.Util.extend(this, b);
          if (!1 !== this.events.triggerEvent('beforesetfeature', {
            feature: a
          })) {
            this.feature = a;
            this.activate();
            this._setfeature = !0;
            var e = this.feature.geometry.getBounds();
            this.box.move(e.getCenterLonLat());
            this.box.geometry.rotate( - c, d);
            this._angle = 0;
            this.rotation ? (c = a.geometry.clone(), c.rotate( - this.rotation, this.center), c = new OpenLayers.Feature.Vector(c.getBounds().toGeometry()), c.geometry.rotate(this.rotation, this.center), this.box.geometry.rotate(this.rotation, this.center), this.box.move(c.geometry.getBounds().getCenterLonLat()), c = c.geometry.components[0].components[0].getBounds().getCenterLonLat())  : c = new OpenLayers.LonLat(e.left, e.bottom);
            this.handles[0].move(c);
            delete this._setfeature;
            this.events.triggerEvent('setfeature', {
              feature: a
            })
          }
        },
        unsetFeature: function () {
          this.active ? this.deactivate()  : (this.feature = null, this.rotation = 0, this.ratio = this.scale = 1)
        },
        createBox: function () {
          var a = this;
          this.center = new OpenLayers.Geometry.Point(0, 0);
          this.box = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point( - 1, - 1),
                                                                                       new OpenLayers.Geometry.Point(0, - 1),
                                                                                       new OpenLayers.Geometry.Point(1, - 1),
                                                                                       new OpenLayers.Geometry.Point(1, 0),
                                                                                       new OpenLayers.Geometry.Point(1, 1),
                                                                                       new OpenLayers.Geometry.Point(0, 1),
                                                                                       new OpenLayers.Geometry.Point( - 1, 1),
                                                                                       new OpenLayers.Geometry.Point( - 1, 0),
                                                                                       new OpenLayers.Geometry.Point( - 1, - 1)]), null, 'string' == typeof this.renderIntent ? null : this.renderIntent);
          this.box.geometry.move = function (b, c) {
            a._moving = !0;
            OpenLayers.Geometry.LineString.prototype.move.apply(this, arguments);
            a.center.move(b, c);
            delete a._moving
          };
          for (var b = function (a, b) {
            OpenLayers.Geometry.Point.prototype.move.apply(this, arguments);
            this._rotationHandle && this._rotationHandle.geometry.move(a, b);
            this._handle.geometry.move(a, b)
          }, c = function (a, b, c) {
            OpenLayers.Geometry.Point.prototype.resize.apply(this, arguments);
            this._rotationHandle && this._rotationHandle.geometry.resize(a, b, c);
            this._handle.geometry.resize(a, b, c)
          }, d = function (a, b) {
            OpenLayers.Geometry.Point.prototype.rotate.apply(this, arguments);
            this._rotationHandle && this._rotationHandle.geometry.rotate(a, b);
            this._handle.geometry.rotate(a, b)
          }, e = function (b, c) {
            var d = this.x,
                e = this.y;
            OpenLayers.Geometry.Point.prototype.move.call(this, b, c);
            if (!a._moving) {
              var f = a.dragControl.handlers.drag.evt,
                  g = !(!a._setfeature && a.preserveAspectRatio) && !(f && f.shiftKey),
                  h = new OpenLayers.Geometry.Point(d, e),
                  f = a.center;
              this.rotate( - a.rotation, f);
              h.rotate( - a.rotation, f);
              var i = this.x - f.x,
                  j = this.y - f.y,
                  k = i - (this.x - h.x),
                  l = j - (this.y - h.y);
              a.irregular && !a._setfeature && (i -= (this.x - h.x) / 2, j -= (this.y - h.y) / 2);
              this.x = d;
              this.y = e;
              h = 1;
              g ? (j = 0.00001 > Math.abs(l) ? 1 : j / l, h = (0.00001 > Math.abs(k) ? 1 : i / k) / j)  : (k = Math.sqrt(k * k + l * l), j = Math.sqrt(i * i + j * j) / k);
              a._moving = !0;
              a.box.geometry.rotate( - a.rotation, f);
              delete a._moving;
              a.box.geometry.resize(j, f, h);
              a.box.geometry.rotate(a.rotation, f);
              a.transformFeature({
                scale: j,
                ratio: h
              });
              a.irregular && !a._setfeature && (i = f.clone(), i.x += 0.00001 > Math.abs(d - f.x) ? 0 : this.x - d, i.y += 0.00001 > Math.abs(e - f.y) ? 0 : this.y - e, a.box.geometry.move(this.x - d, this.y - e), a.transformFeature({
                center: i
              }))
            }
          }, f = function (b, c) {
            var d = this.x,
                e = this.y;
            OpenLayers.Geometry.Point.prototype.move.call(this, b, c);
            if (!a._moving) {
              var f = a.dragControl.handlers.drag.evt,
                  f = f && f.shiftKey ? 45 : 1,
                  g = a.center,
                  h = this.x - g.x,
                  i = this.y - g.y;
              this.x = d;
              this.y = e;
              d = Math.atan2(i - c, h - b);
              d = Math.atan2(i, h) - d;
              d *= 180 / Math.PI;
              a._angle = (a._angle +
                          d) % 360;
              d = a.rotation % f;
              if (Math.abs(a._angle) >= f || 0 !== d) d = Math.round(a._angle / f) * f - d,
                a._angle = 0,
                a.box.geometry.rotate(d, g),
                a.transformFeature({
                rotation: d
              })
                }
          }, g = Array(8), h = Array(4), i, j, k, l = 'sw s se e ne n nw w'.split(' '), m = 0; 8 > m; ++m) i = this.box.geometry.components[m],
            j = new OpenLayers.Feature.Vector(i.clone(), {
            role: l[m] + '-resize'
          }, 'string' == typeof this.renderIntent ? null : this.renderIntent),
            0 == m % 2 && (k = new OpenLayers.Feature.Vector(i.clone(), {
            role: l[m] + '-rotate'
          }, 'string' == typeof this.rotationHandleSymbolizer ?
                                                             null : this.rotationHandleSymbolizer), k.geometry.move = f, i._rotationHandle = k, h[m / 2] = k),
            i.move = b,
            i.resize = c,
            i.rotate = d,
            j.geometry.move = e,
            i._handle = j,
            g[m] = j;
          this.rotationHandles = h;
          this.handles = g
        },
        createControl: function () {
          var a = this;
          this.dragControl = new OpenLayers.Control.DragFeature(this.layer, {
            documentDrag: !0,
            moveFeature: function (b) {
              this.feature === a.feature && (this.feature = a.box);
              OpenLayers.Control.DragFeature.prototype.moveFeature.apply(this, arguments)
            },
            onDrag: function (b) {
              b === a.box && a.transformFeature({
                center: a.center
              })
            },
            onStart: function (b) {
              var c = !a.geometryTypes || - 1 !== OpenLayers.Util.indexOf(a.geometryTypes, b.geometry.CLASS_NAME),
                  d = OpenLayers.Util.indexOf(a.handles, b),
                  d = d + OpenLayers.Util.indexOf(a.rotationHandles, b);
              b !== a.feature && (b !== a.box && - 2 == d && c) && a.setFeature(b)
            },
            onComplete: function () {
              a.events.triggerEvent('transformcomplete', {
                feature: a.feature
              })
            }
          })
        },
        drawHandles: function () {
          for (var a = this.layer, b = 0; 8 > b; ++b) this.rotate && 0 === b % 2 && a.drawFeature(this.rotationHandles[b / 2], this.rotationHandleSymbolizer),
            a.drawFeature(this.handles[b], this.renderIntent)
            },
        transformFeature: function (a) {
          if (!this._setfeature) {
            this.scale *= a.scale || 1;
            this.ratio *= a.ratio || 1;
            var b = this.rotation;
            this.rotation = (this.rotation + (a.rotation || 0)) % 360;
            if (!1 !== this.events.triggerEvent('beforetransform', a)) {
              var c = this.feature,
                  d = c.geometry,
                  e = this.center;
              d.rotate( - b, e);
              a.scale || a.ratio ? d.resize(a.scale, e, a.ratio)  : a.center && c.move(a.center.getBounds().getCenterLonLat());
              d.rotate(this.rotation, e);
              this.layer.drawFeature(c);
              c.toState(OpenLayers.State.UPDATE);
              this.events.triggerEvent('transform', a)
            }
          }
          this.layer.drawFeature(this.box, this.renderIntent);
          this.drawHandles()
        },
        destroy: function () {
          for (var a, b = 0; 8 > b; ++b) a = this.box.geometry.components[b],
            a._handle.destroy(),
            a._handle = null,
            a._rotationHandle && a._rotationHandle.destroy(),
            a._rotationHandle = null;
          this.rotationHandles = this.rotationHandleSymbolizer = this.handles = this.feature = this.center = null;
          this.box.destroy();
          this.layer = this.box = null;
          this.dragControl.destroy();
          this.dragControl = null;
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        CLASS_NAME: 'OpenLayers.Control.TransformFeature'
      });
      OpenLayers.Control.EditingToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {
        citeCompliant: !1,
        initialize: function (a, b) {
          OpenLayers.Control.Panel.prototype.initialize.apply(this, [
            b
          ]);
          this.addControls([new OpenLayers.Control.Navigation]);
          this.addControls([new OpenLayers.Control.DrawFeature(a, OpenLayers.Handler.Point, {
            displayClass: 'olControlDrawFeaturePoint',
            handlerOptions: {
              citeCompliant: this.citeCompliant
            }
          }),
                            new OpenLayers.Control.DrawFeature(a, OpenLayers.Handler.Path, {
                              displayClass: 'olControlDrawFeaturePath',
                              handlerOptions: {
                                citeCompliant: this.citeCompliant
                              }
                            }),
                            new OpenLayers.Control.DrawFeature(a, OpenLayers.Handler.Polygon, {
                              displayClass: 'olControlDrawFeaturePolygon',
                              handlerOptions: {
                                citeCompliant: this.citeCompliant
                              }
                            })])
        },
        draw: function () {
          var a = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
          null === this.defaultControl && (this.defaultControl = this.controls[0]);
          return a
        },
        CLASS_NAME: 'OpenLayers.Control.EditingToolbar'
      });
      OpenLayers.Strategy.BBOX = OpenLayers.Class(OpenLayers.Strategy, {
        bounds: null,
        resolution: null,
        ratio: 2,
        resFactor: null,
        response: null,
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.call(this);
          a && (this.layer.events.on({
            moveend: this.update,
            refresh: this.update,
            visibilitychanged: this.update,
            scope: this
          }), this.update());
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && this.layer.events.un({
            moveend: this.update,
            refresh: this.update,
            visibilitychanged: this.update,
            scope: this
          });
          return a
        },
        update: function (a) {
          var b = this.getMapBounds();
          if (null !== b && (a && a.force || this.layer.visibility && this.layer.calculateInRange() && this.invalidBounds(b))) this.calculateBounds(b),
            this.resolution = this.layer.map.getResolution(),
            this.triggerRead(a)
            },
        getMapBounds: function () {
          if (null === this.layer.map) return null;
          var a = this.layer.map.getExtent();
          a && !this.layer.projection.equals(this.layer.map.getProjectionObject()) && (a = a.clone().transform(this.layer.map.getProjectionObject(), this.layer.projection));
          return a
        },
        invalidBounds: function (a) {
          a || (a = this.getMapBounds());
          a = !this.bounds || !this.bounds.containsBounds(a);
          !a && this.resFactor && (a = this.resolution / this.layer.map.getResolution(), a = a >= this.resFactor || a <= 1 / this.resFactor);
          return a
        },
        calculateBounds: function (a) {
          a || (a = this.getMapBounds());
          var b = a.getCenterLonLat(),
              c = a.getWidth() * this.ratio,
              a = a.getHeight() * this.ratio;
          this.bounds = new OpenLayers.Bounds(b.lon - c / 2, b.lat - a / 2, b.lon + c / 2, b.lat + a / 2)
        },
        triggerRead: function (a) {
          this.response && !(a && !0 === a.noAbort) && (this.layer.protocol.abort(this.response), this.layer.events.triggerEvent('loadend'));
          this.layer.events.triggerEvent('loadstart');
          this.response = this.layer.protocol.read(OpenLayers.Util.applyDefaults({
            filter: this.createFilter(),
            callback: this.merge,
            scope: this
          }, a))
        },
        createFilter: function () {
          var a = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.bounds,
            projection: this.layer.projection
          });
          this.layer.filter && (a = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [
              this.layer.filter,
              a
            ]
          }));
          return a
        },
        merge: function (a) {
          this.layer.destroyFeatures();
          if ((a = a.features) && 0 < a.length) {
            var b = this.layer.projection,
                c = this.layer.map.getProjectionObject();
            if (!c.equals(b)) for (var d, e = 0, f = a.length; e < f; ++e) (d = a[e].geometry) && d.transform(b, c);
            this.layer.addFeatures(a)
          }
          this.response = null;
          this.layer.events.triggerEvent('loadend')
        },
        CLASS_NAME: 'OpenLayers.Strategy.BBOX'
      });
      OpenLayers.Layer.WorldWind = OpenLayers.Class(OpenLayers.Layer.Grid, {
        DEFAULT_PARAMS: {
        },
        isBaseLayer: !0,
        lzd: null,
        zoomLevels: null,
        initialize: function (a, b, c, d, e, f) {
          this.lzd = c;
          this.zoomLevels = d;
          c = [
          ];
          c.push(a, b, e, f);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, c);
          this.params = OpenLayers.Util.applyDefaults(this.params, this.DEFAULT_PARAMS)
        },
        getZoom: function () {
          var a = this.map.getZoom();
          this.map.getMaxExtent();
          return a -= Math.log(this.maxResolution / (this.lzd / 512)) / Math.log(2)
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.getZoom(),
              c = this.map.getMaxExtent(),
              d = this.lzd / Math.pow(2, this.getZoom()),
              e = Math.floor((a.left - c.left) / d),
              a = Math.floor((a.bottom - c.bottom) / d);
          return this.map.getResolution() <= this.lzd / 512 && this.getZoom() <= this.zoomLevels ? this.getFullRequestString({
            L: b,
            X: e,
            Y: a
          })  : OpenLayers.Util.getImageLocation('blank.gif')
        },
        CLASS_NAME: 'OpenLayers.Layer.WorldWind'
      });
      OpenLayers.Protocol.CSW = function (a) {
        var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Protocol.CSW.DEFAULTS),
            b = OpenLayers.Protocol.CSW['v' + a.version.replace(/\./g, '_')];
        if (!b) throw 'Unsupported CSW version: ' + a.version;
        return new b(a)
      };
      OpenLayers.Protocol.CSW.DEFAULTS = {
        version: '2.0.2'
      };
      OpenLayers.Format.WMTSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.0.0',
        yx: {
          'urn:ogc:def:crs:EPSG::4326': !0
        },
        createLayer: function (a, b) {
          var c,
              d = {
                layer: !0,
                matrixSet: !0
              },
              e;
          for (e in d) if (!(e in b)) throw Error('Missing property \'' + e + '\' in layer configuration.');
          d = a.contents;
          e = d.tileMatrixSets[b.matrixSet];
          for (var f, g = 0, h = d.layers.length; g < h; ++g) if (d.layers[g].identifier === b.layer) {
            f = d.layers[g];
            break
          }
          if (f && e) {
            for (var i, g = 0, h = f.styles.length; g < h && !(i = f.styles[g], i.isDefault); ++g);
            c = new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults(b, {
              url: 'REST' === b.requestEncoding && f.resourceUrl ? f.resourceUrl.tile.template : a.operationsMetadata.GetTile.dcp.http.get[0].url,
              name: f.title,
              style: i.identifier,
              matrixIds: e.matrixIds,
              tileFullExtent: e.bounds
            }))
          }
          return c
        },
        CLASS_NAME: 'OpenLayers.Format.WMTSCapabilities'
      });
      OpenLayers.Layer.Google.v3 = {
        DEFAULTS: {
          sphericalMercator: !0,
          projection: 'EPSG:900913'
        },
        animationEnabled: !0,
        loadMapObject: function () {
          this.type || (this.type = google.maps.MapTypeId.ROADMAP);
          var a,
              b = OpenLayers.Layer.Google.cache[this.map.id];
          b ? (a = b.mapObject, ++b.count)  : (b = this.map.viewPortDiv, a = document.createElement('div'), a.id = this.map.id + '_GMapContainer', a.style.position = 'absolute', a.style.width = '100%', a.style.height = '100%', b.appendChild(a), b = this.map.getCenter(), a = new google.maps.Map(a, {
            center: b ? new google.maps.LatLng(b.lat, b.lon)  : new google.maps.LatLng(0, 0),
            zoom: this.map.getZoom() || 0,
            mapTypeId: this.type,
            disableDefaultUI: !0,
            keyboardShortcuts: !1,
            draggable: !1,
            disableDoubleClickZoom: !0,
            scrollwheel: !1,
            streetViewControl: !1
          }), b = {
            mapObject: a,
            count: 1
          }, OpenLayers.Layer.Google.cache[this.map.id] = b, this.repositionListener = google.maps.event.addListenerOnce(a, 'center_changed', OpenLayers.Function.bind(this.repositionMapElements, this)));
          this.mapObject = a;
          this.setGMapVisibility(this.visibility)
        },
        repositionMapElements: function () {
          google.maps.event.trigger(this.mapObject, 'resize');
          var a = this.mapObject.getDiv().firstChild;
          if (!a || 3 > a.childNodes.length) return this.repositionTimer = window.setTimeout(OpenLayers.Function.bind(this.repositionMapElements, this), 250),
            !1;
          for (var b = OpenLayers.Layer.Google.cache[this.map.id], c = this.map.viewPortDiv, d = a.children.length - 1; 0 <= d; --d) {
            if (1000001 == a.children[d].style.zIndex) {
              var e = a.children[d];
              c.appendChild(e);
              e.style.zIndex = '1100';
              e.style.bottom = '';
              e.className = 'olLayerGoogleCopyright olLayerGoogleV3';
              e.style.display = '';
              b.termsOfUse = e
            }
            1000000 == a.children[d].style.zIndex && (e = a.children[d], c.appendChild(e), e.style.zIndex = '1100', e.style.bottom = '', e.className = 'olLayerGooglePoweredBy olLayerGoogleV3 gmnoprint', e.style.display = '', b.poweredBy = e);
            10000002 == a.children[d].style.zIndex && c.appendChild(a.children[d])
          }
          this.setGMapVisibility(this.visibility)
        },
        onMapResize: function () {
          if (this.visibility) google.maps.event.trigger(this.mapObject, 'resize');
          else {
            var a = OpenLayers.Layer.Google.cache[this.map.id];
            if (!a.resized) {
              var b = this;
              google.maps.event.addListenerOnce(this.mapObject, 'tilesloaded', function () {
                google.maps.event.trigger(b.mapObject, 'resize');
                b.moveTo(b.map.getCenter(), b.map.getZoom());
                delete a.resized
              })
            }
            a.resized = !0
          }
        },
        setGMapVisibility: function (a) {
          var b = OpenLayers.Layer.Google.cache[this.map.id];
          if (b) {
            for (var c = this.type, d = this.map.layers, e, f = d.length - 1; 0 <= f; --f) if (e = d[f], e instanceof OpenLayers.Layer.Google && !0 === e.visibility && !0 === e.inRange) {
              c = e.type;
              a = !0;
              break
            }
            d = this.mapObject.getDiv();
            !0 === a ? (this.mapObject.setMapTypeId(c), d.style.left = '', b.termsOfUse && b.termsOfUse.style && (b.termsOfUse.style.left = '', b.termsOfUse.style.display = '', b.poweredBy.style.display = ''), b.displayed = this.id)  : (delete b.displayed, d.style.left = '-9999px', b.termsOfUse && b.termsOfUse.style && (b.termsOfUse.style.display = 'none', b.termsOfUse.style.left = '-9999px', b.poweredBy.style.display = 'none'))
          }
        },
        getMapContainer: function () {
          return this.mapObject.getDiv()
        },
        getMapObjectBoundsFromOLBounds: function (a) {
          var b = null;
          null != a && (b = this.sphericalMercator ? this.inverseMercator(a.bottom, a.left)  : new OpenLayers.LonLat(a.bottom, a.left), a = this.sphericalMercator ? this.inverseMercator(a.top, a.right)  : new OpenLayers.LonLat(a.top, a.right), b = new google.maps.LatLngBounds(new google.maps.LatLng(b.lat, b.lon), new google.maps.LatLng(a.lat, a.lon)));
          return b
        },
        getMapObjectLonLatFromMapObjectPixel: function (a) {
          var b = this.map.getSize(),
              c = this.getLongitudeFromMapObjectLonLat(this.mapObject.center),
              d = this.getLatitudeFromMapObjectLonLat(this.mapObject.center),
              e = this.map.getResolution(),
              a = new OpenLayers.LonLat(c + (a.x - b.w / 2) * e, d - (a.y - b.h / 2) * e);
          this.wrapDateLine && (a = a.wrapDateLine(this.maxExtent));
          return this.getMapObjectLonLatFromLonLat(a.lon, a.lat)
        },
        getMapObjectPixelFromMapObjectLonLat: function (a) {
          var b = this.getLongitudeFromMapObjectLonLat(a),
              a = this.getLatitudeFromMapObjectLonLat(a),
              c = this.map.getResolution(),
              d = this.map.getExtent();
          return this.getMapObjectPixelFromXY(1 / c * (b - d.left), 1 / c * (d.top - a))
        },
        setMapObjectCenter: function (a, b) {
          if (!1 === this.animationEnabled && b != this.mapObject.zoom) {
            var c = this.getMapContainer();
            google.maps.event.addListenerOnce(this.mapObject, 'idle', function () {
              c.style.visibility = ''
            });
            c.style.visibility = 'hidden'
          }
          this.mapObject.setOptions({
            center: a,
            zoom: b
          })
        },
        getMapObjectZoomFromMapObjectBounds: function (a) {
          return this.mapObject.getBoundsZoomLevel(a)
        },
        getMapObjectLonLatFromLonLat: function (a, b) {
          var c;
          this.sphericalMercator ? (c = this.inverseMercator(a, b), c = new google.maps.LatLng(c.lat, c.lon))  : c = new google.maps.LatLng(b, a);
          return c
        },
        getMapObjectPixelFromXY: function (a, b) {
          return new google.maps.Point(a, b)
        },
        destroy: function () {
          this.repositionListener && google.maps.event.removeListener(this.repositionListener);
          this.repositionTimer && window.clearTimeout(this.repositionTimer);
          OpenLayers.Layer.Google.prototype.destroy.apply(this, arguments)
        }
      };
      OpenLayers.Format.WPSDescribeProcess = OpenLayers.Class(OpenLayers.Format.XML, {
        VERSION: '1.0.0',
        namespaces: {
          wps: 'http://www.opengis.net/wps/1.0.0',
          ows: 'http://www.opengis.net/ows/1.1',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        schemaLocation: 'http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd',
        defaultPrefix: 'wps',
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          wps: {
            ProcessDescriptions: function (a, b) {
              b.processDescriptions = {
              };
              this.readChildNodes(a, b.processDescriptions)
            },
            ProcessDescription: function (a, b) {
              var c = {
                processVersion: this.getAttributeNS(a, this.namespaces.wps, 'processVersion'),
                statusSupported: 'true' === a.getAttribute('statusSupported'),
                storeSupported: 'true' === a.getAttribute('storeSupported')
              };
              this.readChildNodes(a, c);
              b[c.identifier] = c
            },
            DataInputs: function (a, b) {
              b.dataInputs = [
              ];
              this.readChildNodes(a, b.dataInputs)
            },
            ProcessOutputs: function (a, b) {
              b.processOutputs = [
              ];
              this.readChildNodes(a, b.processOutputs)
            },
            Output: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.push(c)
            },
            ComplexOutput: function (a, b) {
              b.complexOutput = {
              };
              this.readChildNodes(a, b.complexOutput)
            },
            Input: function (a, b) {
              var c = {
                maxOccurs: parseInt(a.getAttribute('maxOccurs')),
                minOccurs: parseInt(a.getAttribute('minOccurs'))
              };
              this.readChildNodes(a, c);
              b.push(c)
            },
            BoundingBoxData: function (a, b) {
              b.boundingBoxData = {
              };
              this.readChildNodes(a, b.boundingBoxData)
            },
            CRS: function (a, b) {
              b.CRSs || (b.CRSs = {
              });
              b.CRSs[this.getChildValue(a)] = !0
            },
            LiteralData: function (a, b) {
              b.literalData = {
              };
              this.readChildNodes(a, b.literalData)
            },
            ComplexData: function (a, b) {
              b.complexData = {
              };
              this.readChildNodes(a, b.complexData)
            },
            Default: function (a, b) {
              b['default'] = {
              };
              this.readChildNodes(a, b['default'])
            },
            Supported: function (a, b) {
              b.supported = {
              };
              this.readChildNodes(a, b.supported)
            },
            Format: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.formats || (b.formats = {
              });
              b.formats[c.mimeType] = !0
            },
            MimeType: function (a, b) {
              b.mimeType = this.getChildValue(a)
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WPSDescribeProcess'
      });
      OpenLayers.Format.CSWGetRecords.v2_0_2 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          csw: 'http://www.opengis.net/cat/csw/2.0.2',
          dc: 'http://purl.org/dc/elements/1.1/',
          dct: 'http://purl.org/dc/terms/',
          gmd: 'http://www.isotc211.org/2005/gmd',
          geonet: 'http://www.fao.org/geonetwork',
          ogc: 'http://www.opengis.net/ogc',
          ows: 'http://www.opengis.net/ows',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        defaultPrefix: 'csw',
        version: '2.0.2',
        schemaLocation: 'http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd',
        requestId: null,
        resultType: null,
        outputFormat: null,
        outputSchema: null,
        startPosition: null,
        maxRecords: null,
        DistributedSearch: null,
        ResponseHandler: null,
        Query: null,
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          csw: {
            GetRecordsResponse: function (a, b) {
              b.records = [
              ];
              this.readChildNodes(a, b);
              var c = this.getAttributeNS(a, '', 'version');
              '' != c && (b.version = c)
            },
            RequestId: function (a, b) {
              b.RequestId = this.getChildValue(a)
            },
            SearchStatus: function (a, b) {
              b.SearchStatus = {
              };
              var c = this.getAttributeNS(a, '', 'timestamp');
              '' != c && (b.SearchStatus.timestamp = c)
            },
            SearchResults: function (a, b) {
              this.readChildNodes(a, b);
              for (var c = a.attributes, d = {
              }, e = 0, f = c.length; e < f; ++e) d[c[e].name] = 'numberOfRecordsMatched' == c[e].name || 'numberOfRecordsReturned' ==
                c[e].name || 'nextRecord' == c[e].name ? parseInt(c[e].nodeValue)  : c[e].nodeValue;
              b.SearchResults = d
            },
            SummaryRecord: function (a, b) {
              var c = {
                type: 'SummaryRecord'
              };
              this.readChildNodes(a, c);
              b.records.push(c)
            },
            BriefRecord: function (a, b) {
              var c = {
                type: 'BriefRecord'
              };
              this.readChildNodes(a, c);
              b.records.push(c)
            },
            DCMIRecord: function (a, b) {
              var c = {
                type: 'DCMIRecord'
              };
              this.readChildNodes(a, c);
              b.records.push(c)
            },
            Record: function (a, b) {
              var c = {
                type: 'Record'
              };
              this.readChildNodes(a, c);
              b.records.push(c)
            },
            '*': function (a, b) {
              var c = a.localName || a.nodeName.split(':').pop();
              b[c] = this.getChildValue(a)
            }
          },
          geonet: {
            info: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.gninfo = c
            }
          },
          dc: {
            '*': function (a, b) {
              var c = a.localName || a.nodeName.split(':').pop();
              OpenLayers.Util.isArray(b[c]) || (b[c] = [
              ]);
              for (var d = {
              }, e = a.attributes, f = 0, g = e.length; f < g; ++f) d[e[f].name] = e[f].nodeValue;
              d.value = this.getChildValue(a);
              '' != d.value && b[c].push(d)
            }
          },
          dct: {
            '*': function (a, b) {
              var c = a.localName || a.nodeName.split(':').pop();
              OpenLayers.Util.isArray(b[c]) || (b[c] = [
              ]);
              b[c].push(this.getChildValue(a))
            }
          },
          ows: OpenLayers.Util.applyDefaults({
            BoundingBox: function (a, b) {
              b.bounds && (b.BoundingBox = [
                {
                  crs: b.projection,
                  value: [
                    b.bounds.left,
                    b.bounds.bottom,
                    b.bounds.right,
                    b.bounds.top
                  ]
                }
              ], delete b.projection, delete b.bounds);
              OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows.BoundingBox.apply(this, arguments)
            }
          }, OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows)
        },
        write: function (a) {
          a = this.writeNode('csw:GetRecords', a);
          a.setAttribute('xmlns:gmd', this.namespaces.gmd);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        writers: {
          csw: {
            GetRecords: function (a) {
              a || (a = {
              });
              var b = this.createElementNSPlus('csw:GetRecords', {
                attributes: {
                  service: 'CSW',
                  version: this.version,
                  requestId: a.requestId || this.requestId,
                  resultType: a.resultType || this.resultType,
                  outputFormat: a.outputFormat || this.outputFormat,
                  outputSchema: a.outputSchema || this.outputSchema,
                  startPosition: a.startPosition || this.startPosition,
                  maxRecords: a.maxRecords || this.maxRecords
                }
              });
              if (a.DistributedSearch || this.DistributedSearch) this.writeNode('csw:DistributedSearch', a.DistributedSearch || this.DistributedSearch, b);
              var c = a.ResponseHandler || this.ResponseHandler;
              if (OpenLayers.Util.isArray(c) && 0 < c.length) for (var d = 0, e = c.length; d < e; d++) this.writeNode('csw:ResponseHandler', c[d], b);
              this.writeNode('Query', a.Query || this.Query, b);
              return b
            },
            DistributedSearch: function (a) {
              return this.createElementNSPlus('csw:DistributedSearch', {
                attributes: {
                  hopCount: a.hopCount
                }
              })
            },
            ResponseHandler: function (a) {
              return this.createElementNSPlus('csw:ResponseHandler', {
                value: a.value
              })
            },
            Query: function (a) {
              a || (a = {
              });
              var b = this.createElementNSPlus('csw:Query', {
                attributes: {
                  typeNames: a.typeNames || 'csw:Record'
                }
              }),
                  c = a.ElementName;
              if (OpenLayers.Util.isArray(c) && 0 < c.length) for (var d = 0, e = c.length; d < e; d++) this.writeNode('csw:ElementName', c[d], b);
              else this.writeNode('csw:ElementSetName', a.ElementSetName || {
                value: 'summary'
              }, b);
              a.Constraint && this.writeNode('csw:Constraint', a.Constraint, b);
              a.SortBy && this.writeNode('ogc:SortBy', a.SortBy, b);
              return b
            },
            ElementName: function (a) {
              return this.createElementNSPlus('csw:ElementName', {
                value: a.value
              })
            },
            ElementSetName: function (a) {
              return this.createElementNSPlus('csw:ElementSetName', {
                attributes: {
                  typeNames: a.typeNames
                },
                value: a.value
              })
            },
            Constraint: function (a) {
              var b = this.createElementNSPlus('csw:Constraint', {
                attributes: {
                  version: a.version
                }
              });
              if (a.Filter) {
                var c = new OpenLayers.Format.Filter({
                  version: a.version
                });
                b.appendChild(c.write(a.Filter))
              } else a.CqlText && (a = this.createElementNSPlus('CqlText', {
                value: a.CqlText.value
              }), b.appendChild(a));
              return b
            }
          },
          ogc: OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc
        },
        CLASS_NAME: 'OpenLayers.Format.CSWGetRecords.v2_0_2'
      });
      OpenLayers.Marker.Box = OpenLayers.Class(OpenLayers.Marker, {
        bounds: null,
        div: null,
        initialize: function (a, b, c) {
          this.bounds = a;
          this.div = OpenLayers.Util.createDiv();
          this.div.style.overflow = 'hidden';
          this.events = new OpenLayers.Events(this, this.div);
          this.setBorder(b, c)
        },
        destroy: function () {
          this.div = this.bounds = null;
          OpenLayers.Marker.prototype.destroy.apply(this, arguments)
        },
        setBorder: function (a, b) {
          a || (a = 'red');
          b || (b = 2);
          this.div.style.border = b + 'px solid ' + a
        },
        draw: function (a, b) {
          OpenLayers.Util.modifyDOMElement(this.div, null, a, b);
          return this.div
        },
        onScreen: function () {
          var a = !1;
          this.map && (a = this.map.getExtent().containsBounds(this.bounds, !0, !0));
          return a
        },
        display: function (a) {
          this.div.style.display = a ? '' : 'none'
        },
        CLASS_NAME: 'OpenLayers.Marker.Box'
      });
      OpenLayers.Format.Text = OpenLayers.Class(OpenLayers.Format, {
        defaultStyle: null,
        extractStyles: !0,
        initialize: function (a) {
          a = a || {
          };
          !1 !== a.extractStyles && (a.defaultStyle = {
            externalGraphic: OpenLayers.Util.getImageLocation('marker.png'),
            graphicWidth: 21,
            graphicHeight: 25,
            graphicXOffset: - 10.5,
            graphicYOffset: - 12.5
          });
          OpenLayers.Format.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          for (var a = a.split('\n'), b, c = [
          ], d = 0; d < a.length - 1; d++) {
            var e = a[d].replace(/^\s*/, '').replace(/\s*$/, '');
            if ('#' != e.charAt(0)) if (b) {
              for (var e = e.split('\t'), f = new OpenLayers.Geometry.Point(0, 0), g = {
              }, h = this.defaultStyle ? OpenLayers.Util.applyDefaults({
              }, this.defaultStyle)  : null, i = !1, j = 0; j < e.length; j++) if (e[j]) if ('point' == b[j]) i = e[j].split(','),
                f.y = parseFloat(i[0]),
                f.x = parseFloat(i[1]),
                i = !0;
                else if ('lat' == b[j]) f.y = parseFloat(e[j]),
                  i = !0;
                else if ('lon' == b[j]) f.x = parseFloat(e[j]),
                  i = !0;
                else if ('title' == b[j]) g.title = e[j];
                else if ('image' == b[j] || 'icon' == b[j] && h) h.externalGraphic = e[j];
                else if ('iconSize' == b[j] && h) {
                  var k = e[j].split(',');
                  h.graphicWidth = parseFloat(k[0]);
                  h.graphicHeight = parseFloat(k[1])
                } else 'iconOffset' == b[j] && h ? (k = e[j].split(','), h.graphicXOffset = parseFloat(k[0]), h.graphicYOffset = parseFloat(k[1]))  : 'description' == b[j] ? g.description = e[j] : 'overflow' == b[j] ? g.overflow = e[j] : g[b[j]] = e[j];
              i && (this.internalProjection && this.externalProjection && f.transform(this.externalProjection, this.internalProjection), e = new OpenLayers.Feature.Vector(f, g, h), c.push(e))
            } else b = e.split('\t')
              }
          return c
        },
        CLASS_NAME: 'OpenLayers.Format.Text'
      });
      OpenLayers.Layer.Text = OpenLayers.Class(OpenLayers.Layer.Markers, {
        location: null,
        features: null,
        formatOptions: null,
        selectedFeature: null,
        initialize: function (a, b) {
          OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
          this.features = [
          ]
        },
        destroy: function () {
          OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
          this.clearFeatures();
          this.features = null
        },
        loadText: function () {
          !this.loaded && null != this.location && (this.events.triggerEvent('loadstart'), OpenLayers.Request.GET({
            url: this.location,
            success: this.parseData,
            failure: function () {
              this.events.triggerEvent('loadend')
            },
            scope: this
          }), this.loaded = !0)
        },
        moveTo: function (a, b, c) {
          OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
          this.visibility && !this.loaded && this.loadText()
        },
        parseData: function (a) {
          var a = a.responseText,
              b = {
              };
          OpenLayers.Util.extend(b, this.formatOptions);
          this.map && !this.projection.equals(this.map.getProjectionObject()) && (b.externalProjection = this.projection, b.internalProjection = this.map.getProjectionObject());
          for (var a = (new OpenLayers.Format.Text(b)).read(a), b = 0, c = a.length; b < c; b++) {
            var d = {
            },
                e = a[b],
                f,
                g,
                h;
            f = new OpenLayers.LonLat(e.geometry.x, e.geometry.y);
            e.style.graphicWidth && e.style.graphicHeight && (g = new OpenLayers.Size(e.style.graphicWidth, e.style.graphicHeight));
            void 0 !== e.style.graphicXOffset && void 0 !== e.style.graphicYOffset && (h = new OpenLayers.Pixel(e.style.graphicXOffset, e.style.graphicYOffset));
            null != e.style.externalGraphic ? d.icon = new OpenLayers.Icon(e.style.externalGraphic, g, h)  : (d.icon = OpenLayers.Marker.defaultIcon(), null != g && d.icon.setSize(g));
            null != e.attributes.title && null != e.attributes.description && (d.popupContentHTML = '<h2>' + e.attributes.title + '</h2><p>' + e.attributes.description + '</p>');
            d.overflow = e.attributes.overflow || 'auto';
            d = new OpenLayers.Feature(this, f, d);
            this.features.push(d);
            f = d.createMarker();
            null != e.attributes.title && null != e.attributes.description && f.events.register('click', d, this.markerClick);
            this.addMarker(f)
          }
          this.events.triggerEvent('loadend')
        },
        markerClick: function (a) {
          var b = this == this.layer.selectedFeature;
          this.layer.selectedFeature = !b ? this : null;
          for (var c = 0, d = this.layer.map.popups.length; c < d; c++) this.layer.map.removePopup(this.layer.map.popups[c]);
          b || this.layer.map.addPopup(this.createPopup());
          OpenLayers.Event.stop(a)
        },
        clearFeatures: function () {
          if (null != this.features) for (; 0 < this.features.length; ) {
            var a = this.features[0];
            OpenLayers.Util.removeItem(this.features, a);
            a.destroy()
          }
        },
        CLASS_NAME: 'OpenLayers.Layer.Text'
      });
      OpenLayers.Control.SLDSelect = OpenLayers.Class(OpenLayers.Control, {
        clearOnDeactivate: !1,
        layers: null,
        callbacks: null,
        selectionSymbolizer: {
          Polygon: {
            fillColor: '#FF0000',
            stroke: !1
          },
          Line: {
            strokeColor: '#FF0000',
            strokeWidth: 2
          },
          Point: {
            graphicName: 'square',
            fillColor: '#FF0000',
            pointRadius: 5
          }
        },
        layerOptions: null,
        handlerOptions: null,
        sketchStyle: null,
        wfsCache: {
        },
        layerCache: {
        },
        initialize: function (a, b) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            b
          ]);
          this.callbacks = OpenLayers.Util.extend({
            done: this.select,
            click: this.select
          }, this.callbacks);
          this.handlerOptions = this.handlerOptions || {
          };
          this.layerOptions = OpenLayers.Util.applyDefaults(this.layerOptions, {
            displayInLayerSwitcher: !1,
            tileOptions: {
              maxGetUrlLength: 2048
            }
          });
          this.sketchStyle && (this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions, {
            styleMap: new OpenLayers.StyleMap({
              'default': this.sketchStyle
            })
          }));
          this.handler = new a(this, this.callbacks, this.handlerOptions)
        },
        destroy: function () {
          for (var a in this.layerCache) delete this.layerCache[a];
          for (a in this.wfsCache) delete this.wfsCache[a];
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        coupleLayerVisiblity: function (a) {
          this.setVisibility(a.object.getVisibility())
        },
        createSelectionLayer: function (a) {
          var b;
          if (this.layerCache[a.id]) b = this.layerCache[a.id];
          else {
            b = new OpenLayers.Layer.WMS(a.name, a.url, a.params, OpenLayers.Util.applyDefaults(this.layerOptions, a.getOptions()));
            this.layerCache[a.id] = b;
            if (!1 === this.layerOptions.displayInLayerSwitcher) a.events.on({
              visibilitychanged: this.coupleLayerVisiblity,
              scope: b
            });
            this.map.addLayer(b)
          }
          return b
        },
        createSLD: function (a, b, c) {
          for (var d = {
            version: '1.0.0',
            namedLayers: {
            }
          }, e = ('' + a.params.LAYERS).split(','), f = 0, g = e.length; f < g; f++) {
            var h = e[f];
            d.namedLayers[h] = {
              name: h,
              userStyles: [
              ]
            };
            var i = this.selectionSymbolizer,
                j = c[f];
            0 <= j.type.indexOf('Polygon') ? i = {
              Polygon: this.selectionSymbolizer.Polygon
            }
            : 0 <= j.type.indexOf('LineString') ? i = {
              Line: this.selectionSymbolizer.Line
            }
            : 0 <= j.type.indexOf('Point') && (i = {
              Point: this.selectionSymbolizer.Point
            });
            d.namedLayers[h].userStyles.push({
              name: 'default',
              rules: [
                new OpenLayers.Rule({
                  symbolizer: i,
                  filter: b[f],
                  maxScaleDenominator: a.options.minScale
                })
              ]
            })
          }
          return (new OpenLayers.Format.SLD({
            srsName: this.map.getProjection()
          })).write(d)
        },
        parseDescribeLayer: function (a) {
          var b = new OpenLayers.Format.WMSDescribeLayer,
              c = a.responseXML;
          if (!c || !c.documentElement) c = a.responseText;
          for (var a = b.read(c), b = [
          ], c = null, d = 0, e = a.length; d < e; d++) 'WFS' == a[d].owsType && (b.push(a[d].typeName), c = a[d].owsURL);
          OpenLayers.Request.GET({
            url: c,
            params: {
              SERVICE: 'WFS',
              TYPENAME: b.toString(),
              REQUEST: 'DescribeFeatureType',
              VERSION: '1.0.0'
            },
            callback: function (a) {
              var b = new OpenLayers.Format.WFSDescribeFeatureType,
                  c = a.responseXML;
              if (!c || !c.documentElement) c = a.responseText;
              this.control.wfsCache[this.layer.id] = b.read(c);
              this.control._queue && this.control.applySelection()
            },
            scope: this
          })
        },
        getGeometryAttributes: function (a) {
          for (var b = [
          ], a = this.wfsCache[a.id], c = 0, d = a.featureTypes.length; c < d; c++) for (var e = a.featureTypes[c].properties, f = 0, g = e.length; f < g; f++) {
            var h = e[f],
                i = h.type;
            (0 <= i.indexOf('LineString') || 0 <= i.indexOf('GeometryAssociationType') || 0 <= i.indexOf('GeometryPropertyType') || 0 <= i.indexOf('Point') || 0 <= i.indexOf('Polygon')) && b.push(h)
          }
          return b
        },
        activate: function () {
          var a = OpenLayers.Control.prototype.activate.call(this);
          if (a) for (var b = 0, c = this.layers.length; b < c; b++) {
            var d = this.layers[b];
            d && !this.wfsCache[d.id] && OpenLayers.Request.GET({
              url: d.url,
              params: {
                SERVICE: 'WMS',
                VERSION: d.params.VERSION,
                LAYERS: d.params.LAYERS,
                REQUEST: 'DescribeLayer'
              },
              callback: this.parseDescribeLayer,
              scope: {
                layer: d,
                control: this
              }
            })
          }
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Control.prototype.deactivate.call(this);
          if (a) for (var b = 0, c = this.layers.length; b < c; b++) {
            var d = this.layers[b];
            if (d && !0 === this.clearOnDeactivate) {
              var e = this.layerCache,
                  f = e[d.id];
              f && (d.events.un({
                visibilitychanged: this.coupleLayerVisiblity,
                scope: f
              }), f.destroy(), delete e[d.id])
            }
          }
          return a
        },
        setLayers: function (a) {
          this.active ? (this.deactivate(), this.layers = a, this.activate())  : this.layers = a
        },
        createFilter: function (a, b) {
          var c = null;
          this.handler instanceof OpenLayers.Handler.RegularPolygon ? c = !0 === this.handler.irregular ?
            new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            property: a.name,
            value: b.getBounds()
          })  : new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.INTERSECTS,
            property: a.name,
            value: b
          })  : this.handler instanceof OpenLayers.Handler.Polygon ? c = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.INTERSECTS,
            property: a.name,
            value: b
          })  : this.handler instanceof OpenLayers.Handler.Path ? c = 0 <= a.type.indexOf('Point') ? new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.DWITHIN,
            property: a.name,
            distance: 0.01 * this.map.getExtent().getWidth(),
            distanceUnits: this.map.getUnits(),
            value: b
          })  : new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.INTERSECTS,
            property: a.name,
            value: b
          })  : this.handler instanceof OpenLayers.Handler.Click && (c = 0 <= a.type.indexOf('Polygon') ? new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.INTERSECTS,
            property: a.name,
            value: b
          })  : new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.DWITHIN,
            property: a.name,
            distance: 0.01 * this.map.getExtent().getWidth(),
            distanceUnits: this.map.getUnits(),
            value: b
          }));
          return c
        },
        select: function (a) {
          this._queue = function () {
            for (var b = 0, c = this.layers.length; b < c; b++) {
              for (var d = this.layers[b], e = this.getGeometryAttributes(d), f = [
              ], g = 0, h = e.length; g < h; g++) {
                var i = e[g];
                if (null !== i) {
                  if (!(a instanceof OpenLayers.Geometry)) {
                    var j = this.map.getLonLatFromPixel(a.xy);
                    a = new OpenLayers.Geometry.Point(j.lon, j.lat)
                  }
                  i = this.createFilter(i, a);
                  null !== i && f.push(i)
                }
              }
              g = this.createSelectionLayer(d);
              e = this.createSLD(d, f, e);
              this.events.triggerEvent('selected', {
                layer: d,
                filters: f
              });
              g.mergeNewParams({
                SLD_BODY: e
              });
              delete this._queue
            }
          };
          this.applySelection()
        },
        applySelection: function () {
          for (var a = !0, b = 0, c = this.layers.length; b < c; b++) if (!this.wfsCache[this.layers[b].id]) {
            a = !1;
            break
          }
          a && this._queue.call(this)
        },
        CLASS_NAME: 'OpenLayers.Control.SLDSelect'
      });
      OpenLayers.Control.Scale = OpenLayers.Class(OpenLayers.Control, {
        element: null,
        geodesic: !1,
        initialize: function (a, b) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            b
          ]);
          this.element = OpenLayers.Util.getElement(a)
        },
        draw: function () {
          OpenLayers.Control.prototype.draw.apply(this, arguments);
          this.element || (this.element = document.createElement('div'), this.div.appendChild(this.element));
          this.map.events.register('moveend', this, this.updateScale);
          this.updateScale();
          return this.div
        },
        updateScale: function () {
          var a;
          if (!0 === this.geodesic) {
            if (!this.map.getUnits()) return;
            a = OpenLayers.INCHES_PER_UNIT;
            a = (this.map.getGeodesicPixelSize().w || 0.000001) * a.km * OpenLayers.DOTS_PER_INCH
          } else a = this.map.getScale();
          a && (a = 9500 <= a && 950000 >= a ? Math.round(a / 1000) + 'K' : 950000 <= a ? Math.round(a / 1000000) + 'M' : Math.round(a), this.element.innerHTML = OpenLayers.i18n('Scale = 1 : ${scaleDenom}', {
            scaleDenom: a
          }))
        },
        CLASS_NAME: 'OpenLayers.Control.Scale'
      });
      OpenLayers.Layer.MapGuide = OpenLayers.Class(OpenLayers.Layer.Grid, {
        isBaseLayer: !0,
        useHttpTile: !1,
        singleTile: !1,
        useOverlay: !1,
        useAsyncOverlay: !0,
        TILE_PARAMS: {
          operation: 'GETTILEIMAGE',
          version: '1.2.0'
        },
        SINGLE_TILE_PARAMS: {
          operation: 'GETMAPIMAGE',
          format: 'PNG',
          locale: 'en',
          clip: '1',
          version: '1.0.0'
        },
        OVERLAY_PARAMS: {
          operation: 'GETDYNAMICMAPOVERLAYIMAGE',
          format: 'PNG',
          locale: 'en',
          clip: '1',
          version: '2.0.0'
        },
        FOLDER_PARAMS: {
          tileColumnsPerFolder: 30,
          tileRowsPerFolder: 30,
          format: 'png',
          querystring: null
        },
        defaultSize: new OpenLayers.Size(300, 300),
        tileOriginCorner: 'tl',
        initialize: function (a, b, c, d) {
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
          if (null == d || null == d.isBaseLayer) this.isBaseLayer = 'true' != this.transparent && !0 != this.transparent;
          d && null != d.useOverlay && (this.useOverlay = d.useOverlay);
          this.singleTile ? this.useOverlay ? (OpenLayers.Util.applyDefaults(this.params, this.OVERLAY_PARAMS), this.useAsyncOverlay || (this.params.version = '1.0.0'))  : OpenLayers.Util.applyDefaults(this.params, this.SINGLE_TILE_PARAMS)  : (this.useHttpTile ?
          OpenLayers.Util.applyDefaults(this.params, this.FOLDER_PARAMS)  : OpenLayers.Util.applyDefaults(this.params, this.TILE_PARAMS), this.setTileSize(this.defaultSize))
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.MapGuide(this.name, this.url, this.params, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          var b;
          b = a.getCenterLonLat();
          var c = this.map.getSize();
          this.singleTile ? (a = {
            setdisplaydpi: OpenLayers.DOTS_PER_INCH,
            setdisplayheight: c.h * this.ratio,
            setdisplaywidth: c.w * this.ratio,
            setviewcenterx: b.lon,
            setviewcentery: b.lat,
            setviewscale: this.map.getScale()
          }, this.useOverlay && !this.useAsyncOverlay && (b = {
          }, b = OpenLayers.Util.extend(b, a), b.operation = 'GETVISIBLEMAPEXTENT', b.version = '1.0.0', b.session = this.params.session, b.mapName = this.params.mapName, b.format = 'text/xml', b = this.getFullRequestString(b), OpenLayers.Request.GET({
            url: b,
            async: !1
          })), b = this.getFullRequestString(a))  : (c = this.map.getResolution(), b = Math.floor((a.left - this.maxExtent.left) / c), b = Math.round(b / this.tileSize.w), a = Math.floor((this.maxExtent.top - a.top) / c), a = Math.round(a / this.tileSize.h), b = this.useHttpTile ? this.getImageFilePath({
            tilecol: b,
            tilerow: a,
            scaleindex: this.resolutions.length - this.map.zoom - 1
          })  : this.getFullRequestString({
            tilecol: b,
            tilerow: a,
            scaleindex: this.resolutions.length - this.map.zoom - 1
          }));
          return b
        },
        getFullRequestString: function (a, b) {
          var c = null == b ? this.url : b;
          'object' == typeof c && (c = c[Math.floor(Math.random() * c.length)]);
          var d = c,
              e = OpenLayers.Util.extend({
              }, this.params),
              e = OpenLayers.Util.extend(e, a),
              f = OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c)),
              g;
          for (g in e) g.toUpperCase() in f && delete e[g];
          e = OpenLayers.Util.getParameterString(e);
          e = e.replace(/,/g, '+');
          '' != e && (f = c.charAt(c.length - 1), d = '&' == f || '?' == f ? d + e : - 1 == c.indexOf('?') ? d + ('?' + e)  : d + ('&' + e));
          return d
        },
        getImageFilePath: function (a, b) {
          var c = null == b ? this.url : b;
          'object' == typeof c && (c = c[Math.floor(Math.random() * c.length)]);
          var d = '',
              e = '';
          0 > a.tilerow && (d = '-');
          d = 0 == a.tilerow ? d + '0' : d + Math.floor(Math.abs(a.tilerow / this.params.tileRowsPerFolder)) * this.params.tileRowsPerFolder;
          0 > a.tilecol && (e = '-');
          e = 0 == a.tilecol ? e + '0' : e + Math.floor(Math.abs(a.tilecol / this.params.tileColumnsPerFolder)) * this.params.tileColumnsPerFolder;
          d = '/S' + Math.floor(a.scaleindex) + '/' + this.params.basemaplayergroupname + '/R' + d + '/C' + e + '/' + a.tilerow % this.params.tileRowsPerFolder + '_' + a.tilecol % this.params.tileColumnsPerFolder + '.' + this.params.format;
          this.params.querystring && (d += '?' + this.params.querystring);
          return c + d
        },
        calculateGridLayout: function (a, b, c) {
          var d = c * this.tileSize.w,
              c = c * this.tileSize.h,
              e = a.left - b.lon,
              f = Math.floor(e / d) - this.buffer,
              a = b.lat - a.top + c,
              g = Math.floor(a / c) - this.buffer;
          return {
            tilelon: d,
            tilelat: c,
            tileoffsetlon: b.lon + f * d,
            tileoffsetlat: b.lat - c * g,
            tileoffsetx: - (e / d - f) * this.tileSize.w,
            tileoffsety: (g - a / c) * this.tileSize.h
          }
        },
        CLASS_NAME: 'OpenLayers.Layer.MapGuide'
      });
      OpenLayers.Control.Measure = OpenLayers.Class(OpenLayers.Control, {
        handlerOptions: null,
        callbacks: null,
        displaySystem: 'metric',
        geodesic: !1,
        displaySystemUnits: {
          geographic: [
            'dd'
          ],
          english: [
            'mi',
            'ft',
            'in'
          ],
          metric: [
            'km',
            'm'
          ]
        },
        partialDelay: 300,
        delayedTrigger: null,
        persist: !1,
        immediate: !1,
        initialize: function (a, b) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            b
          ]);
          var c = {
            done: this.measureComplete,
            point: this.measurePartial
          };
          this.immediate && (c.modify = this.measureImmediate);
          this.callbacks = OpenLayers.Util.extend(c, this.callbacks);
          this.handlerOptions = OpenLayers.Util.extend({
            persist: this.persist
          }, this.handlerOptions);
          this.handler = new a(this, this.callbacks, this.handlerOptions)
        },
        deactivate: function () {
          this.cancelDelay();
          return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
        },
        cancel: function () {
          this.cancelDelay();
          this.handler.cancel()
        },
        setImmediate: function (a) {
          (this.immediate = a) ? this.callbacks.modify = this.measureImmediate : delete this.callbacks.modify
        },
        updateHandler: function (a, b) {
          var c = this.active;
          c && this.deactivate();
          this.handler = new a(this, this.callbacks, b);
          c && this.activate()
        },
        measureComplete: function (a) {
          this.cancelDelay();
          this.measure(a, 'measure')
        },
        measurePartial: function (a, b) {
          this.cancelDelay();
          b = b.clone();
          this.handler.freehandMode(this.handler.evt) ? this.measure(b, 'measurepartial')  : this.delayedTrigger = window.setTimeout(OpenLayers.Function.bind(function () {
            this.delayedTrigger = null;
            this.measure(b, 'measurepartial')
          }, this), this.partialDelay)
        },
        measureImmediate: function (a, b, c) {
          c && !this.handler.freehandMode(this.handler.evt) && (this.cancelDelay(), this.measure(b.geometry, 'measurepartial'))
        },
        cancelDelay: function () {
          null !== this.delayedTrigger && (window.clearTimeout(this.delayedTrigger), this.delayedTrigger = null)
        },
        measure: function (a, b) {
          var c,
              d;
          - 1 < a.CLASS_NAME.indexOf('LineString') ? (c = this.getBestLength(a), d = 1)  : (c = this.getBestArea(a), d = 2);
          this.events.triggerEvent(b, {
            measure: c[0],
            units: c[1],
            order: d,
            geometry: a
          })
        },
        getBestArea: function (a) {
          for (var b = this.displaySystemUnits[this.displaySystem], c, d, e = 0, f = b.length; e < f && !(c = b[e], d = this.getArea(a, c), 1 < d); ++e);
          return [d,
                  c]
        },
        getArea: function (a, b) {
          var c,
              d;
          this.geodesic ? (c = a.getGeodesicArea(this.map.getProjectionObject()), d = 'm')  : (c = a.getArea(), d = this.map.getUnits());
          var e = OpenLayers.INCHES_PER_UNIT[b];
          e && (c *= Math.pow(OpenLayers.INCHES_PER_UNIT[d] / e, 2));
          return c
        },
        getBestLength: function (a) {
          for (var b = this.displaySystemUnits[this.displaySystem], c, d, e = 0, f = b.length; e < f && !(c = b[e], d = this.getLength(a, c), 1 < d); ++e);
          return [d,
                  c]
        },
        getLength: function (a, b) {
          var c,
              d;
          this.geodesic ? (c = a.getGeodesicLength(this.map.getProjectionObject()), d = 'm')  : (c = a.getLength(), d = this.map.getUnits());
          var e = OpenLayers.INCHES_PER_UNIT[b];
          e && (c *= OpenLayers.INCHES_PER_UNIT[d] / e);
          return c
        },
        CLASS_NAME: 'OpenLayers.Control.Measure'
      });
      OpenLayers.Format.WMC.v1_0_0 = OpenLayers.Class(OpenLayers.Format.WMC.v1, {
        VERSION: '1.0.0',
        schemaLocation: 'http://www.opengis.net/context http://schemas.opengis.net/context/1.0.0/context.xsd',
        initialize: function (a) {
          OpenLayers.Format.WMC.v1.prototype.initialize.apply(this, [
            a
          ])
        },
        read_wmc_SRS: function (a, b) {
          var c = this.getChildValue(b);
          'object' != typeof a.projections && (a.projections = {
          });
          for (var c = c.split(/ +/), d = 0, e = c.length; d < e; d++) a.projections[c[d]] = !0
            },
        write_wmc_Layer: function (a) {
          var b = OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(this, [
            a
          ]);
          if (a.srs) {
            var c = [
            ],
                d;
            for (d in a.srs) c.push(d);
            b.appendChild(this.createElementDefaultNS('SRS', c.join(' ')))
          }
          b.appendChild(this.write_wmc_FormatList(a));
          b.appendChild(this.write_wmc_StyleList(a));
          a.dimensions && b.appendChild(this.write_wmc_DimensionList(a));
          b.appendChild(this.write_wmc_LayerExtension(a))
        },
        CLASS_NAME: 'OpenLayers.Format.WMC.v1_0_0'
      });
      OpenLayers.Popup.Framed = OpenLayers.Class(OpenLayers.Popup.Anchored, {
        imageSrc: null,
        imageSize: null,
        isAlphaImage: !1,
        positionBlocks: null,
        blocks: null,
        fixedRelativePosition: !1,
        initialize: function (a, b, c, d, e, f, g) {
          OpenLayers.Popup.Anchored.prototype.initialize.apply(this, arguments);
          this.fixedRelativePosition && (this.updateRelativePosition(), this.calculateRelativePosition = function () {
            return this.relativePosition
          });
          this.contentDiv.style.position = 'absolute';
          this.contentDiv.style.zIndex = 1;
          f && (this.closeDiv.style.zIndex = 1);
          this.groupDiv.style.position = 'absolute';
          this.groupDiv.style.top = '0px';
          this.groupDiv.style.left = '0px';
          this.groupDiv.style.height = '100%';
          this.groupDiv.style.width = '100%'
        },
        destroy: function () {
          this.isAlphaImage = this.imageSize = this.imageSrc = null;
          this.fixedRelativePosition = !1;
          this.positionBlocks = null;
          for (var a = 0; a < this.blocks.length; a++) {
            var b = this.blocks[a];
            b.image && b.div.removeChild(b.image);
            b.image = null;
            b.div && this.groupDiv.removeChild(b.div);
            b.div = null
          }
          this.blocks = null;
          OpenLayers.Popup.Anchored.prototype.destroy.apply(this, arguments)
        },
        setBackgroundColor: function () {
        },
        setBorder: function () {
        },
        setOpacity: function () {
        },
        setSize: function (a) {
          OpenLayers.Popup.Anchored.prototype.setSize.apply(this, arguments);
          this.updateBlocks()
        },
        updateRelativePosition: function () {
          this.padding = this.positionBlocks[this.relativePosition].padding;
          if (this.closeDiv) {
            var a = this.getContentDivPadding();
            this.closeDiv.style.right = a.right + this.padding.right + 'px';
            this.closeDiv.style.top = a.top + this.padding.top + 'px'
          }
          this.updateBlocks()
        },
        calculateNewPx: function (a) {
          var b = OpenLayers.Popup.Anchored.prototype.calculateNewPx.apply(this, arguments);
          return b = b.offset(this.positionBlocks[this.relativePosition].offset)
        },
        createBlocks: function () {
          this.blocks = [
          ];
          var a = null,
              b;
          for (b in this.positionBlocks) {
            a = b;
            break
          }
          a = this.positionBlocks[a];
          for (b = 0; b < a.blocks.length; b++) {
            var c = {
            };
            this.blocks.push(c);
            c.div = OpenLayers.Util.createDiv(this.id + '_FrameDecorationDiv_' + b, null, null, null, 'absolute', null, 'hidden', null);
            c.image = (this.isAlphaImage ? OpenLayers.Util.createAlphaImageDiv : OpenLayers.Util.createImage) (this.id +
                                                                                                               '_FrameDecorationImg_' + b, null, this.imageSize, this.imageSrc, 'absolute', null, null, null);
            c.div.appendChild(c.image);
            this.groupDiv.appendChild(c.div)
          }
        },
        updateBlocks: function () {
          this.blocks || this.createBlocks();
          if (this.size && this.relativePosition) {
            for (var a = this.positionBlocks[this.relativePosition], b = 0; b < a.blocks.length; b++) {
              var c = a.blocks[b],
                  d = this.blocks[b],
                  e = c.anchor.left,
                  f = c.anchor.bottom,
                  g = c.anchor.right,
                  h = c.anchor.top,
                  i = isNaN(c.size.w) ? this.size.w - (g + e)  : c.size.w,
                  j = isNaN(c.size.h) ? this.size.h - (f +
                                                       h)  : c.size.h;
              d.div.style.width = (0 > i ? 0 : i) + 'px';
              d.div.style.height = (0 > j ? 0 : j) + 'px';
              d.div.style.left = null != e ? e + 'px' : '';
              d.div.style.bottom = null != f ? f + 'px' : '';
              d.div.style.right = null != g ? g + 'px' : '';
              d.div.style.top = null != h ? h + 'px' : '';
              d.image.style.left = c.position.x + 'px';
              d.image.style.top = c.position.y + 'px'
            }
            this.contentDiv.style.left = this.padding.left + 'px';
            this.contentDiv.style.top = this.padding.top + 'px'
          }
        },
        CLASS_NAME: 'OpenLayers.Popup.Framed'
      });
      OpenLayers.Popup.FramedCloud = OpenLayers.Class(OpenLayers.Popup.Framed, {
        contentDisplayClass: 'olFramedCloudPopupContent',
        autoSize: !0,
        panMapIfOutOfView: !0,
        imageSize: new OpenLayers.Size(1276, 736),
        isAlphaImage: !1,
        fixedRelativePosition: !1,
        positionBlocks: {
          tl: {
            offset: new OpenLayers.Pixel(44, 0),
            padding: new OpenLayers.Bounds(8, 40, 8, 9),
            blocks: [
              {
                size: new OpenLayers.Size('auto', 'auto'),
                anchor: new OpenLayers.Bounds(0, 51, 22, 0),
                position: new OpenLayers.Pixel(0, 0)
              },
              {
                size: new OpenLayers.Size(22, 'auto'),
                anchor: new OpenLayers.Bounds(null, 50, 0, 0),
                position: new OpenLayers.Pixel( - 1238, 0)
              },
              {
                size: new OpenLayers.Size('auto', 19),
                anchor: new OpenLayers.Bounds(0, 32, 22, null),
                position: new OpenLayers.Pixel(0, - 631)
              },
              {
                size: new OpenLayers.Size(22, 18),
                anchor: new OpenLayers.Bounds(null, 32, 0, null),
                position: new OpenLayers.Pixel( - 1238, - 632)
              },
              {
                size: new OpenLayers.Size(81, 35),
                anchor: new OpenLayers.Bounds(null, 0, 0, null),
                position: new OpenLayers.Pixel(0, - 688)
              }
            ]
          },
          tr: {
            offset: new OpenLayers.Pixel( - 45, 0),
            padding: new OpenLayers.Bounds(8, 40, 8, 9),
            blocks: [
              {
                size: new OpenLayers.Size('auto', 'auto'),
                anchor: new OpenLayers.Bounds(0, 51, 22, 0),
                position: new OpenLayers.Pixel(0, 0)
              },
              {
                size: new OpenLayers.Size(22, 'auto'),
                anchor: new OpenLayers.Bounds(null, 50, 0, 0),
                position: new OpenLayers.Pixel( - 1238, 0)
              },
              {
                size: new OpenLayers.Size('auto', 19),
                anchor: new OpenLayers.Bounds(0, 32, 22, null),
                position: new OpenLayers.Pixel(0, - 631)
              },
              {
                size: new OpenLayers.Size(22, 19),
                anchor: new OpenLayers.Bounds(null, 32, 0, null),
                position: new OpenLayers.Pixel( - 1238, - 631)
              },
              {
                size: new OpenLayers.Size(81, 35),
                anchor: new OpenLayers.Bounds(0, 0, null, null),
                position: new OpenLayers.Pixel( - 215, - 687)
              }
            ]
          },
          bl: {
            offset: new OpenLayers.Pixel(45, 0),
            padding: new OpenLayers.Bounds(8, 9, 8, 40),
            blocks: [
              {
                size: new OpenLayers.Size('auto', 'auto'),
                anchor: new OpenLayers.Bounds(0, 21, 22, 32),
                position: new OpenLayers.Pixel(0, 0)
              },
              {
                size: new OpenLayers.Size(22, 'auto'),
                anchor: new OpenLayers.Bounds(null, 21, 0, 32),
                position: new OpenLayers.Pixel( - 1238, 0)
              },
              {
                size: new OpenLayers.Size('auto', 21),
                anchor: new OpenLayers.Bounds(0, 0, 22, null),
                position: new OpenLayers.Pixel(0, - 629)
              },
              {
                size: new OpenLayers.Size(22, 21),
                anchor: new OpenLayers.Bounds(null, 0, 0, null),
                position: new OpenLayers.Pixel( - 1238, - 629)
              },
              {
                size: new OpenLayers.Size(81, 33),
                anchor: new OpenLayers.Bounds(null, null, 0, 0),
                position: new OpenLayers.Pixel( - 101, - 674)
              }
            ]
          },
          br: {
            offset: new OpenLayers.Pixel( - 44, 0),
            padding: new OpenLayers.Bounds(8, 9, 8, 40),
            blocks: [
              {
                size: new OpenLayers.Size('auto', 'auto'),
                anchor: new OpenLayers.Bounds(0, 21, 22, 32),
                position: new OpenLayers.Pixel(0, 0)
              },
              {
                size: new OpenLayers.Size(22, 'auto'),
                anchor: new OpenLayers.Bounds(null, 21, 0, 32),
                position: new OpenLayers.Pixel( - 1238, 0)
              },
              {
                size: new OpenLayers.Size('auto', 21),
                anchor: new OpenLayers.Bounds(0, 0, 22, null),
                position: new OpenLayers.Pixel(0, - 629)
              },
              {
                size: new OpenLayers.Size(22, 21),
                anchor: new OpenLayers.Bounds(null, 0, 0, null),
                position: new OpenLayers.Pixel( - 1238, - 629)
              },
              {
                size: new OpenLayers.Size(81, 33),
                anchor: new OpenLayers.Bounds(0, null, null, 0),
                position: new OpenLayers.Pixel( - 311, - 674)
              }
            ]
          }
        },
        minSize: new OpenLayers.Size(105, 10),
        maxSize: new OpenLayers.Size(1200, 660),
        initialize: function (a, b, c, d, e, f, g) {
          this.imageSrc = OpenLayers.Util.getImageLocation('cloud-popup-relative.png');
          OpenLayers.Popup.Framed.prototype.initialize.apply(this, arguments);
          this.contentDiv.className = this.contentDisplayClass
        },
        CLASS_NAME: 'OpenLayers.Popup.FramedCloud'
      });
      OpenLayers.Tile.Image.IFrame = {
        useIFrame: null,
        draw: function () {
          if (OpenLayers.Tile.Image.prototype.shouldDraw.call(this)) {
            var a = this.layer.getURL(this.bounds),
                b = this.useIFrame;
            this.useIFrame = null !== this.maxGetUrlLength && !this.layer.async && a.length > this.maxGetUrlLength;
            a = b && !this.useIFrame;
            b = !b && this.useIFrame;
            if (a || b) this.imgDiv && this.imgDiv.parentNode === this.frame && this.frame.removeChild(this.imgDiv),
              this.imgDiv = null,
              a ? (this.blankImageUrl = this._blankImageUrl, this.frame.removeChild(this.frame.firstChild))  : (this._blankImageUrl = this.blankImageUrl, this.blankImageUrl = 'about:blank')
              }
          return OpenLayers.Tile.Image.prototype.draw.apply(this, arguments)
        },
        getImage: function () {
          if (!0 === this.useIFrame) {
            if (!this.frame.childNodes.length) {
              var a = document.createElement('div'),
                  b = a.style;
              b.position = 'absolute';
              b.width = '100%';
              b.height = '100%';
              b.zIndex = 1;
              b.backgroundImage = 'url(' + this._blankImageUrl + ')';
              this.frame.appendChild(a)
            }
            a = this.id + '_iFrame';
            9 > parseFloat(navigator.appVersion.split('MSIE') [1]) ? (b = document.createElement('<iframe name="' +
                                                                                                 a + '">'), b.style.backgroundColor = '#FFFFFF', b.style.filter = 'chroma(color=#FFFFFF)')  : (b = document.createElement('iframe'), b.style.backgroundColor = 'transparent', b.name = a);
            b.scrolling = 'no';
            b.marginWidth = '0px';
            b.marginHeight = '0px';
            b.frameBorder = '0';
            b.style.position = 'absolute';
            b.style.width = '100%';
            b.style.height = '100%';
            1 > this.layer.opacity && OpenLayers.Util.modifyDOMElement(b, null, null, null, null, null, null, this.layer.opacity);
            this.frame.appendChild(b);
            return this.imgDiv = b
          }
          return OpenLayers.Tile.Image.prototype.getImage.apply(this, arguments)
        },
        createRequestForm: function () {
          var a = document.createElement('form');
          a.method = 'POST';
          var b = this.layer.params._OLSALT,
              b = (b ? b + '_' : '') + this.bounds.toBBOX();
          a.action = OpenLayers.Util.urlAppend(this.layer.url, b);
          a.target = this.id + '_iFrame';
          this.layer.getImageSize();
          var b = OpenLayers.Util.getParameters(this.url),
              c,
              d;
          for (d in b) c = document.createElement('input'),
            c.type = 'hidden',
            c.name = d,
            c.value = b[d],
            a.appendChild(c);
          return a
        },
        setImgSrc: function (a) {
          if (!0 === this.useIFrame) if (a) {
            var b = this.createRequestForm();
            this.frame.appendChild(b);
            b.submit();
            this.frame.removeChild(b)
          } else this.imgDiv.parentNode === this.frame && (this.frame.removeChild(this.imgDiv), this.imgDiv = null);
          else OpenLayers.Tile.Image.prototype.setImgSrc.apply(this, arguments)
            },
        onImageLoad: function () {
          OpenLayers.Tile.Image.prototype.onImageLoad.apply(this, arguments);
          !0 === this.useIFrame && (this.imgDiv.style.opacity = 1, this.frame.style.opacity = this.layer.opacity)
        },
        createBackBuffer: function () {
          var a;
          !1 === this.useIFrame && (a = OpenLayers.Tile.Image.prototype.createBackBuffer.call(this));
          return a
        }
      };
      OpenLayers.Format.SOSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.0.0',
        CLASS_NAME: 'OpenLayers.Format.SOSCapabilities'
      });
      OpenLayers.Format.SOSCapabilities.v1_0_0 = OpenLayers.Class(OpenLayers.Format.SOSCapabilities, {
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          sos: 'http://www.opengis.net/sos/1.0',
          gml: 'http://www.opengis.net/gml',
          xlink: 'http://www.w3.org/1999/xlink'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ]);
          this.options = a
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          gml: OpenLayers.Util.applyDefaults({
            name: function (a, b) {
              b.name = this.getChildValue(a)
            },
            TimePeriod: function (a, b) {
              b.timePeriod = {
              };
              this.readChildNodes(a, b.timePeriod)
            },
            beginPosition: function (a, b) {
              b.beginPosition = this.getChildValue(a)
            },
            endPosition: function (a, b) {
              b.endPosition = this.getChildValue(a)
            }
          }, OpenLayers.Format.GML.v3.prototype.readers.gml),
          sos: {
            Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            Contents: function (a, b) {
              b.contents = {
              };
              this.readChildNodes(a, b.contents)
            },
            ObservationOfferingList: function (a, b) {
              b.offeringList = {
              };
              this.readChildNodes(a, b.offeringList)
            },
            ObservationOffering: function (a, b) {
              var c = this.getAttributeNS(a, this.namespaces.gml, 'id');
              b[c] = {
                procedures: [
                ],
                observedProperties: [
                ],
                featureOfInterestIds: [
                ],
                responseFormats: [
                ],
                resultModels: [
                ],
                responseModes: [
                ]
              };
              this.readChildNodes(a, b[c])
            },
            time: function (a, b) {
              b.time = {
              };
              this.readChildNodes(a, b.time)
            },
            procedure: function (a, b) {
              b.procedures.push(this.getAttributeNS(a, this.namespaces.xlink, 'href'))
            },
            observedProperty: function (a, b) {
              b.observedProperties.push(this.getAttributeNS(a, this.namespaces.xlink, 'href'))
            },
            featureOfInterest: function (a, b) {
              b.featureOfInterestIds.push(this.getAttributeNS(a, this.namespaces.xlink, 'href'))
            },
            responseFormat: function (a, b) {
              b.responseFormats.push(this.getChildValue(a))
            },
            resultModel: function (a, b) {
              b.resultModels.push(this.getChildValue(a))
            },
            responseMode: function (a, b) {
              b.responseModes.push(this.getChildValue(a))
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.SOSCapabilities.v1_0_0'
      });
      OpenLayers.Handler.Pinch = OpenLayers.Class(OpenLayers.Handler, {
        started: !1,
        stopDown: !1,
        pinching: !1,
        last: null,
        start: null,
        touchstart: function (a) {
          var b = !0;
          this.pinching = !1;
          OpenLayers.Event.isMultiTouch(a) ? (this.started = !0, this.last = this.start = {
            distance: this.getDistance(a.touches),
            delta: 0,
            scale: 1
          }, this.callback('start', [
            a,
            this.start
          ]), b = !this.stopDown)  : (this.started = !1, this.last = this.start = null);
          OpenLayers.Event.stop(a);
          return b
        },
        touchmove: function (a) {
          if (this.started && OpenLayers.Event.isMultiTouch(a)) {
            this.pinching = !0;
            var b = this.getPinchData(a);
            this.callback('move', [
              a,
              b
            ]);
            this.last = b;
            OpenLayers.Event.stop(a)
          }
          return !0
        },
        touchend: function (a) {
          this.started && (this.pinching = this.started = !1, this.callback('done', [
            a,
            this.start,
            this.last
          ]), this.last = this.start = null);
          return !0
        },
        activate: function () {
          var a = !1;
          OpenLayers.Handler.prototype.activate.apply(this, arguments) && (this.pinching = !1, a = !0);
          return a
        },
        deactivate: function () {
          var a = !1;
          OpenLayers.Handler.prototype.deactivate.apply(this, arguments) && (this.pinching = this.started = !1, this.last = this.start = null, a = !0);
          return a
        },
        getDistance: function (a) {
          var b = a[0],
              a = a[1];
          return Math.sqrt(Math.pow(b.clientX - a.clientX, 2) + Math.pow(b.clientY - a.clientY, 2))
        },
        getPinchData: function (a) {
          a = this.getDistance(a.touches);
          return {
            distance: a,
            delta: this.last.distance - a,
            scale: a / this.start.distance
          }
        },
        CLASS_NAME: 'OpenLayers.Handler.Pinch'
      });
      OpenLayers.Control.NavToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {
        initialize: function (a) {
          OpenLayers.Control.Panel.prototype.initialize.apply(this, [
            a
          ]);
          this.addControls([new OpenLayers.Control.Navigation,
                            new OpenLayers.Control.ZoomBox])
        },
        draw: function () {
          var a = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
          null === this.defaultControl && (this.defaultControl = this.controls[0]);
          return a
        },
        CLASS_NAME: 'OpenLayers.Control.NavToolbar'
      });
      OpenLayers.Strategy.Refresh = OpenLayers.Class(OpenLayers.Strategy, {
        force: !1,
        interval: 0,
        timer: null,
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.call(this);
          a && (!0 === this.layer.visibility && this.start(), this.layer.events.on({
            visibilitychanged: this.reset,
            scope: this
          }));
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && this.stop();
          return a
        },
        reset: function () {
          !0 === this.layer.visibility ? this.start()  : this.stop()
        },
        start: function () {
          this.interval && ('number' ===
                            typeof this.interval && 0 < this.interval) && (this.timer = window.setInterval(OpenLayers.Function.bind(this.refresh, this), this.interval))
        },
        refresh: function () {
          this.layer && (this.layer.refresh && 'function' == typeof this.layer.refresh) && this.layer.refresh({
            force: this.force
          })
        },
        stop: function () {
          null !== this.timer && (window.clearInterval(this.timer), this.timer = null)
        },
        CLASS_NAME: 'OpenLayers.Strategy.Refresh'
      });
      OpenLayers.Layer.ArcGIS93Rest = OpenLayers.Class(OpenLayers.Layer.Grid, {
        DEFAULT_PARAMS: {
          format: 'png'
        },
        isBaseLayer: !0,
        initialize: function (a, b, c, d) {
          var e = [
          ],
              c = OpenLayers.Util.upperCaseObject(c);
          e.push(a, b, c, d);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, e);
          OpenLayers.Util.applyDefaults(this.params, OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
          if (this.params.TRANSPARENT && 'true' == this.params.TRANSPARENT.toString().toLowerCase()) {
            if (null == d || !d.isBaseLayer) this.isBaseLayer = !1;
            'jpg' == this.params.FORMAT && (this.params.FORMAT = OpenLayers.Util.alphaHack() ? 'gif' : 'png')
          }
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.ArcGIS93Rest(this.name, this.url, this.params, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.projection.getCode().split(':'),
              b = b[b.length - 1],
              c = this.getImageSize(),
              a = {
                BBOX: a.toBBOX(),
                SIZE: c.w + ',' + c.h,
                F: 'image',
                BBOXSR: b,
                IMAGESR: b
              };
          if (this.layerDefs) {
            var b = [
            ],
                d;
            for (d in this.layerDefs) this.layerDefs.hasOwnProperty(d) && this.layerDefs[d] && (b.push(d), b.push(':'), b.push(this.layerDefs[d]), b.push(';'));
            0 < b.length && (a.LAYERDEFS = b.join(''))
          }
          return this.getFullRequestString(a)
        },
        setLayerFilter: function (a, b) {
          this.layerDefs || (this.layerDefs = {
          });
          b ? this.layerDefs[a] = b : delete this.layerDefs[a]
        },
        clearLayerFilter: function (a) {
          a ? delete this.layerDefs[a] : delete this.layerDefs
        },
        mergeNewParams: function (a) {
          a = [
            OpenLayers.Util.upperCaseObject(a)
          ];
          return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, a)
        },
        CLASS_NAME: 'OpenLayers.Layer.ArcGIS93Rest'
      });
      OpenLayers.Handler.Hover = OpenLayers.Class(OpenLayers.Handler, {
        delay: 500,
        pixelTolerance: null,
        stopMove: !1,
        px: null,
        timerId: null,
        mousemove: function (a) {
          this.passesTolerance(a.xy) && (this.clearTimer(), this.callback('move', [
            a
          ]), this.px = a.xy, a = OpenLayers.Util.extend({
          }, a), this.timerId = window.setTimeout(OpenLayers.Function.bind(this.delayedCall, this, a), this.delay));
          return !this.stopMove
        },
        mouseout: function (a) {
          OpenLayers.Util.mouseLeft(a, this.map.viewPortDiv) && (this.clearTimer(), this.callback('move', [
            a
          ]));
          return !0
        },
        passesTolerance: function (a) {
          var b = !0;
          this.pixelTolerance && this.px && Math.sqrt(Math.pow(this.px.x - a.x, 2) + Math.pow(this.px.y - a.y, 2)) < this.pixelTolerance && (b = !1);
          return b
        },
        clearTimer: function () {
          null != this.timerId && (window.clearTimeout(this.timerId), this.timerId = null)
        },
        delayedCall: function (a) {
          this.callback('pause', [
            a
          ])
        },
        deactivate: function () {
          var a = !1;
          OpenLayers.Handler.prototype.deactivate.apply(this, arguments) && (this.clearTimer(), a = !0);
          return a
        },
        CLASS_NAME: 'OpenLayers.Handler.Hover'
      });
      OpenLayers.Control.GetFeature = OpenLayers.Class(OpenLayers.Control, {
        protocol: null,
        multipleKey: null,
        toggleKey: null,
        modifiers: null,
        multiple: !1,
        click: !0,
        single: !0,
        clickout: !0,
        toggle: !1,
        clickTolerance: 5,
        hover: !1,
        box: !1,
        maxFeatures: 10,
        features: null,
        hoverFeature: null,
        handlerOptions: null,
        handlers: null,
        hoverResponse: null,
        filterType: OpenLayers.Filter.Spatial.BBOX,
        initialize: function (a) {
          a.handlerOptions = a.handlerOptions || {
          };
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.features = {
          };
          this.handlers = {
          };
          this.click && (this.handlers.click = new OpenLayers.Handler.Click(this, {
            click: this.selectClick
          }, this.handlerOptions.click || {
          }));
          this.box && (this.handlers.box = new OpenLayers.Handler.Box(this, {
            done: this.selectBox
          }, OpenLayers.Util.extend(this.handlerOptions.box, {
            boxDivClassName: 'olHandlerBoxSelectFeature'
          })));
          this.hover && (this.handlers.hover = new OpenLayers.Handler.Hover(this, {
            move: this.cancelHover,
            pause: this.selectHover
          }, OpenLayers.Util.extend(this.handlerOptions.hover, {
            delay: 250,
            pixelTolerance: 2
          })))
        },
        activate: function () {
          if (!this.active) for (var a in this.handlers) this.handlers[a].activate();
          return OpenLayers.Control.prototype.activate.apply(this, arguments)
        },
        deactivate: function () {
          if (this.active) for (var a in this.handlers) this.handlers[a].deactivate();
          return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
        },
        selectClick: function (a) {
          var b = this.pixelToBounds(a.xy);
          this.setModifiers(a);
          this.request(b, {
            single: this.single
          })
        },
        selectBox: function (a) {
          var b;
          if (a instanceof OpenLayers.Bounds) b = this.map.getLonLatFromPixel({
            x: a.left,
            y: a.bottom
          }),
            a = this.map.getLonLatFromPixel({
            x: a.right,
            y: a.top
          }),
            b = new OpenLayers.Bounds(b.lon, b.lat, a.lon, a.lat);
          else {
            if (this.click) return;
            b = this.pixelToBounds(a)
          }
          this.setModifiers(this.handlers.box.dragHandler.evt);
          this.request(b)
        },
        selectHover: function (a) {
          this.request(this.pixelToBounds(a.xy), {
            single: !0,
            hover: !0
          })
        },
        cancelHover: function () {
          this.hoverResponse && (this.protocol.abort(this.hoverResponse), this.hoverResponse = null, OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait'))
        },
        request: function (a, b) {
          var b = b || {
          },
              c = new OpenLayers.Filter.Spatial({
                type: this.filterType,
                value: a
              });
          OpenLayers.Element.addClass(this.map.viewPortDiv, 'olCursorWait');
          c = this.protocol.read({
            maxFeatures: !0 == b.single ? this.maxFeatures : void 0,
            filter: c,
            callback: function (c) {
            c.success() && (c.features.length ? !0 == b.single ? this.selectBestFeature(c.features, a.getCenterLonLat(), b)  : this.select(c.features)  : b.hover ? this.hoverSelect()  : (this.events.triggerEvent('clickout'), this.clickout && this.unselectAll()));
            OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait')
          },
                                 scope: this
                                 });
          !0 == b.hover && (this.hoverResponse = c)
        },
        selectBestFeature: function (a, b, c) {
          c = c || {
          };
          if (a.length) {
            for (var b = new OpenLayers.Geometry.Point(b.lon, b.lat), d, e, f, g = Number.MAX_VALUE, h = 0; h < a.length && !(d = a[h], d.geometry && (f = b.distanceTo(d.geometry, {
              edge: !1
            }), f < g && (g = f, e = d, 0 == g))); ++h);
            !0 == c.hover ? this.hoverSelect(e)  : this.select(e || a)
          }
        },
        setModifiers: function (a) {
          this.modifiers = {
            multiple: this.multiple || this.multipleKey && a[this.multipleKey],
            toggle: this.toggle || this.toggleKey && a[this.toggleKey]
          }
        },
        select: function (a) {
          !this.modifiers.multiple && !this.modifiers.toggle && this.unselectAll();
          OpenLayers.Util.isArray(a) || (a = [
            a
          ]);
          var b = this.events.triggerEvent('beforefeaturesselected', {
            features: a
          });
          if (!1 !== b) {
            for (var c = [
            ], d, e = 0, f = a.length; e < f; ++e) d = a[e],
              this.features[d.fid || d.id] ? this.modifiers.toggle && this.unselect(this.features[d.fid || d.id])  : (b = this.events.triggerEvent('beforefeatureselected', {
              feature: d
            }), !1 !== b && (this.features[d.fid || d.id] = d, c.push(d), this.events.triggerEvent('featureselected', {
              feature: d
            })));
            this.events.triggerEvent('featuresselected', {
              features: c
            })
          }
        },
        hoverSelect: function (a) {
          var b = a ? a.fid || a.id : null,
              c = this.hoverFeature ? this.hoverFeature.fid || this.hoverFeature.id : null;
          c && c != b && (this.events.triggerEvent('outfeature', {
            feature: this.hoverFeature
          }), this.hoverFeature = null);
          b && b != c && (this.events.triggerEvent('hoverfeature', {
            feature: a
          }), this.hoverFeature = a)
        },
        unselect: function (a) {
          delete this.features[a.fid || a.id];
          this.events.triggerEvent('featureunselected', {
            feature: a
          })
        },
        unselectAll: function () {
          for (var a in this.features) this.unselect(this.features[a])
            },
        setMap: function (a) {
          for (var b in this.handlers) this.handlers[b].setMap(a);
          OpenLayers.Control.prototype.setMap.apply(this, arguments)
        },
        pixelToBounds: function (a) {
          var b = a.add( - this.clickTolerance / 2, this.clickTolerance / 2),
              a = a.add(this.clickTolerance / 2, - this.clickTolerance / 2),
              b = this.map.getLonLatFromPixel(b),
              a = this.map.getLonLatFromPixel(a);
          return new OpenLayers.Bounds(b.lon, b.lat, a.lon, a.lat)
        },
        CLASS_NAME: 'OpenLayers.Control.GetFeature'
      });
      OpenLayers.Format.QueryStringFilter = function () {
        function a(a) {
          a = a.replace(/%/g, '\\%');
          a = a.replace(/\\\\\.(\*)?/g, function (a, b) {
            return b ? a : '\\\\_'
          });
          a = a.replace(/\\\\\.\*/g, '\\\\%');
          a = a.replace(/(\\)?\.(\*)?/g, function (a, b, c) {
            return b || c ? a : '_'
          });
          a = a.replace(/(\\)?\.\*/g, function (a, b) {
            return b ? a : '%'
          });
          a = a.replace(/\\\./g, '.');
          return a = a.replace(/(\\)?\\\*/g, function (a, b) {
            return b ? a : '*'
          })
        }
        var b = {
        };
        b[OpenLayers.Filter.Comparison.EQUAL_TO] = 'eq';
        b[OpenLayers.Filter.Comparison.NOT_EQUAL_TO] = 'ne';
        b[OpenLayers.Filter.Comparison.LESS_THAN] = 'lt';
        b[OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO] = 'lte';
        b[OpenLayers.Filter.Comparison.GREATER_THAN] = 'gt';
        b[OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO] = 'gte';
        b[OpenLayers.Filter.Comparison.LIKE] = 'ilike';
        return OpenLayers.Class(OpenLayers.Format, {
          wildcarded: !1,
          srsInBBOX: !1,
          write: function (c, d) {
            var d = d || {
            },
                e = c.CLASS_NAME,
                e = e.substring(e.lastIndexOf('.') + 1);
            switch (e) {
              case 'Spatial':
                switch (c.type) {
                  case OpenLayers.Filter.Spatial.BBOX:
                    d.bbox = c.value.toArray();
                    this.srsInBBOX && c.projection && d.bbox.push(c.projection.getCode());
                    break;
                  case OpenLayers.Filter.Spatial.DWITHIN:
                    d.tolerance = c.distance;
                  case OpenLayers.Filter.Spatial.WITHIN:
                    d.lon = c.value.x;
                    d.lat = c.value.y;
                    break;
                  default:
                    OpenLayers.Console.warn('Unknown spatial filter type ' + c.type)
                }
                break;
              case 'Comparison':
                e = b[c.type];
                if (void 0 !== e) {
                  var f = c.value;
                  c.type == OpenLayers.Filter.Comparison.LIKE && (f = a(f), this.wildcarded && (f = '%' + f + '%'));
                  d[c.property + '__' + e] = f;
                  d.queryable = d.queryable || [
                  ];
                  d.queryable.push(c.property)
                } else OpenLayers.Console.warn('Unknown comparison filter type ' +
                                               c.type);
                break;
              case 'Logical':
                if (c.type === OpenLayers.Filter.Logical.AND) {
                  e = 0;
                  for (f = c.filters.length; e < f; e++) d = this.write(c.filters[e], d)
                    } else OpenLayers.Console.warn('Unsupported logical filter type ' + c.type);
                break;
              default:
                OpenLayers.Console.warn('Unknown filter type ' + e)
            }
            return d
          },
          CLASS_NAME: 'OpenLayers.Format.QueryStringFilter'
        })
      }();
      OpenLayers.Control.Geolocate = OpenLayers.Class(OpenLayers.Control, {
        geolocation: navigator.geolocation,
        bind: !0,
        watch: !1,
        geolocationOptions: null,
        destroy: function () {
          this.deactivate();
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        activate: function () {
          return !this.geolocation ? (this.events.triggerEvent('locationuncapable'), !1)  : OpenLayers.Control.prototype.activate.apply(this, arguments) ? (this.watch ? this.watchId = this.geolocation.watchPosition(OpenLayers.Function.bind(this.geolocate, this), OpenLayers.Function.bind(this.failure, this), this.geolocationOptions)  : this.getCurrentLocation(), !0)  : !1
        },
        deactivate: function () {
          this.active && null !== this.watchId && this.geolocation.clearWatch(this.watchId);
          return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
        },
        geolocate: function (a) {
          var b = (new OpenLayers.LonLat(a.coords.longitude, a.coords.latitude)).transform(new OpenLayers.Projection('EPSG:4326'), this.map.getProjectionObject());
          this.bind && this.map.setCenter(b);
          this.events.triggerEvent('locationupdated', {
            position: a,
            point: new OpenLayers.Geometry.Point(b.lon, b.lat)
          })
        },
        getCurrentLocation: function () {
          if (!this.active || this.watch) return !1;
          this.geolocation.getCurrentPosition(OpenLayers.Function.bind(this.geolocate, this), OpenLayers.Function.bind(this.failure, this), this.geolocationOptions);
          return !0
        },
        failure: function (a) {
          this.events.triggerEvent('locationfailed', {
            error: a
          })
        },
        CLASS_NAME: 'OpenLayers.Control.Geolocate'
      });
      OpenLayers.Tile.UTFGrid = OpenLayers.Class(OpenLayers.Tile, {
        url: null,
        utfgridResolution: 2,
        json: null,
        format: null,
        destroy: function () {
          this.clear();
          OpenLayers.Tile.prototype.destroy.apply(this, arguments)
        },
        draw: function () {
          var a = OpenLayers.Tile.prototype.draw.apply(this, arguments);
          if (a) if (this.isLoading ? (this.abortLoading(), this.events.triggerEvent('reload'))  : (this.isLoading = !0, this.events.triggerEvent('loadstart')), this.url = this.layer.getURL(this.bounds), this.layer.useJSONP) {
            var b = new OpenLayers.Protocol.Script({
              url: this.url,
              callback: function (a) {
                this.isLoading = false;
                this.events.triggerEvent('loadend');
                this.json = a.data
              },
              scope: this
            });
            b.read();
            this.request = b
          } else this.request = OpenLayers.Request.GET({
            url: this.url,
            callback: function (a) {
              this.isLoading = false;
              this.events.triggerEvent('loadend');
              a.status === 200 && this.parseData(a.responseText)
            },
            scope: this
          });
          else this.unload();
          return a
        },
        abortLoading: function () {
          this.request && (this.request.abort(), delete this.request);
          this.isLoading = !1
        },
        getFeatureInfo: function (a, b) {
          var c = null;
          if (this.json) {
            var d = this.getFeatureId(a, b);
            null !== d && (c = {
              id: d,
              data: this.json.data[d]
            })
          }
          return c
        },
        getFeatureId: function (a, b) {
          var c = null;
          if (this.json) {
            var d = this.utfgridResolution,
                d = this.indexFromCharCode(this.json.grid[Math.floor(b / d)].charCodeAt(Math.floor(a / d))),
                e = this.json.keys;
            !isNaN(d) && d in e && (c = e[d])
          }
          return c
        },
        indexFromCharCode: function (a) {
          93 <= a && a--;
          35 <= a && a--;
          return a - 32
        },
        parseData: function (a) {
          this.format || (this.format = new OpenLayers.Format.JSON);
          this.json = this.format.read(a)
        },
        clear: function () {
          this.json = null
        },
        CLASS_NAME: 'OpenLayers.Tile.UTFGrid'
      });
      OpenLayers.Control.NavigationHistory = OpenLayers.Class(OpenLayers.Control, {
        type: OpenLayers.Control.TYPE_TOGGLE,
        previous: null,
        previousOptions: null,
        next: null,
        nextOptions: null,
        limit: 50,
        autoActivate: !0,
        clearOnDeactivate: !1,
        registry: null,
        nextStack: null,
        previousStack: null,
        listeners: null,
        restoring: !1,
        initialize: function (a) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.registry = OpenLayers.Util.extend({
            moveend: this.getState
          }, this.registry);
          a = {
            trigger: OpenLayers.Function.bind(this.previousTrigger, this),
            displayClass: this.displayClass + ' ' + this.displayClass + 'Previous'
          };
          OpenLayers.Util.extend(a, this.previousOptions);
          this.previous = new OpenLayers.Control.Button(a);
          a = {
            trigger: OpenLayers.Function.bind(this.nextTrigger, this),
            displayClass: this.displayClass + ' ' + this.displayClass + 'Next'
          };
          OpenLayers.Util.extend(a, this.nextOptions);
          this.next = new OpenLayers.Control.Button(a);
          this.clear()
        },
        onPreviousChange: function (a) {
          a && !this.previous.active ? this.previous.activate()  : !a && this.previous.active && this.previous.deactivate()
        },
        onNextChange: function (a) {
          a && !this.next.active ? this.next.activate()  : !a && this.next.active && this.next.deactivate()
        },
        destroy: function () {
          OpenLayers.Control.prototype.destroy.apply(this);
          this.previous.destroy();
          this.next.destroy();
          this.deactivate();
          for (var a in this) this[a] = null
            },
        setMap: function (a) {
          this.map = a;
          this.next.setMap(a);
          this.previous.setMap(a)
        },
        draw: function () {
          OpenLayers.Control.prototype.draw.apply(this, arguments);
          this.next.draw();
          this.previous.draw()
        },
        previousTrigger: function () {
          var a = this.previousStack.shift(),
              b = this.previousStack.shift();
          void 0 != b ? (this.nextStack.unshift(a), this.previousStack.unshift(b), this.restoring = !0, this.restore(b), this.restoring = !1, this.onNextChange(this.nextStack[0], this.nextStack.length), this.onPreviousChange(this.previousStack[1], this.previousStack.length - 1))  : this.previousStack.unshift(a);
          return b
        },
        nextTrigger: function () {
          var a = this.nextStack.shift();
          void 0 != a && (this.previousStack.unshift(a), this.restoring = !0, this.restore(a), this.restoring = !1, this.onNextChange(this.nextStack[0], this.nextStack.length), this.onPreviousChange(this.previousStack[1], this.previousStack.length - 1));
          return a
        },
        clear: function () {
          this.previousStack = [
          ];
          this.previous.deactivate();
          this.nextStack = [
          ];
          this.next.deactivate()
        },
        getState: function () {
          return {
            center: this.map.getCenter(),
            resolution: this.map.getResolution(),
            projection: this.map.getProjectionObject(),
            units: this.map.getProjectionObject().getUnits() || this.map.units || this.map.baseLayer.units
          }
        },
        restore: function (a) {
          var b,
              c;
          if (this.map.getProjectionObject() ==
              a.projection) c = this.map.getZoomForResolution(a.resolution),
            b = a.center;
          else {
            b = a.center.clone();
            b.transform(a.projection, this.map.getProjectionObject());
            c = a.units;
            var d = this.map.getProjectionObject().getUnits() || this.map.units || this.map.baseLayer.units;
            c = this.map.getZoomForResolution((c && d ? OpenLayers.INCHES_PER_UNIT[c] / OpenLayers.INCHES_PER_UNIT[d] : 1) * a.resolution)
          }
          this.map.setCenter(b, c)
        },
        setListeners: function () {
          this.listeners = {
          };
          for (var a in this.registry) this.listeners[a] = OpenLayers.Function.bind(function () {
            if (!this.restoring) {
              this.previousStack.unshift(this.registry[a].apply(this, arguments));
              if (1 < this.previousStack.length) this.onPreviousChange(this.previousStack[1], this.previousStack.length - 1);
              this.previousStack.length > this.limit + 1 && this.previousStack.pop();
              0 < this.nextStack.length && (this.nextStack = [
              ], this.onNextChange(null, 0))
            }
            return !0
          }, this)
            },
        activate: function () {
          var a = !1;
          if (this.map && OpenLayers.Control.prototype.activate.apply(this)) {
            null == this.listeners && this.setListeners();
            for (var b in this.listeners) this.map.events.register(b, this, this.listeners[b]);
            a = !0;
            0 == this.previousStack.length && this.initStack()
          }
          return a
        },
        initStack: function () {
          this.map.getCenter() && this.listeners.moveend()
        },
        deactivate: function () {
          var a = !1;
          if (this.map && OpenLayers.Control.prototype.deactivate.apply(this)) {
            for (var b in this.listeners) this.map.events.unregister(b, this, this.listeners[b]);
            this.clearOnDeactivate && this.clear();
            a = !0
          }
          return a
        },
        CLASS_NAME: 'OpenLayers.Control.NavigationHistory'
      });
      OpenLayers.Protocol.HTTP = OpenLayers.Class(OpenLayers.Protocol, {
        url: null,
        headers: null,
        params: null,
        callback: null,
        scope: null,
        readWithPOST: !1,
        updateWithPOST: !1,
        deleteWithPOST: !1,
        wildcarded: !1,
        srsInBBOX: !1,
        initialize: function (a) {
          a = a || {
          };
          this.params = {
          };
          this.headers = {
          };
          OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
          if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
            var b = new OpenLayers.Format.QueryStringFilter({
              wildcarded: this.wildcarded,
              srsInBBOX: this.srsInBBOX
            });
            this.filterToParams = function (a, d) {
              return b.write(a, d)
            }
          }
        },
        destroy: function () {
          this.headers = this.params = null;
          OpenLayers.Protocol.prototype.destroy.apply(this)
        },
        read: function (a) {
          OpenLayers.Protocol.prototype.read.apply(this, arguments);
          a = a || {
          };
          a.params = OpenLayers.Util.applyDefaults(a.params, this.options.params);
          a = OpenLayers.Util.applyDefaults(a, this.options);
          a.filter && this.filterToParams && (a.params = this.filterToParams(a.filter, a.params));
          var b = void 0 !== a.readWithPOST ? a.readWithPOST : this.readWithPOST,
            c = new OpenLayers.Protocol.Response({
            requestType: 'read'
          });
          b ? (b = a.headers || {
          }, b['Content-Type'] = 'application/x-www-form-urlencoded', c.priv = OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, c, a),
            data: OpenLayers.Util.getParameterString(a.params),
            headers: b
          }))  : c.priv = OpenLayers.Request.GET({
            url: a.url,
            callback: this.createCallback(this.handleRead, c, a),
            params: a.params,
            headers: a.headers
          });
          return c
        },
        handleRead: function (a, b) {
          this.handleResponse(a, b)
        },
        create: function (a, b) {
          var b = OpenLayers.Util.applyDefaults(b, this.options),
              c = new OpenLayers.Protocol.Response({
                reqFeatures: a,
                requestType: 'create'
              });
          c.priv = OpenLayers.Request.POST({
            url: b.url,
            callback: this.createCallback(this.handleCreate, c, b),
            headers: b.headers,
            data: this.format.write(a)
          });
          return c
        },
        handleCreate: function (a, b) {
          this.handleResponse(a, b)
        },
        update: function (a, b) {
          var b = b || {
          },
              c = b.url || a.url || this.options.url + '/' + a.fid,
              b = OpenLayers.Util.applyDefaults(b, this.options),
              d = new OpenLayers.Protocol.Response({
                reqFeatures: a,
                requestType: 'update'
              });
          d.priv = OpenLayers.Request[this.updateWithPOST ? 'POST' : 'PUT']({
            url: c,
            callback: this.createCallback(this.handleUpdate, d, b),
            headers: b.headers,
            data: this.format.write(a)
          });
          return d
        },
        handleUpdate: function (a, b) {
          this.handleResponse(a, b)
        },
        'delete': function (a, b) {
          var b = b || {
          },
              c = b.url || a.url || this.options.url + '/' + a.fid,
              b = OpenLayers.Util.applyDefaults(b, this.options),
              d = new OpenLayers.Protocol.Response({
                reqFeatures: a,
                requestType: 'delete'
              }),
              e = this.deleteWithPOST ? 'POST' : 'DELETE',
              c = {
                url: c,
                callback: this.createCallback(this.handleDelete, d, b),
                headers: b.headers
              };
          this.deleteWithPOST && (c.data = this.format.write(a));
          d.priv = OpenLayers.Request[e](c);
          return d
        },
        handleDelete: function (a, b) {
          this.handleResponse(a, b)
        },
        handleResponse: function (a, b) {
          var c = a.priv;
          b.callback && (200 <= c.status && 300 > c.status ? ('delete' != a.requestType && (a.features = this.parseFeatures(c)), a.code = OpenLayers.Protocol.Response.SUCCESS)  : a.code = OpenLayers.Protocol.Response.FAILURE, b.callback.call(b.scope, a))
        },
        parseFeatures: function (a) {
          var b = a.responseXML;
          if (!b || !b.documentElement) b = a.responseText;
          return !b || 0 >= b.length ? null : this.format.read(b)
        },
        commit: function (a, b) {
          function c(a) {
            for (var b = a.features ? a.features.length : 0, c = Array(b), e = 0; e < b; ++e) c[e] = a.features[e].fid;
            o.insertIds = c;
            d.apply(this, [
              a
            ])
          }
          function d(a) {
            this.callUserCallback(a, b);
            n = n && a.success();
            f++;
            f >= m && b.callback && (o.code = n ? OpenLayers.Protocol.Response.SUCCESS : OpenLayers.Protocol.Response.FAILURE, b.callback.apply(b.scope, [
              o
            ]))
          }
          var b = OpenLayers.Util.applyDefaults(b, this.options),
              e = [
              ],
              f = 0,
              g = {
              };
          g[OpenLayers.State.INSERT] = [
          ];
          g[OpenLayers.State.UPDATE] = [
          ];
          g[OpenLayers.State.DELETE] = [
          ];
          for (var h, i, j = [
          ], k = 0, l = a.length; k < l; ++k) if (h = a[k], i = g[h.state]) i.push(h),
            j.push(h);
          var m = (0 < g[OpenLayers.State.INSERT].length ? 1 : 0) + g[OpenLayers.State.UPDATE].length + g[OpenLayers.State.DELETE].length,
              n = !0,
              o = new OpenLayers.Protocol.Response({
                reqFeatures: j
              });
          h = g[OpenLayers.State.INSERT];
          0 < h.length && e.push(this.create(h, OpenLayers.Util.applyDefaults({
            callback: c,
            scope: this
          }, b.create)));
          h = g[OpenLayers.State.UPDATE];
          for (k = h.length - 1; 0 <= k; --k) e.push(this.update(h[k], OpenLayers.Util.applyDefaults({
            callback: d,
            scope: this
          }, b.update)));
          h = g[OpenLayers.State.DELETE];
          for (k = h.length - 1; 0 <= k; --k) e.push(this['delete'](h[k], OpenLayers.Util.applyDefaults({
            callback: d,
            scope: this
          }, b['delete'])));
          return e
        },
        abort: function (a) {
          a && a.priv.abort()
        },
        callUserCallback: function (a, b) {
          var c = b[a.requestType];
          c && c.callback && c.callback.call(c.scope, a)
        },
        CLASS_NAME: 'OpenLayers.Protocol.HTTP'
      });
      OpenLayers.Strategy.Cluster = OpenLayers.Class(OpenLayers.Strategy, {
        distance: 20,
        threshold: null,
        features: null,
        clusters: null,
        clustering: !1,
        resolution: null,
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.call(this);
          if (a) this.layer.events.on({
            beforefeaturesadded: this.cacheFeatures,
            moveend: this.cluster,
            scope: this
          });
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && (this.clearCache(), this.layer.events.un({
            beforefeaturesadded: this.cacheFeatures,
            moveend: this.cluster,
            scope: this
          }));
          return a
        },
        cacheFeatures: function (a) {
          var b = !0;
          this.clustering || (this.clearCache(), this.features = a.features, this.cluster(), b = !1);
          return b
        },
        clearCache: function () {
          this.features = null
        },
        cluster: function (a) {
          if ((!a || a.zoomChanged) && this.features) if (a = this.layer.map.getResolution(), a != this.resolution || !this.clustersExist()) {
            this.resolution = a;
            for (var a = [
            ], b, c, d, e = 0; e < this.features.length; ++e) if (b = this.features[e], b.geometry) {
              c = !1;
              for (var f = a.length - 1; 0 <= f; --f) if (d = a[f], this.shouldCluster(d, b)) {
                this.addToCluster(d, b);
                c = !0;
                break
              }
              c || a.push(this.createCluster(this.features[e]))
            }
            this.layer.removeAllFeatures();
            if (0 < a.length) {
              if (1 < this.threshold) {
                b = a.slice();
                a = [
                ];
                e = 0;
                for (d = b.length; e < d; ++e) c = b[e],
                  c.attributes.count < this.threshold ? Array.prototype.push.apply(a, c.cluster)  : a.push(c)
                  }
              this.clustering = !0;
              this.layer.addFeatures(a);
              this.clustering = !1
            }
            this.clusters = a
          }
        },
        clustersExist: function () {
          var a = !1;
          if (this.clusters && 0 < this.clusters.length && this.clusters.length == this.layer.features.length) for (var a = !0, b = 0; b < this.clusters.length; ++b) if (this.clusters[b] !=
      this.layer.features[b]) {
            a = !1;
            break
          }
          return a
        },
        shouldCluster: function (a, b) {
          var c = a.geometry.getBounds().getCenterLonLat(),
              d = b.geometry.getBounds().getCenterLonLat();
          return Math.sqrt(Math.pow(c.lon - d.lon, 2) + Math.pow(c.lat - d.lat, 2)) / this.resolution <= this.distance
        },
        addToCluster: function (a, b) {
          a.cluster.push(b);
          a.attributes.count += 1
        },
        createCluster: function (a) {
          var b = a.geometry.getBounds().getCenterLonLat(),
              b = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.lon, b.lat), {
                count: 1
              });
          b.cluster = [
            a
          ];
          return b
        },
        CLASS_NAME: 'OpenLayers.Strategy.Cluster'
      });
      OpenLayers.Strategy.Filter = OpenLayers.Class(OpenLayers.Strategy, {
        filter: null,
        cache: null,
        caching: !1,
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.apply(this, arguments);
          a && (this.cache = [
          ], this.layer.events.on({
            beforefeaturesadded: this.handleAdd,
            beforefeaturesremoved: this.handleRemove,
            scope: this
          }));
          return a
        },
        deactivate: function () {
          this.cache = null;
          this.layer && this.layer.events && this.layer.events.un({
            beforefeaturesadded: this.handleAdd,
            beforefeaturesremoved: this.handleRemove,
            scope: this
          });
          return OpenLayers.Strategy.prototype.deactivate.apply(this, arguments)
        },
        handleAdd: function (a) {
          if (!this.caching && this.filter) {
            var b = a.features;
            a.features = [
            ];
            for (var c, d = 0, e = b.length; d < e; ++d) c = b[d],
              this.filter.evaluate(c) ? a.features.push(c)  : this.cache.push(c)
              }
        },
        handleRemove: function () {
          this.caching || (this.cache = [
          ])
        },
        setFilter: function (a) {
          this.filter = a;
          a = this.cache;
          this.cache = [
          ];
          this.handleAdd({
            features: this.layer.features
          });
          0 < this.cache.length && (this.caching = !0, this.layer.removeFeatures(this.cache.slice()), this.caching = !1);
          0 < a.length && (a = {
            features: a
          }, this.handleAdd(a), 0 < a.features.length && (this.caching = !0, this.layer.addFeatures(a.features), this.caching = !1))
        },
        CLASS_NAME: 'OpenLayers.Strategy.Filter'
      });
      OpenLayers.Protocol.SOS = function (a) {
        var a = OpenLayers.Util.applyDefaults(a, OpenLayers.Protocol.SOS.DEFAULTS),
            b = OpenLayers.Protocol.SOS['v' + a.version.replace(/\./g, '_')];
        if (!b) throw 'Unsupported SOS version: ' + a.version;
        return new b(a)
      };
      OpenLayers.Protocol.SOS.DEFAULTS = {
        version: '1.0.0'
      };
      OpenLayers.Format.WFSDescribeFeatureType = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          xsd: 'http://www.w3.org/2001/XMLSchema'
        },
        readers: {
          xsd: {
            schema: function (a, b) {
              var c = [
              ],
                  d = {
                  };
              this.readChildNodes(a, {
                complexTypes: c,
                customTypes: d
              });
              for (var e = a.attributes, f, g, h = 0, i = e.length; h < i; ++h) f = e[h],
                g = f.name,
                0 == g.indexOf('xmlns') ? this.setNamespace(g.split(':') [1] || '', f.value)  : b[g] = f.value;
              b.featureTypes = c;
              b.targetPrefix = this.namespaceAlias[b.targetNamespace];
              h = 0;
              for (i = c.length; h < i; ++h) e = c[h],
                f = d[e.typeName],
                d[e.typeName] && (e.typeName = f.name)
                },
            complexType: function (a, b) {
              var c = {
                typeName: a.getAttribute('name')
              };
              this.readChildNodes(a, c);
              b.complexTypes.push(c)
            },
            complexContent: function (a, b) {
              this.readChildNodes(a, b)
            },
            extension: function (a, b) {
              this.readChildNodes(a, b)
            },
            sequence: function (a, b) {
              var c = {
                elements: [
                ]
              };
              this.readChildNodes(a, c);
              b.properties = c.elements
            },
            element: function (a, b) {
              if (b.elements) {
                for (var c = {
                }, d = a.attributes, e, f = 0, g = d.length; f < g; ++f) e = d[f],
                  c[e.name] = e.value;
                d = c.type;
                d || (d = {
                }, this.readChildNodes(a, d), c.restriction = d, c.type = d.base);
                c.localType = (d.base || d).split(':').pop();
                b.elements.push(c)
              }
              b.complexTypes && (d = a.getAttribute('type'), c = d.split(':').pop(), b.customTypes[c] = {
                name: a.getAttribute('name'),
                type: d
              })
            },
            simpleType: function (a, b) {
              this.readChildNodes(a, b)
            },
            restriction: function (a, b) {
              b.base = a.getAttribute('base');
              this.readRestriction(a, b)
            }
          }
        },
        readRestriction: function (a, b) {
          for (var c = a.childNodes, d, e, f = 0, g = c.length; f < g; ++f) d = c[f],
            1 == d.nodeType && (e = d.nodeName.split(':').pop(), d = d.getAttribute('value'), b[e] ? ('string' == typeof b[e] && (b[e] = [
            b[e]
          ]), b[e].push(d))  : b[e] = d)
            },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        CLASS_NAME: 'OpenLayers.Format.WFSDescribeFeatureType'
      });
      OpenLayers.Format.GeoRSS = OpenLayers.Class(OpenLayers.Format.XML, {
        rssns: 'http://backend.userland.com/rss2',
        featureNS: 'http://mapserver.gis.umn.edu/mapserver',
        georssns: 'http://www.georss.org/georss',
        geons: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        featureTitle: 'Untitled',
        featureDescription: 'No Description',
        gmlParser: null,
        xy: !1,
        createGeometryFromItem: function (a) {
          var b = this.getElementsByTagNameNS(a, this.georssns, 'point'),
              c = this.getElementsByTagNameNS(a, this.geons, 'lat'),
              d = this.getElementsByTagNameNS(a, this.geons, 'long'),
              e = this.getElementsByTagNameNS(a, this.georssns, 'line'),
              f = this.getElementsByTagNameNS(a, this.georssns, 'polygon'),
              g = this.getElementsByTagNameNS(a, this.georssns, 'where'),
              a = this.getElementsByTagNameNS(a, this.georssns, 'box');
          if (0 < b.length || 0 < c.length && 0 < d.length) {
            0 < b.length ? (c = OpenLayers.String.trim(b[0].firstChild.nodeValue).split(/\s+/), 2 != c.length && (c = OpenLayers.String.trim(b[0].firstChild.nodeValue).split(/\s*,\s*/)))  : c = [
              parseFloat(c[0].firstChild.nodeValue),
              parseFloat(d[0].firstChild.nodeValue)
            ];
            var h = new OpenLayers.Geometry.Point(c[1], c[0])
            } else if (0 < e.length) {
              c = OpenLayers.String.trim(this.getChildValue(e[0])).split(/\s+/);
              d = [
              ];
              e = 0;
              for (f = c.length; e < f; e += 2) b = new OpenLayers.Geometry.Point(c[e + 1], c[e]),
                d.push(b);
              h = new OpenLayers.Geometry.LineString(d)
            } else if (0 < f.length) {
              c = OpenLayers.String.trim(this.getChildValue(f[0])).split(/\s+/);
              d = [
              ];
              e = 0;
              for (f = c.length; e < f; e += 2) b = new OpenLayers.Geometry.Point(c[e + 1], c[e]),
                d.push(b);
              h = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(d)])
            } else 0 <
              g.length ? (this.gmlParser || (this.gmlParser = new OpenLayers.Format.GML({
              xy: this.xy
            })), h = this.gmlParser.parseFeature(g[0]).geometry)  : 0 < a.length && (c = OpenLayers.String.trim(a[0].firstChild.nodeValue).split(/\s+/), d = [
            ], 3 < c.length && (b = new OpenLayers.Geometry.Point(c[1], c[0]), d.push(b), b = new OpenLayers.Geometry.Point(c[1], c[2]), d.push(b), b = new OpenLayers.Geometry.Point(c[3], c[2]), d.push(b), b = new OpenLayers.Geometry.Point(c[3], c[0]), d.push(b), b = new OpenLayers.Geometry.Point(c[1], c[0]), d.push(b)), h = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(d)]));
          h && (this.internalProjection && this.externalProjection) && h.transform(this.externalProjection, this.internalProjection);
          return h
        },
        createFeatureFromItem: function (a) {
          var b = this.createGeometryFromItem(a),
              c = this._getChildValue(a, '*', 'title', this.featureTitle),
              d = this._getChildValue(a, '*', 'description', this._getChildValue(a, '*', 'content', this._getChildValue(a, '*', 'summary', this.featureDescription))),
              e = this._getChildValue(a, '*', 'link');
          if (!e) try {
            e = this.getElementsByTagNameNS(a, '*', 'link') [0].getAttribute('href')
          } catch (f) {
            e = null
          }
          a = this._getChildValue(a, '*', 'id', null);
          b = new OpenLayers.Feature.Vector(b, {
            title: c,
            description: d,
            link: e
          });
          b.fid = a;
          return b
        },
        _getChildValue: function (a, b, c, d) {
          return (a = this.getElementsByTagNameNS(a, b, c)) && a[0] && a[0].firstChild && a[0].firstChild.nodeValue ? this.getChildValue(a[0])  : void 0 == d ? '' : d
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          var b = null,
              b = this.getElementsByTagNameNS(a, '*', 'item');
          0 == b.length && (b = this.getElementsByTagNameNS(a, '*', 'entry'));
          for (var a = b.length, c = Array(a), d = 0; d < a; d++) c[d] = this.createFeatureFromItem(b[d]);
          return c
        },
        write: function (a) {
          var b;
          if (OpenLayers.Util.isArray(a)) {
            b = this.createElementNS(this.rssns, 'rss');
            for (var c = 0, d = a.length; c < d; c++) b.appendChild(this.createFeatureXML(a[c]))
              } else b = this.createFeatureXML(a);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ])
        },
        createFeatureXML: function (a) {
          var b = this.buildGeometryNode(a.geometry),
              c = this.createElementNS(this.rssns, 'item'),
              d = this.createElementNS(this.rssns, 'title');
          d.appendChild(this.createTextNode(a.attributes.title ? a.attributes.title : ''));
          var e = this.createElementNS(this.rssns, 'description');
          e.appendChild(this.createTextNode(a.attributes.description ? a.attributes.description : ''));
          c.appendChild(d);
          c.appendChild(e);
          a.attributes.link && (d = this.createElementNS(this.rssns, 'link'), d.appendChild(this.createTextNode(a.attributes.link)), c.appendChild(d));
          for (var f in a.attributes) 'link' == f || ('title' == f || 'description' == f) || (d = this.createTextNode(a.attributes[f]), e = f, - 1 !=
                                                                                              f.search(':') && (e = f.split(':') [1]), e = this.createElementNS(this.featureNS, 'feature:' + e), e.appendChild(d), c.appendChild(e));
          c.appendChild(b);
          return c
        },
        buildGeometryNode: function (a) {
          this.internalProjection && this.externalProjection && (a = a.clone(), a.transform(this.internalProjection, this.externalProjection));
          var b;
          if ('OpenLayers.Geometry.Polygon' == a.CLASS_NAME) b = this.createElementNS(this.georssns, 'georss:polygon'),
            b.appendChild(this.buildCoordinatesNode(a.components[0]));
          else if ('OpenLayers.Geometry.LineString' ==
                   a.CLASS_NAME) b = this.createElementNS(this.georssns, 'georss:line'),
            b.appendChild(this.buildCoordinatesNode(a));
          else if ('OpenLayers.Geometry.Point' == a.CLASS_NAME) b = this.createElementNS(this.georssns, 'georss:point'),
            b.appendChild(this.buildCoordinatesNode(a));
          else throw 'Couldn\'t parse ' + a.CLASS_NAME;
          return b
        },
        buildCoordinatesNode: function (a) {
          var b = null;
          a.components && (b = a.components);
          if (b) {
            for (var a = b.length, c = Array(a), d = 0; d < a; d++) c[d] = b[d].y + ' ' + b[d].x;
            b = c.join(' ')
          } else b = a.y + ' ' + a.x;
          return this.createTextNode(b)
        },
        CLASS_NAME: 'OpenLayers.Format.GeoRSS'
      });
      OpenLayers.Format.WPSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.0.0',
        CLASS_NAME: 'OpenLayers.Format.WPSCapabilities'
      });
      OpenLayers.Format.WPSCapabilities.v1_0_0 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          wps: 'http://www.opengis.net/wps/1.0.0',
          xlink: 'http://www.w3.org/1999/xlink'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ])
        },
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          return b
        },
        readers: {
          wps: {
            Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            ProcessOfferings: function (a, b) {
              b.processOfferings = {
              };
              this.readChildNodes(a, b.processOfferings)
            },
            Process: function (a, b) {
              var c = {
                processVersion: this.getAttributeNS(a, this.namespaces.wps, 'processVersion')
              };
              this.readChildNodes(a, c);
              b[c.identifier] = c
            },
            Languages: function (a, b) {
              b.languages = [
              ];
              this.readChildNodes(a, b.languages)
            },
            Default: function (a, b) {
              var c = {
                isDefault: !0
              };
              this.readChildNodes(a, c);
              b.push(c)
            },
            Supported: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.push(c)
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WPSCapabilities.v1_0_0'
      });
      OpenLayers.Control.PinchZoom = OpenLayers.Class(OpenLayers.Control, {
        type: OpenLayers.Control.TYPE_TOOL,
        containerCenter: null,
        pinchOrigin: null,
        currentCenter: null,
        autoActivate: !0,
        initialize: function (a) {
          OpenLayers.Control.prototype.initialize.apply(this, arguments);
          this.handler = new OpenLayers.Handler.Pinch(this, {
            start: this.pinchStart,
            move: this.pinchMove,
            done: this.pinchDone
          }, this.handlerOptions)
        },
        activate: function () {
          var a = OpenLayers.Control.prototype.activate.apply(this, arguments);
          a && (this.map.events.on({
            moveend: this.updateContainerCenter,
            scope: this
          }), this.updateContainerCenter());
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Control.prototype.deactivate.apply(this, arguments);
          this.map && this.map.events && this.map.events.un({
            moveend: this.updateContainerCenter,
            scope: this
          });
          return a
        },
        updateContainerCenter: function () {
          var a = this.map.layerContainerDiv;
          this.containerCenter = {
            x: parseInt(a.style.left, 10) + 50,
            y: parseInt(a.style.top, 10) + 50
          }
        },
        pinchStart: function (a) {
          this.currentCenter = this.pinchOrigin = a.xy
        },
        pinchMove: function (a, b) {
          var c = b.scale,
              d = this.containerCenter,
              e = this.pinchOrigin,
              f = a.xy,
              g = Math.round(f.x - e.x + (c - 1) * (d.x - e.x)),
              d = Math.round(f.y - e.y + (c - 1) * (d.y - e.y));
          this.applyTransform('translate(' + g + 'px, ' + d + 'px) scale(' + c + ')');
          this.currentCenter = f
        },
        applyTransform: function (a) {
          var b = this.map.layerContainerDiv.style;
          b['-webkit-transform'] = a;
          b['-moz-transform'] = a
        },
        pinchDone: function (a, b, c) {
          this.applyTransform('');
          a = this.map.getZoomForResolution(this.map.getResolution() / c.scale, !0);
          if (a !== this.map.getZoom() || !this.currentCenter.equals(this.pinchOrigin)) {
            var b = this.map.getResolutionForZoom(a),
                c = this.map.getLonLatFromPixel(this.pinchOrigin),
                d = this.currentCenter,
                e = this.map.getSize();
            c.lon += b * (e.w / 2 - d.x);
            c.lat -= b * (e.h / 2 - d.y);
            this.map.div.clientWidth = this.map.div.clientWidth;
            this.map.setCenter(c, a)
          }
        },
        CLASS_NAME: 'OpenLayers.Control.PinchZoom'
      });
      OpenLayers.Control.TouchNavigation = OpenLayers.Class(OpenLayers.Control, {
        dragPan: null,
        dragPanOptions: null,
        pinchZoom: null,
        pinchZoomOptions: null,
        clickHandlerOptions: null,
        documentDrag: !1,
        autoActivate: !0,
        initialize: function (a) {
          this.handlers = {
          };
          OpenLayers.Control.prototype.initialize.apply(this, arguments)
        },
        destroy: function () {
          this.deactivate();
          this.dragPan && this.dragPan.destroy();
          this.dragPan = null;
          this.pinchZoom && (this.pinchZoom.destroy(), delete this.pinchZoom);
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        activate: function () {
          return OpenLayers.Control.prototype.activate.apply(this, arguments) ? (this.dragPan.activate(), this.handlers.click.activate(), this.pinchZoom.activate(), !0)  : !1
        },
        deactivate: function () {
          return OpenLayers.Control.prototype.deactivate.apply(this, arguments) ? (this.dragPan.deactivate(), this.handlers.click.deactivate(), this.pinchZoom.deactivate(), !0)  : !1
        },
        draw: function () {
          var a = {
            click: this.defaultClick,
            dblclick: this.defaultDblClick
          },
              b = OpenLayers.Util.extend({
                'double': !0,
                stopDouble: !0,
                pixelTolerance: 2
              }, this.clickHandlerOptions);
          this.handlers.click = new OpenLayers.Handler.Click(this, a, b);
          this.dragPan = new OpenLayers.Control.DragPan(OpenLayers.Util.extend({
            map: this.map,
            documentDrag: this.documentDrag
          }, this.dragPanOptions));
          this.dragPan.draw();
          this.pinchZoom = new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({
            map: this.map
          }, this.pinchZoomOptions))
        },
        defaultClick: function (a) {
          a.lastTouches && 2 == a.lastTouches.length && this.map.zoomOut()
        },
        defaultDblClick: function (a) {
          this.map.setCenter(this.map.getLonLatFromViewPortPx(a.xy), this.map.zoom + 1)
        },
        CLASS_NAME: 'OpenLayers.Control.TouchNavigation'
      });
      OpenLayers.Style2 = OpenLayers.Class({
        id: null,
        name: null,
        title: null,
        description: null,
        layerName: null,
        isDefault: !1,
        rules: null,
        initialize: function (a) {
          OpenLayers.Util.extend(this, a);
          this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + '_')
        },
        destroy: function () {
          for (var a = 0, b = this.rules.length; a < b; a++) this.rules[a].destroy();
          delete this.rules
        },
        clone: function () {
          var a = OpenLayers.Util.extend({
          }, this);
          if (this.rules) {
            a.rules = [
            ];
            for (var b = 0, c = this.rules.length; b < c; ++b) a.rules.push(this.rules[b].clone())
              }
          return new OpenLayers.Style2(a)
        },
        CLASS_NAME: 'OpenLayers.Style2'
      });
      OpenLayers.Format.WFS = OpenLayers.Class(OpenLayers.Format.GML, {
        layer: null,
        wfsns: 'http://www.opengis.net/wfs',
        ogcns: 'http://www.opengis.net/ogc',
        initialize: function (a, b) {
          OpenLayers.Format.GML.prototype.initialize.apply(this, [
            a
          ]);
          this.layer = b;
          this.layer.featureNS && (this.featureNS = this.layer.featureNS);
          this.layer.options.geometry_column && (this.geometryName = this.layer.options.geometry_column);
          this.layer.options.typename && (this.featureName = this.layer.options.typename)
        },
        write: function (a) {
          var b = this.createElementNS(this.wfsns, 'wfs:Transaction');
          b.setAttribute('version', '1.0.0');
          b.setAttribute('service', 'WFS');
          for (var c = 0; c < a.length; c++) switch (a[c].state) {
            case OpenLayers.State.INSERT:
              b.appendChild(this.insert(a[c]));
              break;
            case OpenLayers.State.UPDATE:
              b.appendChild(this.update(a[c]));
              break;
            case OpenLayers.State.DELETE:
              b.appendChild(this.remove(a[c]))
          }
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ])
        },
        createFeatureXML: function (a) {
          var b = this.buildGeometryNode(a.geometry),
              c = this.createElementNS(this.featureNS, 'feature:' +
                                       this.geometryName);
          c.appendChild(b);
          b = this.createElementNS(this.featureNS, 'feature:' + this.featureName);
          b.appendChild(c);
          for (var d in a.attributes) {
            var c = this.createTextNode(a.attributes[d]),
                e = d;
            - 1 != d.search(':') && (e = d.split(':') [1]);
            e = this.createElementNS(this.featureNS, 'feature:' + e);
            e.appendChild(c);
            b.appendChild(e)
          }
          return b
        },
        insert: function (a) {
          var b = this.createElementNS(this.wfsns, 'wfs:Insert');
          b.appendChild(this.createFeatureXML(a));
          return b
        },
        update: function (a) {
          a.fid || OpenLayers.Console.userError(OpenLayers.i18n('noFID'));
          var b = this.createElementNS(this.wfsns, 'wfs:Update');
          b.setAttribute('typeName', this.featurePrefix + ':' + this.featureName);
          b.setAttribute('xmlns:' + this.featurePrefix, this.featureNS);
          var c = this.createElementNS(this.wfsns, 'wfs:Property'),
              d = this.createElementNS(this.wfsns, 'wfs:Name'),
              e = this.createTextNode(this.geometryName);
          d.appendChild(e);
          c.appendChild(d);
          d = this.createElementNS(this.wfsns, 'wfs:Value');
          e = this.buildGeometryNode(a.geometry);
          a.layer && e.setAttribute('srsName', a.layer.projection.getCode());
          d.appendChild(e);
          c.appendChild(d);
          b.appendChild(c);
          for (var f in a.attributes) c = this.createElementNS(this.wfsns, 'wfs:Property'),
            d = this.createElementNS(this.wfsns, 'wfs:Name'),
            d.appendChild(this.createTextNode(f)),
            c.appendChild(d),
            d = this.createElementNS(this.wfsns, 'wfs:Value'),
            d.appendChild(this.createTextNode(a.attributes[f])),
            c.appendChild(d),
            b.appendChild(c);
          c = this.createElementNS(this.ogcns, 'ogc:Filter');
          f = this.createElementNS(this.ogcns, 'ogc:FeatureId');
          f.setAttribute('fid', a.fid);
          c.appendChild(f);
          b.appendChild(c);
          return b
        },
        remove: function (a) {
          if (!a.fid) return OpenLayers.Console.userError(OpenLayers.i18n('noFID')),
            !1;
          var b = this.createElementNS(this.wfsns, 'wfs:Delete');
          b.setAttribute('typeName', this.featurePrefix + ':' + this.featureName);
          b.setAttribute('xmlns:' + this.featurePrefix, this.featureNS);
          var c = this.createElementNS(this.ogcns, 'ogc:Filter'),
              d = this.createElementNS(this.ogcns, 'ogc:FeatureId');
          d.setAttribute('fid', a.fid);
          c.appendChild(d);
          b.appendChild(c);
          return b
        },
        destroy: function () {
          this.layer = null
        },
        CLASS_NAME: 'OpenLayers.Format.WFS'
      });
      OpenLayers.Format.SLD.v1_0_0_GeoServer = OpenLayers.Class(OpenLayers.Format.SLD.v1_0_0, {
        version: '1.0.0',
        profile: 'GeoServer',
        readers: OpenLayers.Util.applyDefaults({
          sld: OpenLayers.Util.applyDefaults({
            Priority: function (a, b) {
              var c = this.readers.ogc._expression.call(this, a);
              c && (b.priority = c)
            },
            VendorOption: function (a, b) {
              b.vendorOptions || (b.vendorOptions = {
              });
              b.vendorOptions[a.getAttribute('name')] = this.getChildValue(a)
            }
          }, OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld)
        }, OpenLayers.Format.SLD.v1_0_0.prototype.readers),
        writers: OpenLayers.Util.applyDefaults({
          sld: OpenLayers.Util.applyDefaults({
            Priority: function (a) {
              return this.writers.sld._OGCExpression.call(this, 'sld:Priority', a)
            },
            VendorOption: function (a) {
              return this.createElementNSPlus('sld:VendorOption', {
                attributes: {
                  name: a.name
                },
                value: a.value
              })
            },
            TextSymbolizer: function (a) {
              var b = OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.TextSymbolizer.apply(this, arguments);
              !1 !== a.graphic && (a.externalGraphic || a.graphicName) && this.writeNode('Graphic', a, b);
              'priority' in a && this.writeNode('Priority', a.priority, b);
              return this.addVendorOptions(b, a)
            },
            PointSymbolizer: function (a) {
              return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.PointSymbolizer.apply(this, arguments), a)
            },
            LineSymbolizer: function (a) {
              return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.LineSymbolizer.apply(this, arguments), a)
            },
            PolygonSymbolizer: function (a) {
              return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.PolygonSymbolizer.apply(this, arguments), a)
            }
          }, OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld)
        }, OpenLayers.Format.SLD.v1_0_0.prototype.writers),
        addVendorOptions: function (a, b) {
          if (b.vendorOptions) for (var c in b.vendorOptions) this.writeNode('VendorOption', {
            name: c,
            value: b.vendorOptions[c]
          }, a);
          return a
        },
        CLASS_NAME: 'OpenLayers.Format.SLD.v1_0_0_GeoServer'
      });
      OpenLayers.Layer.Boxes = OpenLayers.Class(OpenLayers.Layer.Markers, {
        drawMarker: function (a) {
          var b = this.map.getLayerPxFromLonLat({
            lon: a.bounds.left,
            lat: a.bounds.top
          }),
              c = this.map.getLayerPxFromLonLat({
                lon: a.bounds.right,
                lat: a.bounds.bottom
              });
          null == c || null == b ? a.display(!1)  : (b = a.draw(b, {
            w: Math.max(1, c.x - b.x),
            h: Math.max(1, c.y - b.y)
          }), a.drawn || (this.div.appendChild(b), a.drawn = !0))
        },
        removeMarker: function (a) {
          OpenLayers.Util.removeItem(this.markers, a);
          null != a.div && a.div.parentNode == this.div && this.div.removeChild(a.div)
        },
        CLASS_NAME: 'OpenLayers.Layer.Boxes'
      });
      OpenLayers.Format.WFSCapabilities.v1_0_0 = OpenLayers.Class(OpenLayers.Format.WFSCapabilities.v1, {
        readers: {
          wfs: OpenLayers.Util.applyDefaults({
            Service: function (a, b) {
              b.service = {
              };
              this.readChildNodes(a, b.service)
            },
            Fees: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.fees = c)
            },
            AccessConstraints: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.accessConstraints = c)
            },
            OnlineResource: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.onlineResource = c)
            },
            Keywords: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.keywords = c.split(', '))
            },
            Capability: function (a, b) {
              b.capability = {
              };
              this.readChildNodes(a, b.capability)
            },
            Request: function (a, b) {
              b.request = {
              };
              this.readChildNodes(a, b.request)
            },
            GetFeature: function (a, b) {
              b.getfeature = {
                href: {
                },
                formats: [
                ]
              };
              this.readChildNodes(a, b.getfeature)
            },
            ResultFormat: function (a, b) {
              for (var c = a.childNodes, d, e = 0; e < c.length; e++) d = c[e],
                1 == d.nodeType && b.formats.push(d.nodeName)
                },
            DCPType: function (a, b) {
              this.readChildNodes(a, b)
            },
            HTTP: function (a, b) {
              this.readChildNodes(a, b.href)
            },
            Get: function (a, b) {
              b.get = a.getAttribute('onlineResource')
            },
            Post: function (a, b) {
              b.post = a.getAttribute('onlineResource')
            },
            SRS: function (a, b) {
              var c = this.getChildValue(a);
              c && (b.srs = c)
            }
          }, OpenLayers.Format.WFSCapabilities.v1.prototype.readers.wfs)
        },
        CLASS_NAME: 'OpenLayers.Format.WFSCapabilities.v1_0_0'
      });
      OpenLayers.Format.WMSCapabilities = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {
        defaultVersion: '1.1.1',
        profile: null,
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities'
      });
      OpenLayers.Format.WMSCapabilities.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          wms: 'http://www.opengis.net/wms',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        defaultPrefix: 'wms',
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          var b = a;
          a && 9 == a.nodeType && (a = a.documentElement);
          var c = {
          };
          this.readNode(a, c);
          void 0 === c.service && (a = new OpenLayers.Format.OGCExceptionReport, c.error = a.read(b));
          return c
        },
        readers: {
          wms: {
            Service: function (a, b) {
              b.service = {
              };
              this.readChildNodes(a, b.service)
            },
            Name: function (a, b) {
              b.name = this.getChildValue(a)
            },
            Title: function (a, b) {
              b.title = this.getChildValue(a)
            },
            Abstract: function (a, b) {
              b['abstract'] = this.getChildValue(a)
            },
            BoundingBox: function (a) {
              var b = {
              };
              b.bbox = [
                parseFloat(a.getAttribute('minx')),
                parseFloat(a.getAttribute('miny')),
                parseFloat(a.getAttribute('maxx')),
                parseFloat(a.getAttribute('maxy'))
              ];
              a = {
                x: parseFloat(a.getAttribute('resx')),
                y: parseFloat(a.getAttribute('resy'))
              };
              if (!isNaN(a.x) || !isNaN(a.y)) b.res = a;
              return b
            },
            OnlineResource: function (a, b) {
              b.href = this.getAttributeNS(a, this.namespaces.xlink, 'href')
            },
            ContactInformation: function (a, b) {
              b.contactInformation = {
              };
              this.readChildNodes(a, b.contactInformation)
            },
            ContactPersonPrimary: function (a, b) {
              b.personPrimary = {
              };
              this.readChildNodes(a, b.personPrimary)
            },
            ContactPerson: function (a, b) {
              b.person = this.getChildValue(a)
            },
            ContactOrganization: function (a, b) {
              b.organization = this.getChildValue(a)
            },
            ContactPosition: function (a, b) {
              b.position = this.getChildValue(a)
            },
            ContactAddress: function (a, b) {
              b.contactAddress = {
              };
              this.readChildNodes(a, b.contactAddress)
            },
            AddressType: function (a, b) {
              b.type = this.getChildValue(a)
            },
            Address: function (a, b) {
              b.address = this.getChildValue(a)
            },
            City: function (a, b) {
              b.city = this.getChildValue(a)
            },
            StateOrProvince: function (a, b) {
              b.stateOrProvince = this.getChildValue(a)
            },
            PostCode: function (a, b) {
              b.postcode = this.getChildValue(a)
            },
            Country: function (a, b) {
              b.country = this.getChildValue(a)
            },
            ContactVoiceTelephone: function (a, b) {
              b.phone = this.getChildValue(a)
            },
            ContactFacsimileTelephone: function (a, b) {
              b.fax = this.getChildValue(a)
            },
            ContactElectronicMailAddress: function (a, b) {
              b.email = this.getChildValue(a)
            },
            Fees: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.fees = c)
            },
            AccessConstraints: function (a, b) {
              var c = this.getChildValue(a);
              c && 'none' != c.toLowerCase() && (b.accessConstraints = c)
            },
            Capability: function (a, b) {
              b.capability = {
                nestedLayers: [
                ],
                layers: [
                ]
              };
              this.readChildNodes(a, b.capability)
            },
            Request: function (a, b) {
              b.request = {
              };
              this.readChildNodes(a, b.request)
            },
            GetCapabilities: function (a, b) {
              b.getcapabilities = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.getcapabilities)
            },
            Format: function (a, b) {
              OpenLayers.Util.isArray(b.formats) ? b.formats.push(this.getChildValue(a))  : b.format = this.getChildValue(a)
            },
            DCPType: function (a, b) {
              this.readChildNodes(a, b)
            },
            HTTP: function (a, b) {
              this.readChildNodes(a, b)
            },
            Get: function (a, b) {
              b.get = {
              };
              this.readChildNodes(a, b.get);
              b.href || (b.href = b.get.href)
            },
            Post: function (a, b) {
              b.post = {
              };
              this.readChildNodes(a, b.post);
              b.href || (b.href = b.get.href)
            },
            GetMap: function (a, b) {
              b.getmap = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.getmap)
            },
            GetFeatureInfo: function (a, b) {
              b.getfeatureinfo = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.getfeatureinfo)
            },
            Exception: function (a, b) {
              b.exception = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.exception)
            },
            Layer: function (a, b) {
              var c,
                  d;
              b.capability ? (d = b.capability, c = b)  : d = b;
              var e = a.getAttributeNode('queryable'),
                  f = e && e.specified ? a.getAttribute('queryable')  : null,
                  g = (e = a.getAttributeNode('cascaded')) && e.specified ? a.getAttribute('cascaded')  : null,
                  e = (e = a.getAttributeNode('opaque')) && e.specified ?
                  a.getAttribute('opaque')  : null,
                  h = a.getAttribute('noSubsets'),
                  i = a.getAttribute('fixedWidth'),
                  j = a.getAttribute('fixedHeight'),
                  k = c || {
                  },
                  l = OpenLayers.Util.extend;
              c = {
                nestedLayers: [
                ],
                styles: c ? [
                ].concat(c.styles)  : [
                ],
                srs: c ? l({
                }, k.srs)  : {
                },
                metadataURLs: [
                ],
                bbox: c ? l({
                }, k.bbox)  : {
                },
                llbbox: k.llbbox,
                dimensions: c ? l({
                }, k.dimensions)  : {
                },
                authorityURLs: c ? l({
                }, k.authorityURLs)  : {
                },
                identifiers: {
                },
                keywords: [
                ],
                queryable: f && '' !== f ? '1' === f || 'true' === f : k.queryable || !1,
                cascaded: null !== g ? parseInt(g)  : k.cascaded || 0,
                opaque: e ? '1' ===
                e || 'true' === e : k.opaque || !1,
                noSubsets: null !== h ? '1' === h || 'true' === h : k.noSubsets || !1,
                fixedWidth: null != i ? parseInt(i)  : k.fixedWidth || 0,
                fixedHeight: null != j ? parseInt(j)  : k.fixedHeight || 0,
                minScale: k.minScale,
                maxScale: k.maxScale,
                attribution: k.attribution
              };
              b.nestedLayers.push(c);
              c.capability = d;
              this.readChildNodes(a, c);
              delete c.capability;
              if (c.name && (f = c.name.split(':'), g = d.request, e = g.getfeatureinfo, 0 < f.length && (c.prefix = f[0]), d.layers.push(c), void 0 === c.formats && (c.formats = g.getmap.formats), void 0 === c.infoFormats && e)) c.infoFormats = e.formats
            },
            Attribution: function (a, b) {
              b.attribution = {
              };
              this.readChildNodes(a, b.attribution)
            },
            LogoURL: function (a, b) {
              b.logo = {
                width: a.getAttribute('width'),
                height: a.getAttribute('height')
              };
              this.readChildNodes(a, b.logo)
            },
            Style: function (a, b) {
              var c = {
              };
              b.styles.push(c);
              this.readChildNodes(a, c)
            },
            LegendURL: function (a, b) {
              var c = {
                width: a.getAttribute('width'),
                height: a.getAttribute('height')
              };
              b.legend = c;
              this.readChildNodes(a, c)
            },
            MetadataURL: function (a, b) {
              var c = {
                type: a.getAttribute('type')
              };
              b.metadataURLs.push(c);
              this.readChildNodes(a, c)
            },
            DataURL: function (a, b) {
              b.dataURL = {
              };
              this.readChildNodes(a, b.dataURL)
            },
            FeatureListURL: function (a, b) {
              b.featureListURL = {
              };
              this.readChildNodes(a, b.featureListURL)
            },
            AuthorityURL: function (a, b) {
              var c = a.getAttribute('name'),
                  d = {
                  };
              this.readChildNodes(a, d);
              b.authorityURLs[c] = d.href
            },
            Identifier: function (a, b) {
              var c = a.getAttribute('authority');
              b.identifiers[c] = this.getChildValue(a)
            },
            KeywordList: function (a, b) {
              this.readChildNodes(a, b)
            },
            SRS: function (a, b) {
              b.srs[this.getChildValue(a)] = !0
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1'
      });
      OpenLayers.Format.WMSCapabilities.v1_3 = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1, {
        readers: {
          wms: OpenLayers.Util.applyDefaults({
            WMS_Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            LayerLimit: function (a, b) {
              b.layerLimit = parseInt(this.getChildValue(a))
            },
            MaxWidth: function (a, b) {
              b.maxWidth = parseInt(this.getChildValue(a))
            },
            MaxHeight: function (a, b) {
              b.maxHeight = parseInt(this.getChildValue(a))
            },
            BoundingBox: function (a, b) {
              var c = OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms.BoundingBox.apply(this, [
                a,
                b
              ]);
              c.srs = a.getAttribute('CRS');
              b.bbox[c.srs] = c
            },
            CRS: function (a, b) {
              this.readers.wms.SRS.apply(this, [
                a,
                b
              ])
            },
            EX_GeographicBoundingBox: function (a, b) {
              b.llbbox = [
              ];
              this.readChildNodes(a, b.llbbox)
            },
            westBoundLongitude: function (a, b) {
              b[0] = this.getChildValue(a)
            },
            eastBoundLongitude: function (a, b) {
              b[2] = this.getChildValue(a)
            },
            southBoundLatitude: function (a, b) {
              b[1] = this.getChildValue(a)
            },
            northBoundLatitude: function (a, b) {
              b[3] = this.getChildValue(a)
            },
            MinScaleDenominator: function (a, b) {
              b.maxScale = parseFloat(this.getChildValue(a)).toPrecision(16)
            },
            MaxScaleDenominator: function (a, b) {
              b.minScale = parseFloat(this.getChildValue(a)).toPrecision(16)
            },
            Dimension: function (a, b) {
              var c = {
                name: a.getAttribute('name').toLowerCase(),
                units: a.getAttribute('units'),
                unitsymbol: a.getAttribute('unitSymbol'),
                nearestVal: '1' === a.getAttribute('nearestValue'),
                multipleVal: '1' === a.getAttribute('multipleValues'),
                'default': a.getAttribute('default') || '',
                current: '1' === a.getAttribute('current'),
                values: this.getChildValue(a).split(',')
              };
              b.dimensions[c.name] = c
            },
            Keyword: function (a, b) {
              var c = {
                value: this.getChildValue(a),
                vocabulary: a.getAttribute('vocabulary')
              };
              b.keywords && b.keywords.push(c)
            }
          }, OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms),
          sld: {
            UserDefinedSymbolization: function (a, b) {
              this.readers.wms.UserDefinedSymbolization.apply(this, [
                a,
                b
              ]);
              b.userSymbols.inlineFeature = 1 == parseInt(a.getAttribute('InlineFeature'));
              b.userSymbols.remoteWCS = 1 == parseInt(a.getAttribute('RemoteWCS'))
            },
            DescribeLayer: function (a, b) {
              this.readers.wms.DescribeLayer.apply(this, [
                a,
                b
              ])
            },
            GetLegendGraphic: function (a, b) {
              this.readers.wms.GetLegendGraphic.apply(this, [
                a,
                b
              ])
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_3'
      });
      OpenLayers.Layer.Zoomify = OpenLayers.Class(OpenLayers.Layer.Grid, {
        size: null,
        isBaseLayer: !0,
        standardTileSize: 256,
        tileOriginCorner: 'tl',
        numberOfTiers: 0,
        tileCountUpToTier: null,
        tierSizeInTiles: null,
        tierImageSize: null,
        initialize: function (a, b, c, d) {
          this.initializeZoomify(c);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            a,
            b,
            c,
            {
            },
            d
          ])
        },
        initializeZoomify: function (a) {
          var a = a.clone(),
              b = new OpenLayers.Size(Math.ceil(a.w / this.standardTileSize), Math.ceil(a.h / this.standardTileSize));
          this.tierSizeInTiles = [
            b
          ];
          for (this.tierImageSize = [
            a
          ]; a.w > this.standardTileSize || a.h > this.standardTileSize; ) a = new OpenLayers.Size(Math.floor(a.w / 2), Math.floor(a.h / 2)),
            b = new OpenLayers.Size(Math.ceil(a.w / this.standardTileSize), Math.ceil(a.h / this.standardTileSize)),
            this.tierSizeInTiles.push(b),
            this.tierImageSize.push(a);
          this.tierSizeInTiles.reverse();
          this.tierImageSize.reverse();
          this.numberOfTiers = this.tierSizeInTiles.length;
          this.tileCountUpToTier = [
            0
          ];
          for (a = 1; a < this.numberOfTiers; a++) this.tileCountUpToTier.push(this.tierSizeInTiles[a -
                                                                                                    1].w * this.tierSizeInTiles[a - 1].h + this.tileCountUpToTier[a - 1])
            },
        destroy: function () {
          OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
          this.tileCountUpToTier.length = 0;
          this.tierSizeInTiles.length = 0;
          this.tierImageSize.length = 0
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.Zoomify(this.name, this.url, this.size, this.options));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.map.getResolution(),
              c = Math.round((a.left - this.tileOrigin.lon) / (b * this.tileSize.w)),
              a = Math.round((this.tileOrigin.lat - a.top) / (b * this.tileSize.h)),
              b = this.map.getZoom(),
              c = 'TileGroup' + Math.floor((c + a * this.tierSizeInTiles[b].w + this.tileCountUpToTier[b]) / 256) + '/' + b + '-' + c + '-' + a + '.jpg',
              a = this.url;
          OpenLayers.Util.isArray(a) && (a = this.selectUrl(c, a));
          return a + c
        },
        getImageSize: function () {
          if (0 < arguments.length) {
            var a = this.adjustBounds(arguments[0]),
                b = this.map.getResolution(),
                c = Math.round((a.left - this.tileOrigin.lon) / (b * this.tileSize.w)),
                a = Math.round((this.tileOrigin.lat -
                                a.top) / (b * this.tileSize.h)),
                b = this.map.getZoom(),
                d = this.standardTileSize,
                e = this.standardTileSize;
            c == this.tierSizeInTiles[b].w - 1 && (d = this.tierImageSize[b].w % this.standardTileSize);
            a == this.tierSizeInTiles[b].h - 1 && (e = this.tierImageSize[b].h % this.standardTileSize);
            return new OpenLayers.Size(d, e)
          }
          return this.tileSize
        },
        setMap: function (a) {
          OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
          this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left, this.map.maxExtent.top)
        },
        calculateGridLayout: function (a, b, c) {
          var d = c * this.tileSize.w,
              c = c * this.tileSize.h,
              e = a.left - b.lon,
              f = Math.floor(e / d) - this.buffer,
              a = b.lat - a.top + c,
              g = Math.floor(a / c) - this.buffer;
          return {
            tilelon: d,
            tilelat: c,
            tileoffsetlon: b.lon + f * d,
            tileoffsetlat: b.lat - c * g,
            tileoffsetx: - (e / d - f) * this.tileSize.w,
            tileoffsety: (g - a / c) * this.tileSize.h
          }
        },
        CLASS_NAME: 'OpenLayers.Layer.Zoomify'
      });
      OpenLayers.Layer.MapServer = OpenLayers.Class(OpenLayers.Layer.Grid, {
        DEFAULT_PARAMS: {
          mode: 'map',
          map_imagetype: 'png'
        },
        initialize: function (a, b, c, d) {
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
          this.params = OpenLayers.Util.applyDefaults(this.params, this.DEFAULT_PARAMS);
          if (null == d || null == d.isBaseLayer) this.isBaseLayer = 'true' != this.params.transparent && !0 != this.params.transparent
            },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.MapServer(this.name, this.url, this.params, this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              a = [
                a.left,
                a.bottom,
                a.right,
                a.top
              ],
              b = this.getImageSize();
          return this.getFullRequestString({
            mapext: a,
            imgext: a,
            map_size: [
              b.w,
              b.h
            ],
            imgx: b.w / 2,
            imgy: b.h / 2,
            imgxy: [
              b.w,
              b.h
            ]
          })
        },
        getFullRequestString: function (a, b) {
          var c = null == b ? this.url : b,
              d = OpenLayers.Util.extend({
              }, this.params),
              d = OpenLayers.Util.extend(d, a),
              e = OpenLayers.Util.getParameterString(d);
          OpenLayers.Util.isArray(c) && (c = this.selectUrl(e, c));
          var e = OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c)),
              f;
          for (f in d) f.toUpperCase() in e && delete d[f];
          e = OpenLayers.Util.getParameterString(d);
          d = c;
          e = e.replace(/,/g, '+');
          '' != e && (f = c.charAt(c.length - 1), d = '&' == f || '?' == f ? d + e : - 1 == c.indexOf('?') ? d + ('?' + e)  : d + ('&' + e));
          return d
        },
        CLASS_NAME: 'OpenLayers.Layer.MapServer'
      });
      OpenLayers.Renderer.VML = OpenLayers.Class(OpenLayers.Renderer.Elements, {
        xmlns: 'urn:schemas-microsoft-com:vml',
        symbolCache: {
        },
        offset: null,
        initialize: function (a) {
          if (this.supported()) {
            if (!document.namespaces.olv) {
              document.namespaces.add('olv', this.xmlns);
              for (var b = document.createStyleSheet(), c = 'shape rect oval fill stroke imagedata group textbox'.split(' '), d = 0, e = c.length; d < e; d++) b.addRule('olv\\:' + c[d], 'behavior: url(#default#VML); position: absolute; display: inline-block;')
                }
            OpenLayers.Renderer.Elements.prototype.initialize.apply(this, arguments)
          }
        },
        supported: function () {
          return !!document.namespaces
        },
        setExtent: function (a, b) {
          var c = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments),
              d = this.getResolution(),
              e = a.left / d | 0,
              d = a.top / d - this.size.h | 0;
          b || !this.offset ? (this.offset = {
            x: e,
            y: d
          }, d = e = 0)  : (e -= this.offset.x, d -= this.offset.y);
          this.root.coordorigin = e - this.xOffset + ' ' + d;
          for (var e = [
            this.root,
            this.vectorRoot,
            this.textRoot
          ], f = 0, g = e.length; f < g; ++f) d = e[f],
            d.coordsize = this.size.w + ' ' + this.size.h;
          this.root.style.flip = 'y';
          return c
        },
        setSize: function (a) {
          OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
          for (var b = [
            this.rendererRoot,
            this.root,
            this.vectorRoot,
            this.textRoot
          ], c = this.size.w + 'px', d = this.size.h + 'px', e, f = 0, g = b.length; f < g; ++f) e = b[f],
            e.style.width = c,
            e.style.height = d
            },
        getNodeType: function (a, b) {
          var c = null;
          switch (a.CLASS_NAME) {
            case 'OpenLayers.Geometry.Point':
              c = b.externalGraphic ? 'olv:rect' : this.isComplexSymbol(b.graphicName) ? 'olv:shape' : 'olv:oval';
              break;
            case 'OpenLayers.Geometry.Rectangle':
              c = 'olv:rect';
              break;
            case 'OpenLayers.Geometry.LineString':
            case 'OpenLayers.Geometry.LinearRing':
            case 'OpenLayers.Geometry.Polygon':
            case 'OpenLayers.Geometry.Curve':
              c = 'olv:shape'
          }
          return c
        },
        setStyle: function (a, b, c, d) {
          var b = b || a._style,
              c = c || a._options,
              e = b.fillColor;
          if ('OpenLayers.Geometry.Point' === a._geometryClass) if (b.externalGraphic) {
            c.isFilled = !0;
            b.graphicTitle && (a.title = b.graphicTitle);
            var e = b.graphicWidth || b.graphicHeight,
                f = b.graphicHeight || b.graphicWidth,
                e = e ? e : 2 * b.pointRadius,
                f = f ? f : 2 * b.pointRadius,
                g = this.getResolution(),
                h = void 0 != b.graphicXOffset ? b.graphicXOffset : - (0.5 * e),
                  i = void 0 != b.graphicYOffset ? b.graphicYOffset : - (0.5 * f);
            a.style.left = ((d.x - this.featureDx) / g - this.offset.x + h | 0) + 'px';
            a.style.top = (d.y / g - this.offset.y - (i + f) | 0) + 'px';
            a.style.width = e + 'px';
            a.style.height = f + 'px';
            a.style.flip = 'y';
            e = 'none';
            c.isStroked = !1
          } else this.isComplexSymbol(b.graphicName) ? (f = this.importSymbol(b.graphicName), a.path = f.path, a.coordorigin = f.left + ',' + f.bottom, f = f.size, a.coordsize = f + ',' + f, this.drawCircle(a, d, b.pointRadius), a.style.flip = 'y')  : this.drawCircle(a, d, b.pointRadius);
          c.isFilled ? a.fillcolor = e : a.filled = 'false';
          d = a.getElementsByTagName('fill');
          d = 0 == d.length ? null : d[0];
          if (c.isFilled) {
            d || (d = this.createNode('olv:fill', a.id + '_fill'));
            d.opacity = b.fillOpacity;
            if ('OpenLayers.Geometry.Point' === a._geometryClass && b.externalGraphic && (b.graphicOpacity && (d.opacity = b.graphicOpacity), d.src = b.externalGraphic, d.type = 'frame', !b.graphicWidth || !b.graphicHeight)) d.aspect = 'atmost';
            d.parentNode != a && a.appendChild(d)
          } else d && a.removeChild(d);
          e = b.rotation;
          if (void 0 !== e || void 0 !== a._rotation) a._rotation = e,
            b.externalGraphic ? (this.graphicRotate(a, h, i, b), d.opacity = 0)  : 'OpenLayers.Geometry.Point' === a._geometryClass && (a.style.rotation = e || 0);
          h = a.getElementsByTagName('stroke');
          h = 0 == h.length ? null : h[0];
          if (c.isStroked) {
            if (h || (h = this.createNode('olv:stroke', a.id + '_stroke'), a.appendChild(h)), h.on = !0, h.color = b.strokeColor, h.weight = b.strokeWidth + 'px', h.opacity = b.strokeOpacity, h.endcap = 'butt' == b.strokeLinecap ? 'flat' : b.strokeLinecap || 'round', b.strokeDashstyle) h.dashstyle = this.dashStyle(b)
              } else a.stroked = !1,
                h && (h.on = !1);
          'inherit' != b.cursor && null != b.cursor && (a.style.cursor = b.cursor);
          return a
        },
        graphicRotate: function (a, b, c, d) {
          var d = d || a._style,
              e = d.rotation || 0,
              f,
              g;
          if (!d.graphicWidth || !d.graphicHeight) {
            var h = new Image;
            h.onreadystatechange = OpenLayers.Function.bind(function () {
              if ('complete' == h.readyState || 'interactive' == h.readyState) f = h.width / h.height,
                g = Math.max(2 * d.pointRadius, d.graphicWidth || 0, d.graphicHeight || 0),
                b *= f,
                d.graphicWidth = g * f,
                d.graphicHeight = g,
                this.graphicRotate(a, b, c, d)
                }, this);
            h.src = d.externalGraphic
          } else {
            g = Math.max(d.graphicWidth, d.graphicHeight);
            f = d.graphicWidth / d.graphicHeight;
            var i = Math.round(d.graphicWidth || g * f),
                j = Math.round(d.graphicHeight || g);
            a.style.width = i + 'px';
            a.style.height = j + 'px';
            var k = document.getElementById(a.id + '_image');
            k || (k = this.createNode('olv:imagedata', a.id + '_image'), a.appendChild(k));
            k.style.width = i + 'px';
            k.style.height = j + 'px';
            k.src = d.externalGraphic;
            k.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'\', sizingMethod=\'scale\')';
            k = e * Math.PI / 180;
            e = Math.sin(k);
            k = Math.cos(k);
            e = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + k + ',M12=' + - e + ',M21=' + e + ',M22=' + k + ',SizingMethod=\'auto expand\')\n';
            (k = d.graphicOpacity || d.fillOpacity) && 1 != k && (e += 'progid:DXImageTransform.Microsoft.BasicImage(opacity=' + k + ')\n');
            a.style.filter = e;
            e = new OpenLayers.Geometry.Point( - b, - c);
            i = (new OpenLayers.Bounds(0, 0, i, j)).toGeometry();
            i.rotate(d.rotation, e);
            i = i.getBounds();
            a.style.left = Math.round(parseInt(a.style.left) + i.left) + 'px';
            a.style.top = Math.round(parseInt(a.style.top) - i.bottom) + 'px'
          }
        },
        postDraw: function (a) {
          a.style.visibility = 'visible';
          var b = a._style.fillColor,
              c = a._style.strokeColor;
          'none' == b && a.fillcolor != b && (a.fillcolor = b);
          'none' == c && a.strokecolor != c && (a.strokecolor = c)
        },
        setNodeDimension: function (a, b) {
          var c = b.getBounds();
          if (c) {
            var d = this.getResolution(),
                c = new OpenLayers.Bounds((c.left - this.featureDx) / d - this.offset.x | 0, c.bottom / d - this.offset.y | 0, (c.right - this.featureDx) / d - this.offset.x | 0, c.top / d - this.offset.y | 0);
            a.style.left = c.left + 'px';
            a.style.top = c.top + 'px';
            a.style.width = c.getWidth() + 'px';
            a.style.height = c.getHeight() + 'px';
            a.coordorigin = c.left + ' ' + c.top;
            a.coordsize = c.getWidth() + ' ' + c.getHeight()
          }
        },
        dashStyle: function (a) {
          a = a.strokeDashstyle;
          switch (a) {
            case 'solid':
            case 'dot':
            case 'dash':
            case 'dashdot':
            case 'longdash':
            case 'longdashdot':
              return a;
            default:
              return a = a.split(/[ ,]/),
                2 == a.length ? 1 * a[0] >= 2 * a[1] ? 'longdash' : 1 == a[0] || 1 == a[1] ? 'dot' : 'dash' : 4 == a.length ? 1 * a[0] >= 2 * a[1] ? 'longdashdot' : 'dashdot' : 'solid'
          }
        },
        createNode: function (a, b) {
          var c = document.createElement(a);
          b && (c.id = b);
          c.unselectable = 'on';
          c.onselectstart = OpenLayers.Function.False;
          return c
        },
        nodeTypeCompare: function (a, b) {
          var c = b,
              d = c.indexOf(':');
          - 1 != d && (c = c.substr(d +
                                    1));
          var e = a.nodeName,
              d = e.indexOf(':');
          - 1 != d && (e = e.substr(d + 1));
          return c == e
        },
        createRenderRoot: function () {
          return this.nodeFactory(this.container.id + '_vmlRoot', 'div')
        },
        createRoot: function (a) {
          return this.nodeFactory(this.container.id + a, 'olv:group')
        },
        drawPoint: function (a, b) {
          return this.drawCircle(a, b, 1)
        },
        drawCircle: function (a, b, c) {
          if (!isNaN(b.x) && !isNaN(b.y)) {
            var d = this.getResolution();
            a.style.left = ((b.x - this.featureDx) / d - this.offset.x | 0) - c + 'px';
            a.style.top = (b.y / d - this.offset.y | 0) - c + 'px';
            b = 2 * c;
            a.style.width = b + 'px';
            a.style.height = b + 'px';
            return a
          }
          return !1
        },
        drawLineString: function (a, b) {
          return this.drawLine(a, b, !1)
        },
        drawLinearRing: function (a, b) {
          return this.drawLine(a, b, !0)
        },
        drawLine: function (a, b, c) {
          this.setNodeDimension(a, b);
          for (var d = this.getResolution(), e = b.components.length, f = Array(e), g, h, i = 0; i < e; i++) g = b.components[i],
            h = (g.x - this.featureDx) / d - this.offset.x | 0,
            g = g.y / d - this.offset.y | 0,
            f[i] = ' ' + h + ',' + g + ' l ';
          a.path = 'm' + f.join('') + (c ? ' x e' : ' e');
          return a
        },
        drawPolygon: function (a, b) {
          this.setNodeDimension(a, b);
          var c = this.getResolution(),
              d = [
              ],
              e,
              f,
              g,
              h,
              i,
              j,
              k,
              l,
              m,
              n;
          e = 0;
          for (f = b.components.length; e < f; e++) {
            d.push('m');
            g = b.components[e].components;
            h = 0 === e;
            j = i = null;
            k = 0;
            for (l = g.length; k < l; k++) m = g[k],
              n = (m.x - this.featureDx) / c - this.offset.x | 0,
              m = m.y / c - this.offset.y | 0,
              n = ' ' + n + ',' + m,
              d.push(n),
              0 == k && d.push(' l'),
              h || (i ? i != n && (j ? j != n && (h = !0)  : j = n)  : i = n);
            d.push(h ? ' x ' : ' ')
          }
          d.push('e');
          a.path = d.join('');
          return a
        },
        drawRectangle: function (a, b) {
          var c = this.getResolution();
          a.style.left = ((b.x - this.featureDx) / c - this.offset.x | 0) +
            'px';
          a.style.top = (b.y / c - this.offset.y | 0) + 'px';
          a.style.width = (b.width / c | 0) + 'px';
          a.style.height = (b.height / c | 0) + 'px';
          return a
        },
        drawText: function (a, b, c) {
          var d = this.nodeFactory(a + this.LABEL_ID_SUFFIX, 'olv:rect'),
              e = this.nodeFactory(a + this.LABEL_ID_SUFFIX + '_textbox', 'olv:textbox'),
              f = this.getResolution();
          d.style.left = ((c.x - this.featureDx) / f - this.offset.x | 0) + 'px';
          d.style.top = (c.y / f - this.offset.y | 0) + 'px';
          d.style.flip = 'y';
          e.innerText = b.label;
          'inherit' != b.cursor && null != b.cursor && (e.style.cursor = b.cursor);
          b.fontColor && (e.style.color = b.fontColor);
          b.fontOpacity && (e.style.filter = 'alpha(opacity=' + 100 * b.fontOpacity + ')');
          b.fontFamily && (e.style.fontFamily = b.fontFamily);
          b.fontSize && (e.style.fontSize = b.fontSize);
          b.fontWeight && (e.style.fontWeight = b.fontWeight);
          b.fontStyle && (e.style.fontStyle = b.fontStyle);
          !0 === b.labelSelect && (d._featureId = a, e._featureId = a, e._geometry = c, e._geometryClass = c.CLASS_NAME);
          e.style.whiteSpace = 'nowrap';
          e.inset = '1px,0px,0px,0px';
          d.parentNode || (d.appendChild(e), this.textRoot.appendChild(d));
          b = b.labelAlign || 'cm';
          1 == b.length && (b += 'm');
          a = e.clientWidth * OpenLayers.Renderer.VML.LABEL_SHIFT[b.substr(0, 1)];
          e = e.clientHeight * OpenLayers.Renderer.VML.LABEL_SHIFT[b.substr(1, 1)];
          d.style.left = parseInt(d.style.left) - a - 1 + 'px';
          d.style.top = parseInt(d.style.top) + e + 'px'
        },
        moveRoot: function (a) {
          var b = this.map.getLayer(a.container.id);
          b instanceof OpenLayers.Layer.Vector.RootContainer && (b = this.map.getLayer(this.container.id));
          b && b.renderer.clear();
          OpenLayers.Renderer.Elements.prototype.moveRoot.apply(this, arguments);
          b && b.redraw()
        },
        importSymbol: function (a) {
          var b = this.container.id + '-' + a,
              c = this.symbolCache[b];
          if (c) return c;
          c = OpenLayers.Renderer.symbol[a];
          if (!c) throw Error(a + ' is not a valid symbol name');
          for (var a = new OpenLayers.Bounds(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0), d = [
            'm'
          ], e = 0; e < c.length; e += 2) {
            var f = c[e],
                g = c[e + 1];
            a.left = Math.min(a.left, f);
            a.bottom = Math.min(a.bottom, g);
            a.right = Math.max(a.right, f);
            a.top = Math.max(a.top, g);
            d.push(f);
            d.push(g);
            0 == e && d.push('l')
          }
          d.push('x e');
          c = d.join(' ');
          d = (a.getWidth() - a.getHeight()) / 2;
          0 < d ? (a.bottom -= d, a.top += d)  : (a.left += d, a.right -= d);
          c = {
            path: c,
            size: a.getWidth(),
            left: a.left,
            bottom: a.bottom
          };
          return this.symbolCache[b] = c
        },
        CLASS_NAME: 'OpenLayers.Renderer.VML'
      });
      OpenLayers.Renderer.VML.LABEL_SHIFT = {
        l: 0,
        c: 0.5,
        r: 1,
        t: 0,
        m: 0.5,
        b: 1
      };
      OpenLayers.Control.CacheRead = OpenLayers.Class(OpenLayers.Control, {
        fetchEvent: 'tileloadstart',
        layers: null,
        autoActivate: !0,
        setMap: function (a) {
          OpenLayers.Control.prototype.setMap.apply(this, arguments);
          var b,
              c = this.layers || a.layers;
          for (b = c.length - 1; 0 <= b; --b) this.addLayer({
            layer: c[b]
          });
          if (!this.layers) a.events.on({
            addlayer: this.addLayer,
            removeLayer: this.removeLayer,
            scope: this
          })
            },
        addLayer: function (a) {
          a.layer.events.register(this.fetchEvent, this, this.fetch)
        },
        removeLayer: function (a) {
          a.layer.events.unregister(this.fetchEvent, this, this.fetch)
        },
        fetch: function (a) {
          if (this.active && window.localStorage && a.tile instanceof OpenLayers.Tile.Image) {
            var b = a.tile,
                c = b.url;
            !b.layer.crossOriginKeyword && (OpenLayers.ProxyHost && 0 === c.indexOf(OpenLayers.ProxyHost)) && (c = OpenLayers.Control.CacheWrite.urlMap[c]);
            if (c = window.localStorage.getItem('olCache_' + c)) b.url = c,
              'tileerror' === a.type && b.setImgSrc(c)
              }
        },
        destroy: function () {
          if (this.layers || this.map) {
            var a,
                b = this.layers || this.map.layers;
            for (a = b.length - 1; 0 <= a; --a) this.removeLayer({
              layer: b[a]
            })
              }
          this.map && this.map.events.un({
            addlayer: this.addLayer,
            removeLayer: this.removeLayer,
            scope: this
          });
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        CLASS_NAME: 'OpenLayers.Control.CacheRead'
      });
      OpenLayers.Protocol.WFS.v1_0_0 = OpenLayers.Class(OpenLayers.Protocol.WFS.v1, {
        version: '1.0.0',
        CLASS_NAME: 'OpenLayers.Protocol.WFS.v1_0_0'
      });
      OpenLayers.Format.WMSGetFeatureInfo = OpenLayers.Class(OpenLayers.Format.XML, {
        layerIdentifier: '_layer',
        featureIdentifier: '_feature',
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        gmlFormat: null,
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          var b = a.documentElement;
          if (b) var c = this['read_' + b.nodeName],
              a = c ? c.call(this, b)  : (new OpenLayers.Format.GML(this.options ? this.options : {
              })).read(a);
          return a
        },
        read_msGMLOutput: function (a) {
          var b = [
          ];
          if (a = this.getSiblingNodesByTagCriteria(a, this.layerIdentifier)) for (var c = 0, d = a.length; c < d; ++c) {
            var e = a[c],
                f = e.nodeName;
            e.prefix && (f = f.split(':') [1]);
            f = f.replace(this.layerIdentifier, '');
            if (e = this.getSiblingNodesByTagCriteria(e, this.featureIdentifier)) for (var g = 0; g < e.length; g++) {
              var h = e[g],
                  i = this.parseGeometry(h),
                  h = this.parseAttributes(h),
                  h = new OpenLayers.Feature.Vector(i.geometry, h, null);
              h.bounds = i.bounds;
              h.type = f;
              b.push(h)
            }
          }
          return b
        },
        read_FeatureInfoResponse: function (a) {
          for (var b = [
          ], a = this.getElementsByTagNameNS(a, '*', 'FIELDS'), c = 0, d = a.length; c < d; c++) {
            var e = a[c],
                f = {
                },
                g,
                h = e.attributes.length;
            if (0 < h) for (g = 0; g < h; g++) {
              var i = e.attributes[g];
              f[i.nodeName] = i.nodeValue
            } else {
              e = e.childNodes;
              g = 0;
              for (h = e.length; g < h; ++g) i = e[g],
                3 != i.nodeType && (f[i.getAttribute('name')] = i.getAttribute('value'))
                }
            b.push(new OpenLayers.Feature.Vector(null, f, null))
          }
          return b
        },
        getSiblingNodesByTagCriteria: function (a, b) {
          var c = [
          ],
              d,
              e,
              f,
              g;
          if (a && a.hasChildNodes()) {
            d = a.childNodes;
            f = d.length;
            for (var h = 0; h < f; h++) {
              for (g = d[h]; g && 1 != g.nodeType; ) g = g.nextSibling,
                h++;
              e = g ? g.nodeName : '';
              0 < e.length && - 1 < e.indexOf(b) ? c.push(g)  : (e = this.getSiblingNodesByTagCriteria(g, b), 0 < e.length && (0 == c.length ? c = e : c.push(e)))
            }
          }
          return c
        },
        parseAttributes: function (a) {
          var b = {
          };
          if (1 == a.nodeType) for (var a = a.childNodes, c = a.length, d = 0; d < c; ++d) {
            var e = a[d];
            if (1 == e.nodeType) {
              var f = e.childNodes,
                  e = e.prefix ? e.nodeName.split(':') [1] : e.nodeName;
              if (0 == f.length) b[e] = null;
              else if (1 == f.length && (f = f[0], 3 == f.nodeType || 4 == f.nodeType)) f = f.nodeValue.replace(this.regExes.trimSpace, ''),
                b[e] = f
                }
          }
          return b
        },
        parseGeometry: function (a) {
          this.gmlFormat || (this.gmlFormat = new OpenLayers.Format.GML);
          var a = this.gmlFormat.parseFeature(a),
              b,
              c = null;
          a && (b = a.geometry && a.geometry.clone(), c = a.bounds && a.bounds.clone(), a.destroy());
          return {
            geometry: b,
            bounds: c
          }
        },
        CLASS_NAME: 'OpenLayers.Format.WMSGetFeatureInfo'
      });
      OpenLayers.Control.WMTSGetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {
        hover: !1,
        requestEncoding: 'KVP',
        drillDown: !1,
        maxFeatures: 10,
        clickCallback: 'click',
        layers: null,
        queryVisible: !0,
        infoFormat: 'text/html',
        vendorParams: {
        },
        format: null,
        formatOptions: null,
        handlerOptions: null,
        handler: null,
        hoverRequest: null,
        pending: 0,
        initialize: function (a) {
          a = a || {
          };
          a.handlerOptions = a.handlerOptions || {
          };
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.format || (this.format = new OpenLayers.Format.WMSGetFeatureInfo(a.formatOptions));
          !0 === this.drillDown && (this.hover = !1);
          this.hover ? this.handler = new OpenLayers.Handler.Hover(this, {
            move: this.cancelHover,
            pause: this.getInfoForHover
          }, OpenLayers.Util.extend(this.handlerOptions.hover || {
          }, {
            delay: 250
          }))  : (a = {
          }, a[this.clickCallback] = this.getInfoForClick, this.handler = new OpenLayers.Handler.Click(this, a, this.handlerOptions.click || {
          }))
        },
        getInfoForClick: function (a) {
          this.request(a.xy, {
          })
        },
        getInfoForHover: function (a) {
          this.request(a.xy, {
            hover: !0
          })
        },
        cancelHover: function () {
          this.hoverRequest && (--this.pending, 0 >= this.pending && (OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait'), this.pending = 0), this.hoverRequest.abort(), this.hoverRequest = null)
        },
        findLayers: function () {
          for (var a = this.layers || this.map.layers, b = [
          ], c, d = a.length - 1; 0 <= d; --d) if (c = a[d], c instanceof OpenLayers.Layer.WMTS && c.requestEncoding === this.requestEncoding && (!this.queryVisible || c.getVisibility())) if (b.push(c), !this.drillDown || this.hover) break;
          return b
        },
        buildRequestOptions: function (a, b) {
          var c = this.map.getLonLatFromPixel(b),
              d = a.getURL(new OpenLayers.Bounds(c.lon, c.lat, c.lon, c.lat)),
              d = OpenLayers.Util.getParameters(d),
              c = a.getTileInfo(c);
          OpenLayers.Util.extend(d, {
            service: 'WMTS',
            version: a.version,
            request: 'GetFeatureInfo',
            infoFormat: this.infoFormat,
            i: c.i,
            j: c.j
          });
          OpenLayers.Util.applyDefaults(d, this.vendorParams);
          return {
            url: OpenLayers.Util.isArray(a.url) ? a.url[0] : a.url,
            params: OpenLayers.Util.upperCaseObject(d),
            callback: function (c) {
              this.handleResponse(b, c, a)
            },
            scope: this
          }
        },
        request: function (a, b) {
          var b = b || {
          },
              c = this.findLayers();
          if (0 < c.length) {
            for (var d, e, f = 0, g = c.length; f < g; f++) e = c[f],
              d = this.events.triggerEvent('beforegetfeatureinfo', {
              xy: a,
              layer: e
            }),
              !1 !== d && (++this.pending, d = this.buildRequestOptions(e, a), d = OpenLayers.Request.GET(d), !0 === b.hover && (this.hoverRequest = d));
            0 < this.pending && OpenLayers.Element.addClass(this.map.viewPortDiv, 'olCursorWait')
          }
        },
        handleResponse: function (a, b, c) {
          --this.pending;
          0 >= this.pending && (OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait'), this.pending = 0);
          if (b.status && (200 > b.status || 300 <= b.status)) this.events.triggerEvent('exception', {
            xy: a,
            request: b,
            layer: c
          });
          else {
            var d = b.responseXML;
            if (!d || !d.documentElement) d = b.responseText;
            var e,
                f;
            try {
              e = this.format.read(d)
            } catch (g) {
              f = !0,
                this.events.triggerEvent('exception', {
                xy: a,
                request: b,
                error: g,
                layer: c
              })
            }
            f || this.events.triggerEvent('getfeatureinfo', {
              text: b.responseText,
              features: e,
              request: b,
              xy: a,
              layer: c
            })
          }
        },
        CLASS_NAME: 'OpenLayers.Control.WMTSGetFeatureInfo'
      });
      OpenLayers.Strategy.Paging = OpenLayers.Class(OpenLayers.Strategy, {
        features: null,
        length: 10,
        num: null,
        paging: !1,
        activate: function () {
          var a = OpenLayers.Strategy.prototype.activate.call(this);
          if (a) this.layer.events.on({
            beforefeaturesadded: this.cacheFeatures,
            scope: this
          });
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Strategy.prototype.deactivate.call(this);
          a && (this.clearCache(), this.layer.events.un({
            beforefeaturesadded: this.cacheFeatures,
            scope: this
          }));
          return a
        },
        cacheFeatures: function (a) {
          this.paging || (this.clearCache(), this.features = a.features, this.pageNext(a))
        },
        clearCache: function () {
          if (this.features) for (var a = 0; a < this.features.length; ++a) this.features[a].destroy();
          this.num = this.features = null
        },
        pageCount: function () {
          return Math.ceil((this.features ? this.features.length : 0) / this.length)
        },
        pageNum: function () {
          return this.num
        },
        pageLength: function (a) {
          a && 0 < a && (this.length = a);
          return this.length
        },
        pageNext: function (a) {
          var b = !1;
          this.features && (null === this.num && (this.num = - 1), b = this.page((this.num + 1) * this.length, a));
          return b
        },
        pagePrevious: function () {
          var a = !1;
          this.features && (null === this.num && (this.num = this.pageCount()), a = this.page((this.num - 1) * this.length));
          return a
        },
        page: function (a, b) {
          var c = !1;
          if (this.features && 0 <= a && a < this.features.length) {
            var d = Math.floor(a / this.length);
            d != this.num && (this.paging = !0, c = this.features.slice(a, a + this.length), this.layer.removeFeatures(this.layer.features), this.num = d, b && b.features ? b.features = c : this.layer.addFeatures(c), this.paging = !1, c = !0)
          }
          return c
        },
        CLASS_NAME: 'OpenLayers.Strategy.Paging'
      });
      OpenLayers.Protocol.CSW.v2_0_2 = OpenLayers.Class(OpenLayers.Protocol, {
        formatOptions: null,
        initialize: function (a) {
          OpenLayers.Protocol.prototype.initialize.apply(this, [
            a
          ]);
          a.format || (this.format = new OpenLayers.Format.CSWGetRecords.v2_0_2(OpenLayers.Util.extend({
          }, this.formatOptions)))
        },
        destroy: function () {
          this.options && !this.options.format && this.format.destroy();
          this.format = null;
          OpenLayers.Protocol.prototype.destroy.apply(this)
        },
        read: function (a) {
          a = OpenLayers.Util.extend({
          }, a);
          OpenLayers.Util.applyDefaults(a, this.options || {
          });
          var b = new OpenLayers.Protocol.Response({
            requestType: 'read'
          }),
              c = this.format.write(a.params);
          b.priv = OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, b, a),
            params: a.params,
            headers: a.headers,
            data: c
          });
          return b
        },
        handleRead: function (a, b) {
          if (b.callback) {
            var c = a.priv;
            200 <= c.status && 300 > c.status ? (a.data = this.parseData(c), a.code = OpenLayers.Protocol.Response.SUCCESS)  : a.code = OpenLayers.Protocol.Response.FAILURE;
            b.callback.call(b.scope, a)
          }
        },
        parseData: function (a) {
          var b = a.responseXML;
          if (!b || !b.documentElement) b = a.responseText;
          return !b || 0 >= b.length ? null : this.format.read(b)
        },
        CLASS_NAME: 'OpenLayers.Protocol.CSW.v2_0_2'
      });
      OpenLayers.Format.WMSCapabilities.v1_1 = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1, {
        readers: {
          wms: OpenLayers.Util.applyDefaults({
            WMT_MS_Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            Keyword: function (a, b) {
              b.keywords && b.keywords.push(this.getChildValue(a))
            },
            DescribeLayer: function (a, b) {
              b.describelayer = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.describelayer)
            },
            GetLegendGraphic: function (a, b) {
              b.getlegendgraphic = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.getlegendgraphic)
            },
            GetStyles: function (a, b) {
              b.getstyles = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.getstyles)
            },
            PutStyles: function (a, b) {
              b.putstyles = {
                formats: [
                ]
              };
              this.readChildNodes(a, b.putstyles)
            },
            UserDefinedSymbolization: function (a, b) {
              var c = {
                supportSLD: 1 == parseInt(a.getAttribute('SupportSLD')),
                userLayer: 1 == parseInt(a.getAttribute('UserLayer')),
                userStyle: 1 == parseInt(a.getAttribute('UserStyle')),
                remoteWFS: 1 == parseInt(a.getAttribute('RemoteWFS'))
              };
              b.userSymbols = c
            },
            LatLonBoundingBox: function (a, b) {
              b.llbbox = [
                parseFloat(a.getAttribute('minx')),
                parseFloat(a.getAttribute('miny')),
                parseFloat(a.getAttribute('maxx')),
                parseFloat(a.getAttribute('maxy'))
              ]
            },
            BoundingBox: function (a, b) {
              var c = OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms.BoundingBox.apply(this, [
                a,
                b
              ]);
              c.srs = a.getAttribute('SRS');
              b.bbox[c.srs] = c
            },
            ScaleHint: function (a, b) {
              var c = a.getAttribute('min'),
                  d = a.getAttribute('max'),
                  e = Math.pow(2, 0.5),
                  f = OpenLayers.INCHES_PER_UNIT.m;
              b.maxScale = parseFloat((c / e * f * OpenLayers.DOTS_PER_INCH).toPrecision(13));
              b.minScale = parseFloat((d / e * f * OpenLayers.DOTS_PER_INCH).toPrecision(13))
            },
            Dimension: function (a, b) {
              var c = {
                name: a.getAttribute('name').toLowerCase(),
                units: a.getAttribute('units'),
                unitsymbol: a.getAttribute('unitSymbol')
              };
              b.dimensions[c.name] = c
            },
            Extent: function (a, b) {
              var c = a.getAttribute('name').toLowerCase();
              if (c in b.dimensions) {
                c = b.dimensions[c];
                c.nearestVal = '1' === a.getAttribute('nearestValue');
                c.multipleVal = '1' === a.getAttribute('multipleValues');
                c.current = '1' === a.getAttribute('current');
                c['default'] = a.getAttribute('default') || '';
                var d = this.getChildValue(a);
                c.values = d.split(',')
              }
            }
          }, OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms)
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_1'
      });
      OpenLayers.Control.Graticule = OpenLayers.Class(OpenLayers.Control, {
        autoActivate: !0,
        intervals: [
          45,
          30,
          20,
          10,
          5,
          2,
          1,
          0.5,
          0.2,
          0.1,
          0.05,
          0.01,
          0.005,
          0.002,
          0.001
        ],
        displayInLayerSwitcher: !0,
        visible: !0,
        numPoints: 50,
        targetSize: 200,
        layerName: null,
        labelled: !0,
        labelFormat: 'dm',
        lineSymbolizer: {
          strokeColor: '#333',
          strokeWidth: 1,
          strokeOpacity: 0.5
        },
        labelSymbolizer: {
        },
        gratLayer: null,
        initialize: function (a) {
          a = a || {
          };
          a.layerName = a.layerName || OpenLayers.i18n('Graticule');
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.labelSymbolizer.stroke = !1;
          this.labelSymbolizer.fill = !1;
          this.labelSymbolizer.label = '${label}';
          this.labelSymbolizer.labelAlign = '${labelAlign}';
          this.labelSymbolizer.labelXOffset = '${xOffset}';
          this.labelSymbolizer.labelYOffset = '${yOffset}'
        },
        destroy: function () {
          this.deactivate();
          OpenLayers.Control.prototype.destroy.apply(this, arguments);
          this.gratLayer && (this.gratLayer.destroy(), this.gratLayer = null)
        },
        draw: function () {
          OpenLayers.Control.prototype.draw.apply(this, arguments);
          if (!this.gratLayer) {
            var a = new OpenLayers.Style({
            }, {
              rules: [
                new OpenLayers.Rule({
                  symbolizer: {
                    Point: this.labelSymbolizer,
                    Line: this.lineSymbolizer
                  }
                })
              ]
            });
            this.gratLayer = new OpenLayers.Layer.Vector(this.layerName, {
              styleMap: new OpenLayers.StyleMap({
                'default': a
              }),
              visibility: this.visible,
              displayInLayerSwitcher: this.displayInLayerSwitcher
            })
          }
          return this.div
        },
        activate: function () {
          return OpenLayers.Control.prototype.activate.apply(this, arguments) ? (this.map.addLayer(this.gratLayer), this.map.events.register('moveend', this, this.update), this.update(), !0)  : !1
        },
        deactivate: function () {
          return OpenLayers.Control.prototype.deactivate.apply(this, arguments) ? (this.map.events.unregister('moveend', this, this.update), this.map.removeLayer(this.gratLayer), !0)  : !1
        },
        update: function () {
          var a = this.map.getExtent();
          if (a) {
            this.gratLayer.destroyFeatures();
            var b = new OpenLayers.Projection('EPSG:4326'),
                c = this.map.getProjectionObject(),
                d = this.map.getResolution();
            c.proj && 'longlat' == c.proj.projName && (this.numPoints = 1);
            var e = this.map.getCenter(),
                f = new OpenLayers.Pixel(e.lon, e.lat);
            OpenLayers.Projection.transform(f, c, b);
            for (var e = this.targetSize * d, e = e * e, g, d = 0; d < this.intervals.length; ++d) {
              g = this.intervals[d];
              var h = g / 2,
                  i = f.offset({
                    x: - h,
                    y: - h
                  }),
                  h = f.offset({
                    x: h,
                    y: h
                  });
              OpenLayers.Projection.transform(i, b, c);
              OpenLayers.Projection.transform(h, b, c);
              if ((i.x - h.x) * (i.x - h.x) + (i.y - h.y) * (i.y - h.y) <= e) break
                }
            f.x = Math.floor(f.x / g) * g;
            f.y = Math.floor(f.y / g) * g;
            var d = 0,
                e = [
                  f.clone()
                ],
                h = f.clone(),
                j;
            do h = h.offset({
              x: 0,
              y: g
            }),
              j = OpenLayers.Projection.transform(h.clone(), b, c),
              e.unshift(h);
            while (a.containsPixel(j) && 1000 > ++d);
            h = f.clone();
            do h = h.offset({
              x: 0,
              y: - g
            }),
              j = OpenLayers.Projection.transform(h.clone(), b, c),
              e.push(h);
            while (a.containsPixel(j) && 1000 > ++d);
            d = 0;
            i = [
              f.clone()
            ];
            h = f.clone();
            do h = h.offset({
              x: - g,
              y: 0
            }),
              j = OpenLayers.Projection.transform(h.clone(), b, c),
              i.unshift(h);
            while (a.containsPixel(j) && 1000 > ++d);
            h = f.clone();
            do h = h.offset({
              x: g,
              y: 0
            }),
              j = OpenLayers.Projection.transform(h.clone(), b, c),
              i.push(h);
            while (a.containsPixel(j) && 1000 > ++d);
            g = [
            ];
            for (d = 0; d < i.length; ++d) {
              j = i[d].x;
              for (var f = [
              ], k = null, l = Math.min(e[0].y, 90), h = Math.max(e[e.length - 1].y, - 90), m = (l - h) / this.numPoints, l = h, h = 0; h <= this.numPoints; ++h) {
                var n = new OpenLayers.Geometry.Point(j, l);
                n.transform(b, c);
                f.push(n);
                l += m;
                n.y >= a.bottom && !k && (k = n)
              }
              this.labelled && (k = new OpenLayers.Geometry.Point(k.x, a.bottom), j = {
                value: j,
                label: this.labelled ? OpenLayers.Util.getFormattedLonLat(j, 'lon', this.labelFormat)  : '',
                labelAlign: 'cb',
                xOffset: 0,
                yOffset: 2
              }, this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(k, j)));
              f = new OpenLayers.Geometry.LineString(f);
              g.push(new OpenLayers.Feature.Vector(f))
            }
            for (h = 0; h < e.length; ++h) if (l = e[h].y, !( - 90 > l || 90 < l)) {
              f = [
              ];
              d = i[0].x;
              m = (i[i.length - 1].x - d) / this.numPoints;
              j = d;
              k = null;
              for (d = 0; d <= this.numPoints; ++d) n = new OpenLayers.Geometry.Point(j, l),
                n.transform(b, c),
                f.push(n),
                j += m,
                n.x < a.right && (k = n);
              this.labelled && (k = new OpenLayers.Geometry.Point(a.right, k.y), j = {
                value: l,
                label: this.labelled ? OpenLayers.Util.getFormattedLonLat(l, 'lat', this.labelFormat)  : '',
                labelAlign: 'rb',
                xOffset: - 2,
                yOffset: 2
              }, this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(k, j)));
              f = new OpenLayers.Geometry.LineString(f);
              g.push(new OpenLayers.Feature.Vector(f))
            }
            this.gratLayer.addFeatures(g)
          }
        },
        CLASS_NAME: 'OpenLayers.Control.Graticule'
      });
      OpenLayers.Layer.UTFGrid = OpenLayers.Class(OpenLayers.Layer.XYZ, {
        isBaseLayer: !1,
        projection: new OpenLayers.Projection('EPSG:900913'),
        useJSONP: !1,
        tileClass: OpenLayers.Tile.UTFGrid,
        initialize: function (a) {
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            a.name,
            a.url,
            {
            },
            a
          ]);
          this.tileOptions = OpenLayers.Util.extend({
            utfgridResolution: this.utfgridResolution
          }, this.tileOptions)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.UTFGrid(this.getOptions()));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getFeatureInfo: function (a) {
          var b = null,
              a = this.getTileData(a);
          a.tile && (b = a.tile.getFeatureInfo(a.i, a.j));
          return b
        },
        getFeatureId: function (a) {
          var b = null,
              a = this.getTileData(a);
          a.tile && (b = a.tile.getFeatureId(a.i, a.j));
          return b
        },
        CLASS_NAME: 'OpenLayers.Layer.UTFGrid'
      });
      OpenLayers.Layer.ArcGISCache = OpenLayers.Class(OpenLayers.Layer.XYZ, {
        url: null,
        tileOrigin: null,
        tileSize: new OpenLayers.Size(256, 256),
        useArcGISServer: !0,
        type: 'png',
        useScales: !1,
        overrideDPI: !1,
        initialize: function (a, b, c) {
          OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
          this.resolutions && (this.serverResolutions = this.resolutions, this.maxExtent = this.getMaxExtentForResolution(this.resolutions[0]));
          if (this.layerInfo) {
            var d = this.layerInfo,
                e = new OpenLayers.Bounds(d.fullExtent.xmin, d.fullExtent.ymin, d.fullExtent.xmax, d.fullExtent.ymax);
            this.projection = 'EPSG:' + d.spatialReference.wkid;
            this.sphericalMercator = 102100 == d.spatialReference.wkid;
            this.units = 'esriFeet' == d.units ? 'ft' : 'm';
            if (d.tileInfo) {
              this.tileSize = new OpenLayers.Size(d.tileInfo.width || d.tileInfo.cols, d.tileInfo.height || d.tileInfo.rows);
              this.tileOrigin = new OpenLayers.LonLat(d.tileInfo.origin.x, d.tileInfo.origin.y);
              var f = new OpenLayers.Geometry.Point(e.left, e.top),
                  e = new OpenLayers.Geometry.Point(e.right, e.bottom);
              this.useScales ? this.scales = [
              ] : this.resolutions = [
              ];
              this.lods = [
              ];
              for (var g in d.tileInfo.lods) if (d.tileInfo.lods.hasOwnProperty(g)) {
                var h = d.tileInfo.lods[g];
                this.useScales ? this.scales.push(h.scale)  : this.resolutions.push(h.resolution);
                var i = this.getContainingTileCoords(f, h.resolution);
                h.startTileCol = i.x;
                h.startTileRow = i.y;
                i = this.getContainingTileCoords(e, h.resolution);
                h.endTileCol = i.x;
                h.endTileRow = i.y;
                this.lods.push(h)
              }
              this.maxExtent = this.calculateMaxExtentWithLOD(this.lods[0]);
              this.serverResolutions = this.resolutions;
              this.overrideDPI && d.tileInfo.dpi && (OpenLayers.DOTS_PER_INCH = d.tileInfo.dpi)
            }
          }
        },
        getContainingTileCoords: function (a, b) {
          return new OpenLayers.Pixel(Math.max(Math.floor((a.x - this.tileOrigin.lon) / (this.tileSize.w * b)), 0), Math.max(Math.floor((this.tileOrigin.lat - a.y) / (this.tileSize.h * b)), 0))
        },
        calculateMaxExtentWithLOD: function (a) {
          var b = this.tileOrigin.lon + a.startTileCol * this.tileSize.w * a.resolution,
              c = this.tileOrigin.lat - a.startTileRow * this.tileSize.h * a.resolution;
          return new OpenLayers.Bounds(b, c - (a.endTileRow - a.startTileRow +
                                               1) * this.tileSize.h * a.resolution, b + (a.endTileCol - a.startTileCol + 1) * this.tileSize.w * a.resolution, c)
        },
        calculateMaxExtentWithExtent: function (a, b) {
          var c = new OpenLayers.Geometry.Point(a.left, a.top),
              d = new OpenLayers.Geometry.Point(a.right, a.bottom),
              c = this.getContainingTileCoords(c, b),
              d = this.getContainingTileCoords(d, b);
          return this.calculateMaxExtentWithLOD({
            resolution: b,
            startTileCol: c.x,
            startTileRow: c.y,
            endTileCol: d.x,
            endTileRow: d.y
          })
        },
        getUpperLeftTileCoord: function (a) {
          return this.getContainingTileCoords(new OpenLayers.Geometry.Point(this.maxExtent.left, this.maxExtent.top), a)
        },
        getLowerRightTileCoord: function (a) {
          return this.getContainingTileCoords(new OpenLayers.Geometry.Point(this.maxExtent.right, this.maxExtent.bottom), a)
        },
        getMaxExtentForResolution: function (a) {
          var b = this.getUpperLeftTileCoord(a),
              c = this.getLowerRightTileCoord(a),
              d = this.tileOrigin.lon + b.x * this.tileSize.w * a,
              e = this.tileOrigin.lat - b.y * this.tileSize.h * a;
          return new OpenLayers.Bounds(d, e - (c.y - b.y + 1) * this.tileSize.h * a, d + (c.x - b.x + 1) * this.tileSize.w * a, e)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.ArcGISCache(this.name, this.url, this.options));
          return OpenLayers.Layer.XYZ.prototype.clone.apply(this, [
            a
          ])
        },
        getMaxExtent: function () {
          return this.maxExtent = this.getMaxExtentForResolution(this.map.getResolution())
        },
        getTileOrigin: function () {
          var a = this.getMaxExtent();
          return new OpenLayers.LonLat(a.left, a.bottom)
        },
        getURL: function (a) {
          var b = this.getResolution(),
              c = this.tileOrigin.lon + b * this.tileSize.w / 2,
              d = this.tileOrigin.lat - b * this.tileSize.h / 2,
              a = a.getCenterLonLat(),
              c = Math.round(Math.abs((a.lon - c) / (b * this.tileSize.w))),
              d = Math.round(Math.abs((d -
                                       a.lat) / (b * this.tileSize.h))),
              a = this.map.getZoom();
          if (this.lods) {
            if (b = this.lods[this.map.getZoom()], c < b.startTileCol || c > b.endTileCol || d < b.startTileRow || d > b.endTileRow) return null
              } else {
                var e = this.getUpperLeftTileCoord(b),
                    b = this.getLowerRightTileCoord(b);
                if (c < e.x || c >= b.x || d < e.y || d >= b.y) return null
                  }
          b = this.url;
          e = '' + c + d + a;
          OpenLayers.Util.isArray(b) && (b = this.selectUrl(e, b));
          this.useArcGISServer ? b += '/tile/${z}/${y}/${x}' : (c = 'C' + this.zeroPad(c, 8, 16), d = 'R' + this.zeroPad(d, 8, 16), a = 'L' + this.zeroPad(a, 2, 16), b = b + '/${z}/${y}/${x}.' + this.type);
          b = OpenLayers.String.format(b, {
            x: c,
            y: d,
            z: a
          });
          return OpenLayers.Util.urlAppend(b, OpenLayers.Util.getParameterString(this.params))
        },
        zeroPad: function (a, b, c) {
          for (a = a.toString(c || 10); a.length < b; ) a = '0' + a;
          return a
        },
        CLASS_NAME: 'OpenLayers.Layer.ArcGISCache'
      });
      OpenLayers.Control.WMSGetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {
        hover: !1,
        drillDown: !1,
        maxFeatures: 10,
        clickCallback: 'click',
        output: 'features',
        layers: null,
        queryVisible: !1,
        url: null,
        layerUrls: null,
        infoFormat: 'text/html',
        vendorParams: {
        },
        format: null,
        formatOptions: null,
        handlerOptions: null,
        handler: null,
        hoverRequest: null,
        initialize: function (a) {
          a = a || {
          };
          a.handlerOptions = a.handlerOptions || {
          };
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.format || (this.format = new OpenLayers.Format.WMSGetFeatureInfo(a.formatOptions));
          !0 === this.drillDown && (this.hover = !1);
          this.hover ? this.handler = new OpenLayers.Handler.Hover(this, {
            move: this.cancelHover,
            pause: this.getInfoForHover
          }, OpenLayers.Util.extend(this.handlerOptions.hover || {
          }, {
            delay: 250
          }))  : (a = {
          }, a[this.clickCallback] = this.getInfoForClick, this.handler = new OpenLayers.Handler.Click(this, a, this.handlerOptions.click || {
          }))
        },
        getInfoForClick: function (a) {
          this.events.triggerEvent('beforegetfeatureinfo', {
            xy: a.xy
          });
          OpenLayers.Element.addClass(this.map.viewPortDiv, 'olCursorWait');
          this.request(a.xy, {
          })
        },
        getInfoForHover: function (a) {
          this.events.triggerEvent('beforegetfeatureinfo', {
            xy: a.xy
          });
          this.request(a.xy, {
            hover: !0
          })
        },
        cancelHover: function () {
          this.hoverRequest && (this.hoverRequest.abort(), this.hoverRequest = null)
        },
        findLayers: function () {
          for (var a = this.layers || this.map.layers, b = [
          ], c, d, e = a.length - 1; 0 <= e; --e) if (c = a[e], c instanceof OpenLayers.Layer.WMS && (!this.queryVisible || c.getVisibility())) d = OpenLayers.Util.isArray(c.url) ? c.url[0] : c.url,
            !1 === this.drillDown && !this.url && (this.url = d),
            (!0 === this.drillDown || this.urlMatches(d)) && b.push(c);
          return b
        },
        urlMatches: function (a) {
          var b = OpenLayers.Util.isEquivalentUrl(this.url, a);
          if (!b && this.layerUrls) for (var c = 0, d = this.layerUrls.length; c < d; ++c) if (OpenLayers.Util.isEquivalentUrl(this.layerUrls[c], a)) {
            b = !0;
            break
          }
          return b
        },
        buildWMSOptions: function (a, b, c, d) {
          for (var e = [
          ], f = [
          ], g = 0, h = b.length; g < h; g++) null != b[g].params.LAYERS && (e = e.concat(b[g].params.LAYERS), f = f.concat(this.getStyleNames(b[g])));
          b = b[0];
          g = this.map.getProjection();
          (h = b.projection) && h.equals(this.map.getProjectionObject()) && (g = h.getCode());
          d = OpenLayers.Util.extend({
            service: 'WMS',
            version: b.params.VERSION,
            request: 'GetFeatureInfo',
            exceptions: b.params.EXCEPTIONS,
            bbox: this.map.getExtent().toBBOX(null, b.reverseAxisOrder()),
            feature_count: this.maxFeatures,
            height: this.map.getSize().h,
            width: this.map.getSize().w,
            format: d,
            info_format: b.params.INFO_FORMAT || this.infoFormat
          }, 1.3 <= parseFloat(b.params.VERSION) ? {
            crs: g,
            i: parseInt(c.x),
            j: parseInt(c.y)
          }
                                     : {
            srs: g,
            x: parseInt(c.x),
            y: parseInt(c.y)
          });
          0 != e.length && (d = OpenLayers.Util.extend({
            layers: e,
            query_layers: e,
            styles: f
          }, d));
          OpenLayers.Util.applyDefaults(d, this.vendorParams);
          return {
            url: a,
            params: OpenLayers.Util.upperCaseObject(d),
            callback: function (b) {
              this.handleResponse(c, b, a)
            },
            scope: this
          }
        },
        getStyleNames: function (a) {
          return a.params.STYLES ? a.params.STYLES : OpenLayers.Util.isArray(a.params.LAYERS) ? Array(a.params.LAYERS.length)  : a.params.LAYERS.replace(/[^,]/g, '')
        },
        request: function (a, b) {
          var c = this.findLayers();
          if (0 == c.length) this.events.triggerEvent('nogetfeatureinfo'),
            OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait');
          else if (b = b || {
          }, !1 === this.drillDown) {
            var c = this.buildWMSOptions(this.url, c, a, c[0].params.FORMAT),
                d = OpenLayers.Request.GET(c);
            !0 === b.hover && (this.hoverRequest = d)
          } else {
            this._numRequests = this._requestCount = 0;
            this.features = [
            ];
            for (var d = {
            }, e, f = 0, g = c.length; f < g; f++) {
              var h = c[f];
              e = OpenLayers.Util.isArray(h.url) ? h.url[0] : h.url;
              e in d ? d[e].push(h)  : (this._numRequests++, d[e] = [
                h
              ])
            }
            for (e in d) c = d[e],
              c = this.buildWMSOptions(e, c, a, c[0].params.FORMAT),
              OpenLayers.Request.GET(c)
              }
        },
        triggerGetFeatureInfo: function (a, b, c) {
          this.events.triggerEvent('getfeatureinfo', {
            text: a.responseText,
            features: c,
            request: a,
            xy: b
          });
          OpenLayers.Element.removeClass(this.map.viewPortDiv, 'olCursorWait')
        },
        handleResponse: function (a, b, c) {
          var d = b.responseXML;
          if (!d || !d.documentElement) d = b.responseText;
          d = this.format.read(d);
          !1 === this.drillDown ? this.triggerGetFeatureInfo(b, a, d)  : (this._requestCount++, this._features = 'object' === this.output ? (this._features || [
          ]).concat({
            url: c,
            features: d
          })  : (this._features || [
          ]).concat(d), this._requestCount === this._numRequests && (this.triggerGetFeatureInfo(b, a, this._features.concat()), delete this._features, delete this._requestCount, delete this._numRequests))
        },
        CLASS_NAME: 'OpenLayers.Control.WMSGetFeatureInfo'
      });
      OpenLayers.Format.WMSCapabilities.v1_3_0 = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_3, {
        version: '1.3.0',
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_3_0'
      });
      OpenLayers.Format.SOSGetFeatureOfInterest = OpenLayers.Class(OpenLayers.Format.XML, {
        VERSION: '1.0.0',
        namespaces: {
          sos: 'http://www.opengis.net/sos/1.0',
          gml: 'http://www.opengis.net/gml',
          sa: 'http://www.opengis.net/sampling/1.0',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        schemaLocation: 'http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd',
        defaultPrefix: 'sos',
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        read: function (a) {
          'string' ==
            typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
            features: [
            ]
          };
          this.readNode(a, b);
          for (var a = [
          ], c = 0, d = b.features.length; c < d; c++) {
            var e = b.features[c];
            this.internalProjection && (this.externalProjection && e.components[0]) && e.components[0].transform(this.externalProjection, this.internalProjection);
            e = new OpenLayers.Feature.Vector(e.components[0], e.attributes);
            a.push(e)
          }
          return a
        },
        readers: {
          sa: {
            SamplingPoint: function (a, b) {
              if (!b.attributes) {
                var c = {
                  attributes: {
                  }
                };
                b.features.push(c);
                b = c
              }
              b.attributes.id = this.getAttributeNS(a, this.namespaces.gml, 'id');
              this.readChildNodes(a, b)
            },
            position: function (a, b) {
              this.readChildNodes(a, b)
            }
          },
          gml: OpenLayers.Util.applyDefaults({
            FeatureCollection: function (a, b) {
              this.readChildNodes(a, b)
            },
            featureMember: function (a, b) {
              var c = {
                attributes: {
                }
              };
              b.features.push(c);
              this.readChildNodes(a, c)
            },
            name: function (a, b) {
              b.attributes.name = this.getChildValue(a)
            },
            pos: function (a, b) {
              this.externalProjection || (this.externalProjection = new OpenLayers.Projection(a.getAttribute('srsName')));
              OpenLayers.Format.GML.v3.prototype.readers.gml.pos.apply(this, [
                a,
                b
              ])
            }
          }, OpenLayers.Format.GML.v3.prototype.readers.gml)
        },
        writers: {
          sos: {
            GetFeatureOfInterest: function (a) {
              for (var b = this.createElementNSPlus('GetFeatureOfInterest', {
                attributes: {
                  version: this.VERSION,
                  service: 'SOS',
                  'xsi:schemaLocation': this.schemaLocation
                }
              }), c = 0, d = a.fois.length; c < d; c++) this.writeNode('FeatureOfInterestId', {
                foi: a.fois[c]
              }, b);
              return b
            },
            FeatureOfInterestId: function (a) {
              return this.createElementNSPlus('FeatureOfInterestId', {
                value: a.foi
              })
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.SOSGetFeatureOfInterest'
      });
      OpenLayers.Format.SOSGetObservation = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          ows: 'http://www.opengis.net/ows',
          gml: 'http://www.opengis.net/gml',
          sos: 'http://www.opengis.net/sos/1.0',
          ogc: 'http://www.opengis.net/ogc',
          om: 'http://www.opengis.net/om/1.0',
          sa: 'http://www.opengis.net/sampling/1.0',
          xlink: 'http://www.w3.org/1999/xlink',
          xsi: 'http://www.w3.org/2001/XMLSchema-instance'
        },
        regExes: {
          trimSpace: /^\s*|\s*$/g,
          removeSpace: /\s*/g,
          splitSpace: /\s+/,
          trimComma: /\s*,\s*/g
        },
        VERSION: '1.0.0',
        schemaLocation: 'http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosGetObservation.xsd',
        defaultPrefix: 'sos',
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
            measurements: [
            ],
            observations: [
            ]
          };
          this.readNode(a, b);
          return b
        },
        write: function (a) {
          a = this.writeNode('sos:GetObservation', a);
          a.setAttribute('xmlns:om', this.namespaces.om);
          a.setAttribute('xmlns:ogc', this.namespaces.ogc);
          this.setAttributeNS(a, this.namespaces.xsi, 'xsi:schemaLocation', this.schemaLocation);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            a
          ])
        },
        readers: {
          om: {
            ObservationCollection: function (a, b) {
              b.id = this.getAttributeNS(a, this.namespaces.gml, 'id');
              this.readChildNodes(a, b)
            },
            member: function (a, b) {
              this.readChildNodes(a, b)
            },
            Measurement: function (a, b) {
              var c = {
              };
              b.measurements.push(c);
              this.readChildNodes(a, c)
            },
            Observation: function (a, b) {
              var c = {
              };
              b.observations.push(c);
              this.readChildNodes(a, c)
            },
            samplingTime: function (a, b) {
              var c = {
              };
              b.samplingTime = c;
              this.readChildNodes(a, c)
            },
            observedProperty: function (a, b) {
              b.observedProperty = this.getAttributeNS(a, this.namespaces.xlink, 'href');
              this.readChildNodes(a, b)
            },
            procedure: function (a, b) {
              b.procedure = this.getAttributeNS(a, this.namespaces.xlink, 'href');
              this.readChildNodes(a, b)
            },
            featureOfInterest: function (a, b) {
              var c = {
                features: [
                ]
              };
              b.fois = [
              ];
              b.fois.push(c);
              this.readChildNodes(a, c);
              for (var d = [
              ], e = 0, f = c.features.length; e < f; e++) {
                var g = c.features[e];
                d.push(new OpenLayers.Feature.Vector(g.components[0], g.attributes))
              }
              c.features = d
            },
            result: function (a, b) {
              var c = {
              };
              b.result = c;
              '' !== this.getChildValue(a) ? (c.value = this.getChildValue(a), c.uom = a.getAttribute('uom'))  : this.readChildNodes(a, c)
            }
          },
          sa: OpenLayers.Format.SOSGetFeatureOfInterest.prototype.readers.sa,
          gml: OpenLayers.Util.applyDefaults({
            TimeInstant: function (a, b) {
              var c = {
              };
              b.timeInstant = c;
              this.readChildNodes(a, c)
            },
            timePosition: function (a, b) {
              b.timePosition = this.getChildValue(a)
            }
          }, OpenLayers.Format.SOSGetFeatureOfInterest.prototype.readers.gml)
        },
        writers: {
          sos: {
            GetObservation: function (a) {
              var b = this.createElementNSPlus('GetObservation', {
                attributes: {
                  version: this.VERSION,
                  service: 'SOS'
                }
              });
              this.writeNode('offering', a, b);
              a.eventTime && this.writeNode('eventTime', a, b);
              for (var c in a.procedures) this.writeNode('procedure', a.procedures[c], b);
              for (var d in a.observedProperties) this.writeNode('observedProperty', a.observedProperties[d], b);
              a.foi && this.writeNode('featureOfInterest', a.foi, b);
              this.writeNode('responseFormat', a, b);
              a.resultModel && this.writeNode('resultModel', a, b);
              a.responseMode && this.writeNode('responseMode', a, b);
              return b
            },
            featureOfInterest: function (a) {
              var b = this.createElementNSPlus('featureOfInterest');
              this.writeNode('ObjectID', a.objectId, b);
              return b
            },
            ObjectID: function (a) {
              return this.createElementNSPlus('ObjectID', {
                value: a
              })
            },
            responseFormat: function (a) {
              return this.createElementNSPlus('responseFormat', {
                value: a.responseFormat
              })
            },
            procedure: function (a) {
              return this.createElementNSPlus('procedure', {
                value: a
              })
            },
            offering: function (a) {
              return this.createElementNSPlus('offering', {
                value: a.offering
              })
            },
            observedProperty: function (a) {
              return this.createElementNSPlus('observedProperty', {
                value: a
              })
            },
            eventTime: function (a) {
              var b = this.createElementNSPlus('eventTime');
              'latest' === a.eventTime && this.writeNode('ogc:TM_Equals', a, b);
              return b
            },
            resultModel: function (a) {
              return this.createElementNSPlus('resultModel', {
                value: a.resultModel
              })
            },
            responseMode: function (a) {
              return this.createElementNSPlus('responseMode', {
                value: a.responseMode
              })
            }
          },
          ogc: {
            TM_Equals: function (a) {
              var b = this.createElementNSPlus('ogc:TM_Equals');
              this.writeNode('ogc:PropertyName', {
                property: 'urn:ogc:data:time:iso8601'
              }, b);
              'latest' === a.eventTime && this.writeNode('gml:TimeInstant', {
                value: 'latest'
              }, b);
              return b
            },
            PropertyName: function (a) {
              return this.createElementNSPlus('ogc:PropertyName', {
                value: a.property
              })
            }
          },
          gml: {
            TimeInstant: function (a) {
              var b = this.createElementNSPlus('gml:TimeInstant');
              this.writeNode('gml:timePosition', a, b);
              return b
            },
            timePosition: function (a) {
              return this.createElementNSPlus('gml:timePosition', {
                value: a.value
              })
            }
          }
        },
        CLASS_NAME: 'OpenLayers.Format.SOSGetObservation'
      });
      OpenLayers.Control.UTFGrid = OpenLayers.Class(OpenLayers.Control, {
        autoActivate: !0,
        layers: null,
        defaultHandlerOptions: {
          delay: 300,
          pixelTolerance: 4,
          stopMove: !1,
          single: !0,
          'double': !1,
          stopSingle: !1,
          stopDouble: !1
        },
        handlerMode: 'click',
        setHandler: function (a) {
          this.handlerMode = a;
          this.resetHandler()
        },
        resetHandler: function () {
          this.handler && (this.handler.deactivate(), this.handler.destroy(), this.handler = null);
          'hover' == this.handlerMode ? this.handler = new OpenLayers.Handler.Hover(this, {
            pause: this.handleEvent,
            move: this.reset
          }, this.handlerOptions)  : 'click' == this.handlerMode ? this.handler = new OpenLayers.Handler.Click(this, {
            click: this.handleEvent
          }, this.handlerOptions)  : 'move' == this.handlerMode && (this.handler = new OpenLayers.Handler.Hover(this, {
            pause: this.handleEvent,
            move: this.handleEvent
          }, this.handlerOptions));
          return this.handler ? !0 : !1
        },
        initialize: function (a) {
          a = a || {
          };
          a.handlerOptions = a.handlerOptions || this.defaultHandlerOptions;
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.resetHandler()
        },
        handleEvent: function (a) {
          if (null ==
              a) this.reset();
          else {
            var b = this.map.getLonLatFromPixel(a.xy);
            if (b) {
              var c = this.findLayers();
              if (0 < c.length) {
                for (var d = {
                }, e, f, g = 0, h = c.length; g < h; g++) e = c[g],
                  f = OpenLayers.Util.indexOf(this.map.layers, e),
                  d[f] = e.getFeatureInfo(b);
                this.callback(d, b, a.xy)
              }
            }
          }
        },
        callback: function () {
        },
        reset: function () {
          this.callback(null)
        },
        findLayers: function () {
          for (var a = this.layers || this.map.layers, b = [
          ], c, d = a.length - 1; 0 <= d; --d) c = a[d],
            c instanceof OpenLayers.Layer.UTFGrid && b.push(c);
          return b
        },
        CLASS_NAME: 'OpenLayers.Control.UTFGrid'
      });
      OpenLayers.Format.CQL = function () {
        function a(a) {
          function b() {
            var a = e.pop();
            switch (a.type) {
              case 'LOGICAL':
                var c = b(),
                    g = b();
                return new OpenLayers.Filter.Logical({
                  filters: [
                    g,
                    c
                  ],
                  type: f[a.text.toUpperCase()]
                });
              case 'NOT':
                return c = b(),
                  new OpenLayers.Filter.Logical({
                  filters: [
                    c
                  ],
                  type: OpenLayers.Filter.Logical.NOT
                });
              case 'BETWEEN':
                return e.pop(),
                  g = b(),
                  a = b(),
                  c = b(),
                  new OpenLayers.Filter.Comparison({
                  property: c,
                  lowerBoundary: a,
                  upperBoundary: g,
                  type: OpenLayers.Filter.Comparison.BETWEEN
                });
              case 'COMPARISON':
                return g = b(),
                  c = b(),
                  new OpenLayers.Filter.Comparison({
                  property: c,
                  value: g,
                  type: d[a.text.toUpperCase()]
                });
              case 'VALUE':
                return /^'.*'$/.test(a.text) ? a.text.substr(1, a.text.length - 2)  : Number(a.text);
              case 'SPATIAL':
                switch (a.text.toUpperCase()) {
                  case 'BBOX':
                    var c = b(),
                        a = b(),
                        g = b(),
                        h = b(),
                        i = b();
                    return new OpenLayers.Filter.Spatial({
                      type: OpenLayers.Filter.Spatial.BBOX,
                      property: i,
                      value: OpenLayers.Bounds.fromArray([h,
                                                          g,
                                                          a,
                                                          c])
                    });
                  case 'INTERSECTS':
                    return g = b(),
                      c = b(),
                      new OpenLayers.Filter.Spatial({
                      type: OpenLayers.Filter.Spatial.INTERSECTS,
                      property: c,
                      value: g
                    });
                  case 'WITHIN':
                    return g = b(),
                      c = b(),
                      new OpenLayers.Filter.Spatial({
                      type: OpenLayers.Filter.Spatial.WITHIN,
                      property: c,
                      value: g
                    });
                  case 'CONTAINS':
                    return g = b(),
                      c = b(),
                      new OpenLayers.Filter.Spatial({
                      type: OpenLayers.Filter.Spatial.CONTAINS,
                      property: c,
                      value: g
                    });
                  case 'DWITHIN':
                    return a = b(),
                      g = b(),
                      c = b(),
                      new OpenLayers.Filter.Spatial({
                      type: OpenLayers.Filter.Spatial.DWITHIN,
                      value: g,
                      property: c,
                      distance: Number(a)
                    })
                }
              case 'GEOMETRY':
                return OpenLayers.Geometry.fromWKT(a.text);
              default:
                return a.text
            }
          }
          for (var c = [
          ], e = [
          ]; a.length; ) {
            var g = a.shift();
            switch (g.type) {
              case 'PROPERTY':
              case 'GEOMETRY':
              case 'VALUE':
                e.push(g);
                break;
              case 'COMPARISON':
              case 'BETWEEN':
              case 'LOGICAL':
                for (var i = h[g.type]; 0 < c.length && h[c[c.length - 1].type] <= i; ) e.push(c.pop());
                c.push(g);
                break;
              case 'SPATIAL':
              case 'NOT':
              case 'LPAREN':
                c.push(g);
                break;
              case 'RPAREN':
                for (; 0 < c.length && 'LPAREN' != c[c.length - 1].type; ) e.push(c.pop());
                c.pop();
                0 < c.length && 'SPATIAL' == c[c.length - 1].type && e.push(c.pop());
              case 'COMMA':
              case 'END':
                break;
              default:
                throw Error('Unknown token type ' +
                            g.type);
            }
          }
          for (; 0 < c.length; ) e.push(c.pop());
          a = b();
          if (0 < e.length) {
            a = 'Remaining tokens after building AST: \n';
            for (c = e.length - 1; 0 <= c; c--) a += e[c].type + ': ' + e[c].text + '\n';
            throw Error(a);
          }
          return a
        }
        var b = {
          PROPERTY: /^[_a-zA-Z]\w*/,
          COMPARISON: /^(=|<>|<=|<|>=|>|LIKE)/i,
          COMMA: /^,/,
          LOGICAL: /^(AND|OR)/i,
          VALUE: /^('\w+'|\d+(\.\d*)?|\.\d+)/,
          LPAREN: /^\(/,
          RPAREN: /^\)/,
          SPATIAL: /^(BBOX|INTERSECTS|DWITHIN|WITHIN|CONTAINS)/i,
          NOT: /^NOT/i,
          BETWEEN: /^BETWEEN/i,
          GEOMETRY: function (a) {
            var b = /^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)/.exec(a);
            if (b) {
              var c = a.length,
                  b = a.indexOf('(', b[0].length);
              if ( - 1 < b) for (var d = 1; b < c && 0 < d; ) switch (b++, a.charAt(b)) {
                case '(':
                  d++;
                  break;
                case ')':
                  d--
              }
              return [a.substr(0, b + 1)]
            }
          },
          END: /^$/
        },
            c = {
              LPAREN: [
                'GEOMETRY',
                'SPATIAL',
                'PROPERTY',
                'VALUE',
                'LPAREN'
              ],
              RPAREN: [
                'NOT',
                'LOGICAL',
                'END',
                'RPAREN'
              ],
              PROPERTY: [
                'COMPARISON',
                'BETWEEN',
                'COMMA'
              ],
              BETWEEN: [
                'VALUE'
              ],
              COMPARISON: [
                'VALUE'
              ],
              COMMA: [
                'GEOMETRY',
                'VALUE',
                'PROPERTY'
              ],
              VALUE: [
                'LOGICAL',
                'COMMA',
                'RPAREN',
                'END'
              ],
              SPATIAL: [
                'LPAREN'
              ],
              LOGICAL: [
                'NOT',
                'VALUE',
                'SPATIAL',
                'PROPERTY',
                'LPAREN'
              ],
              NOT: [
                'PROPERTY',
                'LPAREN'
              ],
              GEOMETRY: [
                'COMMA',
                'RPAREN'
              ]
            },
            d = {
              '=': OpenLayers.Filter.Comparison.EQUAL_TO,
              '<>': OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
              '<': OpenLayers.Filter.Comparison.LESS_THAN,
              '<=': OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
              '>': OpenLayers.Filter.Comparison.GREATER_THAN,
              '>=': OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
              LIKE: OpenLayers.Filter.Comparison.LIKE,
              BETWEEN: OpenLayers.Filter.Comparison.BETWEEN
            },
            e = {
            },
            f = {
              AND: OpenLayers.Filter.Logical.AND,
              OR: OpenLayers.Filter.Logical.OR
            },
            g = {
            },
            h = {
              RPAREN: 3,
              LOGICAL: 2,
              COMPARISON: 1
            },
            i;
        for (i in d) d.hasOwnProperty(i) && (e[d[i]] = i);
        for (i in f) f.hasOwnProperty(i) && (g[f[i]] = i);
        return OpenLayers.Class(OpenLayers.Format, {
          read: function (d) {
            var e = d,
                d = [
                ],
                f,
                g = [
                  'NOT',
                  'GEOMETRY',
                  'SPATIAL',
                  'PROPERTY',
                  'LPAREN'
                ];
            do {
              a: {
                f = g;
                for (var h = void 0, g = void 0, i = f.length, h = 0; h < i; h++) {
                  var g = f[h],
                      p = b[g] instanceof RegExp ? b[g].exec(e)  : (0, b[g]) (e);
                  if (p) {
                    f = p[0];
                    e = e.substr(f.length).replace(/^\s*/, '');
                    f = {
                      type: g,
                      text: f,
                      remainder: e
                    };
                    break a
                  }
                }
                d = 'ERROR: In parsing: [' + e + '], expected one of: ';
                for (h = 0; h < i; h++) g = f[h],
                  d += '\n    ' + g + ': ' + b[g];
                throw Error(d);
              }
              e = f.remainder;
              g = c[f.type];
              if ('END' != f.type && !g) throw Error('No follows list for ' + f.type);
              d.push(f)
            } while ('END' != f.type);
            d = a(d);
            this.keepData && (this.data = d);
            return d
          },
          write: function (a) {
            if (a instanceof OpenLayers.Geometry) return a.toString();
            switch (a.CLASS_NAME) {
              case 'OpenLayers.Filter.Spatial':
                switch (a.type) {
                  case OpenLayers.Filter.Spatial.BBOX:
                    return 'BBOX(' + a.property + ',' + a.value.toBBOX() + ')';
                  case OpenLayers.Filter.Spatial.DWITHIN:
                    return 'DWITHIN(' +
                      a.property + ', ' + this.write(a.value) + ', ' + a.distance + ')';
                  case OpenLayers.Filter.Spatial.WITHIN:
                    return 'WITHIN(' + a.property + ', ' + this.write(a.value) + ')';
                  case OpenLayers.Filter.Spatial.INTERSECTS:
                    return 'INTERSECTS(' + a.property + ', ' + this.write(a.value) + ')';
                  case OpenLayers.Filter.Spatial.CONTAINS:
                    return 'CONTAINS(' + a.property + ', ' + this.write(a.value) + ')';
                  default:
                    throw Error('Unknown spatial filter type: ' + a.type);
                }
              case 'OpenLayers.Filter.Logical':
                if (a.type == OpenLayers.Filter.Logical.NOT) return 'NOT (' + this.write(a.filters[0]) +
                  ')';
                for (var b = '(', c = !0, d = 0; d < a.filters.length; d++) c ? c = !1 : b += ') ' + g[a.type] + ' (',
                  b += this.write(a.filters[d]);
                return b + ')';
              case 'OpenLayers.Filter.Comparison':
                return a.type == OpenLayers.Filter.Comparison.BETWEEN ? a.property + ' BETWEEN ' + this.write(a.lowerBoundary) + ' AND ' + this.write(a.upperBoundary)  : a.property + ' ' + e[a.type] + ' ' + this.write(a.value);
              case void 0:
                if ('string' === typeof a) return '\'' + a + '\'';
                if ('number' === typeof a) return '' + a;
              default:
                throw Error('Can\'t encode: ' + a.CLASS_NAME + ' ' + a);
            }
          },
          CLASS_NAME: 'OpenLayers.Format.CQL'
        })
      }();
      OpenLayers.Control.Split = OpenLayers.Class(OpenLayers.Control, {
        layer: null,
        source: null,
        sourceOptions: null,
        tolerance: null,
        edge: !0,
        deferDelete: !1,
        mutual: !0,
        targetFilter: null,
        sourceFilter: null,
        handler: null,
        initialize: function (a) {
          OpenLayers.Control.prototype.initialize.apply(this, [
            a
          ]);
          this.options = a || {
          };
          this.options.source && this.setSource(this.options.source)
        },
        setSource: function (a) {
          this.active ? (this.deactivate(), this.handler && (this.handler.destroy(), delete this.handler), this.source = a, this.activate())  : this.source = a
        },
        activate: function () {
          var a = OpenLayers.Control.prototype.activate.call(this);
          if (a) if (this.source) {
            if (this.source.events) this.source.events.on({
              sketchcomplete: this.onSketchComplete,
              afterfeaturemodified: this.afterFeatureModified,
              scope: this
            })
              } else this.handler || (this.handler = new OpenLayers.Handler.Path(this, {
                done: function (a) {
                  this.onSketchComplete({
                    feature: new OpenLayers.Feature.Vector(a)
                  })
                }
              }, {
                layerOptions: this.sourceOptions
              })),
                this.handler.activate();
          return a
        },
        deactivate: function () {
          var a = OpenLayers.Control.prototype.deactivate.call(this);
          a && this.source && this.source.events && this.layer.events.un({
            sketchcomplete: this.onSketchComplete,
            afterfeaturemodified: this.afterFeatureModified,
            scope: this
          });
          return a
        },
        onSketchComplete: function (a) {
          this.feature = null;
          return !this.considerSplit(a.feature)
        },
        afterFeatureModified: function (a) {
          a.modified && 'function' === typeof a.feature.geometry.split && (this.feature = a.feature, this.considerSplit(a.feature))
        },
        removeByGeometry: function (a, b) {
          for (var c = 0, d = a.length; c < d; ++c) if (a[c].geometry === b) {
            a.splice(c, 1);
            break
          }
        },
        isEligible: function (a) {
          return a.geometry ? a.state !== OpenLayers.State.DELETE && 'function' === typeof a.geometry.split && this.feature !== a && (!this.targetFilter || this.targetFilter.evaluate(a.attributes))  : !1
        },
        considerSplit: function (a) {
          var b = !1,
              c = !1;
          if (!this.sourceFilter || this.sourceFilter.evaluate(a.attributes)) {
            for (var d = this.layer && this.layer.features || [
            ], e, f, g = [
            ], h = [
            ], i = this.layer === this.source && this.mutual, j = {
              edge: this.edge,
              tolerance: this.tolerance,
              mutual: i
            }, k = [
              a.geometry
            ], l, m, n, o = 0, p = d.length; o < p; ++o) if (l = d[o], this.isEligible(l)) {
              m = [
                l.geometry
              ];
              for (var q = 0; q < k.length; ++q) {
                n = k[q];
                for (var r = 0; r < m.length; ++r) if (e = m[r], n.getBounds().intersectsBounds(e.getBounds()) && (e = n.split(e, j))) if (f = this.events.triggerEvent('beforesplit', {
                  source: a,
                  target: l
                }), !1 !== f && (i && (f = e[0], 1 < f.length && (f.unshift(q, 1), Array.prototype.splice.apply(k, f), q += f.length - 3), e = e[1]), 1 < e.length)) e.unshift(r, 1),
                  Array.prototype.splice.apply(m, e),
                  r += e.length - 3
                  }
              m && 1 < m.length && (this.geomsToFeatures(l, m), this.events.triggerEvent('split', {
                original: l,
                features: m
              }), Array.prototype.push.apply(g, m), h.push(l), c = !0)
            }
            k && 1 < k.length && (this.geomsToFeatures(a, k), this.events.triggerEvent('split', {
              original: a,
              features: k
            }), Array.prototype.push.apply(g, k), h.push(a), b = !0);
            if (b || c) {
              if (this.deferDelete) {
                d = [
                ];
                o = 0;
                for (p = h.length; o < p; ++o) c = h[o],
                  c.state === OpenLayers.State.INSERT ? d.push(c)  : (c.state = OpenLayers.State.DELETE, this.layer.drawFeature(c));
                this.layer.destroyFeatures(d, {
                  silent: !0
                });
                o = 0;
                for (p = g.length; o < p; ++o) g[o].state = OpenLayers.State.INSERT
                  } else this.layer.destroyFeatures(h, {
                    silent: !0
                  });
              this.layer.addFeatures(g, {
                silent: !0
              });
              this.events.triggerEvent('aftersplit', {
                source: a,
                features: g
              })
            }
          }
          return b
        },
        geomsToFeatures: function (a, b) {
          var c = a.clone();
          delete c.geometry;
          for (var d, e = 0, f = b.length; e < f; ++e) d = c.clone(),
            d.geometry = b[e],
            d.state = OpenLayers.State.INSERT,
            b[e] = d
            },
        destroy: function () {
          this.active && this.deactivate();
          OpenLayers.Control.prototype.destroy.call(this)
        },
        CLASS_NAME: 'OpenLayers.Control.Split'
      });
      OpenLayers.Layer.WMTS = OpenLayers.Class(OpenLayers.Layer.Grid, {
        isBaseLayer: !0,
        version: '1.0.0',
        requestEncoding: 'KVP',
        url: null,
        layer: null,
        matrixSet: null,
        style: null,
        format: 'image/jpeg',
        tileOrigin: null,
        tileFullExtent: null,
        formatSuffix: null,
        matrixIds: null,
        dimensions: null,
        params: null,
        zoomOffset: 0,
        serverResolutions: null,
        formatSuffixMap: {
          'image/png': 'png',
          'image/png8': 'png',
          'image/png24': 'png',
          'image/png32': 'png',
          png: 'png',
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          jpeg: 'jpg',
          jpg: 'jpg'
        },
        matrix: null,
        initialize: function (a) {
          var b = {
            url: !0,
            layer: !0,
            style: !0,
            matrixSet: !0
          },
              c;
          for (c in b) if (!(c in a)) throw Error('Missing property \'' + c + '\' in layer configuration.');
          a.params = OpenLayers.Util.upperCaseObject(a.params);
          OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            a.name,
            a.url,
            a.params,
            a
          ]);
          this.formatSuffix || (this.formatSuffix = this.formatSuffixMap[this.format] || this.format.split('/').pop());
          if (this.matrixIds && (a = this.matrixIds.length) && 'string' === typeof this.matrixIds[0]) {
            b = this.matrixIds;
            this.matrixIds = Array(a);
            for (c = 0; c < a; ++c) this.matrixIds[c] = {
              identifier: b[c]
            }
              }
        },
        setMap: function () {
          OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
          this.updateMatrixProperties()
        },
        updateMatrixProperties: function () {
          if (this.matrix = this.getMatrix()) if (this.matrix.topLeftCorner && (this.tileOrigin = this.matrix.topLeftCorner), this.matrix.tileWidth && this.matrix.tileHeight && (this.tileSize = new OpenLayers.Size(this.matrix.tileWidth, this.matrix.tileHeight)), this.tileOrigin || (this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left, this.maxExtent.top)), !this.tileFullExtent) this.tileFullExtent = this.maxExtent
            },
        moveTo: function (a, b, c) {
          (b || !this.matrix) && this.updateMatrixProperties();
          return OpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments)
        },
        clone: function (a) {
          null == a && (a = new OpenLayers.Layer.WMTS(this.options));
          return a = OpenLayers.Layer.Grid.prototype.clone.apply(this, [
            a
          ])
        },
        getIdentifier: function () {
          return this.getServerZoom()
        },
        getMatrix: function () {
          var a;
          if (!this.matrixIds || 0 === this.matrixIds.length) a = {
            identifier: this.getIdentifier()
          };
          else if ('scaleDenominator' in this.matrixIds[0]) for (var b = OpenLayers.METERS_PER_INCH * OpenLayers.INCHES_PER_UNIT[this.units] * this.getServerResolution() / 0.00028, c = Number.POSITIVE_INFINITY, d, e = 0, f = this.matrixIds.length; e < f; ++e) d = Math.abs(1 - this.matrixIds[e].scaleDenominator / b),
            d < c && (c = d, a = this.matrixIds[e]);
          else a = this.matrixIds[this.getIdentifier()];
          return a
        },
        getTileInfo: function (a) {
          var b = this.getServerResolution(),
              c = (a.lon - this.tileOrigin.lon) / (b * this.tileSize.w),
              a = (this.tileOrigin.lat - a.lat) / (b * this.tileSize.h),
              b = Math.floor(c),
              d = Math.floor(a);
          return {
            col: b,
            row: d,
            i: Math.floor((c - b) * this.tileSize.w),
            j: Math.floor((a - d) * this.tileSize.h)
          }
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = '';
          if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(a)) {
            var c = this.getTileInfo(a.getCenterLonLat()),
                a = this.dimensions;
            if ('REST' === this.requestEncoding.toUpperCase()) if (b = this.params, 'string' === typeof this.url && - 1 !== this.url.indexOf('{')) {
              var d = this.url.replace(/\{/g, '${'),
                  c = {
                    style: this.style,
                    Style: this.style,
                    TileMatrixSet: this.matrixSet,
                    TileMatrix: this.matrix.identifier,
                    TileRow: c.row,
                    TileCol: c.col
                  };
              if (a) {
                var e,
                    f;
                for (f = a.length - 1; 0 <= f; --f) e = a[f],
                  c[e] = b[e.toUpperCase()]
                  }
              b = OpenLayers.String.format(d, c)
            } else {
              d = this.version + '/' + this.layer + '/' + this.style + '/';
              if (a) for (f = 0; f < a.length; f++) b[a[f]] && (d = d + b[a[f]] + '/');
              d = d + this.matrixSet + '/' + this.matrix.identifier + '/' + c.row + '/' + c.col + '.' + this.formatSuffix;
              b = OpenLayers.Util.isArray(this.url) ? this.selectUrl(d, this.url)  : this.url;
              b.match(/\/$/) || (b += '/');
              b += d
            } else 'KVP' === this.requestEncoding.toUpperCase() && (b = {
              SERVICE: 'WMTS',
              REQUEST: 'GetTile',
              VERSION: this.version,
              LAYER: this.layer,
              STYLE: this.style,
              TILEMATRIXSET: this.matrixSet,
              TILEMATRIX: this.matrix.identifier,
              TILEROW: c.row,
              TILECOL: c.col,
              FORMAT: this.format
            }, b = OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, [
              b
            ]))
              }
          return b
        },
        mergeNewParams: function (a) {
          if ('KVP' === this.requestEncoding.toUpperCase()) return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, [
            OpenLayers.Util.upperCaseObject(a)
          ])
            },
        CLASS_NAME: 'OpenLayers.Layer.WMTS'
      });
      OpenLayers.Protocol.SOS.v1_0_0 = OpenLayers.Class(OpenLayers.Protocol, {
        fois: null,
        formatOptions: null,
        initialize: function (a) {
          OpenLayers.Protocol.prototype.initialize.apply(this, [
            a
          ]);
          a.format || (this.format = new OpenLayers.Format.SOSGetFeatureOfInterest(this.formatOptions))
        },
        destroy: function () {
          this.options && !this.options.format && this.format.destroy();
          this.format = null;
          OpenLayers.Protocol.prototype.destroy.apply(this)
        },
        read: function (a) {
          a = OpenLayers.Util.extend({
          }, a);
          OpenLayers.Util.applyDefaults(a, this.options || {
          });
          var b = new OpenLayers.Protocol.Response({
            requestType: 'read'
          }),
              c = this.format,
              c = OpenLayers.Format.XML.prototype.write.apply(c, [
                c.writeNode('sos:GetFeatureOfInterest', {
                  fois: this.fois
                })
              ]);
          b.priv = OpenLayers.Request.POST({
            url: a.url,
            callback: this.createCallback(this.handleRead, b, a),
            data: c
          });
          return b
        },
        handleRead: function (a, b) {
          if (b.callback) {
            var c = a.priv;
            200 <= c.status && 300 > c.status ? (a.features = this.parseFeatures(c), a.code = OpenLayers.Protocol.Response.SUCCESS)  : a.code = OpenLayers.Protocol.Response.FAILURE;
            b.callback.call(b.scope, a)
          }
        },
        parseFeatures: function (a) {
          var b = a.responseXML;
          if (!b || !b.documentElement) b = a.responseText;
          return !b || 0 >= b.length ? null : this.format.read(b)
        },
        CLASS_NAME: 'OpenLayers.Protocol.SOS.v1_0_0'
      });
      OpenLayers.Layer.KaMapCache = OpenLayers.Class(OpenLayers.Layer.KaMap, {
        IMAGE_EXTENSIONS: {
          jpeg: 'jpg',
          gif: 'gif',
          png: 'png',
          png8: 'png',
          png24: 'png',
          dithered: 'png'
        },
        DEFAULT_FORMAT: 'jpeg',
        initialize: function (a, b, c, d) {
          OpenLayers.Layer.KaMap.prototype.initialize.apply(this, arguments);
          this.extension = this.IMAGE_EXTENSIONS[this.params.i.toLowerCase() || this.DEFAULT_FORMAT]
        },
        getURL: function (a) {
          var a = this.adjustBounds(a),
              b = this.map.getResolution(),
              c = Math.round(10000 * this.map.getScale()) / 10000,
              d = Math.round(a.left / b),
              a = - Math.round(a.top / b),
              b = Math.floor(d / this.tileSize.w / this.params.metaTileSize.w) * this.tileSize.w * this.params.metaTileSize.w,
              e = Math.floor(a / this.tileSize.h / this.params.metaTileSize.h) * this.tileSize.h * this.params.metaTileSize.h,
              c = [
                '/',
                this.params.map,
                '/',
                c,
                '/',
                this.params.g.replace(/\s/g, '_'),
                '/def/t',
                e,
                '/l',
                b,
                '/t',
                a,
                'l',
                d,
                '.',
                this.extension
              ],
              d = this.url;
          OpenLayers.Util.isArray(d) && (d = this.selectUrl(c.join(''), d));
          return d + c.join('')
        },
        CLASS_NAME: 'OpenLayers.Layer.KaMapCache'
      });
      OpenLayers.Protocol.WFS.v1_1_0 = OpenLayers.Class(OpenLayers.Protocol.WFS.v1, {
        version: '1.1.0',
        initialize: function (a) {
          OpenLayers.Protocol.WFS.v1.prototype.initialize.apply(this, arguments);
          this.outputFormat && !this.readFormat && ('gml2' == this.outputFormat.toLowerCase() ? this.readFormat = new OpenLayers.Format.GML.v2({
            featureType: this.featureType,
            featureNS: this.featureNS,
            geometryName: this.geometryName
          })  : 'json' == this.outputFormat.toLowerCase() && (this.readFormat = new OpenLayers.Format.GeoJSON))
        },
        CLASS_NAME: 'OpenLayers.Protocol.WFS.v1_1_0'
      });
      OpenLayers.Format.WMSCapabilities.v1_1_1 = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1, {
        version: '1.1.1',
        readers: {
          wms: OpenLayers.Util.applyDefaults({
            SRS: function (a, b) {
              b.srs[this.getChildValue(a)] = !0
            }
          }, OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers.wms)
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_1_1'
      });
      OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1_1, {
        version: '1.1.1',
        profile: 'WMSC',
        readers: {
          wms: OpenLayers.Util.applyDefaults({
            VendorSpecificCapabilities: function (a, b) {
              b.vendorSpecific = {
                tileSets: [
                ]
              };
              this.readChildNodes(a, b.vendorSpecific)
            },
            TileSet: function (a, b) {
              var c = {
                srs: {
                },
                bbox: {
                },
                resolutions: [
                ]
              };
              this.readChildNodes(a, c);
              b.tileSets.push(c)
            },
            Resolutions: function (a, b) {
              for (var c = this.getChildValue(a).split(' '), d = 0, e = c.length; d < e; d++) '' != c[d] && b.resolutions.push(parseFloat(c[d]))
                },
            Width: function (a, b) {
              b.width = parseInt(this.getChildValue(a))
            },
            Height: function (a, b) {
              b.height = parseInt(this.getChildValue(a))
            },
            Layers: function (a, b) {
              b.layers = this.getChildValue(a)
            },
            Styles: function (a, b) {
              b.styles = this.getChildValue(a)
            }
          }, OpenLayers.Format.WMSCapabilities.v1_1_1.prototype.readers.wms)
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC'
      });
      OpenLayers.Format.WMSCapabilities.v1_1_0 = OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1, {
        version: '1.1.0',
        readers: {
          wms: OpenLayers.Util.applyDefaults({
            SRS: function (a, b) {
              for (var c = this.getChildValue(a).split(/ +/), d = 0, e = c.length; d < e; d++) b.srs[c[d]] = !0
                }
          }, OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers.wms)
        },
        CLASS_NAME: 'OpenLayers.Format.WMSCapabilities.v1_1_0'
      });
      OpenLayers.Control.LayerSwitcher = OpenLayers.Class(OpenLayers.Control, {
        roundedCorner: !1,
        roundedCornerColor: 'darkblue',
        layerStates: null,
        layersDiv: null,
        baseLayersDiv: null,
        baseLayers: null,
        dataLbl: null,
        dataLayersDiv: null,
        dataLayers: null,
        minimizeDiv: null,
        maximizeDiv: null,
        ascending: !0,
        initialize: function (a) {
          OpenLayers.Control.prototype.initialize.apply(this, arguments);
          this.layerStates = [
          ];
          this.roundedCorner && OpenLayers.Console.warn('roundedCorner option is deprecated')
        },
        destroy: function () {
          this.clearLayersArray('base');
          this.clearLayersArray('data');
          this.map.events.un({
            buttonclick: this.onButtonClick,
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
          });
          this.events.unregister('buttonclick', this, this.onButtonClick);
          OpenLayers.Control.prototype.destroy.apply(this, arguments)
        },
        setMap: function (a) {
          OpenLayers.Control.prototype.setMap.apply(this, arguments);
          this.map.events.on({
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
          });
          this.outsideViewport ? (this.events.attachToElement(this.div), this.events.register('buttonclick', this, this.onButtonClick))  : this.map.events.register('buttonclick', this, this.onButtonClick)
        },
        draw: function () {
          OpenLayers.Control.prototype.draw.apply(this);
          this.loadContents();
          this.outsideViewport || this.minimizeControl();
          this.redraw();
          return this.div
        },
        onButtonClick: function (a) {
          a = a.buttonElement;
          a === this.minimizeDiv ? this.minimizeControl()  : a === this.maximizeDiv ? this.maximizeControl()  : a._layerSwitcher ===
            this.id && (a['for'] && (a = document.getElementById(a['for'])), a.disabled || ('radio' == a.type ? (a.checked = !0, this.map.setBaseLayer(this.map.getLayer(a._layer)))  : (a.checked = !a.checked, this.updateMap())))
        },
        clearLayersArray: function (a) {
          this[a + 'LayersDiv'].innerHTML = '';
          this[a + 'Layers'] = [
          ]
        },
        checkRedraw: function () {
          var a = !1;
          if (!this.layerStates.length || this.map.layers.length != this.layerStates.length) a = !0;
          else for (var b = 0, c = this.layerStates.length; b < c; b++) {
            var d = this.layerStates[b],
                e = this.map.layers[b];
            if (d.name !=
                e.name || d.inRange != e.inRange || d.id != e.id || d.visibility != e.visibility) {
              a = !0;
              break
            }
          }
          return a
        },
        redraw: function () {
          if (!this.checkRedraw()) return this.div;
          this.clearLayersArray('base');
          this.clearLayersArray('data');
          var a = !1,
              b = !1,
              c = this.map.layers.length;
          this.layerStates = Array(c);
          for (var d = 0; d < c; d++) {
            var e = this.map.layers[d];
            this.layerStates[d] = {
              name: e.name,
              visibility: e.visibility,
              inRange: e.inRange,
              id: e.id
            }
          }
          var f = this.map.layers.slice();
          this.ascending || f.reverse();
          d = 0;
          for (c = f.length; d < c; d++) {
            var e = f[d],
                g = e.isBaseLayer;
            if (e.displayInLayerSwitcher) {
              g ? b = !0 : a = !0;
              var h = g ? e == this.map.baseLayer : e.getVisibility(),
                  i = document.createElement('input');
              i.id = this.id + '_input_' + e.name;
              i.name = g ? this.id + '_baseLayers' : e.name;
              i.type = g ? 'radio' : 'checkbox';
              i.value = e.name;
              i.checked = h;
              i.defaultChecked = h;
              i.className = 'olButton';
              i._layer = e.id;
              i._layerSwitcher = this.id;
              !g && !e.inRange && (i.disabled = !0);
              h = document.createElement('label');
              h['for'] = i.id;
              OpenLayers.Element.addClass(h, 'labelSpan olButton');
              h._layer = e.id;
              h._layerSwitcher = this.id;
              !g && !e.inRange && (h.style.color = 'gray');
              h.innerHTML = e.name;
              h.style.verticalAlign = g ? 'bottom' : 'baseline';
              var j = document.createElement('br');
              (g ? this.baseLayers : this.dataLayers).push({
                layer: e,
                inputElem: i,
                labelSpan: h
              });
              e = g ? this.baseLayersDiv : this.dataLayersDiv;
              e.appendChild(i);
              e.appendChild(h);
              e.appendChild(j)
            }
          }
          this.dataLbl.style.display = a ? '' : 'none';
          this.baseLbl.style.display = b ? '' : 'none';
          return this.div
        },
        updateMap: function () {
          for (var a = 0, b = this.baseLayers.length; a < b; a++) {
            var c = this.baseLayers[a];
            c.inputElem.checked && this.map.setBaseLayer(c.layer, !1)
          }
          a = 0;
          for (b = this.dataLayers.length; a < b; a++) c = this.dataLayers[a],
            c.layer.setVisibility(c.inputElem.checked)
            },
        maximizeControl: function (a) {
          this.div.style.width = '';
          this.div.style.height = '';
          this.showControls(!1);
          null != a && OpenLayers.Event.stop(a)
        },
        minimizeControl: function (a) {
          this.div.style.width = '0px';
          this.div.style.height = '0px';
          this.showControls(!0);
          null != a && OpenLayers.Event.stop(a)
        },
        showControls: function (a) {
          this.maximizeDiv.style.display = a ? '' : 'none';
          this.minimizeDiv.style.display = a ? 'none' : '';
          this.layersDiv.style.display = a ? 'none' : ''
        },
        loadContents: function () {
          this.layersDiv = document.createElement('div');
          this.layersDiv.id = this.id + '_layersDiv';
          OpenLayers.Element.addClass(this.layersDiv, 'layersDiv');
          this.baseLbl = document.createElement('div');
          this.baseLbl.innerHTML = OpenLayers.i18n('Base Layer');
          OpenLayers.Element.addClass(this.baseLbl, 'baseLbl');
          this.baseLayersDiv = document.createElement('div');
          OpenLayers.Element.addClass(this.baseLayersDiv, 'baseLayersDiv');
          this.dataLbl = document.createElement('div');
          this.dataLbl.innerHTML = OpenLayers.i18n('Overlays');
          OpenLayers.Element.addClass(this.dataLbl, 'dataLbl');
          this.dataLayersDiv = document.createElement('div');
          OpenLayers.Element.addClass(this.dataLayersDiv, 'dataLayersDiv');
          this.ascending ? (this.layersDiv.appendChild(this.baseLbl), this.layersDiv.appendChild(this.baseLayersDiv), this.layersDiv.appendChild(this.dataLbl), this.layersDiv.appendChild(this.dataLayersDiv))  : (this.layersDiv.appendChild(this.dataLbl), this.layersDiv.appendChild(this.dataLayersDiv), this.layersDiv.appendChild(this.baseLbl), this.layersDiv.appendChild(this.baseLayersDiv));
          this.div.appendChild(this.layersDiv);
          this.roundedCorner && (OpenLayers.Rico.Corner.round(this.div, {
            corners: 'tl bl',
            bgColor: 'transparent',
            color: this.roundedCornerColor,
            blend: !1
          }), OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.75));
          var a = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
          this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv('OpenLayers_Control_MaximizeDiv', null, null, a, 'absolute');
          OpenLayers.Element.addClass(this.maximizeDiv, 'maximizeDiv olButton');
          this.maximizeDiv.style.display = 'none';
          this.div.appendChild(this.maximizeDiv);
          a = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
          this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv('OpenLayers_Control_MinimizeDiv', null, null, a, 'absolute');
          OpenLayers.Element.addClass(this.minimizeDiv, 'minimizeDiv olButton');
          this.minimizeDiv.style.display = 'none';
          this.div.appendChild(this.minimizeDiv)
        },
        CLASS_NAME: 'OpenLayers.Control.LayerSwitcher'
      });
      OpenLayers.Format.Atom = OpenLayers.Class(OpenLayers.Format.XML, {
        namespaces: {
          atom: 'http://www.w3.org/2005/Atom',
          georss: 'http://www.georss.org/georss'
        },
        feedTitle: 'untitled',
        defaultEntryTitle: 'untitled',
        gmlParser: null,
        xy: !1,
        read: function (a) {
          'string' == typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          return this.parseFeatures(a)
        },
        write: function (a) {
          var b;
          if (OpenLayers.Util.isArray(a)) {
            b = this.createElementNSPlus('atom:feed');
            b.appendChild(this.createElementNSPlus('atom:title', {
              value: this.feedTitle
            }));
            for (var c = 0, d = a.length; c < d; c++) b.appendChild(this.buildEntryNode(a[c]))
              } else b = this.buildEntryNode(a);
          return OpenLayers.Format.XML.prototype.write.apply(this, [
            b
          ])
        },
        buildContentNode: function (a) {
          var b = this.createElementNSPlus('atom:content', {
            attributes: {
              type: a.type || null
            }
          });
          if (a.src) b.setAttribute('src', a.src);
          else if ('text' == a.type || null == a.type) b.appendChild(this.createTextNode(a.value));
          else if ('html' == a.type) {
            if ('string' != typeof a.value) throw 'HTML content must be in form of an escaped string';
            b.appendChild(this.createTextNode(a.value))
          } else 'xhtml' ==
            a.type ? b.appendChild(a.value)  : 'xhtml' == a.type || a.type.match(/(\+|\/)xml$/) ? b.appendChild(a.value)  : b.appendChild(this.createTextNode(a.value));
          return b
        },
        buildEntryNode: function (a) {
          var b = a.attributes,
              c = b.atom || {
              },
              d = this.createElementNSPlus('atom:entry');
          if (c.authors) for (var e = OpenLayers.Util.isArray(c.authors) ? c.authors : [
            c.authors
          ], f = 0, g = e.length; f < g; f++) d.appendChild(this.buildPersonConstructNode('author', e[f]));
          if (c.categories) for (var e = OpenLayers.Util.isArray(c.categories) ? c.categories : [
            c.categories
          ], h, f = 0, g = e.length; f < g; f++) h = e[f],
            d.appendChild(this.createElementNSPlus('atom:category', {
            attributes: {
              term: h.term,
              scheme: h.scheme || null,
              label: h.label || null
            }
          }));
          c.content && d.appendChild(this.buildContentNode(c.content));
          if (c.contributors) {
            e = OpenLayers.Util.isArray(c.contributors) ? c.contributors : [
              c.contributors
            ];
            f = 0;
            for (g = e.length; f < g; f++) d.appendChild(this.buildPersonConstructNode('contributor', e[f]))
              }
          a.fid && d.appendChild(this.createElementNSPlus('atom:id', {
            value: a.fid
          }));
          if (c.links) {
            e = OpenLayers.Util.isArray(c.links) ?
              c.links : [
              c.links
            ];
            f = 0;
            for (g = e.length; f < g; f++) h = e[f],
              d.appendChild(this.createElementNSPlus('atom:link', {
              attributes: {
                href: h.href,
                rel: h.rel || null,
                type: h.type || null,
                hreflang: h.hreflang || null,
                title: h.title || null,
                length: h.length || null
              }
            }))
              }
          c.published && d.appendChild(this.createElementNSPlus('atom:published', {
            value: c.published
          }));
          c.rights && d.appendChild(this.createElementNSPlus('atom:rights', {
            value: c.rights
          }));
          if (c.summary || b.description) d.appendChild(this.createElementNSPlus('atom:summary', {
            value: c.summary || b.description
          }));
          d.appendChild(this.createElementNSPlus('atom:title', {
            value: c.title || b.title || this.defaultEntryTitle
          }));
          c.updated && d.appendChild(this.createElementNSPlus('atom:updated', {
            value: c.updated
          }));
          a.geometry && (b = this.createElementNSPlus('georss:where'), b.appendChild(this.buildGeometryNode(a.geometry)), d.appendChild(b));
          return d
        },
        initGmlParser: function () {
          this.gmlParser = new OpenLayers.Format.GML.v3({
            xy: this.xy,
            featureNS: 'http://example.com#feature',
            internalProjection: this.internalProjection,
            externalProjection: this.externalProjection
          })
        },
        buildGeometryNode: function (a) {
          this.gmlParser || this.initGmlParser();
          return this.gmlParser.writeNode('feature:_geometry', a).firstChild
        },
        buildPersonConstructNode: function (a, b) {
          var c = [
            'uri',
            'email'
          ],
              d = this.createElementNSPlus('atom:' + a);
          d.appendChild(this.createElementNSPlus('atom:name', {
            value: b.name
          }));
          for (var e = 0, f = c.length; e < f; e++) b[c[e]] && d.appendChild(this.createElementNSPlus('atom:' + c[e], {
            value: b[c[e]]
          }));
          return d
        },
        getFirstChildValue: function (a, b, c, d) {
          return (a = this.getElementsByTagNameNS(a, b, c)) && 0 < a.length ? this.getChildValue(a[0], d)  : d
        },
        parseFeature: function (a) {
          var b = {
          },
              c = null,
              d = null,
              e = null,
              f = this.namespaces.atom;
          this.parsePersonConstructs(a, 'author', b);
          d = this.getElementsByTagNameNS(a, f, 'category');
          0 < d.length && (b.categories = [
          ]);
          for (var g = 0, h = d.length; g < h; g++) {
            c = {
            };
            c.term = d[g].getAttribute('term');
            if (e = d[g].getAttribute('scheme')) c.scheme = e;
            if (e = d[g].getAttribute('label')) c.label = e;
            b.categories.push(c)
          }
          d = this.getElementsByTagNameNS(a, f, 'content');
          if (0 < d.length) {
            c = {
            };
            if (e = d[0].getAttribute('type')) c.type = e;
            (e = d[0].getAttribute('src')) ? c.src = e : (c.value = 'text' == c.type || 'html' == c.type || null == c.type ? this.getFirstChildValue(a, f, 'content', null)  : 'xhtml' == c.type || c.type.match(/(\+|\/)xml$/) ? this.getChildEl(d[0])  : this.getFirstChildValue(a, f, 'content', null), b.content = c)
          }
          this.parsePersonConstructs(a, 'contributor', b);
          b.id = this.getFirstChildValue(a, f, 'id', null);
          d = this.getElementsByTagNameNS(a, f, 'link');
          0 < d.length && (b.links = Array(d.length));
          for (var i = [
            'rel',
            'type',
            'hreflang',
            'title',
            'length'
          ], g = 0, h = d.length; g < h; g++) {
            c = {
            };
            c.href = d[g].getAttribute('href');
            for (var j = 0, k = i.length; j < k; j++) (e = d[g].getAttribute(i[j])) && (c[i[j]] = e);
            b.links[g] = c
          }
          if (c = this.getFirstChildValue(a, f, 'published', null)) b.published = c;
          if (c = this.getFirstChildValue(a, f, 'rights', null)) b.rights = c;
          if (c = this.getFirstChildValue(a, f, 'summary', null)) b.summary = c;
          b.title = this.getFirstChildValue(a, f, 'title', null);
          b.updated = this.getFirstChildValue(a, f, 'updated', null);
          c = {
            title: b.title,
            description: b.summary,
            atom: b
          };
          a = this.parseLocations(a) [0];
          a = new OpenLayers.Feature.Vector(a, c);
          a.fid = b.id;
          return a
        },
        parseFeatures: function (a) {
          var b = [
          ],
              c = this.getElementsByTagNameNS(a, this.namespaces.atom, 'entry');
          0 == c.length && (c = [
            a
          ]);
          for (var a = 0, d = c.length; a < d; a++) b.push(this.parseFeature(c[a]));
          return b
        },
        parseLocations: function (a) {
          var b = this.namespaces.georss,
              c = {
                components: [
                ]
              },
              d = this.getElementsByTagNameNS(a, b, 'where');
          if (d && 0 < d.length) {
            this.gmlParser || this.initGmlParser();
            for (var e = 0, f = d.length; e < f; e++) this.gmlParser.readChildNodes(d[e], c)
              }
          c = c.components;
          if ((d = this.getElementsByTagNameNS(a, b, 'point')) && 0 < d.length) {
            e = 0;
            for (f = d.length; e < f; e++) {
              var g = OpenLayers.String.trim(d[e].firstChild.nodeValue).split(/\s+/);
              2 != g.length && (g = OpenLayers.String.trim(d[e].firstChild.nodeValue).split(/\s*,\s*/));
              c.push(new OpenLayers.Geometry.Point(g[1], g[0]))
            }
          }
          var h = this.getElementsByTagNameNS(a, b, 'line');
          if (h && 0 < h.length) for (var i, e = 0, f = h.length; e < f; e++) {
            d = OpenLayers.String.trim(h[e].firstChild.nodeValue).split(/\s+/);
            i = [
            ];
            for (var j = 0, k = d.length; j <
                 k; j += 2) g = new OpenLayers.Geometry.Point(d[j + 1], d[j]),
              i.push(g);
            c.push(new OpenLayers.Geometry.LineString(i))
          }
          if ((a = this.getElementsByTagNameNS(a, b, 'polygon')) && 0 < a.length) {
            e = 0;
            for (f = a.length; e < f; e++) {
              d = OpenLayers.String.trim(a[e].firstChild.nodeValue).split(/\s+/);
              i = [
              ];
              j = 0;
              for (k = d.length; j < k; j += 2) g = new OpenLayers.Geometry.Point(d[j + 1], d[j]),
                i.push(g);
              c.push(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(c)]))
            }
          }
          if (this.internalProjection && this.externalProjection) {
            e = 0;
            for (f = c.length; e <
                 f; e++) c[e] && c[e].transform(this.externalProjection, this.internalProjection)
              }
          return c
        },
        parsePersonConstructs: function (a, b, c) {
          for (var d = [
          ], e = this.namespaces.atom, a = this.getElementsByTagNameNS(a, e, b), f = [
            'uri',
            'email'
          ], g = 0, h = a.length; g < h; g++) {
            var i = {
            };
            i.name = this.getFirstChildValue(a[g], e, 'name', null);
            for (var j = 0, k = f.length; j < k; j++) {
              var l = this.getFirstChildValue(a[g], e, f[j], null);
              l && (i[f[j]] = l)
            }
            d.push(i)
          }
          0 < d.length && (c[b + 's'] = d)
        },
        CLASS_NAME: 'OpenLayers.Format.Atom'
      });
      OpenLayers.Control.KeyboardDefaults = OpenLayers.Class(OpenLayers.Control, {
        autoActivate: !0,
        slideFactor: 75,
        observeElement: null,
        draw: function () {
          this.handler = new OpenLayers.Handler.Keyboard(this, {
            keydown: this.defaultKeyPress
          }, {
            observeElement: this.observeElement || document
          })
        },
        defaultKeyPress: function (a) {
          var b,
              c = !0;
          switch (a.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
              this.map.pan( - this.slideFactor, 0);
              break;
            case OpenLayers.Event.KEY_RIGHT:
              this.map.pan(this.slideFactor, 0);
              break;
            case OpenLayers.Event.KEY_UP:
              this.map.pan(0, - this.slideFactor);
              break;
            case OpenLayers.Event.KEY_DOWN:
              this.map.pan(0, this.slideFactor);
              break;
            case 33:
              b = this.map.getSize();
              this.map.pan(0, - 0.75 * b.h);
              break;
            case 34:
              b = this.map.getSize();
              this.map.pan(0, 0.75 * b.h);
              break;
            case 35:
              b = this.map.getSize();
              this.map.pan(0.75 * b.w, 0);
              break;
            case 36:
              b = this.map.getSize();
              this.map.pan( - 0.75 * b.w, 0);
              break;
            case 43:
            case 61:
            case 187:
            case 107:
              this.map.zoomIn();
              break;
            case 45:
            case 109:
            case 189:
            case 95:
              this.map.zoomOut();
              break;
            default:
              c = !1
          }
          c && OpenLayers.Event.stop(a)
        },
        CLASS_NAME: 'OpenLayers.Control.KeyboardDefaults'
      });
      OpenLayers.Format.WMTSCapabilities.v1_0_0 = OpenLayers.Class(OpenLayers.Format.OWSCommon.v1_1_0, {
        version: '1.0.0',
        namespaces: {
          ows: 'http://www.opengis.net/ows/1.1',
          wmts: 'http://www.opengis.net/wmts/1.0',
          xlink: 'http://www.w3.org/1999/xlink'
        },
        yx: null,
        defaultPrefix: 'wmts',
        initialize: function (a) {
          OpenLayers.Format.XML.prototype.initialize.apply(this, [
            a
          ]);
          this.options = a;
          a = OpenLayers.Util.extend({
          }, OpenLayers.Format.WMTSCapabilities.prototype.yx);
          this.yx = OpenLayers.Util.extend(a, this.yx)
        },
        read: function (a) {
          'string' ==
            typeof a && (a = OpenLayers.Format.XML.prototype.read.apply(this, [
            a
          ]));
          a && 9 == a.nodeType && (a = a.documentElement);
          var b = {
          };
          this.readNode(a, b);
          b.version = this.version;
          return b
        },
        readers: {
          wmts: {
            Capabilities: function (a, b) {
              this.readChildNodes(a, b)
            },
            Contents: function (a, b) {
              b.contents = {
              };
              b.contents.layers = [
              ];
              b.contents.tileMatrixSets = {
              };
              this.readChildNodes(a, b.contents)
            },
            Layer: function (a, b) {
              var c = {
                styles: [
                ],
                formats: [
                ],
                dimensions: [
                ],
                tileMatrixSetLinks: [
                ],
                layers: [
                ]
              };
              this.readChildNodes(a, c);
              b.layers.push(c)
            },
            Style: function (a, b) {
              var c = {
              };
              c.isDefault = 'true' === a.getAttribute('isDefault');
              this.readChildNodes(a, c);
              b.styles.push(c)
            },
            Format: function (a, b) {
              b.formats.push(this.getChildValue(a))
            },
            TileMatrixSetLink: function (a, b) {
              var c = {
              };
              this.readChildNodes(a, c);
              b.tileMatrixSetLinks.push(c)
            },
            TileMatrixSet: function (a, b) {
              if (b.layers) {
                var c = {
                  matrixIds: [
                  ]
                };
                this.readChildNodes(a, c);
                b.tileMatrixSets[c.identifier] = c
              } else b.tileMatrixSet = this.getChildValue(a)
                },
            TileMatrix: function (a, b) {
              var c = {
                supportedCRS: b.supportedCRS
              };
              this.readChildNodes(a, c);
              b.matrixIds.push(c)
            },
            ScaleDenominator: function (a, b) {
              b.scaleDenominator = parseFloat(this.getChildValue(a))
            },
            TopLeftCorner: function (a, b) {
              var c = this.getChildValue(a).split(' '),
                  d;
              b.supportedCRS && (d = !!this.yx[b.supportedCRS.replace(/urn:ogc:def:crs:(\w+):.+:(\w+)$/, 'urn:ogc:def:crs:$1::$2')]);
              b.topLeftCorner = d ? new OpenLayers.LonLat(c[1], c[0])  : new OpenLayers.LonLat(c[0], c[1])
            },
            TileWidth: function (a, b) {
              b.tileWidth = parseInt(this.getChildValue(a))
            },
            TileHeight: function (a, b) {
              b.tileHeight = parseInt(this.getChildValue(a))
            },
            MatrixWidth: function (a, b) {
              b.matrixWidth = parseInt(this.getChildValue(a))
            },
            MatrixHeight: function (a, b) {
              b.matrixHeight = parseInt(this.getChildValue(a))
            },
            ResourceURL: function (a, b) {
              b.resourceUrl = b.resourceUrl || {
              };
              b.resourceUrl[a.getAttribute('resourceType')] = {
                format: a.getAttribute('format'),
                template: a.getAttribute('template')
              }
            },
            WSDL: function (a, b) {
              b.wsdl = {
              };
              b.wsdl.href = a.getAttribute('xlink:href')
            },
            ServiceMetadataURL: function (a, b) {
              b.serviceMetadataUrl = {
              };
              b.serviceMetadataUrl.href = a.getAttribute('xlink:href')
            },
            LegendURL: function (a, b) {
              b.legend = {
              };
              b.legend.href = a.getAttribute('xlink:href');
              b.legend.format = a.getAttribute('format')
            },
            Dimension: function (a, b) {
              var c = {
                values: [
                ]
              };
              this.readChildNodes(a, c);
              b.dimensions.push(c)
            },
            Default: function (a, b) {
              b['default'] = this.getChildValue(a)
            },
            Value: function (a, b) {
              b.values.push(this.getChildValue(a))
            }
          },
          ows: OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows
        },
        CLASS_NAME: 'OpenLayers.Format.WMTSCapabilities.v1_0_0'
      });
    console.log('UpgradeOL: finished');
  }
  function checkReady() {
    if (typeof OpenLayers == 'undefined') {
      setTimeout(checkReady, 100);
      console.log('UpgradeOL: Timeout 100 ms');
      return;
    }
    console.log('UpgradeOL: activate');
    upgradeOL();
  }
  checkReady();
})();
