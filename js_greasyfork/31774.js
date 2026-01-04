// ==UserScript==
// @name WME_Assist_Analyzer
// @author borman84 (Boris Molodenkov)
// @description Waze Map Editor Assist Analyzer
// @match     https://world.waze.com/editor/*
// @match     https://*.waze.com/editor/*
// @match     https://*.waze.com/*/editor/*
// @match     https://world.waze.com/map-editor/*
// @match     https://world.waze.com/beta_editor/*
// @match     https://www.waze.com/map-editor/*
// @grant     none
// @include   https://editor-beta.waze.com/*
// @include   https://*.waze.com/editor/editor/*
// @include   https://*.waze.com/*/editor/*
// @version   0.5.22
// @namespace WazeRus
// ==/UserScript==

var WME_Assist = WME_Assist || {}

WME_Assist.Analyzer = function (wazeapi) {
    var Exceptions = function () {
        var exceptions = [];

        var onAdd = function (name) {}
        var onDelete = function (index) {}

        var save = function (exception) {
            if (localStorage) {
                localStorage.setItem('assistExceptionsKey', JSON.stringify(exceptions));
            }
        }

        this.load = function () {
            if (localStorage) {
                var str = localStorage.getItem('assistExceptionsKey');
                if (str) {
                    var arr = JSON.parse(str);
                    for (var i = 0; i < arr.length; ++i) {
                        var exception = arr[i];
                        this.add(exception);
                    }
                }
            }
        }

        this.contains = function (name) {
            if (exceptions.indexOf(name) == -1) return false;
            return true;
        }

        this.add = function (name) {
            exceptions.push(name);
            save(exceptions);
            onAdd(name);
        }

        this.remove = function (index) {
            exceptions.splice(index, 1);
            save(exceptions);
            onDelete(index);
        }

        this.onAdd = function (cb) { onAdd = cb }
        this.onDelete = function (cb) {onDelete = cb }
    }

    var analyzedIds = [];
    var problems = [];
    var unresolvedIdx = 0;
    var skippedErrors = 0;
    var variant;
    var exceptions = new Exceptions();
    var rules;
    var action;

    var getUnresolvedErrorNum = function () {
        return problems.length - unresolvedIdx - skippedErrors;
    }

    var getFixedErrorNum = function () {
        return unresolvedIdx;
    }

    this.unresolvedErrorNum = getUnresolvedErrorNum;
    this.fixedErrorNum = getFixedErrorNum;

    this.setRules = function (r) {
        rules = r;
    }

    this.setActionHelper = function (a) {
        action = a;
    }

    this.loadExceptions = function () {
        exceptions.load();
    }

    this.onExceptionAdd = function (cb) {
        exceptions.onAdd(cb);
    }

    this.onExceptionDelete = function (cb) {
        exceptions.onDelete(cb);
    }

    this.addException = function (reason, cb) {
        exceptions.add(reason);

        var i;
        for (i = 0; i < problems.length; ++i) {
            var problem = problems[i];
            if (problem.reason == reason) {
                problem.skip = true;
                ++skippedErrors;

                cb(problem.object.id);
            }
        }
    }

    this.removeException = function (i) {
        exceptions.remove(i);
    }

    this.setVariant = function (v) {
        variant = v;
    }

    this.reset = function () {
        analyzedIds = [];
        problems = [];
        unresolvedIdx = 0;
        skippedErrors = 0;
    }

    this.fixAll = function (onefixed, allfixed) {
        WME_Assist.series(problems, unresolvedIdx, function (p, next) {
            if (p.skip) {
                next();
                return;
            }

            action.fixProblem(p).done(function (id) {
                ++unresolvedIdx;
                onefixed(id);

                setTimeout(next, 0);
            });
        }, allfixed);
    }

    var checkStreet = function (bounds, zoom, streets, streetID, obj, attrName, onProblemDetected) {
        var street = streets[streetID];

        if (!street) return;

        var detected = false;
        var title = '';
        var reason;

        if (!street.isEmpty) {
            if (!exceptions.contains(street.name)) {
                try {
                    var result = rules.correct(variant, street.name);
                    var newStreetName = result.value;
                    detected = (newStreetName != street.name);
                    if (obj.type == 'venue') title = 'POI: ';
                    title = title + street.name.replace(/\u00A0/g, '■').replace(/^\s|\s$/, '■') + ' ➤ ' + newStreetName;
                    reason = street.name;
                } catch (err) {
                    WME_Assist.warning('Street name "' + street.name + '" causes error in rules');
                    return;
                }
            }
        }

        var newCityID = street.cityID;
        // if (obj.type != 'segment') {
        //     newCityID = action.newCityID(street.cityID);
        //     if (newCityID != street.cityID) {
        //         detected = true;
        //         title = 'city: ' +
        //             wazeapi.model.cities.objects[street.cityID].name + ' -> ' +
        //             wazeapi.model.cities.objects[newCityID].name;
        //     }
        // }

        if (detected) {
            var gj = new OL.Format.GeoJSON();
            var geometry = gj.parseGeometry(obj.geometry);
            var objCenter = geometry.getBounds().getCenterLonLat().transform(wazeapi.map.displayProjection, wazeapi.map.getProjectionObject());
            var boundsCenter = bounds.clone().getCenterLonLat().transform(wazeapi.map.displayProjection, wazeapi.map.getProjectionObject());
            obj.center = objCenter;

            problems.push({
                object: obj,
                reason: reason,
                attrName: attrName,
                detectPos: boundsCenter,
                zoom: zoom,
                newStreetName: newStreetName,
                isEmpty: street.isEmpty,
                cityId: newCityID,
                experimental: false,
            });

            onProblemDetected(obj, title, reason);
        }
    }

    this.analyze = function (bounds, zoom, data, onProblemDetected) {
        // var permissions = new require("Waze/Permissions");
        var startTime = new Date().getTime();

        WME_Assist.info('start analyze');

        var subjects = {
            'segment': {
                attr: 'primaryStreetID',
                name: 'segments',
                // permissions: permissions.Segments,
            },
            'venue': {
                attr: 'streetID',
                name: 'venues',
                // permissions: permissions.Landmarks,
            }
        };

        for (var k in subjects) {
            var subject = subjects[k];
            var subjectData = data[subject.name];

            if (!subjectData) continue;

            var objects = subjectData.objects;

            for (var i = 0; i < objects.length; ++i) {
                var obj = objects[i];
                var id = obj.id;

                obj.type = k;

                if (analyzedIds.indexOf(id) >= 0) continue;

                // if (!(obj.permissions & subject.permissions.EDIT_PROPERTIES)) continue;
                if (obj.hasClosures) continue;

                if (typeof obj.approved != 'undefined' && !obj.approved) continue;

                var streetID = obj[subject.attr];
                var streetDict = data.streets.objects.reduce(function (dict, street, i) {
                    dict[street.id] = street;
                    return dict;
                }, {});
                checkStreet(bounds, zoom, streetDict, streetID, obj, subject.attr, onProblemDetected);

                analyzedIds.push(id);
            }
        }

        WME_Assist.info('end analyze: ' + (new Date().getTime() - startTime) + 'ms');
    }
}
