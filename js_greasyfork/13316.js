// ==UserScript==
// @name        WME Road Events Data
// @namespace   http://www.tomputtemans.com/
// @description Retrieve and show road events
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     1.8.2
// @connect     geo.api.vlaanderen.be
// @connect     *
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13316/WME%20Road%20Events%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/13316/WME%20Road%20Events%20Data.meta.js
// ==/UserScript==

/* global I18n, W, $, OpenLayers */

let styleElement;

(function() {
  var UI = {},
    RoadEvents;
  let dateFormat = new Intl.DateTimeFormat("nl-BE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  function roadEventsInit() {
    var userInfo = document.getElementById('user-info');

    // Check initialisation
    if (typeof W == 'undefined' || typeof I18n == 'undefined') {
      setTimeout(roadEventsInit, 660);
      log('Waze object unavailable, map still loading');
      return;
    }
    if (userInfo === null) {
      setTimeout(roadEventsInit, 660);
      log('User info unavailable, map still loading');
      return;
    }
    var navTabs = userInfo.querySelector('.nav-tabs');
    if (navTabs === null) {
      setTimeout(roadEventsInit, 660);
      log('Nav tabs unavailable, map still loading');
      return;
    }
    log('Road Events initated');

    // Set translation strings
    addTranslations();

    if (!localStorage.WME_RoadEventsData) {
      var data = {};
      data.disabledSources = [];
      data.relevantOnly = true;
      localStorage.WME_RoadEventsData = JSON.stringify(data);
    }

    UI.Tab = function() {
      log("Configuring UI");
      var tabContent = userInfo.querySelector('.tab-content'),
          roadEventsTab = document.createElement('li'),
          roadEventsContent = document.createElement('div'),
          roadEventsFooter = document.createElement('p');

      roadEventsTab.innerHTML = '<a href="#sidepanel-roadEvents" data-toggle="tab">' + I18n.t('road_events.tab_name') + '</a>';
      roadEventsContent.id = 'sidepanel-roadEvents';
      roadEventsContent.className = 'tab-pane';
      navTabs.appendChild(roadEventsTab);
      tabContent.appendChild(roadEventsContent);
      roadEventsFooter.appendChild(document.createTextNode(GM_info.script.name + ': v' + GM_info.script.version));
      roadEventsFooter.style.fontSize = '11px';
      roadEventsFooter.style.marginTop = '1em';
      roadEventsContent.appendChild(roadEventsFooter);

      return {
        add: function(element) {
          roadEventsContent.insertBefore(element, roadEventsFooter);
        }
      };
    }();
    UI.ResultList = function() {
      var filterPane = document.createElement('div');
      // List to contain results encapsulated in this object
      var ul = document.createElement('ul');
      filterPane.style.display = 'none';
      filterPane.style.marginTop  = '5px';

      function createButton(text, handler, title) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-default';
        button.innerHTML = text;
        button.addEventListener('click', handler, true);
        if (title) {
          button.title = title;
          $(button).tooltip();
        }
        return button;
      }

      function clearList() {
        while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }
      }

      // Add search button
      var searchButton = createButton(I18n.t('road_events.search.button_label'), function() {
        RoadEvents.update();
        return false;
      });
      UI.Tab.add(searchButton);

      // Add filter button
      var filterButton = createButton('<span class="fa" style="font-size:14px"></span>', function() {
        $(filterPane).toggle();
        return false;
      }, I18n.t('road_events.search.filter_title'));
      filterButton.style.marginLeft = '0.4em';
      UI.Tab.add(filterButton);

      // Add clear button
      var clearButton = createButton('<span class="fa" style="font-size:14px"></span>', function() {
        clearList();
        UI.Layer.clear();
        UI.ItemDetail.hide();
        UI.ResultList.show();
        return false;
      }, I18n.t('road_events.results.clear_title'));
      clearButton.className = 'btn btn-danger';
      clearButton.style.marginLeft = '0.2em';
      UI.Tab.add(clearButton);

      // Fill in filter pane
      var filterForm = document.createElement('form');
      filterForm.className = 'form-horizontal';
      var sourceGroup = document.createElement('div');
      sourceGroup.className = 'form-group';
      sourceGroup.style.backgroundColor = '#ccc';
      sourceGroup.style.paddingBottom = '5px';
      var generalLabel = document.createElement('label');
      generalLabel.className = 'col-sm-3 control-label';
      generalLabel.appendChild(document.createTextNode('Sources:'));
      sourceGroup.appendChild(generalLabel);
      var sourceList = document.createElement('div');
      sourceList.className = 'col-sm-9';
      sourceGroup.appendChild(sourceList);

      // Allow showing only the relevant data
      var relevantOnlyGroup = document.createElement('div');
      relevantOnlyGroup.className = 'checkbox col-sm-12';
      var relevantOnlyLabel = document.createElement('label');
      var relevantOnlyCheckbox = document.createElement('input');
      relevantOnlyCheckbox.type = 'checkbox';
      relevantOnlyCheckbox.checked = JSON.parse(localStorage.WME_RoadEventsData).relevantOnly !== false;
      relevantOnlyLabel.appendChild(relevantOnlyCheckbox);
      relevantOnlyLabel.appendChild(document.createTextNode(I18n.t('road_events.search.relevant_results_only')));
      relevantOnlyGroup.appendChild(relevantOnlyLabel);
      relevantOnlyCheckbox.addEventListener('click', () => {
        let data = JSON.parse(localStorage.WME_RoadEventsData);
        data.relevantOnly = relevantOnlyCheckbox.checked;
        localStorage.WME_RoadEventsData = JSON.stringify(data);
      });
      sourceGroup.appendChild(relevantOnlyGroup);

      filterForm.appendChild(sourceGroup);
      filterPane.appendChild(filterForm);
      UI.Tab.add(filterPane);

      ul.className = 'result-list';
      UI.Tab.add(ul);

      return {
        // Populate the result list with an array of events
        fill: function(events) {
          this.clear();
          ul.style.listStyleType = 'decimal';
          events.forEach(function(event, index) {
            var li = document.createElement('li');
            var head = document.createElement('p');
            head.className = 'title';
            if (event.color) {
              head.style.paddingLeft = '5px';
              head.style.borderLeft = '3px solid ' + event.color;
            }
            head.innerHTML = event.description;
            li.appendChild(head);
            var subhead = document.createElement('p');
            subhead.className = 'additional-info';
            subhead.style.fontWeight = 'normal';
            if (event.color) {
              subhead.style.paddingLeft = '8px';
            }
            subhead.appendChild(document.createTextNode(dateFormat.format(new Date(event.start))));
            if (event.end) {
              var separator = document.createElement('i');
              separator.className = 'fa fa-fw fa-chevron-right';
              subhead.appendChild(separator);
              subhead.appendChild(document.createTextNode(dateFormat.format(new Date(event.end))));
            }
            li.appendChild(subhead);
            li.addEventListener('click', function() {
              RoadEvents.show(event, index + 1);
            });
            ul.appendChild(li);
          });
          UI.ItemDetail.hide();
          UI.ResultList.show();
        },
        clear: clearList,
        setStatus: function(status, count) {
          var title, info;

          this.clear();
          ul.style.listStyleType = 'none';
          if (status == 'loading') {
            title = I18n.t('road_events.search.loading_header');
            info = I18n.t('road_events.search.loading_subheader', {count: count});
          } else if (status == 'noResult') {
            title = I18n.t('road_events.results.empty_header');
            info = I18n.t('road_events.results.empty_subheader');
          } else if (status == 'noSources') {
            title = I18n.t('road_events.results.no_sources_header');
            info = I18n.t('road_events.results.no_sources_subheader');
          } else {
            log('Invalid status received: ' + status);
            throw new Error('Invalid status received: ' + status);
          }
          var li = document.createElement('li');
          li.className = 'result';
          li.style.fontWeight = 'bold';
          li.style.paddingLeft = '0';
          var head = document.createElement('p');
          head.className = 'title';
          head.appendChild(document.createTextNode(title));
          li.appendChild(head);
          var subhead = document.createElement('p');
          subhead.className = 'additional-info';
          subhead.style.fontWeight = 'normal';
          subhead.appendChild(document.createTextNode(info));
          li.appendChild(subhead);
          ul.appendChild(li);
          UI.ItemDetail.hide();
          UI.ResultList.show();
        },
        show: function() {
          ul.style.display = 'block';
        },
        hide: function() {
          ul.style.display = 'none';
        },
        addFilter: function(sourceName, enabled, action) {
          var newSource = document.createElement('div');
          newSource.className = 'checkbox';
          var sourceLabel = document.createElement('label');
          var sourceCheckbox = document.createElement('input');
          sourceCheckbox.type = 'checkbox';
          sourceCheckbox.checked = enabled;
          sourceLabel.appendChild(sourceCheckbox);
          sourceLabel.appendChild(document.createTextNode(sourceName));
          newSource.appendChild(sourceLabel);
          sourceCheckbox.addEventListener('click', function(e) { action(this.checked); });
          sourceList.appendChild(newSource);
        }
      };
    }();
    UI.ItemDetail = function() {
      var pane = document.createElement('div');
      pane.style.display = 'none';
      pane.style.marginTop = '8px';
      var details = document.createElement('div');
      var backToList = document.createElement('button');
      var backToListIcon = document.createElement('span');
      var listeners = [];

      function returnToList() {
        UI.Layer.removeType("area");
        UI.ItemDetail.hide();
        UI.ResultList.show();
      }

      backToListIcon.className = 'fa';
      backToListIcon.appendChild(document.createTextNode(''));
      backToListIcon.style.marginRight = '1em';
      backToList.appendChild(backToListIcon);
      backToList.appendChild(document.createTextNode(I18n.t('road_events.detail.back_to_list')));
      backToList.className = 'btn btn-link';
      var backToListBottom = backToList.cloneNode(true);
      backToList.addEventListener('click', returnToList);
      backToListBottom.addEventListener('click', returnToList);
      pane.appendChild(backToList);
      pane.appendChild(details);
      pane.appendChild(backToListBottom);
      UI.Tab.add(pane);

      return {
        set: function(event, index) {
          this.clear();
          var eventTitle  = document.createElement('h3');
          eventTitle.style.borderBottom = '1px solid #cecece';
          eventTitle.textContent = (index ? index + '. ' : '') + event.detail.description;
          details.appendChild(eventTitle);
          var moreInfoHeader = document.createElement('h3');
          moreInfoHeader.style.marginTop = '1em';
          moreInfoHeader.textContent = I18n.t('road_events.detail.more_info');
          var moreInfoDataContainer = document.createElement('fieldset');
          var moreInfoData = document.createElement('p');
          moreInfoDataContainer.appendChild(moreInfoData);
          if (event.start) {
            moreInfoData.innerHTML = '<strong>' + I18n.t('road_events.detail.start_date') + ':</strong> ' + dateFormat.format(new Date(event.start)) + '<br />';
          }
          if (event.end) {
            moreInfoData.innerHTML += '<strong>' + I18n.t('road_events.detail.end_date') + ':</strong> ' + dateFormat.format(new Date(event.end)) + '<br />';
          }
          if (event.id) {
            moreInfoData.innerHTML += '<strong>' + I18n.t('road_events.detail.id') + ':</strong> ' + formatDataField(escapeString(event.id)) + '<br />';
          }
          if (moreInfoData.childNodes.length > 0) {
            details.appendChild(moreInfoHeader);
            details.appendChild(moreInfoData);
          }
          for (var group in event.detail) {
            if (typeof event.detail[group] === 'string') {
              continue;
            }
            var sectionHeader = document.createElement('h3');
            sectionHeader.style.marginTop = '1em';
            sectionHeader.textContent = I18n.t('road_events.detail.' + group);
            details.appendChild(sectionHeader);
            var p = document.createElement('p');
            for (var name in event.detail[group]) {
              var item = event.detail[group][name];
              if (item !== null && item.length !== 0) {
                if (Array.isArray(item)) {
                  p.innerHTML += '<strong>' + I18n.t('road_events.detail.' + name, {count: item.length}) + ":</strong> ";
                  p.innerHTML += item.join(', ');
                } else {
                  p.innerHTML += '<strong>' + I18n.t('road_events.detail.' + name) + ":</strong> ";
                  if (typeof item === 'boolean') {
                    p.innerHTML += I18n.t('road_events.detail.' + (item ? 'yes' : 'no'));
                  } else if (typeof item === 'string' && item.startsWith('http')) {
                    p.innerHTML += '<a href="' + item + '" target="_blank">' + item + '</a>';
                  } else {
                    p.innerHTML += item;
                  }
                }
                p.innerHTML += '<br/>';
              }
            }
            details.appendChild(p);
          }
          UI.ResultList.hide();
          UI.ItemDetail.show();
        },
        clear: function() {
          while (details.firstChild) {
            details.removeChild(details.firstChild);
          }
        },
        show: function() {
          pane.style.display = 'block';
        },
        hide: function() {
          pane.style.display = 'none';
        }
      };
    }();
    UI.Layer = function() {
      var layer = new OpenLayers.Layer.Vector(I18n.t('road_events.layer_label'), {
        styleMap: new OpenLayers.StyleMap({
          'default': new OpenLayers.Style({
            pointRadius: 10,
            strokeColor: '#eee',
            fillColor: '${color}',
            fontColor: '#fff',
            fontWeight: 'bold',
            label: '${index}'
          }),
          'select': new OpenLayers.Style({
            pointRadius: 10,
            strokeColor: '#aaa',
            fillColor: '${color}',
            fontColor: '#fff',
            fontWeight: 'bold',
            label: '${index}'
          })
        })
      });
      W.map.addLayer(layer);

      function makeVector(event) {
        return new OpenLayers.Feature.Vector(
          event.coordinate,
          { type: 'marker', description: event.description, id: event.id, color: event.color, index: event.index.toString() }
        );
      }

      return {
        // Add a vector
        add: function(vector) {
          layer.addFeatures([ vector ]);
        },
        // Add a set of road events to the map at once
        fill: function(events) {
          this.clear();
          if (events) {
            var vectors = events.map(makeVector);
            layer.addFeatures(vectors);
          }
        },
        // Remove all features for which a certain attribute is set
        removeType: function(type) {
          layer.removeFeatures(layer.getFeaturesByAttribute('type', type));
        },
        // Clear the layer by removing all features
        clear: function() {
          layer.removeAllFeatures();
        }
      };
    }();

    RoadEvents = function() {
      var activeEvent = null,
        sources = {};

      // Hook into dialog-container for closure addition prefilling
      var observer = new MutationObserver(function(mutations) {
        if (activeEvent !== null) {
          mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
              var node = mutation.addedNodes[i];
              if (node !== Node.ELEMENT_NODE) {
                continue;
              }
              if (node.querySelector('.edit-closure.new')) {
                node.querySelector("input.form-control[name='closure_reason']").value = activeEvent.detail.description;
                if (activeEvent.start) {
                  node.querySelector("input[name='closure_hasStartDate']").checked = true;
                  node.querySelector("input.form-control[name='closure_startDate']").value = activeEvent.start.getFullYear() + '-' + zeroPad(activeEvent.start.getMonth()+1) + '-' + zeroPad(activeEvent.start.getDate());
                  node.querySelector("input.form-control[name='closure_startTime']").value = zeroPad(activeEvent.start.getHours()) + ':' + zeroPad(activeEvent.start.getMinutes());
                }
                if (activeEvent.end) {
                  node.querySelector("input.form-control[name='closure_endDate']").value = activeEvent.end.getFullYear() + '-' + zeroPad(activeEvent.end.getMonth()+1) + '-' + zeroPad(activeEvent.end.getDate());
                  node.querySelector("input.form-control[name='closure_endTime']").value = zeroPad(activeEvent.end.getHours()) + ':' + zeroPad(activeEvent.end.getMinutes());
                }
              }
            }
          });
        }
      });
      observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

      return {
        // Retrieve one specific event from a source
        show: function(event, index) {
          sources[event.source].get(event.id, function(detail) {
            UI.ItemDetail.set(detail, index);
            activeEvent = detail;
            if (detail.vector) {
              UI.Layer.add(detail.vector);
            }
            W.map.moveTo(OpenLayers.LonLat.fromArray([ event.coordinate.x, event.coordinate.y ]));
          });
        },
        // Update all sources for the current location
        update: function() {
          var promises = [];
          var viewBounds = W.map.getExtent();
          activeEvent = null;
          for (var source in sources) {
            if (!sources[source].disabled && sources[source].intersects(viewBounds)) {
              promises.push(sources[source].update());
            }
          }
          if (promises.length === 0) {
            UI.ResultList.setStatus('noSources');
            return;
          }
          UI.ResultList.setStatus('loading', promises.length);
          Promise.all(promises).then(function(results) {
            var roadEvents = results.reduce(function(prev, curr) {
              return prev.concat(curr);
            }).sort(function(a, b) {
              if (a.hindrance == b.hindrance) {
                return new Date(a.start).getTime() - new Date(b.start).getTime();
              } else {
                return (a.hindrance ? -1 : 1);
              }
            }).map(function(roadEvent, index) {
              roadEvent.index = index + 1;
              return roadEvent;
            });
            if (roadEvents.length > 0) {
              UI.ResultList.fill(roadEvents);
              UI.Layer.fill(roadEvents);
            } else {
              UI.ResultList.setStatus('noResult');
            }
          });
        },
        // Add a new source of road events
        addSource: function(source) {
          sources[source.id] = source;
          source.disabled = JSON.parse(localStorage.WME_RoadEventsData).disabledSources.indexOf(source.id) >= 0;
          UI.ResultList.addFilter(source.name, !source.disabled, function(enabled) {
            source.disabled = !enabled;

            var data = JSON.parse(localStorage.WME_RoadEventsData);
            if (enabled) {
              if (data.disabledSources.indexOf(source.id) >= 0) {
                data.disabledSources.splice(data.disabledSources.indexOf(source.id), 1);
              }
            } else {
              data.disabledSources.push(source.id);
            }
            localStorage.WME_RoadEventsData = JSON.stringify(data);
          });
        }
      };
    }();
    window.RoadEvents = RoadEvents;

    // Data source: GIPOD Mobility Hindrances (Flanders, Belgium)
    RoadEvents.addSource(function() {
      var url = 'https://geo.api.vlaanderen.be/GIPOD/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=GIPOD:HINDER&SRSNAME=urn:x-ogc:def:crs:EPSG:4326&outputFormat=application/json',
          projection = new OpenLayers.Projection("EPSG:4326"),
          cache = [], // cached event details,
          bounds = new OpenLayers.Bounds(280525, 6557859, 661237, 6712007)
          relevantConsequences = ['Geen doorgang voor gemotoriseerd verkeer', 'Geen doorgang voor gemotoriseerd verkeer uitgezonderd hulpdiensten', 'Geen doorgang voor gemotoriseerd verkeer uitgezonderd openbaar vervoer', 'Geen doorgang voor gemotoriseerd verkeer uitgezonderd plaatselijk verkeer', 'Afgesloten in 1 rijrichting', 'Afgesloten in 1 rijrichting uitgezonderd hulpdiensten', 'Afgesloten in 1 rijrichting uitgezonderd openbaar vervoer', 'Rijrichting omgekeerd'];

      return {
        id: 'gipod_mobility',
        name: 'GIPOD Mobility Hindrances',
        intersects: function(view) {
          return view.intersectsBounds(bounds);
        },
        update: function() {
          return new Promise(function(resolve, reject) {
            // Obtain the bounds of the current view
            var bounds = new OpenLayers.Bounds(W.map.calculateBounds());
            var bbox = bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top + ",EPSG:4326";
            GM_xmlhttpRequest({
              method: 'GET',
              url: url + '&BBOX=' + bbox,
              onload: function(response) {
                var rawData = JSON.parse(response.responseText);
                if (!rawData || !rawData.features) {
                  resolve([]);
                  return;
                }
                let isRelevant = (event) => {
                  // Don't filter if not requested
                  if (JSON.parse(localStorage.WME_RoadEventsData).relevantOnly === false) {
                    return true;
                  }
                  let consequences = event.properties.Consequences.split(';');
                  return relevantConsequences.some(consequence => consequences.includes(consequence));
                };
                var roadEvents = rawData.features.filter(isRelevant).map(function(data) {
                  let event = {
                    id: data.id,
                    source: 'gipod_mobility',
                    description: escapeString(data.properties.HindranceDescription),
                    start: data.properties.HindranceStart,
                    end: data.properties.HindranceEnd,
                    hindrance: data.properties.SevereHindrance,
                    color: (data.properties.SevereHindrance ? '#ff3333' : '#ff8c00'),
                    coordinate: (new OpenLayers.Bounds(data.bbox)).toGeometry().transform(projection, W.map.getProjectionObject()).getCentroid(),
                    rawData: data
                  };
                  console.log(event);
                  cache[data.id] = event;
                  return event;
                });
                resolve(roadEvents);
              },
              onerror: function(xhr, text) {
                resolve([]);
              }
            });
          });
        },
        get: function(gipodId, callback) {
          if (cache[gipodId]) {
            let data = cache[gipodId];
            let vector = null;
            if (data.rawData.geometry !== null) {
              let poly = null;
              if (data.rawData.geometry.type == 'Polygon') {
                let ring = new OpenLayers.Geometry.LinearRing(data.rawData.geometry.coordinates[0].map(function(coord) {
                  return new OpenLayers.Geometry.Point(coord[0], coord[1]).transform(projection, W.map.getProjectionObject());
                }));
                poly = new OpenLayers.Geometry.Polygon([ ring ]);
              } else if (data.rawData.geometry.type == 'MultiPolygon') {
                let rings = data.rawData.geometry.coordinates[0].map(function(coords) {
                  return new OpenLayers.Geometry.LinearRing(coords.map(function(coord) {
                    return new OpenLayers.Geometry.Point(coord[0], coord[1]).transform(projection, W.map.getProjectionObject());
                  }));
                });
                poly = new OpenLayers.Geometry.Polygon(rings);
              }
              if (poly !== null) {
                vector = new OpenLayers.Feature.Vector(poly, { type: 'area' }, { fillOpacity: 0.6, fillColor: '#ff8c00', strokeColor: '#eeeeee'});
              }
            }
            let sourceId = data.rawData.properties.HindranceConsequenceOf.split(';')[0].split('/').pop();
            let roadEvent = {
              detail: {
                description: data.description,
                identification: {
                  last_update: escapeString(dateFormat.format(new Date(data.rawData.properties.HindranceLastModifiedOn))),
                  created_on: escapeString(dateFormat.format(new Date(data.rawData.properties.HindranceCreatedOn))),
                  state: escapeString(data.rawData.properties.HindranceStatus),
                  id: escapeString(data.id),
                  source: 'GIPOD Mobility Hindrances'
                },
                hindrance: {
                  important_hindrance: data.hindrance === true,
                  effects: data.rawData.properties.Consequences ? data.rawData.properties.Consequences.split(';').map(escapeString) : ''
                },
                contact: {
                  owner: escapeString(data.rawData.properties.HindranceOwner)
                }
              },
              start: new Date(data.start),
              end: new Date(data.end),
              id: 'http://www.geopunt.be/kaart?app=Hinder_in_kaart_app&lang=nl&GIPODID=' + escapeString(sourceId) + '|' + escapeString(sourceId),
              vector: vector,
              rawData: data
            };
            callback(roadEvent);
          }
        }
      };
    }());

    // Data source: Waze alerts by Wazers
    RoadEvents.addSource(function() {
      var projection = new OpenLayers.Projection("EPSG:4326");
      var url = 'https://www.waze.com';
      switch (W.app.getAppRegionCode()) {
        case 'row':
          url += '/row-rtserver/web/TGeoRSS';
          break;
        case 'il':
          url += '/il-rtserver/web/TGeoRSS';
          break;
        default:
          url += '/rtserver/web/TGeoRSS';
      }
      var cache = {};

      return {
        id: 'waze_alerts',
        name: 'Waze livemap alerts',
        intersects: function(view) {
          return true; // Available worldwide
        },
        update: function() {
          return new Promise(function(resolve, reject) {
            var extent = W.map.getExtent().transform(W.map.getProjectionObject(), projection);
            var data = {
              types: "alerts",
              left: extent.left,
              right: extent.right,
              bottom: extent.bottom,
              top: extent.top
            };
            $.ajax({
              url: url,
              data: data,
              dataType: 'json'
            }).done(function(response) {
              var roadEvents = [];
              if (response.alerts) {
                response.alerts.forEach(function(alert) {
                  roadEvents.push({
                    id: alert.id,
                    source: 'waze_alerts',
                    description: escapeString(alert.type),
                    start: alert.pubMillis,
                    hindrance: false,
                    color: '#614051',
                    coordinate: new OpenLayers.Geometry.Point(alert.location.x, alert.location.y).transform(projection, W.map.getProjectionObject())
                  });
                  cache[alert.id] = alert;
                });
              }
              resolve(roadEvents);
            }).fail(function(xhr, text) {
              resolve([]);
            });
          });
        },
        get: function(id, callback) {
          var alert = cache[id],
              description = alert.type;
          if (alert.reportDescription) {
            description += ' ' + alert.reportDescription;
          }
          if (alert.subtype) {
            description += ' ' + alert.subtype;
          }
          callback({
            detail: {
              description: escapeString(description),
              identification: {
                periods: [ new Date(alert.pubMillis).toISOString().substring(0, 10) ],
                id: alert.id
              },
              contact: {
                owner: 'Waze',
                initiator: escapeString(alert.reportBy)
              }
            }
          });
        }
      };
    }());

    // Data source: Brussels Mobility (Brussels, Belgium)
    /*RoadEvents.addSource(function() {
      // Proxy necessary as this API is not available via a secure connection
      var url = 'https://tomputtemans.com/waze-scripts/road-events.php?source=mobiris',
        projection = new OpenLayers.Projection("EPSG:31370"),
        cache = [], // cached events
        bounds = new OpenLayers.Bounds(472208, 6579412, 499191, 6606318);
      // http://www.bruxellesmobilite.irisnet.be/static/mobiris_files/nl/alerts.json*/
  }

  function addTranslations() {
    var strings = {
      en: {
        layer_label: "Road Events",
        tab_name: "RED",
        tab_title: "Road Events Data",
        search: {
          button_label: "Search current area",
          filter_title: "Select data sources",
          relevant_results_only: "Only show relevant results",
          loading_header: "Loading...",
          loading_subheader: {
            one: "Retrieving information from 1 service",
            other: "Retrieving information from %{count} services"
          }
        },
        results: {
          empty_header: "No results found",
          empty_subheader: "Please zoom out or pan to another area",
          limit_reached_header: "Some results may have been omitted",
          limit_reached_header: "A service limits the amount of results and this limit has been reached. Zoom in to see all results",
          no_sources_header: "No data sources for this area",
          no_sources_subheader: "There are no data sources configured for this area",
          clear_title: "Clear results"
        },
        detail: {
          back_to_list: "Back to results",
          more_info: "More information",
          cities: {
            one: "City",
            other: "Cities"
          },
          comment: "Comment",
          contact: "Contact",
          contractor: "Contractor",
          description: "Description",
          direction: "Direction",
          effects: {
            one: "Effect",
            other: "Effects"
          },
          email: "E-mail",
          event_type: "Event type",
          hindrance: "Hindrance",
          id: "ID",
          start_date: "Start date",
          end_date: "End date",
          identification: "Identification",
          important_hindrance: "Important hindrance",
          initiator: "Initiator",
          last_update: "Last update",
          created_on: "Created on",
          locations: {
            one: "Location",
            other: "Locations"
          },
          main_contractor: "Main Contractor",
          no: "no",
          no_hindrance: "no hindrance specified",
          no_organisation: "no organisation specified",
          organisation: "Organisation",
          owner: "Owner",
          periods: {
            one: "Period",
            other: "Periods"
          },
          phone: "Phone number",
          recurrence: "Recurrences",
          reference: "Reference",
          source: "Source",
          state: "State",
          type: "Type",
          url: "URL",
          yes: "yes"
        }
      },
      nl: {
        layer_label: "Weggebeurtenissen",
        tab_name: "RED",
        tab_title: "Weggebeurtenissen (Road Events Data)",
        search: {
          button_label: "Gebied doorzoeken",
          filter_title: "Selecteer databronnen",
          relevant_results_only: "Toon alleen relevante resultaten",
          loading_header: "Aan het laden...",
          loading_subheader: {
            one: "Informatie aan het opvragen bij 1 dienst",
            other: "Informatie aan het opvragen bij %{count} diensten"
          }
        },
        results: {
          empty_header: "Geen resultaten gevonden",
          empty_subheader: "Zoom uit of ga naar een andere locatie",
          limit_reached_header: "Mogelijk ontbreken sommige resultaten",
          limit_reached_header: "Een dienst beperkt het aantal resultaten en deze limiet werd bereikt. Zoom in om het alle resultaten te zien",
          no_sources_header: "Geen databronnen voor dit gebied",
          no_sources_subheader: "Er zijn geen databronnen ingesteld voor dit gebied",
          clear_title: "Resultaten verwijderen"
        },
        detail: {
          back_to_list: "Terug naar resultaten",
          more_info: "Meer informatie",
          cities: {
            one: "Grondgebied",
            other: "Grondgebied"
          },
          comment: "Commentaar",
          contact: "Contact",
          contractor: "Aannemer",
          description: "Omschrijving",
          direction: "Richting",
          effects: {
            one: "Impact",
            other: "Impact"
          },
          email: "E-mail",
          event_type: "Evenementtype",
          hindrance: "Hinder",
          id: "ID",
          start_date: "Begindatum",
          end_date: "Einddatum",
          identification: "Identificatie",
          important_hindrance: "Ernstige hinder",
          initiator: "Initiatiefnemer",
          last_update: "Laatst bijgewerkt",
          created_on: "Aangemaakt op",
          locations: {
            one: "Plaats",
            other: "Plaatsen"
          },
          main_contractor: "Hoofdaannemer",
          no: "nee",
          no_hindrance: "geen hinder vermeld",
          no_organisation: "geen organisatie vermeld",
          organisation: "Organisatie",
          owner: "Beheerder",
          periods: {
            one: "Periode",
            other: "Periodes"
          },
          phone: "Telefoonnummer",
          recurrence: "Herhalingspatroon",
          reference: "Referentie",
          source: "Bron",
          state: "Status",
          type: "Type",
          url: "URL",
          yes: "ja"
        }
      },
      fr: {
        layer_label: "Evénements routiers",
        tab_name: "RED",
        tab_title: "Evénements routiers (Road Events Data)",
        search: {
          button_label: "Cherchez ici",
          filter_title: "Sélectionne sources des données",
          relevant_results_only: "Affiche uniquement les résultats pertinents",
          loading_header: "Chargement en cours...",
          loading_subheader: {
            one: "En train de obtenir de l'information chez 1 service",
            other: "En train de obtenir de l'information chez %{count} services"
          }
        },
        results: {
          empty_header: "Aucun résultat trouvé",
          empty_subheader: "Dézoome ou déplace la carte",
          limit_reached_header: "Quelques résultats peuvent manquer",
          limit_reached_header: "Une service limite la quantité de résultats et on a attaint cette limite. Agrandis la carte pour voir tout les résultats",
          no_sources_header: "Aucun source pour cette région",
          no_sources_subheader: "Aucun source de données spécifié pour cette région",
          clear_title: "Supprime les résultats"
        },
        detail: {
          back_to_list: "Retour aux résultats",
          more_info: "Détails",
          cities: {
            one: "Commune",
            other: "Communes"
          },
          comment: "Commentaire",
          contact: "Contact",
          contractor: "Contractant",
          description: "Description",
          direction: "Direction",
          effects: {
            one: "Impact",
            other: "Impact"
          },
          email: "Email",
          event_type: "Type d'événement",
          hindrance: "Obstacles",
          id: "ID",
          start_date: "Date de début",
          end_date: "Date de fin",
          identification: "Identification",
          important_hindrance: "Obstacle majeur",
          initiator: "Initiateur",
          last_update: "Dernier mise à jour",
          created_on: "Date de création",
          locations: {
            one: "Endroit",
            other: "Endroits"
          },
          main_contractor: "Contractant principal",
          no: "non",
          no_hindrance: "aucun obstacle spécifié",
          no_organisation: "aucun organisation spécifié",
          organisation: "Organisation",
          owner: "Administrateur",
          periods: {
            one: "Période",
            other: "Périodes"
          },
          phone: "Numéro telephone",
          recurrence: "Récurrences",
          reference: "Réference",
          source: "Source",
          state: "Etat",
          type: "Type",
          url: "URL",
          yes: "oui"
        }
      }
    };
    strings['en-GB'] = strings['en-US'] = strings.en;
    I18n.locales.get().forEach(function(locale) {
      if (I18n.translations[locale]) {
        I18n.translations[locale].road_events = strings[locale];
      }
    });
  }

  function escapeString(text) {
    if (Array.isArray(text)) {
      if (text.length > 0) {
        return text.map(escapeString);
      } else {
        return null;
      }
    }
    if (typeof text === 'undefined' || text === null || text === '' || text === ' ') {
      return null;
    }
    if (typeof text !== 'string') {
      text = JSON.stringify(text);
    }
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function zeroPad(number) {
    return ("0" + number).slice(-2);
  }

  function formatDataField(field) {
    if (typeof field === 'string') {
      if (/^https?:\/\//.test(field)) { // Website
        if (field.indexOf('|') == -1) {
          return '<a href="' + encodeURI(field) + '" target="_blank">' + field + '</a>';
        } else {
          var dataParts = field.split('|');
          return '<a href="' + encodeURI(dataParts[0]) + '" target="_blank">' + dataParts[1] + '</a>';
        }
      } else if (/^[^ ]+@[^ ]+\.[a-zA-Z0-9]+$/.test(field)) { // E-mail
        return '<a href="mailto:' + encodeURI(field) + '" target="_blank">' + field + '</a>';
      } else {
        return field;
      }
    }
    return null;
  }

  // TODO: handle these calls visually for the user
  function showError(error) {
    log(error);
  }

  function log(message) {
    if (typeof message === 'string') {
      console.log('Road Events: ' + message);
    } else {
      console.log('Road Events', message);
    }
  }

  // Add style
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.textContent = `
#sidepanel-roadEvents .result-list {
  margin-top: 5px;
  padding-left: 10px;
}

#sidepanel-roadEvents .result-list li {
  cursor: pointer;
  font-weight: bold;
  padding-left: 0;
}

#sidepanel-roadEvents .result-list li:hover {
  background-color: #ddd;
}
`;
  }
  if (!styleElement.parentNode) {
    document.head.appendChild(styleElement);
  }

  // attempt to bootstrap after about a second
  log('Road Events bootstrap set');
  setTimeout(roadEventsInit, 1010);
})();
