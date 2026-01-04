// ==UserScript==
// @name        WME UT Kadastrs
// @namespace   http://ursus.id.lv
// @version     1.2.0
// @description WME UrSuS Tools: LV Kadastrs
// @author      UrSuS
// @match       https://*.waze.com/*editor*
// @license     MIT/BSD/X11
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNjMuOTk5OTk2bW0iCiAgIGhlaWdodD0iNjQuMDAwMDE1bW0iCiAgIHZpZXdCb3g9IjAgMCA2My45OTk5OTYgNjQuMDAwMDE1IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc1IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjIgKGRjMmFlZGFmMDMsIDIwMjItMDUtMTUpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ3bWUga2FkYXN0cnMuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxLjAzMzA4MjIiCiAgICAgaW5rc2NhcGU6Y3g9IjY3Ljc1ODQwMSIKICAgICBpbmtzY2FwZTpjeT0iNzU3LjQ0MjEzIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA1IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSI+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIzMi4wMDAwMDMsMzIuMDAwMDA3IgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTgzMCIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIzMi4wMDAwMDEsMzIuMDAwMDA5IgogICAgICAgb3JpZW50YXRpb249IjAsLTEiCiAgICAgICBpZD0iZ3VpZGU4MzIiCiAgICAgICBpbmtzY2FwZTpsb2NrZWQ9ImZhbHNlIiAvPgogIDwvc29kaXBvZGk6bmFtZWR2aWV3PgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01NC40MzczMywtMTczLjI3MjY1KSI+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2EwMmMyYztzdHJva2Utd2lkdGg6MjYuNDU4MyIKICAgICAgIGlkPSJyZWN0ODE4IgogICAgICAgd2lkdGg9IjY0IgogICAgICAgaGVpZ2h0PSI2NCIKICAgICAgIHg9IjU0LjQzNzMzMiIKICAgICAgIHk9IjE3My4yNzI2NiIgLz4KICAgIDxnCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLjE5MzY3MDgsMCwwLDEuMTkzNjcwOCw1Ni42Mzc5MTgsMTc1LjM4OTExKSIKICAgICAgIGlkPSJnODI0Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSAyNy41LDIuNjc0IGMgLTYuMTgxLDAgLTExLjk0NCwyLjc3NyAtMTUuODMzLDcuNzA4IEMgOC45NTgsMTMuODU0IDcuNSwxOC4xNiA3LjUsMjIuNTM1IHYgMy42OCBDIDcuNSwyNy44MTIgNi44NzUsMjkuMzQgNS44MzMsMzAuNDUxIDUsMzEuMjg1IDMuOTU4LDMxLjkxIDIuODQ3LDMyLjE4OCBjIDAuNDE3LDEuMDQxIDEuMzg5LDIuNjM4IDMuMTI1LDQuMzc1IDEuNDU5LDEuNTI3IDMuMTk1LDIuNzc3IDUuMDcsMy42OCB2IC0wLjA2OSBjIDEuMTgsLTEuODA2IDMuMTI1LC0yLjg0OCA1LjI3NywtMi44NDggMC40MTcsMCAwLjc2NCwwLjA3IDEuMTgxLDAuMTM5IDIuNSwwLjQ4NiA0LjQ0NCwyLjQzMSA0LjkzMSw0Ljg2MSBoIDUuMTM4IGMgNS4zNDgsMCAxMC40MTcsLTIuMjIyIDE0LjA5OCwtNS44MzMgNS42OTQsLTUuNjk0IDcuNDMsLTE0LjIzNiA0LjMwNSwtMjEuNTk3IEMgNDIuODQ3LDcuNDY1IDM1LjYyNSwyLjY3NCAyNy41LDIuNjc0IFoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNhMDJjMmMiCiAgICAgICAgIGlkPSJwYXRoODIwIiAvPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDI3LjUsMC4xNzQgQyAyMC42MjUsMC4xNzQgMTQuMTY3LDMuMjI5IDkuNzkyLDguNzE1IDYuNjY3LDEyLjY3NCA1LDE3LjUzNSA1LDIyLjYwNCB2IDMuNjExIGMgMCwxLjg3NSAtMS4zMTksMy42MTEgLTMuODg5LDMuNzUgLTAuNjI1LDAgLTEuMTExLDAuNDg2IC0xLjE4LDEuMTExIC0wLjA3LDEuNjY3IDEuNzM2LDQuNzkyIDQuMjM2LDcuMjkyIDEuNzM2LDEuNzM2IDMuNzUsMy4xMjUgNS45MDIsNC4yMzYgLTAuNjk0LDMuODIgMi4yOTIsNy4yOTIgNi4xODEsNy4yOTIgaCAwLjA2OSBjIDIuOTg3LDAgNS40ODcsLTIuMDgzIDYuMTEyLC00LjkzMSBoIDUuMjA4IGMgMC41NTUsMi44NDggMy4wNTUsNC45MzEgNi4xMTEsNC45MzEgMC42OTQsMCAxLjQ1OCwtMC4xMzkgMi4xNTMsLTAuMzQ3IDEuNzM2LC0wLjU1NiAzLjA1NSwtMS44NzUgMy42OCwtMy42MTIgMC41NTYsLTEuNTk3IDAuNDg2LC0zLjE5NCAwLC00LjUxMyAxLjM4OSwtMC45MDMgMi42MzksLTEuODc1IDMuODIsLTMuMDU2IEMgNDcuNjM5LDM0LjIwMSA1MCwyOC41MDcgNTAsMjIuNjA0IDUwLDE2LjYzMiA0Ny42MzksMTEuMDc2IDQzLjQwMyw2Ljg0IDM5LjE2NywyLjQ2NSAzMy40NzIsMC4xNzQgMjcuNSwwLjE3NCBaIG0gMCwyLjUgYyA4LjA1NiwwIDE1LjM0Nyw0Ljg2MSAxOC40NzIsMTIuMjkxIDMuMTI1LDcuNDMxIDEuMzg5LDE1Ljk3MiAtNC4zMDUsMjEuNTk4IC0zLjY4MSwzLjY4IC04Ljc1LDUuODMzIC0xNC4wOTgsNS44MzMgSCAyMi40MzEgQyAyMS45NDQsMzkuODk2IDIwLDM4LjAyMSAxNy41LDM3LjUzNSBjIC0wLjQxNywtMC4wNyAtMC43NjQsLTAuMTM5IC0xLjE4MSwtMC4xMzkgLTIuMDgzLDAgLTQuMDk3LDEuMDQyIC01LjI3NywyLjg0NyB2IDAuMDcgQyA5LjE2NywzOS4zNCA3LjUsMzguMDkgNS45NzIsMzYuNjMyIDQuMjM2LDM0Ljg5NiAzLjI2NCwzMy4yMjkgMi44NDcsMzIuMjU3IDQuMDI4LDMxLjk3OSA1LDMxLjM1NCA1LjgzMywzMC41MjEgNi44NzUsMjkuMzQgNy41LDI3Ljg4MiA3LjUsMjYuMjg1IHYgLTMuNjgxIGMgMCwtNC4zNzUgMS40NTgsLTguNjggNC4xNjcsLTEyLjE1MyBDIDE1LjU1Niw1LjM4MiAyMS4zMTksMi42NzQgMjcuNSwyLjY3NCBaIgogICAgICAgICBpZD0icGF0aDgyMiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgLz4KICAgIDwvZz4KICAgIDxnCiAgICAgICBhcmlhLWxhYmVsPSJVVCIKICAgICAgIGlkPSJ0ZXh0ODI4IgogICAgICAgc3R5bGU9ImZvbnQtc2l6ZTozMC42NzMycHg7bGluZS1oZWlnaHQ6MS4yNTtmb250LWZhbWlseTpXYXplOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246V2F6ZTtsZXR0ZXItc3BhY2luZzowcHg7d29yZC1zcGFjaW5nOjBweDtmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMTE1MDI0Ij4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSA4OC4zMTk3NzQsMjA4LjEyNTI2IHEgMCwyLjc5MTI2IC0xLjI1NzYwMiw0LjYwMDk4IC0xLjI1NzYwMSwxLjc3OTA1IC0zLjI4MjAzMiwyLjYzNzkgLTIuMDI0NDMxLDAuODU4ODUgLTQuMzU1NTk1LDAuODU4ODUgLTIuMzAwNDksMCAtNC4zMjQ5MjEsLTAuODU4ODUgLTIuMDI0NDMxLC0wLjg1ODg1IC0zLjI4MjAzMiwtMi42Mzc5IC0xLjI1NzYwMiwtMS43NzkwNCAtMS4yNTc2MDIsLTQuNTcwMyB2IC0xMy4xODk0OCBxIDAsLTAuMjQ1MzggMC4xODQwNCwtMC40Mjk0MiAwLjE4NDAzOSwtMC4yMTQ3MiAwLjQ2MDA5OCwtMC4yMTQ3MiBoIDIuNzkxMjYxIHEgMC4yNzYwNTksMCAwLjQ2MDA5OCwwLjIxNDcyIDAuMjE0NzEyLDAuMTg0MDQgMC4yMTQ3MTIsMC40Mjk0MiB2IDEyLjkxMzQyIHEgMCwyLjE0NzEyIDEuMjU3NjAyLDMuMzc0MDUgMS4yNTc2MDEsMS4yMjY5MyAzLjQ5Njc0NCwxLjIyNjkzIDIuMjY5ODE3LDAgMy41Mjc0MTksLTEuMjI2OTMgMS4yNTc2MDEsLTEuMjI2OTMgMS4yNTc2MDEsLTMuMzc0MDUgdiAtMTIuOTEzNDIgcSAwLC0wLjI0NTM4IDAuMTg0MDM5LC0wLjQyOTQyIDAuMjE0NzEyLC0wLjIxNDcyIDAuNDkwNzcxLC0wLjIxNDcyIGggMi43OTEyNjEgcSAwLjI0NTM4NiwwIDAuNDI5NDI1LDAuMjE0NzIgMC4yMTQ3MTMsMC4xODQwNCAwLjIxNDcxMywwLjQyOTQyIHoiCiAgICAgICAgIGlkPSJwYXRoODc4IiAvPgogICAgICA8cGF0aAogICAgICAgICBkPSJtIDkwLjQzNjIxNSwxOTcuNDUwOTkgdiAtMi40NTM4NiBxIDAsLTAuMjc2MDUgMC4xODQwNCwtMC40NjAwOSAwLjE4NDAzOSwtMC4yMTQ3MiAwLjQ2MDA5OCwtMC4yMTQ3MiBoIDE2Ljk5Mjk1NyBxIDAuMjc2MDUsMCAwLjQ2MDA5LDAuMjE0NzIgMC4xODQwNCwwLjE4NDA0IDAuMTg0MDQsMC40NjAwOSB2IDIuNDUzODYgcSAwLDAuMjc2MDYgLTAuMTg0MDQsMC40NjAxIC0wLjE4NDA0LDAuMTg0MDQgLTAuNDYwMDksMC4xODQwNCBoIC02LjM4MDAzIHYgMTcuMDIzNjIgcSAwLDAuMjc2MDYgLTAuMjE0NzEsMC40OTA3NyAtMC4xODQwNCwwLjE4NDA0IC0wLjQ2MDEsMC4xODQwNCBoIC0yLjkxMzk1NCBxIC0wLjI3NjA1OSwwIC0wLjQ2MDA5OCwtMC4xODQwNCAtMC4xODQwNCwtMC4yMTQ3MSAtMC4xODQwNCwtMC40OTA3NyB2IC0xNy4wMjM2MiBoIC02LjM4MDAyNSBxIC0wLjI3NjA1OSwwIC0wLjQ2MDA5OCwtMC4xODQwNCAtMC4xODQwNCwtMC4xODQwNCAtMC4xODQwNCwtMC40NjAxIHoiCiAgICAgICAgIGlkPSJwYXRoODgwIiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==
// @exclude     https://www.waze.com/user/editor*
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect     lvmgeoserver.lvm.lv
// @connect     docs.google.com
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/532323/WME%20UT%20Kadastrs.user.js
// @updateURL https://update.greasyfork.org/scripts/532323/WME%20UT%20Kadastrs.meta.js
// ==/UserScript==

(function (exports) {
  'use strict';

  // index.ts
  var earthRadius = 63710088e-1;
  var factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: 360 / (2 * Math.PI),
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.37,
    kilometers: earthRadius / 1e3,
    kilometres: earthRadius / 1e3,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1e3,
    millimetres: earthRadius * 1e3,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius * 1.0936
  };
  function feature(geom, properties, options = {}) {
    const feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
      feat.id = options.id;
    }
    if (options.bbox) {
      feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
  }
  function point(coordinates, properties, options = {}) {
    if (!coordinates) {
      throw new Error("coordinates is required");
    }
    if (!Array.isArray(coordinates)) {
      throw new Error("coordinates must be an Array");
    }
    if (coordinates.length < 2) {
      throw new Error("coordinates must be at least 2 numbers long");
    }
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
      throw new Error("coordinates must contain numbers");
    }
    const geom = {
      type: "Point",
      coordinates
    };
    return feature(geom, properties, options);
  }
  function polygon(coordinates, properties, options = {}) {
    for (const ring of coordinates) {
      if (ring.length < 4) {
        throw new Error(
          "Each LinearRing of a Polygon must have 4 or more Positions."
        );
      }
      if (ring[ring.length - 1].length !== ring[0].length) {
        throw new Error("First and last Position are not equivalent.");
      }
      for (let j = 0; j < ring[ring.length - 1].length; j++) {
        if (ring[ring.length - 1][j] !== ring[0][j]) {
          throw new Error("First and last Position are not equivalent.");
        }
      }
    }
    const geom = {
      type: "Polygon",
      coordinates
    };
    return feature(geom, properties, options);
  }
  function lineString(coordinates, properties, options = {}) {
    if (coordinates.length < 2) {
      throw new Error("coordinates must be an array of two or more positions");
    }
    const geom = {
      type: "LineString",
      coordinates
    };
    return feature(geom, properties, options);
  }
  function featureCollection(features, options = {}) {
    const fc = { type: "FeatureCollection" };
    if (options.id) {
      fc.id = options.id;
    }
    if (options.bbox) {
      fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
  }
  function multiLineString(coordinates, properties, options = {}) {
    const geom = {
      type: "MultiLineString",
      coordinates
    };
    return feature(geom, properties, options);
  }
  function radiansToLength(radians, units = "kilometers") {
    const factor = factors[units];
    if (!factor) {
      throw new Error(units + " units is invalid");
    }
    return radians * factor;
  }
  function lengthToRadians(distance, units = "kilometers") {
    const factor = factors[units];
    if (!factor) {
      throw new Error(units + " units is invalid");
    }
    return distance / factor;
  }
  function radiansToDegrees(radians) {
    const normalisedRadians = radians % (2 * Math.PI);
    return normalisedRadians * 180 / Math.PI;
  }
  function degreesToRadians(degrees) {
    const normalisedDegrees = degrees % 360;
    return normalisedDegrees * Math.PI / 180;
  }
  function convertLength(length, originalUnit = "kilometers", finalUnit = "kilometers") {
    if (!(length >= 0)) {
      throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
  }
  function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
  }
  function isObject(input) {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  }

  // index.ts
  function getCoord(coord) {
    if (!coord) {
      throw new Error("coord is required");
    }
    if (!Array.isArray(coord)) {
      if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
        return [...coord.geometry.coordinates];
      }
      if (coord.type === "Point") {
        return [...coord.coordinates];
      }
    }
    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
      return [...coord];
    }
    throw new Error("coord must be GeoJSON Point or an Array of numbers");
  }
  function getCoords(coords) {
    if (Array.isArray(coords)) {
      return coords;
    }
    if (coords.type === "Feature") {
      if (coords.geometry !== null) {
        return coords.geometry.coordinates;
      }
    } else {
      if (coords.coordinates) {
        return coords.coordinates;
      }
    }
    throw new Error(
      "coords must be GeoJSON Feature, Geometry Object or an Array"
    );
  }
  function featureOf(feature, type, name) {
    if (!feature) {
      throw new Error("No feature passed");
    }
    if (!name) {
      throw new Error(".featureOf() requires a name");
    }
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
      throw new Error(
        "Invalid input to " + name + ", Feature with geometry required"
      );
    }
    if (!feature.geometry || feature.geometry.type !== type) {
      throw new Error(
        "Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type
      );
    }
  }
  function getGeom(geojson) {
    if (geojson.type === "Feature") {
      return geojson.geometry;
    }
    return geojson;
  }

  // index.ts
  function distance(from, to, options = {}) {
    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
    var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
    var lat1 = degreesToRadians(coordinates1[1]);
    var lat2 = degreesToRadians(coordinates2[1]);
    var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    return radiansToLength(
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      options.units
    );
  }

  // index.ts
  function rhumbBearing(start, end, options = {}) {
    let bear360;
    if (options.final) {
      bear360 = calculateRhumbBearing(getCoord(end), getCoord(start));
    } else {
      bear360 = calculateRhumbBearing(getCoord(start), getCoord(end));
    }
    const bear180 = bear360 > 180 ? -(360 - bear360) : bear360;
    return bear180;
  }
  function calculateRhumbBearing(from, to) {
    const phi1 = degreesToRadians(from[1]);
    const phi2 = degreesToRadians(to[1]);
    let deltaLambda = degreesToRadians(to[0] - from[0]);
    if (deltaLambda > Math.PI) {
      deltaLambda -= 2 * Math.PI;
    }
    if (deltaLambda < -Math.PI) {
      deltaLambda += 2 * Math.PI;
    }
    const deltaPsi = Math.log(
      Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4)
    );
    const theta = Math.atan2(deltaLambda, deltaPsi);
    return (radiansToDegrees(theta) + 360) % 360;
  }

  // index.js
  function coordEach(geojson, callback, excludeWrapCoord) {
    if (geojson === null) return;
    var j, k, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, coordIndex = 0, isGeometryCollection, type = geojson.type, isFeatureCollection = type === "FeatureCollection", isFeature = type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
      geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
      isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
      stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
      for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
        var multiFeatureIndex = 0;
        var geometryIndex = 0;
        geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;
        if (geometry === null) continue;
        coords = geometry.coordinates;
        var geomType = geometry.type;
        wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;
        switch (geomType) {
          case null:
            break;
          case "Point":
            if (callback(
              coords,
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false)
              return false;
            coordIndex++;
            multiFeatureIndex++;
            break;
          case "LineString":
          case "MultiPoint":
            for (j = 0; j < coords.length; j++) {
              if (callback(
                coords[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false)
                return false;
              coordIndex++;
              if (geomType === "MultiPoint") multiFeatureIndex++;
            }
            if (geomType === "LineString") multiFeatureIndex++;
            break;
          case "Polygon":
          case "MultiLineString":
            for (j = 0; j < coords.length; j++) {
              for (k = 0; k < coords[j].length - wrapShrink; k++) {
                if (callback(
                  coords[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false)
                  return false;
                coordIndex++;
              }
              if (geomType === "MultiLineString") multiFeatureIndex++;
              if (geomType === "Polygon") geometryIndex++;
            }
            if (geomType === "Polygon") multiFeatureIndex++;
            break;
          case "MultiPolygon":
            for (j = 0; j < coords.length; j++) {
              geometryIndex = 0;
              for (k = 0; k < coords[j].length; k++) {
                for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                  if (callback(
                    coords[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false)
                    return false;
                  coordIndex++;
                }
                geometryIndex++;
              }
              multiFeatureIndex++;
            }
            break;
          case "GeometryCollection":
            for (j = 0; j < geometry.geometries.length; j++)
              if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false)
                return false;
            break;
          default:
            throw new Error("Unknown Geometry Type");
        }
      }
    }
  }
  function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === "FeatureCollection", isFeature = geojson.type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
    for (i = 0; i < stop; i++) {
      geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
      featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
      featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
      featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
      isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
      stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
      for (g = 0; g < stopG; g++) {
        geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
        if (geometry === null) {
          if (callback(
            null,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          ) === false)
            return false;
          continue;
        }
        switch (geometry.type) {
          case "Point":
          case "LineString":
          case "MultiPoint":
          case "Polygon":
          case "MultiLineString":
          case "MultiPolygon": {
            if (callback(
              geometry,
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            ) === false)
              return false;
            break;
          }
          case "GeometryCollection": {
            for (j = 0; j < geometry.geometries.length; j++) {
              if (callback(
                geometry.geometries[j],
                featureIndex,
                featureProperties,
                featureBBox,
                featureId
              ) === false)
                return false;
            }
            break;
          }
          default:
            throw new Error("Unknown Geometry Type");
        }
      }
      featureIndex++;
    }
  }
  function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(
      geojson,
      function(currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
        if (featureIndex === 0 && initialValue === void 0)
          previousValue = currentGeometry;
        else
          previousValue = callback(
            previousValue,
            currentGeometry,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          );
      }
    );
    return previousValue;
  }
  function flattenEach(geojson, callback) {
    geomEach(geojson, function(geometry, featureIndex, properties, bbox, id) {
      var type = geometry === null ? null : geometry.type;
      switch (type) {
        case null:
        case "Point":
        case "LineString":
        case "Polygon":
          if (callback(
            feature(geometry, properties, { bbox, id }),
            featureIndex,
            0
          ) === false)
            return false;
          return;
      }
      var geomType;
      switch (type) {
        case "MultiPoint":
          geomType = "Point";
          break;
        case "MultiLineString":
          geomType = "LineString";
          break;
        case "MultiPolygon":
          geomType = "Polygon";
          break;
      }
      for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
        var coordinate = geometry.coordinates[multiFeatureIndex];
        var geom = {
          type: geomType,
          coordinates: coordinate
        };
        if (callback(feature(geom, properties), featureIndex, multiFeatureIndex) === false)
          return false;
      }
    });
  }
  function segmentEach(geojson, callback) {
    flattenEach(geojson, function(feature2, featureIndex, multiFeatureIndex) {
      var segmentIndex = 0;
      if (!feature2.geometry) return;
      var type = feature2.geometry.type;
      if (type === "Point" || type === "MultiPoint") return;
      var previousCoords;
      var previousFeatureIndex = 0;
      var previousMultiIndex = 0;
      var prevGeomIndex = 0;
      if (coordEach(
        feature2,
        function(currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
          if (previousCoords === void 0 || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
            previousCoords = currentCoord;
            previousFeatureIndex = featureIndex;
            previousMultiIndex = multiPartIndexCoord;
            prevGeomIndex = geometryIndex;
            segmentIndex = 0;
            return;
          }
          var currentSegment = lineString(
            [previousCoords, currentCoord],
            feature2.properties
          );
          if (callback(
            currentSegment,
            featureIndex,
            multiFeatureIndex,
            geometryIndex,
            segmentIndex
          ) === false)
            return false;
          segmentIndex++;
          previousCoords = currentCoord;
        }
      ) === false)
        return false;
    });
  }

  // index.ts
  function area(geojson) {
    return geomReduce(
      geojson,
      (value, geom) => {
        return value + calculateArea(geom);
      },
      0
    );
  }
  function calculateArea(geom) {
    let total = 0;
    let i;
    switch (geom.type) {
      case "Polygon":
        return polygonArea(geom.coordinates);
      case "MultiPolygon":
        for (i = 0; i < geom.coordinates.length; i++) {
          total += polygonArea(geom.coordinates[i]);
        }
        return total;
      case "Point":
      case "MultiPoint":
      case "LineString":
      case "MultiLineString":
        return 0;
    }
    return 0;
  }
  function polygonArea(coords) {
    let total = 0;
    if (coords && coords.length > 0) {
      total += Math.abs(ringArea(coords[0]));
      for (let i = 1; i < coords.length; i++) {
        total -= Math.abs(ringArea(coords[i]));
      }
    }
    return total;
  }
  var FACTOR = earthRadius * earthRadius / 2;
  var PI_OVER_180 = Math.PI / 180;
  function ringArea(coords) {
    const coordsLength = coords.length - 1;
    if (coordsLength <= 2) return 0;
    let total = 0;
    let i = 0;
    while (i < coordsLength) {
      const lower = coords[i];
      const middle = coords[i + 1 === coordsLength ? 0 : i + 1];
      const upper = coords[i + 2 >= coordsLength ? (i + 2) % coordsLength : i + 2];
      const lowerX = lower[0] * PI_OVER_180;
      const middleY = middle[1] * PI_OVER_180;
      const upperX = upper[0] * PI_OVER_180;
      total += (upperX - lowerX) * Math.sin(middleY);
      i++;
    }
    return total * FACTOR;
  }

  // index.ts
  function bbox(geojson, options = {}) {
    if (geojson.bbox != null && true !== options.recompute) {
      return geojson.bbox;
    }
    const result = [Infinity, Infinity, -Infinity, -Infinity];
    coordEach(geojson, (coord) => {
      if (result[0] > coord[0]) {
        result[0] = coord[0];
      }
      if (result[1] > coord[1]) {
        result[1] = coord[1];
      }
      if (result[2] < coord[0]) {
        result[2] = coord[0];
      }
      if (result[3] < coord[1]) {
        result[3] = coord[1];
      }
    });
    return result;
  }

  const epsilon = 1.1102230246251565e-16;
  const splitter = 134217729;
  const resulterrbound = (3 + 8 * epsilon) * epsilon;

  // fast_expansion_sum_zeroelim routine from oritinal code
  function sum(elen, e, flen, f, h) {
      let Q, Qnew, hh, bvirt;
      let enow = e[0];
      let fnow = f[0];
      let eindex = 0;
      let findex = 0;
      if ((fnow > enow) === (fnow > -enow)) {
          Q = enow;
          enow = e[++eindex];
      } else {
          Q = fnow;
          fnow = f[++findex];
      }
      let hindex = 0;
      if (eindex < elen && findex < flen) {
          if ((fnow > enow) === (fnow > -enow)) {
              Qnew = enow + Q;
              hh = Q - (Qnew - enow);
              enow = e[++eindex];
          } else {
              Qnew = fnow + Q;
              hh = Q - (Qnew - fnow);
              fnow = f[++findex];
          }
          Q = Qnew;
          if (hh !== 0) {
              h[hindex++] = hh;
          }
          while (eindex < elen && findex < flen) {
              if ((fnow > enow) === (fnow > -enow)) {
                  Qnew = Q + enow;
                  bvirt = Qnew - Q;
                  hh = Q - (Qnew - bvirt) + (enow - bvirt);
                  enow = e[++eindex];
              } else {
                  Qnew = Q + fnow;
                  bvirt = Qnew - Q;
                  hh = Q - (Qnew - bvirt) + (fnow - bvirt);
                  fnow = f[++findex];
              }
              Q = Qnew;
              if (hh !== 0) {
                  h[hindex++] = hh;
              }
          }
      }
      while (eindex < elen) {
          Qnew = Q + enow;
          bvirt = Qnew - Q;
          hh = Q - (Qnew - bvirt) + (enow - bvirt);
          enow = e[++eindex];
          Q = Qnew;
          if (hh !== 0) {
              h[hindex++] = hh;
          }
      }
      while (findex < flen) {
          Qnew = Q + fnow;
          bvirt = Qnew - Q;
          hh = Q - (Qnew - bvirt) + (fnow - bvirt);
          fnow = f[++findex];
          Q = Qnew;
          if (hh !== 0) {
              h[hindex++] = hh;
          }
      }
      if (Q !== 0 || hindex === 0) {
          h[hindex++] = Q;
      }
      return hindex;
  }

  function estimate(elen, e) {
      let Q = e[0];
      for (let i = 1; i < elen; i++) Q += e[i];
      return Q;
  }

  function vec(n) {
      return new Float64Array(n);
  }

  const ccwerrboundA = (3 + 16 * epsilon) * epsilon;
  const ccwerrboundB = (2 + 12 * epsilon) * epsilon;
  const ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;

  const B = vec(4);
  const C1$1 = vec(8);
  const C2 = vec(12);
  const D = vec(16);
  const u = vec(4);

  function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
      let acxtail, acytail, bcxtail, bcytail;
      let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

      const acx = ax - cx;
      const bcx = bx - cx;
      const acy = ay - cy;
      const bcy = by - cy;

      s1 = acx * bcy;
      c = splitter * acx;
      ahi = c - (c - acx);
      alo = acx - ahi;
      c = splitter * bcy;
      bhi = c - (c - bcy);
      blo = bcy - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = acy * bcx;
      c = splitter * acy;
      ahi = c - (c - acy);
      alo = acy - ahi;
      c = splitter * bcx;
      bhi = c - (c - bcx);
      blo = bcx - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      B[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      B[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      B[2] = _j - (u3 - bvirt) + (_i - bvirt);
      B[3] = u3;

      let det = estimate(4, B);
      let errbound = ccwerrboundB * detsum;
      if (det >= errbound || -det >= errbound) {
          return det;
      }

      bvirt = ax - acx;
      acxtail = ax - (acx + bvirt) + (bvirt - cx);
      bvirt = bx - bcx;
      bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
      bvirt = ay - acy;
      acytail = ay - (acy + bvirt) + (bvirt - cy);
      bvirt = by - bcy;
      bcytail = by - (bcy + bvirt) + (bvirt - cy);

      if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
          return det;
      }

      errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
      det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
      if (det >= errbound || -det >= errbound) return det;

      s1 = acxtail * bcy;
      c = splitter * acxtail;
      ahi = c - (c - acxtail);
      alo = acxtail - ahi;
      c = splitter * bcy;
      bhi = c - (c - bcy);
      blo = bcy - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = acytail * bcx;
      c = splitter * acytail;
      ahi = c - (c - acytail);
      alo = acytail - ahi;
      c = splitter * bcx;
      bhi = c - (c - bcx);
      blo = bcx - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      u[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      u[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      const C1len = sum(4, B, 4, u, C1$1);

      s1 = acx * bcytail;
      c = splitter * acx;
      ahi = c - (c - acx);
      alo = acx - ahi;
      c = splitter * bcytail;
      bhi = c - (c - bcytail);
      blo = bcytail - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = acy * bcxtail;
      c = splitter * acy;
      ahi = c - (c - acy);
      alo = acy - ahi;
      c = splitter * bcxtail;
      bhi = c - (c - bcxtail);
      blo = bcxtail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      u[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      u[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      const C2len = sum(C1len, C1$1, 4, u, C2);

      s1 = acxtail * bcytail;
      c = splitter * acxtail;
      ahi = c - (c - acxtail);
      alo = acxtail - ahi;
      c = splitter * bcytail;
      bhi = c - (c - bcytail);
      blo = bcytail - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = acytail * bcxtail;
      c = splitter * acytail;
      ahi = c - (c - acytail);
      alo = acytail - ahi;
      c = splitter * bcxtail;
      bhi = c - (c - bcxtail);
      blo = bcxtail - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      u[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      u[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      u[2] = _j - (u3 - bvirt) + (_i - bvirt);
      u[3] = u3;
      const Dlen = sum(C2len, C2, 4, u, D);

      return D[Dlen - 1];
  }

  function orient2d(ax, ay, bx, by, cx, cy) {
      const detleft = (ay - cy) * (bx - cx);
      const detright = (ax - cx) * (by - cy);
      const det = detleft - detright;

      const detsum = Math.abs(detleft + detright);
      if (Math.abs(det) >= ccwerrboundA * detsum) return det;

      return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
  }

  function pointInPolygon(p, polygon) {
      var i;
      var ii;
      var k = 0;
      var f;
      var u1;
      var v1;
      var u2;
      var v2;
      var currentP;
      var nextP;

      var x = p[0];
      var y = p[1];

      var numContours = polygon.length;
      for (i = 0; i < numContours; i++) {
          ii = 0;
          var contour = polygon[i];
          var contourLen = contour.length - 1;

          currentP = contour[0];
          if (currentP[0] !== contour[contourLen][0] &&
              currentP[1] !== contour[contourLen][1]) {
              throw new Error('First and last coordinates in a ring must be the same')
          }

          u1 = currentP[0] - x;
          v1 = currentP[1] - y;

          for (ii; ii < contourLen; ii++) {
              nextP = contour[ii + 1];

              u2 = nextP[0] - x;
              v2 = nextP[1] - y;

              if (v1 === 0 && v2 === 0) {
                  if ((u2 <= 0 && u1 >= 0) || (u1 <= 0 && u2 >= 0)) { return 0 }
              } else if ((v2 >= 0 && v1 <= 0) || (v2 <= 0 && v1 >= 0)) {
                  f = orient2d(u1, u2, v1, v2, 0, 0);
                  if (f === 0) { return 0 }
                  if ((f > 0 && v2 > 0 && v1 <= 0) || (f < 0 && v2 <= 0 && v1 > 0)) { k++; }
              }
              currentP = nextP;
              v1 = v2;
              u1 = u2;
          }
      }

      if (k % 2 === 0) { return false }
      return true
  }

  // index.ts
  function booleanPointInPolygon(point, polygon, options = {}) {
    if (!point) {
      throw new Error("point is required");
    }
    if (!polygon) {
      throw new Error("polygon is required");
    }
    const pt = getCoord(point);
    const geom = getGeom(polygon);
    const type = geom.type;
    const bbox = polygon.bbox;
    let polys = geom.coordinates;
    if (bbox && inBBox(pt, bbox) === false) {
      return false;
    }
    if (type === "Polygon") {
      polys = [polys];
    }
    let result = false;
    for (var i = 0; i < polys.length; ++i) {
      const polyResult = pointInPolygon(pt, polys[i]);
      if (polyResult === 0) return options.ignoreBoundary ? false : true;
      else if (polyResult) result = true;
    }
    return result;
  }
  function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1];
  }

  // index.ts
  function booleanPointOnLine(pt, line, options = {}) {
    const ptCoords = getCoord(pt);
    const lineCoords = getCoords(line);
    for (let i = 0; i < lineCoords.length - 1; i++) {
      let ignoreBoundary = false;
      if (options.ignoreEndVertices) {
        if (i === 0) {
          ignoreBoundary = "start";
        }
        if (i === lineCoords.length - 2) {
          ignoreBoundary = "end";
        }
        if (i === 0 && i + 1 === lineCoords.length - 1) {
          ignoreBoundary = "both";
        }
      }
      if (isPointOnLineSegment$1(
        lineCoords[i],
        lineCoords[i + 1],
        ptCoords,
        ignoreBoundary,
        typeof options.epsilon === "undefined" ? null : options.epsilon
      )) {
        return true;
      }
    }
    return false;
  }
  function isPointOnLineSegment$1(lineSegmentStart, lineSegmentEnd, pt, excludeBoundary, epsilon) {
    const x = pt[0];
    const y = pt[1];
    const x1 = lineSegmentStart[0];
    const y1 = lineSegmentStart[1];
    const x2 = lineSegmentEnd[0];
    const y2 = lineSegmentEnd[1];
    const dxc = pt[0] - x1;
    const dyc = pt[1] - y1;
    const dxl = x2 - x1;
    const dyl = y2 - y1;
    const cross = dxc * dyl - dyc * dxl;
    if (epsilon !== null) {
      if (Math.abs(cross) > epsilon) {
        return false;
      }
    } else if (cross !== 0) {
      return false;
    }
    if (Math.abs(dxl) === Math.abs(dyl) && Math.abs(dxl) === 0) {
      if (excludeBoundary) {
        return false;
      }
      if (pt[0] === lineSegmentStart[0] && pt[1] === lineSegmentStart[1]) {
        return true;
      } else {
        return false;
      }
    }
    if (!excludeBoundary) {
      if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
      }
      return dyl > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
    } else if (excludeBoundary === "start") {
      if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? x1 < x && x <= x2 : x2 <= x && x < x1;
      }
      return dyl > 0 ? y1 < y && y <= y2 : y2 <= y && y < y1;
    } else if (excludeBoundary === "end") {
      if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? x1 <= x && x < x2 : x2 < x && x <= x1;
      }
      return dyl > 0 ? y1 <= y && y < y2 : y2 < y && y <= y1;
    } else if (excludeBoundary === "both") {
      if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? x1 < x && x < x2 : x2 < x && x < x1;
      }
      return dyl > 0 ? y1 < y && y < y2 : y2 < y && y < y1;
    }
    return false;
  }

  class TinyQueue {
      constructor(data = [], compare = defaultCompare) {
          this.data = data;
          this.length = this.data.length;
          this.compare = compare;

          if (this.length > 0) {
              for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
          }
      }

      push(item) {
          this.data.push(item);
          this.length++;
          this._up(this.length - 1);
      }

      pop() {
          if (this.length === 0) return undefined;

          const top = this.data[0];
          const bottom = this.data.pop();
          this.length--;

          if (this.length > 0) {
              this.data[0] = bottom;
              this._down(0);
          }

          return top;
      }

      peek() {
          return this.data[0];
      }

      _up(pos) {
          const {data, compare} = this;
          const item = data[pos];

          while (pos > 0) {
              const parent = (pos - 1) >> 1;
              const current = data[parent];
              if (compare(item, current) >= 0) break;
              data[pos] = current;
              pos = parent;
          }

          data[pos] = item;
      }

      _down(pos) {
          const {data, compare} = this;
          const halfLength = this.length >> 1;
          const item = data[pos];

          while (pos < halfLength) {
              let left = (pos << 1) + 1;
              let best = data[left];
              const right = left + 1;

              if (right < this.length && compare(data[right], best) < 0) {
                  left = right;
                  best = data[right];
              }
              if (compare(best, item) >= 0) break;

              data[pos] = best;
              pos = left;
          }

          data[pos] = item;
      }
  }

  function defaultCompare(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
  }

  function checkWhichEventIsLeft (e1, e2) {
      if (e1.p.x > e2.p.x) return 1
      if (e1.p.x < e2.p.x) return -1

      if (e1.p.y !== e2.p.y) return e1.p.y > e2.p.y ? 1 : -1
      return 1
  }

  function checkWhichSegmentHasRightEndpointFirst (seg1, seg2) {
      if (seg1.rightSweepEvent.p.x > seg2.rightSweepEvent.p.x) return 1
      if (seg1.rightSweepEvent.p.x < seg2.rightSweepEvent.p.x) return -1

      if (seg1.rightSweepEvent.p.y !== seg2.rightSweepEvent.p.y) return seg1.rightSweepEvent.p.y < seg2.rightSweepEvent.p.y ? 1 : -1
      return 1
  }

  let Event$1 = class Event {

      constructor (p, featureId, ringId, eventId) {
          this.p = {
              x: p[0],
              y: p[1]
          };
          this.featureId = featureId;
          this.ringId = ringId;
          this.eventId = eventId;

          this.otherEvent = null;
          this.isLeftEndpoint = null;
      }

      isSamePoint (eventToCheck) {
          return this.p.x === eventToCheck.p.x && this.p.y === eventToCheck.p.y
      }
  };

  function fillEventQueue (geojson, eventQueue) {
      if (geojson.type === 'FeatureCollection') {
          const features = geojson.features;
          for (let i = 0; i < features.length; i++) {
              processFeature(features[i], eventQueue);
          }
      } else {
          processFeature(geojson, eventQueue);
      }
  }

  let featureId = 0;
  let ringId = 0;
  let eventId = 0;
  function processFeature (featureOrGeometry, eventQueue) {
      const geom = featureOrGeometry.type === 'Feature' ? featureOrGeometry.geometry : featureOrGeometry;
      let coords = geom.coordinates;
      // standardise the input
      if (geom.type === 'Polygon' || geom.type === 'MultiLineString') coords = [coords];
      if (geom.type === 'LineString') coords = [[coords]];

      for (let i = 0; i < coords.length; i++) {
          for (let ii = 0; ii < coords[i].length; ii++) {
              let currentP = coords[i][ii][0];
              let nextP = null;
              ringId = ringId + 1;
              for (let iii = 0; iii < coords[i][ii].length - 1; iii++) {
                  nextP = coords[i][ii][iii + 1];

                  const e1 = new Event$1(currentP, featureId, ringId, eventId);
                  const e2 = new Event$1(nextP, featureId, ringId, eventId + 1);

                  e1.otherEvent = e2;
                  e2.otherEvent = e1;

                  if (checkWhichEventIsLeft(e1, e2) > 0) {
                      e2.isLeftEndpoint = true;
                      e1.isLeftEndpoint = false;
                  } else {
                      e1.isLeftEndpoint = true;
                      e2.isLeftEndpoint = false;
                  }
                  eventQueue.push(e1);
                  eventQueue.push(e2);

                  currentP = nextP;
                  eventId = eventId + 1;
              }
          }
      }
      featureId = featureId + 1;
  }

  class Segment {

      constructor (event) {
          this.leftSweepEvent = event;
          this.rightSweepEvent = event.otherEvent;
      }
  }

  function testSegmentIntersect (seg1, seg2) {
      if (seg1 === null || seg2 === null) return false

      if (seg1.leftSweepEvent.ringId === seg2.leftSweepEvent.ringId &&
          (seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
          seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
          seg1.rightSweepEvent.isSamePoint(seg2.rightSweepEvent) ||
          seg1.leftSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
          seg1.leftSweepEvent.isSamePoint(seg2.rightSweepEvent))) return false

      const x1 = seg1.leftSweepEvent.p.x;
      const y1 = seg1.leftSweepEvent.p.y;
      const x2 = seg1.rightSweepEvent.p.x;
      const y2 = seg1.rightSweepEvent.p.y;
      const x3 = seg2.leftSweepEvent.p.x;
      const y3 = seg2.leftSweepEvent.p.y;
      const x4 = seg2.rightSweepEvent.p.x;
      const y4 = seg2.rightSweepEvent.p.y;

      const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
      const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
      const numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

      if (denom === 0) {
          if (numeA === 0 && numeB === 0) return false
          return false
      }

      const uA = numeA / denom;
      const uB = numeB / denom;

      if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          const x = x1 + (uA * (x2 - x1));
          const y = y1 + (uA * (y2 - y1));
          return [x, y]
      }
      return false
  }

  // import {debugEventAndSegments, debugRemovingSegment} from './debug'

  function runCheck (eventQueue, ignoreSelfIntersections) {
      ignoreSelfIntersections = ignoreSelfIntersections ? ignoreSelfIntersections : false;

      const intersectionPoints = [];
      const outQueue = new TinyQueue([], checkWhichSegmentHasRightEndpointFirst);

      while (eventQueue.length) {
          const event = eventQueue.pop();
          if (event.isLeftEndpoint) {
              // debugEventAndSegments(event.p, outQueue.data)
              const segment = new Segment(event);
              for (let i = 0; i < outQueue.data.length; i++) {
                  const otherSeg = outQueue.data[i];
                  if (ignoreSelfIntersections) {
                      if (otherSeg.leftSweepEvent.featureId === event.featureId) continue
                  }
                  const intersection = testSegmentIntersect(segment, otherSeg);
                  if (intersection !== false) intersectionPoints.push(intersection);
              }
              outQueue.push(segment);
          } else if (event.isLeftEndpoint === false) {
              outQueue.pop();
              // const seg = outQueue.pop()
              // debugRemovingSegment(event.p, seg)
          }
      }
      return intersectionPoints
  }

  function sweeplineIntersections$1 (geojson, ignoreSelfIntersections) {
      const eventQueue = new TinyQueue([], checkWhichEventIsLeft);
      fillEventQueue(geojson, eventQueue);
      return runCheck(eventQueue, ignoreSelfIntersections)
  }

  // index.ts
  var sweeplineIntersections = sweeplineIntersections$1;

  // index.ts
  function lineIntersect(line1, line2, options = {}) {
    const { removeDuplicates = true, ignoreSelfIntersections = true } = options;
    let features = [];
    if (line1.type === "FeatureCollection")
      features = features.concat(line1.features);
    else if (line1.type === "Feature") features.push(line1);
    else if (line1.type === "LineString" || line1.type === "Polygon" || line1.type === "MultiLineString" || line1.type === "MultiPolygon") {
      features.push(feature(line1));
    }
    if (line2.type === "FeatureCollection")
      features = features.concat(line2.features);
    else if (line2.type === "Feature") features.push(line2);
    else if (line2.type === "LineString" || line2.type === "Polygon" || line2.type === "MultiLineString" || line2.type === "MultiPolygon") {
      features.push(feature(line2));
    }
    const intersections = sweeplineIntersections(
      featureCollection(features),
      ignoreSelfIntersections
    );
    let results = [];
    if (removeDuplicates) {
      const unique = {};
      intersections.forEach((intersection) => {
        const key = intersection.join(",");
        if (!unique[key]) {
          unique[key] = true;
          results.push(intersection);
        }
      });
    } else {
      results = intersections;
    }
    return featureCollection(results.map((r) => point(r)));
  }

  // index.ts
  function polygonToLine(poly, options = {}) {
    const geom = getGeom(poly);
    if (!options.properties && poly.type === "Feature") {
      options.properties = poly.properties;
    }
    switch (geom.type) {
      case "Polygon":
        return singlePolygonToLine(geom, options);
      case "MultiPolygon":
        return multiPolygonToLine(geom, options);
      default:
        throw new Error("invalid poly");
    }
  }
  function singlePolygonToLine(poly, options = {}) {
    const geom = getGeom(poly);
    const coords = geom.coordinates;
    const properties = options.properties ? options.properties : poly.type === "Feature" ? poly.properties : {};
    return coordsToLine(coords, properties);
  }
  function multiPolygonToLine(multiPoly, options = {}) {
    const geom = getGeom(multiPoly);
    const coords = geom.coordinates;
    const properties = options.properties ? options.properties : multiPoly.type === "Feature" ? multiPoly.properties : {};
    const lines = [];
    coords.forEach((coord) => {
      lines.push(coordsToLine(coord, properties));
    });
    return featureCollection(lines);
  }
  function coordsToLine(coords, properties) {
    if (coords.length > 1) {
      return multiLineString(coords, properties);
    }
    return lineString(coords[0], properties);
  }

  // index.ts
  function booleanDisjoint(feature1, feature2, {
    ignoreSelfIntersections = true
  } = { ignoreSelfIntersections: true }) {
    let bool = true;
    flattenEach(feature1, (flatten1) => {
      flattenEach(feature2, (flatten2) => {
        if (bool === false) {
          return false;
        }
        bool = disjoint(
          flatten1.geometry,
          flatten2.geometry,
          ignoreSelfIntersections
        );
      });
    });
    return bool;
  }
  function disjoint(geom1, geom2, ignoreSelfIntersections) {
    switch (geom1.type) {
      case "Point":
        switch (geom2.type) {
          case "Point":
            return !compareCoords$1(geom1.coordinates, geom2.coordinates);
          case "LineString":
            return !isPointOnLine(geom2, geom1);
          case "Polygon":
            return !booleanPointInPolygon(geom1, geom2);
        }
        break;
      case "LineString":
        switch (geom2.type) {
          case "Point":
            return !isPointOnLine(geom1, geom2);
          case "LineString":
            return !isLineOnLine$1(geom1, geom2, ignoreSelfIntersections);
          case "Polygon":
            return !isLineInPoly$1(geom2, geom1, ignoreSelfIntersections);
        }
        break;
      case "Polygon":
        switch (geom2.type) {
          case "Point":
            return !booleanPointInPolygon(geom2, geom1);
          case "LineString":
            return !isLineInPoly$1(geom1, geom2, ignoreSelfIntersections);
          case "Polygon":
            return !isPolyInPoly$1(geom2, geom1, ignoreSelfIntersections);
        }
    }
    return false;
  }
  function isPointOnLine(lineString, pt) {
    for (let i = 0; i < lineString.coordinates.length - 1; i++) {
      if (isPointOnLineSegment(
        lineString.coordinates[i],
        lineString.coordinates[i + 1],
        pt.coordinates
      )) {
        return true;
      }
    }
    return false;
  }
  function isLineOnLine$1(lineString1, lineString2, ignoreSelfIntersections) {
    const doLinesIntersect = lineIntersect(lineString1, lineString2, {
      ignoreSelfIntersections
    });
    if (doLinesIntersect.features.length > 0) {
      return true;
    }
    return false;
  }
  function isLineInPoly$1(polygon, lineString, ignoreSelfIntersections) {
    for (const coord of lineString.coordinates) {
      if (booleanPointInPolygon(coord, polygon)) {
        return true;
      }
    }
    const doLinesIntersect = lineIntersect(lineString, polygonToLine(polygon), {
      ignoreSelfIntersections
    });
    if (doLinesIntersect.features.length > 0) {
      return true;
    }
    return false;
  }
  function isPolyInPoly$1(feature1, feature2, ignoreSelfIntersections) {
    for (const coord1 of feature1.coordinates[0]) {
      if (booleanPointInPolygon(coord1, feature2)) {
        return true;
      }
    }
    for (const coord2 of feature2.coordinates[0]) {
      if (booleanPointInPolygon(coord2, feature1)) {
        return true;
      }
    }
    const doLinesIntersect = lineIntersect(
      polygonToLine(feature1),
      polygonToLine(feature2),
      { ignoreSelfIntersections }
    );
    if (doLinesIntersect.features.length > 0) {
      return true;
    }
    return false;
  }
  function isPointOnLineSegment(lineSegmentStart, lineSegmentEnd, pt) {
    const dxc = pt[0] - lineSegmentStart[0];
    const dyc = pt[1] - lineSegmentStart[1];
    const dxl = lineSegmentEnd[0] - lineSegmentStart[0];
    const dyl = lineSegmentEnd[1] - lineSegmentStart[1];
    const cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
      return false;
    }
    if (Math.abs(dxl) >= Math.abs(dyl)) {
      if (dxl > 0) {
        return lineSegmentStart[0] <= pt[0] && pt[0] <= lineSegmentEnd[0];
      } else {
        return lineSegmentEnd[0] <= pt[0] && pt[0] <= lineSegmentStart[0];
      }
    } else if (dyl > 0) {
      return lineSegmentStart[1] <= pt[1] && pt[1] <= lineSegmentEnd[1];
    } else {
      return lineSegmentEnd[1] <= pt[1] && pt[1] <= lineSegmentStart[1];
    }
  }
  function compareCoords$1(pair1, pair2) {
    return pair1[0] === pair2[0] && pair1[1] === pair2[1];
  }

  // index.ts
  function booleanIntersects(feature1, feature2, {
    ignoreSelfIntersections = true
  } = {}) {
    let bool = false;
    flattenEach(feature1, (flatten1) => {
      flattenEach(feature2, (flatten2) => {
        if (bool === true) {
          return true;
        }
        bool = !booleanDisjoint(flatten1.geometry, flatten2.geometry, {
          ignoreSelfIntersections
        });
      });
    });
    return bool;
  }

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  function nearestPointOnLine(lines, pt, options = {}) {
    if (!lines || !pt) {
      throw new Error("lines and pt are required arguments");
    }
    const ptPos = getCoord(pt);
    let closestPt = point([Infinity, Infinity], {
      dist: Infinity,
      index: -1,
      multiFeatureIndex: -1,
      location: -1
    });
    let length = 0;
    flattenEach(
      lines,
      function(line, _featureIndex, multiFeatureIndex) {
        const coords = getCoords(line);
        for (let i = 0; i < coords.length - 1; i++) {
          const start = point(coords[i]);
          start.properties.dist = distance(pt, start, options);
          const startPos = getCoord(start);
          const stop = point(coords[i + 1]);
          stop.properties.dist = distance(pt, stop, options);
          const stopPos = getCoord(stop);
          const sectionLength = distance(start, stop, options);
          let intersectPos;
          let wasEnd;
          if (startPos[0] === ptPos[0] && startPos[1] === ptPos[1]) {
            [intersectPos, , wasEnd] = [startPos, void 0, false];
          } else if (stopPos[0] === ptPos[0] && stopPos[1] === ptPos[1]) {
            [intersectPos, , wasEnd] = [stopPos, void 0, true];
          } else {
            [intersectPos, , wasEnd] = nearestPointOnSegment(
              start.geometry.coordinates,
              stop.geometry.coordinates,
              getCoord(pt)
            );
          }
          let intersectPt;
          if (intersectPos) {
            intersectPt = point(intersectPos, {
              dist: distance(pt, intersectPos, options),
              multiFeatureIndex,
              location: length + distance(start, intersectPos, options)
            });
          }
          if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
            closestPt = __spreadProps(__spreadValues({}, intersectPt), {
              properties: __spreadProps(__spreadValues({}, intersectPt.properties), {
                // Legacy behaviour where index progresses to next segment # if we
                // went with the end point this iteration.
                index: wasEnd ? i + 1 : i
              })
            });
          }
          length += sectionLength;
        }
      }
    );
    return closestPt;
  }
  function dot$1(v1, v2) {
    const [v1x, v1y, v1z] = v1;
    const [v2x, v2y, v2z] = v2;
    return v1x * v2x + v1y * v2y + v1z * v2z;
  }
  function cross(v1, v2) {
    const [v1x, v1y, v1z] = v1;
    const [v2x, v2y, v2z] = v2;
    return [v1y * v2z - v1z * v2y, v1z * v2x - v1x * v2z, v1x * v2y - v1y * v2x];
  }
  function magnitude(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
  }
  function angle(v1, v2) {
    const theta = dot$1(v1, v2) / (magnitude(v1) * magnitude(v2));
    return Math.acos(Math.min(Math.max(theta, -1), 1));
  }
  function lngLatToVector(a) {
    const lat = degreesToRadians(a[1]);
    const lng = degreesToRadians(a[0]);
    return [
      Math.cos(lat) * Math.cos(lng),
      Math.cos(lat) * Math.sin(lng),
      Math.sin(lat)
    ];
  }
  function vectorToLngLat(v) {
    const [x, y, z] = v;
    const lat = radiansToDegrees(Math.asin(z));
    const lng = radiansToDegrees(Math.atan2(y, x));
    return [lng, lat];
  }
  function nearestPointOnSegment(posA, posB, posC) {
    const A = lngLatToVector(posA);
    const B = lngLatToVector(posB);
    const C = lngLatToVector(posC);
    const [Cx, Cy, Cz] = C;
    const [D, E, F] = cross(A, B);
    const a = E * Cz - F * Cy;
    const b = F * Cx - D * Cz;
    const c = D * Cy - E * Cx;
    const f = c * E - b * F;
    const g = a * F - c * D;
    const h = b * D - a * E;
    const t = 1 / Math.sqrt(Math.pow(f, 2) + Math.pow(g, 2) + Math.pow(h, 2));
    const I1 = [f * t, g * t, h * t];
    const I2 = [-1 * f * t, -1 * g * t, -1 * h * t];
    const angleAB = angle(A, B);
    const angleAI1 = angle(A, I1);
    const angleBI1 = angle(B, I1);
    const angleAI2 = angle(A, I2);
    const angleBI2 = angle(B, I2);
    let I;
    if (angleAI1 < angleAI2 && angleAI1 < angleBI2 || angleBI1 < angleAI2 && angleBI1 < angleBI2) {
      I = I1;
    } else {
      I = I2;
    }
    if (angle(A, I) > angleAB || angle(B, I) > angleAB) {
      if (distance(vectorToLngLat(I), vectorToLngLat(A)) <= distance(vectorToLngLat(I), vectorToLngLat(B))) {
        return [vectorToLngLat(A), true, false];
      } else {
        return [vectorToLngLat(B), false, true];
      }
    }
    return [vectorToLngLat(I), false, false];
  }

  // index.ts
  function booleanWithin(feature1, feature2) {
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);
    var type1 = geom1.type;
    var type2 = geom2.type;
    switch (type1) {
      case "Point":
        switch (type2) {
          case "MultiPoint":
            return isPointInMultiPoint(geom1, geom2);
          case "LineString":
            return booleanPointOnLine(geom1, geom2, { ignoreEndVertices: true });
          case "Polygon":
          case "MultiPolygon":
            return booleanPointInPolygon(geom1, geom2, { ignoreBoundary: true });
          default:
            throw new Error("feature2 " + type2 + " geometry not supported");
        }
      case "MultiPoint":
        switch (type2) {
          case "MultiPoint":
            return isMultiPointInMultiPoint(geom1, geom2);
          case "LineString":
            return isMultiPointOnLine(geom1, geom2);
          case "Polygon":
          case "MultiPolygon":
            return isMultiPointInPoly(geom1, geom2);
          default:
            throw new Error("feature2 " + type2 + " geometry not supported");
        }
      case "LineString":
        switch (type2) {
          case "LineString":
            return isLineOnLine(geom1, geom2);
          case "Polygon":
          case "MultiPolygon":
            return isLineInPoly(geom1, geom2);
          default:
            throw new Error("feature2 " + type2 + " geometry not supported");
        }
      case "Polygon":
        switch (type2) {
          case "Polygon":
          case "MultiPolygon":
            return isPolyInPoly(geom1, geom2);
          default:
            throw new Error("feature2 " + type2 + " geometry not supported");
        }
      default:
        throw new Error("feature1 " + type1 + " geometry not supported");
    }
  }
  function isPointInMultiPoint(point, multiPoint) {
    var i;
    var output = false;
    for (i = 0; i < multiPoint.coordinates.length; i++) {
      if (compareCoords(multiPoint.coordinates[i], point.coordinates)) {
        output = true;
        break;
      }
    }
    return output;
  }
  function isMultiPointInMultiPoint(multiPoint1, multiPoint2) {
    for (var i = 0; i < multiPoint1.coordinates.length; i++) {
      var anyMatch = false;
      for (var i2 = 0; i2 < multiPoint2.coordinates.length; i2++) {
        if (compareCoords(multiPoint1.coordinates[i], multiPoint2.coordinates[i2])) {
          anyMatch = true;
        }
      }
      if (!anyMatch) {
        return false;
      }
    }
    return true;
  }
  function isMultiPointOnLine(multiPoint, lineString) {
    var foundInsidePoint = false;
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
      if (!booleanPointOnLine(multiPoint.coordinates[i], lineString)) {
        return false;
      }
      if (!foundInsidePoint) {
        foundInsidePoint = booleanPointOnLine(
          multiPoint.coordinates[i],
          lineString,
          { ignoreEndVertices: true }
        );
      }
    }
    return foundInsidePoint;
  }
  function isMultiPointInPoly(multiPoint, polygon) {
    var output = true;
    var isInside = false;
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
      isInside = booleanPointInPolygon(multiPoint.coordinates[i], polygon);
      if (!isInside) {
        output = false;
        break;
      }
      {
        isInside = booleanPointInPolygon(multiPoint.coordinates[i], polygon, {
          ignoreBoundary: true
        });
      }
    }
    return output && isInside;
  }
  function isLineOnLine(lineString1, lineString2) {
    for (var i = 0; i < lineString1.coordinates.length; i++) {
      if (!booleanPointOnLine(lineString1.coordinates[i], lineString2)) {
        return false;
      }
    }
    return true;
  }
  function isLineInPoly(linestring, polygon) {
    var polyBbox = bbox(polygon);
    var lineBbox = bbox(linestring);
    if (!doBBoxOverlap(polyBbox, lineBbox)) {
      return false;
    }
    var foundInsidePoint = false;
    for (var i = 0; i < linestring.coordinates.length; i++) {
      if (!booleanPointInPolygon(linestring.coordinates[i], polygon)) {
        return false;
      }
      if (!foundInsidePoint) {
        foundInsidePoint = booleanPointInPolygon(
          linestring.coordinates[i],
          polygon,
          { ignoreBoundary: true }
        );
      }
      if (!foundInsidePoint && i < linestring.coordinates.length - 1) {
        var midpoint = getMidpoint(
          linestring.coordinates[i],
          linestring.coordinates[i + 1]
        );
        foundInsidePoint = booleanPointInPolygon(midpoint, polygon, {
          ignoreBoundary: true
        });
      }
    }
    return foundInsidePoint;
  }
  function isPolyInPoly(geometry1, geometry2) {
    var poly1Bbox = bbox(geometry1);
    var poly2Bbox = bbox(geometry2);
    if (!doBBoxOverlap(poly2Bbox, poly1Bbox)) {
      return false;
    }
    for (var i = 0; i < geometry1.coordinates[0].length; i++) {
      if (!booleanPointInPolygon(geometry1.coordinates[0][i], geometry2)) {
        return false;
      }
    }
    return true;
  }
  function doBBoxOverlap(bbox1, bbox2) {
    if (bbox1[0] > bbox2[0]) return false;
    if (bbox1[2] < bbox2[2]) return false;
    if (bbox1[1] > bbox2[1]) return false;
    if (bbox1[3] < bbox2[3]) return false;
    return true;
  }
  function compareCoords(pair1, pair2) {
    return pair1[0] === pair2[0] && pair1[1] === pair2[1];
  }
  function getMidpoint(pair1, pair2) {
    return [(pair1[0] + pair2[0]) / 2, (pair1[1] + pair2[1]) / 2];
  }

  // index.ts
  function centroid(geojson, options = {}) {
    let xSum = 0;
    let ySum = 0;
    let len = 0;
    coordEach(
      geojson,
      function(coord) {
        xSum += coord[0];
        ySum += coord[1];
        len++;
      },
      true
    );
    return point([xSum / len, ySum / len], options.properties);
  }

  // index.ts
  function clone(geojson) {
    if (!geojson) {
      throw new Error("geojson is required");
    }
    switch (geojson.type) {
      case "Feature":
        return cloneFeature(geojson);
      case "FeatureCollection":
        return cloneFeatureCollection(geojson);
      case "Point":
      case "LineString":
      case "Polygon":
      case "MultiPoint":
      case "MultiLineString":
      case "MultiPolygon":
      case "GeometryCollection":
        return cloneGeometry(geojson);
      default:
        throw new Error("unknown GeoJSON type");
    }
  }
  function cloneFeature(geojson) {
    const cloned = { type: "Feature" };
    Object.keys(geojson).forEach((key) => {
      switch (key) {
        case "type":
        case "properties":
        case "geometry":
          return;
        default:
          cloned[key] = geojson[key];
      }
    });
    cloned.properties = cloneProperties(geojson.properties);
    if (geojson.geometry == null) {
      cloned.geometry = null;
    } else {
      cloned.geometry = cloneGeometry(geojson.geometry);
    }
    return cloned;
  }
  function cloneProperties(properties) {
    const cloned = {};
    if (!properties) {
      return cloned;
    }
    Object.keys(properties).forEach((key) => {
      const value = properties[key];
      if (typeof value === "object") {
        if (value === null) {
          cloned[key] = null;
        } else if (Array.isArray(value)) {
          cloned[key] = value.map((item) => {
            return item;
          });
        } else {
          cloned[key] = cloneProperties(value);
        }
      } else {
        cloned[key] = value;
      }
    });
    return cloned;
  }
  function cloneFeatureCollection(geojson) {
    const cloned = { type: "FeatureCollection" };
    Object.keys(geojson).forEach((key) => {
      switch (key) {
        case "type":
        case "features":
          return;
        default:
          cloned[key] = geojson[key];
      }
    });
    cloned.features = geojson.features.map((feature) => {
      return cloneFeature(feature);
    });
    return cloned;
  }
  function cloneGeometry(geometry) {
    const geom = { type: geometry.type };
    if (geometry.bbox) {
      geom.bbox = geometry.bbox;
    }
    if (geometry.type === "GeometryCollection") {
      geom.geometries = geometry.geometries.map((g) => {
        return cloneGeometry(g);
      });
      return geom;
    }
    geom.coordinates = deepSlice(geometry.coordinates);
    return geom;
  }
  function deepSlice(coords) {
    const cloned = coords;
    if (typeof cloned[0] !== "object") {
      return cloned.slice();
    }
    return cloned.map((coord) => {
      return deepSlice(coord);
    });
  }

  // index.ts
  function rhumbDestination(origin, distance, bearing, options = {}) {
    const wasNegativeDistance = distance < 0;
    let distanceInMeters = convertLength(
      Math.abs(distance),
      options.units,
      "meters"
    );
    if (wasNegativeDistance) distanceInMeters = -Math.abs(distanceInMeters);
    const coords = getCoord(origin);
    const destination = calculateRhumbDestination(
      coords,
      distanceInMeters,
      bearing
    );
    destination[0] += destination[0] - coords[0] > 180 ? -360 : coords[0] - destination[0] > 180 ? 360 : 0;
    return point(destination, options.properties);
  }
  function calculateRhumbDestination(origin, distance, bearing, radius) {
    radius = radius === void 0 ? earthRadius : Number(radius);
    const delta = distance / radius;
    const lambda1 = origin[0] * Math.PI / 180;
    const phi1 = degreesToRadians(origin[1]);
    const theta = degreesToRadians(bearing);
    const DeltaPhi = delta * Math.cos(theta);
    let phi2 = phi1 + DeltaPhi;
    if (Math.abs(phi2) > Math.PI / 2) {
      phi2 = phi2 > 0 ? Math.PI - phi2 : -Math.PI - phi2;
    }
    const DeltaPsi = Math.log(
      Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4)
    );
    const q = Math.abs(DeltaPsi) > 1e-11 ? DeltaPhi / DeltaPsi : Math.cos(phi1);
    const DeltaLambda = delta * Math.sin(theta) / q;
    const lambda2 = lambda1 + DeltaLambda;
    return [
      (lambda2 * 180 / Math.PI + 540) % 360 - 180,
      phi2 * 180 / Math.PI
    ];
  }

  // index.ts
  function rhumbDistance(from, to, options = {}) {
    const origin = getCoord(from);
    const destination = getCoord(to);
    destination[0] += destination[0] - origin[0] > 180 ? -360 : origin[0] - destination[0] > 180 ? 360 : 0;
    const distanceInMeters = calculateRhumbDistance(origin, destination);
    const distance = convertLength(distanceInMeters, "meters", options.units);
    return distance;
  }
  function calculateRhumbDistance(origin, destination, radius) {
    radius = radius === void 0 ? earthRadius : Number(radius);
    const R = radius;
    const phi1 = origin[1] * Math.PI / 180;
    const phi2 = destination[1] * Math.PI / 180;
    const DeltaPhi = phi2 - phi1;
    let DeltaLambda = Math.abs(destination[0] - origin[0]) * Math.PI / 180;
    if (DeltaLambda > Math.PI) {
      DeltaLambda -= 2 * Math.PI;
    }
    const DeltaPsi = Math.log(
      Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4)
    );
    const q = Math.abs(DeltaPsi) > 1e-11 ? DeltaPhi / DeltaPsi : Math.cos(phi1);
    const delta = Math.sqrt(
      DeltaPhi * DeltaPhi + q * q * DeltaLambda * DeltaLambda
    );
    const dist = delta * R;
    return dist;
  }

  // index.ts
  function transformRotate(geojson, angle, options) {
    options = options || {};
    if (!isObject(options)) throw new Error("options is invalid");
    const pivot = options.pivot;
    const mutate = options.mutate;
    if (!geojson) throw new Error("geojson is required");
    if (angle === void 0 || angle === null || isNaN(angle))
      throw new Error("angle is required");
    if (angle === 0) return geojson;
    const pivotCoord = pivot != null ? pivot : centroid(geojson);
    if (mutate === false || mutate === void 0) geojson = clone(geojson);
    coordEach(geojson, function(pointCoords) {
      const initialAngle = rhumbBearing(pivotCoord, pointCoords);
      const finalAngle = initialAngle + angle;
      const distance = rhumbDistance(pivotCoord, pointCoords);
      const newCoords = getCoords(
        rhumbDestination(pivotCoord, distance, finalAngle)
      );
      pointCoords[0] = newCoords[0];
      pointCoords[1] = newCoords[1];
    });
    return geojson;
  }

  // index.ts
  function pointToLineDistance(pt, line, options = {}) {
    var _a, _b;
    const method = (_a = options.method) != null ? _a : "geodesic";
    const units = (_b = options.units) != null ? _b : "kilometers";
    if (!pt) {
      throw new Error("pt is required");
    }
    if (Array.isArray(pt)) {
      pt = point(pt);
    } else if (pt.type === "Point") {
      pt = feature(pt);
    } else {
      featureOf(pt, "Point", "point");
    }
    if (!line) {
      throw new Error("line is required");
    }
    if (Array.isArray(line)) {
      line = lineString(line);
    } else if (line.type === "LineString") {
      line = feature(line);
    } else {
      featureOf(line, "LineString", "line");
    }
    let distance = Infinity;
    const p = pt.geometry.coordinates;
    segmentEach(line, (segment) => {
      if (segment) {
        const a = segment.geometry.coordinates[0];
        const b = segment.geometry.coordinates[1];
        const d = distanceToSegment(p, a, b, { method });
        if (d < distance) {
          distance = d;
        }
      }
    });
    return convertLength(distance, "degrees", units);
  }
  function distanceToSegment(p, a, b, options) {
    if (options.method === "geodesic") {
      const nearest = nearestPointOnLine(lineString([a, b]).geometry, p, {
        units: "degrees"
      });
      return nearest.properties.dist;
    }
    const v = [b[0] - a[0], b[1] - a[1]];
    const w = [p[0] - a[0], p[1] - a[1]];
    const c1 = dot(w, v);
    if (c1 <= 0) {
      return rhumbDistance(p, a, { units: "degrees" });
    }
    const c2 = dot(v, v);
    if (c2 <= c1) {
      return rhumbDistance(p, b, { units: "degrees" });
    }
    const b2 = c1 / c2;
    const Pb = [a[0] + b2 * v[0], a[1] + b2 * v[1]];
    return rhumbDistance(p, Pb, { units: "degrees" });
  }
  function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
  }

  function globals(defs) {
    defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
    defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
    defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
    // UTM WGS84
    for (var i = 0; i <= 60; ++i) {
      defs('EPSG:' + (32600 + i), "+proj=utm +zone=" + i + " +datum=WGS84 +units=m");
      defs('EPSG:' + (32700 + i), "+proj=utm +zone=" + i + " +south +datum=WGS84 +units=m");
    }

    defs.WGS84 = defs['EPSG:4326'];
    defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
    defs.GOOGLE = defs['EPSG:3857'];
    defs['EPSG:900913'] = defs['EPSG:3857'];
    defs['EPSG:102113'] = defs['EPSG:3857'];
  }

  var PJD_3PARAM = 1;
  var PJD_7PARAM = 2;
  var PJD_GRIDSHIFT = 3;
  var PJD_WGS84 = 4; // WGS84 or equivalent
  var PJD_NODATUM = 5; // WGS84 or equivalent
  var SRS_WGS84_SEMIMAJOR = 6378137.0;  // only used in grid shift transforms
  var SRS_WGS84_SEMIMINOR = 6356752.314;  // only used in grid shift transforms
  var SRS_WGS84_ESQUARED = 0.0066943799901413165; // only used in grid shift transforms
  var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
  var HALF_PI = Math.PI/2;
  // ellipoid pj_set_ell.c
  var SIXTH = 0.1666666666666666667;
  /* 1/6 */
  var RA4 = 0.04722222222222222222;
  /* 17/360 */
  var RA6 = 0.02215608465608465608;
  var EPSLN = 1.0e-10;
  // you'd think you could use Number.EPSILON above but that makes
  // Mollweide get into an infinate loop.

  var D2R$1 = 0.01745329251994329577;
  var R2D = 57.29577951308232088;
  var FORTPI = Math.PI/4;
  var TWO_PI = Math.PI * 2;
  // SPI is slightly greater than Math.PI, so values that exceed the -180..180
  // degree range by a tiny amount don't get wrapped. This prevents points that
  // have drifted from their original location along the 180th meridian (due to
  // floating point error) from changing their sign.
  var SPI = 3.14159265359;

  var exports$2 = {};

  exports$2.greenwich = 0.0; //"0dE",
  exports$2.lisbon = -9.131906111111; //"9d07'54.862\"W",
  exports$2.paris = 2.337229166667; //"2d20'14.025\"E",
  exports$2.bogota = -74.080916666667; //"74d04'51.3\"W",
  exports$2.madrid = -3.687938888889; //"3d41'16.58\"W",
  exports$2.rome = 12.452333333333; //"12d27'8.4\"E",
  exports$2.bern = 7.439583333333; //"7d26'22.5\"E",
  exports$2.jakarta = 106.807719444444; //"106d48'27.79\"E",
  exports$2.ferro = -17.666666666667; //"17d40'W",
  exports$2.brussels = 4.367975; //"4d22'4.71\"E",
  exports$2.stockholm = 18.058277777778; //"18d3'29.8\"E",
  exports$2.athens = 23.7163375; //"23d42'58.815\"E",
  exports$2.oslo = 10.722916666667; //"10d43'22.5\"E"

  var units = {
    'mm': {to_meter: 0.001},
    'cm': {to_meter: 0.01},
    'ft': {to_meter: 0.3048},
    'us-ft': {to_meter: 1200 / 3937},
    'fath': {to_meter: 1.8288},
    'kmi': {to_meter: 1852},
    'us-ch': {to_meter: 20.1168402336805},
    'us-mi': {to_meter: 1609.34721869444},
    'km': {to_meter: 1000},
    'ind-ft': {to_meter: 0.30479841},
    'ind-yd': {to_meter: 0.91439523},
    'mi': {to_meter: 1609.344},
    'yd': {to_meter: 0.9144},
    'ch': {to_meter: 20.1168},
    'link': {to_meter: 0.201168},
    'dm': {to_meter: 0.01},
    'in': {to_meter: 0.0254},
    'ind-ch': {to_meter: 20.11669506},
    'us-in': {to_meter: 0.025400050800101},
    'us-yd': {to_meter: 0.914401828803658}
  };

  var ignoredChar = /[\s_\-\/\(\)]/g;
  function match(obj, key) {
    if (obj[key]) {
      return obj[key];
    }
    var keys = Object.keys(obj);
    var lkey = key.toLowerCase().replace(ignoredChar, '');
    var i = -1;
    var testkey, processedKey;
    while (++i < keys.length) {
      testkey = keys[i];
      processedKey = testkey.toLowerCase().replace(ignoredChar, '');
      if (processedKey === lkey) {
        return obj[testkey];
      }
    }
  }

  function projStr(defData) {
    var self = {};
    var paramObj = defData.split('+').map(function(v) {
      return v.trim();
    }).filter(function(a) {
      return a;
    }).reduce(function(p, a) {
      var split = a.split('=');
      split.push(true);
      p[split[0].toLowerCase()] = split[1];
      return p;
    }, {});
    var paramName, paramVal, paramOutname;
    var params = {
      proj: 'projName',
      datum: 'datumCode',
      rf: function(v) {
        self.rf = parseFloat(v);
      },
      lat_0: function(v) {
        self.lat0 = v * D2R$1;
      },
      lat_1: function(v) {
        self.lat1 = v * D2R$1;
      },
      lat_2: function(v) {
        self.lat2 = v * D2R$1;
      },
      lat_ts: function(v) {
        self.lat_ts = v * D2R$1;
      },
      lon_0: function(v) {
        self.long0 = v * D2R$1;
      },
      lon_1: function(v) {
        self.long1 = v * D2R$1;
      },
      lon_2: function(v) {
        self.long2 = v * D2R$1;
      },
      alpha: function(v) {
        self.alpha = parseFloat(v) * D2R$1;
      },
      gamma: function(v) {
        self.rectified_grid_angle = parseFloat(v);
      },
      lonc: function(v) {
        self.longc = v * D2R$1;
      },
      x_0: function(v) {
        self.x0 = parseFloat(v);
      },
      y_0: function(v) {
        self.y0 = parseFloat(v);
      },
      k_0: function(v) {
        self.k0 = parseFloat(v);
      },
      k: function(v) {
        self.k0 = parseFloat(v);
      },
      a: function(v) {
        self.a = parseFloat(v);
      },
      b: function(v) {
        self.b = parseFloat(v);
      },
      r: function(v) {
        self.a = self.b = parseFloat(v);
      },
      r_a: function() {
        self.R_A = true;
      },
      zone: function(v) {
        self.zone = parseInt(v, 10);
      },
      south: function() {
        self.utmSouth = true;
      },
      towgs84: function(v) {
        self.datum_params = v.split(",").map(function(a) {
          return parseFloat(a);
        });
      },
      to_meter: function(v) {
        self.to_meter = parseFloat(v);
      },
      units: function(v) {
        self.units = v;
        var unit = match(units, v);
        if (unit) {
          self.to_meter = unit.to_meter;
        }
      },
      from_greenwich: function(v) {
        self.from_greenwich = v * D2R$1;
      },
      pm: function(v) {
        var pm = match(exports$2, v);
        self.from_greenwich = (pm ? pm : parseFloat(v)) * D2R$1;
      },
      nadgrids: function(v) {
        if (v === '@null') {
          self.datumCode = 'none';
        }
        else {
          self.nadgrids = v;
        }
      },
      axis: function(v) {
        var legalAxis = "ewnsud";
        if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
          self.axis = v;
        }
      },
      approx: function() {
        self.approx = true;
      }
    };
    for (paramName in paramObj) {
      paramVal = paramObj[paramName];
      if (paramName in params) {
        paramOutname = params[paramName];
        if (typeof paramOutname === 'function') {
          paramOutname(paramVal);
        }
        else {
          self[paramOutname] = paramVal;
        }
      }
      else {
        self[paramName] = paramVal;
      }
    }
    if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
      self.datumCode = self.datumCode.toLowerCase();
    }
    return self;
  }

  class PROJJSONBuilderBase {
    static getId(node) {
      const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
      if (idNode && idNode.length >= 3) {
        return {
          authority: idNode[1],
          code: parseInt(idNode[2], 10),
        };
      }
      return null;
    }

    static convertUnit(node, type = 'unit') {
      if (!node || node.length < 3) {
        return { type, name: 'unknown', conversion_factor: null };
      }

      const name = node[1];
      const conversionFactor = parseFloat(node[2]) || null;

      const idNode = node.find((child) => Array.isArray(child) && child[0] === 'ID');
      const id = idNode
        ? {
          authority: idNode[1],
          code: parseInt(idNode[2], 10),
        }
        : null;

      return {
        type,
        name,
        conversion_factor: conversionFactor,
        id,
      };
    }

    static convertAxis(node) {
      const name = node[1] || 'Unknown';

      // Determine the direction
      let direction;
      const abbreviationMatch = name.match(/^\((.)\)$/); // Match abbreviations like "(E)" or "(N)"
      if (abbreviationMatch) {
        // Use the abbreviation to determine the direction
        const abbreviation = abbreviationMatch[1].toUpperCase();
        if (abbreviation === 'E') direction = 'east';
        else if (abbreviation === 'N') direction = 'north';
        else if (abbreviation === 'U') direction = 'up';
        else throw new Error(`Unknown axis abbreviation: ${abbreviation}`);
      } else {
        // Use the explicit direction provided in the AXIS node
        direction = node[2] ? node[2].toLowerCase() : 'unknown';
      }

      const orderNode = node.find((child) => Array.isArray(child) && child[0] === 'ORDER');
      const order = orderNode ? parseInt(orderNode[1], 10) : null;

      const unitNode = node.find(
        (child) =>
          Array.isArray(child) &&
          (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
      );
      const unit = this.convertUnit(unitNode);

      return {
        name,
        direction, // Use the valid PROJJSON direction value
        unit,
        order,
      };
    }

    static extractAxes(node) {
      return node
        .filter((child) => Array.isArray(child) && child[0] === 'AXIS')
        .map((axis) => this.convertAxis(axis))
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by the "order" property
    }

    static convert(node, result = {}) {

      switch (node[0]) {
        case 'PROJCRS':
          result.type = 'ProjectedCRS';
          result.name = node[1];
          result.base_crs = node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'BASEGEOGCRS'))
            : null;
          result.conversion = node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'CONVERSION'))
            : null;

          const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
          if (csNode) {
            result.coordinate_system = {
              type: csNode[1],
              axis: this.extractAxes(node),
            };
          }

          const lengthUnitNode = node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT');
          if (lengthUnitNode) {
            const unit = this.convertUnit(lengthUnitNode);
            result.coordinate_system.unit = unit; // Add unit to coordinate_system
          }

          result.id = this.getId(node);
          break;

        case 'BASEGEOGCRS':
        case 'GEOGCRS':
          result.type = 'GeographicCRS';
          result.name = node[1];

          // Handle DATUM or ENSEMBLE
          const datumOrEnsembleNode = node.find(
            (child) => Array.isArray(child) && (child[0] === 'DATUM' || child[0] === 'ENSEMBLE')
          );
          if (datumOrEnsembleNode) {
            const datumOrEnsemble = this.convert(datumOrEnsembleNode);
            if (datumOrEnsembleNode[0] === 'ENSEMBLE') {
              result.datum_ensemble = datumOrEnsemble;
            } else {
              result.datum = datumOrEnsemble;
            }
            const primem = node.find((child) => Array.isArray(child) && child[0] === 'PRIMEM');
            if (primem && primem[1] !== 'Greenwich') {
              datumOrEnsemble.prime_meridian = {
                name: primem[1],
                longitude: parseFloat(primem[2]),
              };
            }
          }

          result.coordinate_system = {
            type: 'ellipsoidal',
            axis: this.extractAxes(node),
          };

          result.id = this.getId(node);
          break;

        case 'DATUM':
          result.type = 'GeodeticReferenceFrame';
          result.name = node[1];
          result.ellipsoid = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID'))
            : null;
          break;

        case 'ENSEMBLE':
          result.type = 'DatumEnsemble';
          result.name = node[1];

          // Extract ensemble members
          result.members = node
            .filter((child) => Array.isArray(child) && child[0] === 'MEMBER')
            .map((member) => ({
              type: 'DatumEnsembleMember',
              name: member[1],
              id: this.getId(member), // Extract ID as { authority, code }
            }));

          // Extract accuracy
          const accuracyNode = node.find((child) => Array.isArray(child) && child[0] === 'ENSEMBLEACCURACY');
          if (accuracyNode) {
            result.accuracy = parseFloat(accuracyNode[1]);
          }

          // Extract ellipsoid
          const ellipsoidNode = node.find((child) => Array.isArray(child) && child[0] === 'ELLIPSOID');
          if (ellipsoidNode) {
            result.ellipsoid = this.convert(ellipsoidNode); // Convert the ellipsoid node
          }

          // Extract identifier for the ensemble
          result.id = this.getId(node);
          break;

        case 'ELLIPSOID':
          result.type = 'Ellipsoid';
          result.name = node[1];
          result.semi_major_axis = parseFloat(node[2]);
          result.inverse_flattening = parseFloat(node[3]);
          node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'LENGTHUNIT'), result)
            : null;
          break;

        case 'CONVERSION':
          result.type = 'Conversion';
          result.name = node[1];
          result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
            : null;
          result.parameters = node
            .filter((child) => Array.isArray(child) && child[0] === 'PARAMETER')
            .map((param) => this.convert(param));
          break;

        case 'METHOD':
          result.type = 'Method';
          result.name = node[1];
          result.id = this.getId(node);
          break;

        case 'PARAMETER':
          result.type = 'Parameter';
          result.name = node[1];
          result.value = parseFloat(node[2]);
          result.unit = this.convertUnit(
            node.find(
              (child) =>
                Array.isArray(child) &&
                (child[0] === 'LENGTHUNIT' || child[0] === 'ANGLEUNIT' || child[0] === 'SCALEUNIT')
            )
          );
          result.id = this.getId(node);
          break;

        case 'BOUNDCRS':
          result.type = 'BoundCRS';

          // Process SOURCECRS
          const sourceCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'SOURCECRS');
          if (sourceCrsNode) {
            const sourceCrsContent = sourceCrsNode.find((child) => Array.isArray(child));
            result.source_crs = sourceCrsContent ? this.convert(sourceCrsContent) : null;
          }

          // Process TARGETCRS
          const targetCrsNode = node.find((child) => Array.isArray(child) && child[0] === 'TARGETCRS');
          if (targetCrsNode) {
            const targetCrsContent = targetCrsNode.find((child) => Array.isArray(child));
            result.target_crs = targetCrsContent ? this.convert(targetCrsContent) : null;
          }

          // Process ABRIDGEDTRANSFORMATION
          const transformationNode = node.find((child) => Array.isArray(child) && child[0] === 'ABRIDGEDTRANSFORMATION');
          if (transformationNode) {
            result.transformation = this.convert(transformationNode);
          } else {
            result.transformation = null;
          }
          break;

        case 'ABRIDGEDTRANSFORMATION':
          result.type = 'Transformation';
          result.name = node[1];
          result.method = node.find((child) => Array.isArray(child) && child[0] === 'METHOD')
            ? this.convert(node.find((child) => Array.isArray(child) && child[0] === 'METHOD'))
            : null;

          result.parameters = node
            .filter((child) => Array.isArray(child) && (child[0] === 'PARAMETER' || child[0] === 'PARAMETERFILE'))
            .map((param) => {
              if (param[0] === 'PARAMETER') {
                return this.convert(param);
              } else if (param[0] === 'PARAMETERFILE') {
                return {
                  name: param[1],
                  value: param[2],
                  id: {
                    'authority': 'EPSG',
                    'code': 8656
                  }
                };
              }
            });

          // Adjust the Scale difference parameter if present
          if (result.parameters.length === 7) {
            const scaleDifference = result.parameters[6];
            if (scaleDifference.name === 'Scale difference') {
              scaleDifference.value = Math.round((scaleDifference.value - 1) * 1e12) / 1e6;
            }
          }

          result.id = this.getId(node);
          break;

        case 'AXIS':
          if (!result.coordinate_system) {
            result.coordinate_system = { type: 'unspecified', axis: [] };
          }
          result.coordinate_system.axis.push(this.convertAxis(node));
          break;

        case 'LENGTHUNIT':
          const unit = this.convertUnit(node, 'LinearUnit');
          if (result.coordinate_system && result.coordinate_system.axis) {
            result.coordinate_system.axis.forEach((axis) => {
              if (!axis.unit) {
                axis.unit = unit;
              }
            });
          }
          if (unit.conversion_factor && unit.conversion_factor !== 1) {
            if (result.semi_major_axis) {
              result.semi_major_axis = {
                value: result.semi_major_axis,
                unit,
              };
            }
          }
          break;

        default:
          result.keyword = node[0];
          break;
      }

      return result;
    }
  }

  class PROJJSONBuilder2015 extends PROJJSONBuilderBase {
    static convert(node, result = {}) {
      super.convert(node, result);

      // Skip `CS` and `USAGE` nodes for WKT2-2015
      if (result.coordinate_system && result.coordinate_system.subtype === 'Cartesian') {
        delete result.coordinate_system;
      }
      if (result.usage) {
        delete result.usage;
      }

      return result;
    }
  }

  class PROJJSONBuilder2019 extends PROJJSONBuilderBase {
    static convert(node, result = {}) {
      super.convert(node, result);

      // Handle `CS` node for WKT2-2019
      const csNode = node.find((child) => Array.isArray(child) && child[0] === 'CS');
      if (csNode) {
        result.coordinate_system = {
          subtype: csNode[1],
          axis: this.extractAxes(node),
        };
      }

      // Handle `USAGE` node for WKT2-2019
      const usageNode = node.find((child) => Array.isArray(child) && child[0] === 'USAGE');
      if (usageNode) {
        const scope = usageNode.find((child) => Array.isArray(child) && child[0] === 'SCOPE');
        const area = usageNode.find((child) => Array.isArray(child) && child[0] === 'AREA');
        const bbox = usageNode.find((child) => Array.isArray(child) && child[0] === 'BBOX');
        result.usage = {};
        if (scope) {
          result.usage.scope = scope[1];
        }
        if (area) {
          result.usage.area = area[1];
        }
        if (bbox) {
          result.usage.bbox = bbox.slice(1);
        }
      }

      return result;
    }
  }

  /**
   * Detects the WKT2 version based on the structure of the WKT.
   * @param {Array} root The root WKT array node.
   * @returns {string} The detected version ("2015" or "2019").
   */
  function detectWKT2Version(root) {
    // Check for WKT2-2019-specific nodes
    if (root.find((child) => Array.isArray(child) && child[0] === 'USAGE')) {
      return '2019'; // `USAGE` is specific to WKT2-2019
    }

    // Check for WKT2-2015-specific nodes
    if (root.find((child) => Array.isArray(child) && child[0] === 'CS')) {
      return '2015'; // `CS` is valid in both, but default to 2015 unless `USAGE` is present
    }

    if (root[0] === 'BOUNDCRS' || root[0] === 'PROJCRS' || root[0] === 'GEOGCRS') {
      return '2015'; // These are valid in both, but default to 2015
    }

    // Default to WKT2-2015 if no specific indicators are found
    return '2015';
  }

  /**
   * Builds a PROJJSON object from a WKT array structure.
   * @param {Array} root The root WKT array node.
   * @returns {Object} The PROJJSON object.
   */
  function buildPROJJSON(root) {
    const version = detectWKT2Version(root);
    const builder = version === '2019' ? PROJJSONBuilder2019 : PROJJSONBuilder2015;
    return builder.convert(root);
  }

  /**
   * Detects whether the WKT string is WKT1 or WKT2.
   * @param {string} wkt The WKT string.
   * @returns {string} The detected version ("WKT1" or "WKT2").
   */
  function detectWKTVersion(wkt) {
    // Normalize the WKT string for easier keyword matching
    const normalizedWKT = wkt.toUpperCase();

    // Check for WKT2-specific keywords
    if (
      normalizedWKT.includes('PROJCRS') ||
      normalizedWKT.includes('GEOGCRS') ||
      normalizedWKT.includes('BOUNDCRS') ||
      normalizedWKT.includes('VERTCRS') ||
      normalizedWKT.includes('LENGTHUNIT') ||
      normalizedWKT.includes('ANGLEUNIT') ||
      normalizedWKT.includes('SCALEUNIT')
    ) {
      return 'WKT2';
    }

    // Check for WKT1-specific keywords
    if (
      normalizedWKT.includes('PROJCS') ||
      normalizedWKT.includes('GEOGCS') ||
      normalizedWKT.includes('LOCAL_CS') ||
      normalizedWKT.includes('VERT_CS') ||
      normalizedWKT.includes('UNIT')
    ) {
      return 'WKT1';
    }

    // Default to WKT1 if no specific indicators are found
    return 'WKT1';
  }

  var NEUTRAL = 1;
  var KEYWORD = 2;
  var NUMBER = 3;
  var QUOTED = 4;
  var AFTERQUOTE = 5;
  var ENDED = -1;
  var whitespace = /\s/;
  var latin = /[A-Za-z]/;
  var keyword = /[A-Za-z84_]/;
  var endThings = /[,\]]/;
  var digets = /[\d\.E\-\+]/;
  // const ignoredChar = /[\s_\-\/\(\)]/g;
  function Parser(text) {
    if (typeof text !== 'string') {
      throw new Error('not a string');
    }
    this.text = text.trim();
    this.level = 0;
    this.place = 0;
    this.root = null;
    this.stack = [];
    this.currentObject = null;
    this.state = NEUTRAL;
  }
  Parser.prototype.readCharicter = function() {
    var char = this.text[this.place++];
    if (this.state !== QUOTED) {
      while (whitespace.test(char)) {
        if (this.place >= this.text.length) {
          return;
        }
        char = this.text[this.place++];
      }
    }
    switch (this.state) {
      case NEUTRAL:
        return this.neutral(char);
      case KEYWORD:
        return this.keyword(char)
      case QUOTED:
        return this.quoted(char);
      case AFTERQUOTE:
        return this.afterquote(char);
      case NUMBER:
        return this.number(char);
      case ENDED:
        return;
    }
  };
  Parser.prototype.afterquote = function(char) {
    if (char === '"') {
      this.word += '"';
      this.state = QUOTED;
      return;
    }
    if (endThings.test(char)) {
      this.word = this.word.trim();
      this.afterItem(char);
      return;
    }
    throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
  };
  Parser.prototype.afterItem = function(char) {
    if (char === ',') {
      if (this.word !== null) {
        this.currentObject.push(this.word);
      }
      this.word = null;
      this.state = NEUTRAL;
      return;
    }
    if (char === ']') {
      this.level--;
      if (this.word !== null) {
        this.currentObject.push(this.word);
        this.word = null;
      }
      this.state = NEUTRAL;
      this.currentObject = this.stack.pop();
      if (!this.currentObject) {
        this.state = ENDED;
      }

      return;
    }
  };
  Parser.prototype.number = function(char) {
    if (digets.test(char)) {
      this.word += char;
      return;
    }
    if (endThings.test(char)) {
      this.word = parseFloat(this.word);
      this.afterItem(char);
      return;
    }
    throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
  };
  Parser.prototype.quoted = function(char) {
    if (char === '"') {
      this.state = AFTERQUOTE;
      return;
    }
    this.word += char;
    return;
  };
  Parser.prototype.keyword = function(char) {
    if (keyword.test(char)) {
      this.word += char;
      return;
    }
    if (char === '[') {
      var newObjects = [];
      newObjects.push(this.word);
      this.level++;
      if (this.root === null) {
        this.root = newObjects;
      } else {
        this.currentObject.push(newObjects);
      }
      this.stack.push(this.currentObject);
      this.currentObject = newObjects;
      this.state = NEUTRAL;
      return;
    }
    if (endThings.test(char)) {
      this.afterItem(char);
      return;
    }
    throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
  };
  Parser.prototype.neutral = function(char) {
    if (latin.test(char)) {
      this.word = char;
      this.state = KEYWORD;
      return;
    }
    if (char === '"') {
      this.word = '';
      this.state = QUOTED;
      return;
    }
    if (digets.test(char)) {
      this.word = char;
      this.state = NUMBER;
      return;
    }
    if (endThings.test(char)) {
      this.afterItem(char);
      return;
    }
    throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
  };
  Parser.prototype.output = function() {
    while (this.place < this.text.length) {
      this.readCharicter();
    }
    if (this.state === ENDED) {
      return this.root;
    }
    throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
  };

  function parseString(txt) {
    var parser = new Parser(txt);
    return parser.output();
  }

  function mapit(obj, key, value) {
    if (Array.isArray(key)) {
      value.unshift(key);
      key = null;
    }
    var thing = key ? {} : obj;

    var out = value.reduce(function(newObj, item) {
      sExpr(item, newObj);
      return newObj
    }, thing);
    if (key) {
      obj[key] = out;
    }
  }

  function sExpr(v, obj) {
    if (!Array.isArray(v)) {
      obj[v] = true;
      return;
    }
    var key = v.shift();
    if (key === 'PARAMETER') {
      key = v.shift();
    }
    if (v.length === 1) {
      if (Array.isArray(v[0])) {
        obj[key] = {};
        sExpr(v[0], obj[key]);
        return;
      }
      obj[key] = v[0];
      return;
    }
    if (!v.length) {
      obj[key] = true;
      return;
    }
    if (key === 'TOWGS84') {
      obj[key] = v;
      return;
    }
    if (key === 'AXIS') {
      if (!(key in obj)) {
        obj[key] = [];
      }
      obj[key].push(v);
      return;
    }
    if (!Array.isArray(key)) {
      obj[key] = {};
    }

    var i;
    switch (key) {
      case 'UNIT':
      case 'PRIMEM':
      case 'VERT_DATUM':
        obj[key] = {
          name: v[0].toLowerCase(),
          convert: v[1]
        };
        if (v.length === 3) {
          sExpr(v[2], obj[key]);
        }
        return;
      case 'SPHEROID':
      case 'ELLIPSOID':
        obj[key] = {
          name: v[0],
          a: v[1],
          rf: v[2]
        };
        if (v.length === 4) {
          sExpr(v[3], obj[key]);
        }
        return;
      case 'EDATUM':
      case 'ENGINEERINGDATUM':
      case 'LOCAL_DATUM':
      case 'DATUM':
      case 'VERT_CS':
      case 'VERTCRS':
      case 'VERTICALCRS':
        v[0] = ['name', v[0]];
        mapit(obj, key, v);
        return;
      case 'COMPD_CS':
      case 'COMPOUNDCRS':
      case 'FITTED_CS':
      // the followings are the crs defined in
      // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
      case 'PROJECTEDCRS':
      case 'PROJCRS':
      case 'GEOGCS':
      case 'GEOCCS':
      case 'PROJCS':
      case 'LOCAL_CS':
      case 'GEODCRS':
      case 'GEODETICCRS':
      case 'GEODETICDATUM':
      case 'ENGCRS':
      case 'ENGINEERINGCRS':
        v[0] = ['name', v[0]];
        mapit(obj, key, v);
        obj[key].type = key;
        return;
      default:
        i = -1;
        while (++i < v.length) {
          if (!Array.isArray(v[i])) {
            return sExpr(v, obj[key]);
          }
        }
        return mapit(obj, key, v);
    }
  }

  var D2R = 0.01745329251994329577;

  function d2r(input) {
    return input * D2R;
  }

  function applyProjectionDefaults(wkt) {
    // Normalize projName for WKT2 compatibility
    const normalizedProjName = (wkt.projName || '').toLowerCase().replace(/_/g, ' ');

    if (!wkt.long0 && wkt.longc && (normalizedProjName === 'albers conic equal area' || normalizedProjName === 'lambert azimuthal equal area')) {
      wkt.long0 = wkt.longc;
    }
    if (!wkt.lat_ts && wkt.lat1 && (normalizedProjName === 'stereographic south pole' || normalizedProjName === 'polar stereographic (variant b)')) {
      wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
      wkt.lat_ts = wkt.lat1;
      delete wkt.lat1;
    } else if (!wkt.lat_ts && wkt.lat0 && (normalizedProjName === 'polar stereographic' || normalizedProjName === 'polar stereographic (variant a)')) {
      wkt.lat_ts = wkt.lat0;
      wkt.lat0 = d2r(wkt.lat0 > 0 ? 90 : -90);
      delete wkt.lat1;
    }
  }

  // Helper function to process units and to_meter
  function processUnit(unit) {
    let result = { units: null, to_meter: undefined };

    if (typeof unit === 'string') {
      result.units = unit.toLowerCase();
      if (result.units === 'metre') {
        result.units = 'meter'; // Normalize 'metre' to 'meter'
      }
      if (result.units === 'meter') {
        result.to_meter = 1; // Only set to_meter if units are 'meter'
      }
    } else if (unit && unit.name) {
      result.units = unit.name.toLowerCase();
      if (result.units === 'metre') {
        result.units = 'meter'; // Normalize 'metre' to 'meter'
      }
      result.to_meter = unit.conversion_factor;
    }

    return result;
  }

  function toValue(valueOrObject) {
    if (typeof valueOrObject === 'object') {
      return valueOrObject.value * valueOrObject.unit.conversion_factor;
    }
    return valueOrObject;
  }

  function calculateEllipsoid(value, result) {
    if (value.ellipsoid.radius) {
      result.a = value.ellipsoid.radius;
      result.rf = 0;
    } else {
      result.a = toValue(value.ellipsoid.semi_major_axis);
      if (value.ellipsoid.inverse_flattening !== undefined) {
        result.rf = value.ellipsoid.inverse_flattening;
      } else if (value.ellipsoid.semi_major_axis !== undefined && value.ellipsoid.semi_minor_axis !== undefined) {
        result.rf = result.a / (result.a - toValue(value.ellipsoid.semi_minor_axis));
      }
    }
  }

  function transformPROJJSON(projjson, result = {}) {
    if (!projjson || typeof projjson !== 'object') {
      return projjson; // Return primitive values as-is
    }

    if (projjson.type === 'BoundCRS') {
      transformPROJJSON(projjson.source_crs, result);

      if (projjson.transformation) {
        if (projjson.transformation.method && projjson.transformation.method.name === 'NTv2') {
          // Set nadgrids to the filename from the parameterfile
          result.nadgrids = projjson.transformation.parameters[0].value;
        } else {
          // Populate datum_params if no parameterfile is found
          result.datum_params = projjson.transformation.parameters.map((param) => param.value);
        }
      }
      return result; // Return early for BoundCRS
    }

    // Handle specific keys in PROJJSON
    Object.keys(projjson).forEach((key) => {
      const value = projjson[key];
      if (value === null) {
        return;
      }

      switch (key) {
        case 'name':
          if (result.srsCode) {
            break;
          }
          result.name = value;
          result.srsCode = value; // Map `name` to `srsCode`
          break;

        case 'type':
          if (value === 'GeographicCRS') {
            result.projName = 'longlat';
          } else if (value === 'ProjectedCRS' && projjson.conversion && projjson.conversion.method) {
            result.projName = projjson.conversion.method.name; // Retain original capitalization
          }
          break;

        case 'datum':
        case 'datum_ensemble': // Handle both datum and ensemble
          if (value.ellipsoid) {
            // Extract ellipsoid properties
            result.ellps = value.ellipsoid.name;
            calculateEllipsoid(value, result);
          }
          if (value.prime_meridian) {
            result.from_greenwich = value.prime_meridian.longitude * Math.PI / 180; // Convert to radians
          }
          break;

        case 'ellipsoid':
          result.ellps = value.name;
          calculateEllipsoid(value, result);
          break;

        case 'prime_meridian':
          result.long0 = (value.longitude || 0) * Math.PI / 180; // Convert to radians
          break;

        case 'coordinate_system':
          if (value.axis) {
            result.axis = value.axis
              .map((axis) => {
                const direction = axis.direction;
                if (direction === 'east') return 'e';
                if (direction === 'north') return 'n';
                if (direction === 'west') return 'w';
                if (direction === 'south') return 's';
                throw new Error(`Unknown axis direction: ${direction}`);
              })
              .join('') + 'u'; // Combine into a single string (e.g., "enu")

            if (value.unit) {
              const { units, to_meter } = processUnit(value.unit);
              result.units = units;
              result.to_meter = to_meter;
            } else if (value.axis[0] && value.axis[0].unit) {
              const { units, to_meter } = processUnit(value.axis[0].unit);
              result.units = units;
              result.to_meter = to_meter;
            }
          }
          break;

        case 'id':
          if (value.authority && value.code) {
            result.title = value.authority + ':' + value.code;
          }
          break;

        case 'conversion':
          if (value.method && value.method.name) {
            result.projName = value.method.name; // Retain original capitalization
          }
          if (value.parameters) {
            value.parameters.forEach((param) => {
              const paramName = param.name.toLowerCase().replace(/\s+/g, '_');
              const paramValue = param.value;
              if (param.unit && param.unit.conversion_factor) {
                result[paramName] = paramValue * param.unit.conversion_factor; // Convert to radians or meters
              } else if (param.unit === 'degree') {
                result[paramName] = paramValue * Math.PI / 180; // Convert to radians
              } else {
                result[paramName] = paramValue;
              }
            });
          }
          break;

        case 'unit':
          if (value.name) {
            result.units = value.name.toLowerCase();
            if (result.units === 'metre') {
              result.units = 'meter';
            }
          }
          if (value.conversion_factor) {
            result.to_meter = value.conversion_factor;
          }
          break;

        case 'base_crs':
          transformPROJJSON(value, result); // Pass `result` directly
          result.datumCode = value.id ? value.id.authority + '_' + value.id.code : value.name; // Set datumCode
          break;
      }
    });

    // Additional calculated properties
    if (result.latitude_of_false_origin !== undefined) {
      result.lat0 = result.latitude_of_false_origin; // Already in radians
    }
    if (result.longitude_of_false_origin !== undefined) {
      result.long0 = result.longitude_of_false_origin;
    }
    if (result.latitude_of_standard_parallel !== undefined) {
      result.lat0 = result.latitude_of_standard_parallel;
      result.lat1 = result.latitude_of_standard_parallel;
    }
    if (result.latitude_of_1st_standard_parallel !== undefined) {
      result.lat1 = result.latitude_of_1st_standard_parallel;
    }
    if (result.latitude_of_2nd_standard_parallel !== undefined) {
      result.lat2 = result.latitude_of_2nd_standard_parallel;
    }
    if (result.latitude_of_projection_centre !== undefined) {
      result.lat0 = result.latitude_of_projection_centre;
    }
    if (result.longitude_of_projection_centre !== undefined) {
      result.longc = result.longitude_of_projection_centre;
    }
    if (result.easting_at_false_origin !== undefined) {
      result.x0 = result.easting_at_false_origin;
    }
    if (result.northing_at_false_origin !== undefined) {
      result.y0 = result.northing_at_false_origin;
    }
    if (result.latitude_of_natural_origin !== undefined) {
      result.lat0 = result.latitude_of_natural_origin;
    }
    if (result.longitude_of_natural_origin !== undefined) {
      result.long0 = result.longitude_of_natural_origin;
    }
    if (result.longitude_of_origin !== undefined) {
      result.long0 = result.longitude_of_origin;
    }
    if (result.false_easting !== undefined) {
      result.x0 = result.false_easting;
    }
    if (result.easting_at_projection_centre) {
      result.x0 = result.easting_at_projection_centre;
    }
    if (result.false_northing !== undefined) {
      result.y0 = result.false_northing;
    }
    if (result.northing_at_projection_centre) {
      result.y0 = result.northing_at_projection_centre;
    }
    if (result.standard_parallel_1 !== undefined) {
      result.lat1 = result.standard_parallel_1;
    }
    if (result.standard_parallel_2 !== undefined) {
      result.lat2 = result.standard_parallel_2;
    }
    if (result.scale_factor_at_natural_origin !== undefined) {
      result.k0 = result.scale_factor_at_natural_origin;
    }
    if (result.scale_factor_at_projection_centre !== undefined) {
      result.k0 = result.scale_factor_at_projection_centre;
    }
    if (result.scale_factor_on_pseudo_standard_parallel !== undefined) {
      result.k0 = result.scale_factor_on_pseudo_standard_parallel;
    }
    if (result.azimuth !== undefined) {
      result.alpha = result.azimuth;
    }
    if (result.azimuth_at_projection_centre !== undefined) {
      result.alpha = result.azimuth_at_projection_centre;
    }
    if (result.angle_from_rectified_to_skew_grid) {
      result.rectified_grid_angle = result.angle_from_rectified_to_skew_grid;
    }

    // Apply projection defaults
    applyProjectionDefaults(result);

    return result;
  }

  var knownTypes = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS', 'GEOCCS', 'PROJCS', 'LOCAL_CS', 'GEODCRS',
    'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];

  function rename(obj, params) {
    var outName = params[0];
    var inName = params[1];
    if (!(outName in obj) && (inName in obj)) {
      obj[outName] = obj[inName];
      if (params.length === 3) {
        obj[outName] = params[2](obj[outName]);
      }
    }
  }

  function cleanWKT(wkt) {
    var keys = Object.keys(wkt);
    for (var i = 0, ii = keys.length; i <ii; ++i) {
      var key = keys[i];
      // the followings are the crs defined in
      // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
      if (knownTypes.indexOf(key) !== -1) {
        setPropertiesFromWkt(wkt[key]);
      }
      if (typeof wkt[key] === 'object') {
        cleanWKT(wkt[key]);
      }
    }
  }

  function setPropertiesFromWkt(wkt) {
    if (wkt.AUTHORITY) {
      var authority = Object.keys(wkt.AUTHORITY)[0];
      if (authority && authority in wkt.AUTHORITY) {
        wkt.title = authority + ':' + wkt.AUTHORITY[authority];
      }
    }
    if (wkt.type === 'GEOGCS') {
      wkt.projName = 'longlat';
    } else if (wkt.type === 'LOCAL_CS') {
      wkt.projName = 'identity';
      wkt.local = true;
    } else {
      if (typeof wkt.PROJECTION === 'object') {
        wkt.projName = Object.keys(wkt.PROJECTION)[0];
      } else {
        wkt.projName = wkt.PROJECTION;
      }
    }
    if (wkt.AXIS) {
      var axisOrder = '';
      for (var i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
        var axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];
        if (axis[0].indexOf('north') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north')) {
          axisOrder += 'n';
        } else if (axis[0].indexOf('south') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south')) {
          axisOrder += 's';
        } else if (axis[0].indexOf('east') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east')) {
          axisOrder += 'e';
        } else if (axis[0].indexOf('west') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west')) {
          axisOrder += 'w';
        }
      }
      if (axisOrder.length === 2) {
        axisOrder += 'u';
      }
      if (axisOrder.length === 3) {
        wkt.axis = axisOrder;
      }
    }
    if (wkt.UNIT) {
      wkt.units = wkt.UNIT.name.toLowerCase();
      if (wkt.units === 'metre') {
        wkt.units = 'meter';
      }
      if (wkt.UNIT.convert) {
        if (wkt.type === 'GEOGCS') {
          if (wkt.DATUM && wkt.DATUM.SPHEROID) {
            wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
          }
        } else {
          wkt.to_meter = wkt.UNIT.convert;
        }
      }
    }
    var geogcs = wkt.GEOGCS;
    if (wkt.type === 'GEOGCS') {
      geogcs = wkt;
    }
    if (geogcs) {
      //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
      //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
      //}
      if (geogcs.DATUM) {
        wkt.datumCode = geogcs.DATUM.name.toLowerCase();
      } else {
        wkt.datumCode = geogcs.name.toLowerCase();
      }
      if (wkt.datumCode.slice(0, 2) === 'd_') {
        wkt.datumCode = wkt.datumCode.slice(2);
      }
      if (wkt.datumCode === 'new_zealand_1949') {
        wkt.datumCode = 'nzgd49';
      }
      if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
        if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
          wkt.sphere = true;
        }
        wkt.datumCode = 'wgs84';
      }
      if (wkt.datumCode === 'belge_1972') {
        wkt.datumCode = 'rnb72';
      }
      if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
        wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
        if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
          wkt.ellps = 'intl';
        }

        wkt.a = geogcs.DATUM.SPHEROID.a;
        wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
      }

      if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
        wkt.datum_params = geogcs.DATUM.TOWGS84;
      }
      if (~wkt.datumCode.indexOf('osgb_1936')) {
        wkt.datumCode = 'osgb36';
      }
      if (~wkt.datumCode.indexOf('osni_1952')) {
        wkt.datumCode = 'osni52';
      }
      if (~wkt.datumCode.indexOf('tm65')
        || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
        wkt.datumCode = 'ire65';
      }
      if (wkt.datumCode === 'ch1903+') {
        wkt.datumCode = 'ch1903';
      }
      if (~wkt.datumCode.indexOf('israel')) {
        wkt.datumCode = 'isr93';
      }
    }
    if (wkt.b && !isFinite(wkt.b)) {
      wkt.b = wkt.a;
    }
    if (wkt.rectified_grid_angle) {
      wkt.rectified_grid_angle = d2r(wkt.rectified_grid_angle);
    }

    function toMeter(input) {
      var ratio = wkt.to_meter || 1;
      return input * ratio;
    }
    var renamer = function(a) {
      return rename(wkt, a);
    };
    var list = [
      ['standard_parallel_1', 'Standard_Parallel_1'],
      ['standard_parallel_1', 'Latitude of 1st standard parallel'],
      ['standard_parallel_2', 'Standard_Parallel_2'],
      ['standard_parallel_2', 'Latitude of 2nd standard parallel'],
      ['false_easting', 'False_Easting'],
      ['false_easting', 'False easting'],
      ['false-easting', 'Easting at false origin'],
      ['false_northing', 'False_Northing'],
      ['false_northing', 'False northing'],
      ['false_northing', 'Northing at false origin'],
      ['central_meridian', 'Central_Meridian'],
      ['central_meridian', 'Longitude of natural origin'],
      ['central_meridian', 'Longitude of false origin'],
      ['latitude_of_origin', 'Latitude_Of_Origin'],
      ['latitude_of_origin', 'Central_Parallel'],
      ['latitude_of_origin', 'Latitude of natural origin'],
      ['latitude_of_origin', 'Latitude of false origin'],
      ['scale_factor', 'Scale_Factor'],
      ['k0', 'scale_factor'],
      ['latitude_of_center', 'Latitude_Of_Center'],
      ['latitude_of_center', 'Latitude_of_center'],
      ['lat0', 'latitude_of_center', d2r],
      ['longitude_of_center', 'Longitude_Of_Center'],
      ['longitude_of_center', 'Longitude_of_center'],
      ['longc', 'longitude_of_center', d2r],
      ['x0', 'false_easting', toMeter],
      ['y0', 'false_northing', toMeter],
      ['long0', 'central_meridian', d2r],
      ['lat0', 'latitude_of_origin', d2r],
      ['lat0', 'standard_parallel_1', d2r],
      ['lat1', 'standard_parallel_1', d2r],
      ['lat2', 'standard_parallel_2', d2r],
      ['azimuth', 'Azimuth'],
      ['alpha', 'azimuth', d2r],
      ['srsCode', 'name']
    ];
    list.forEach(renamer);
    applyProjectionDefaults(wkt);
  }
  function wkt(wkt) {
    if (typeof wkt === 'object') {
      return transformPROJJSON(wkt);
    }
    const version = detectWKTVersion(wkt);
    var lisp = parseString(wkt);
    if (version === 'WKT2') {
      const projjson = buildPROJJSON(lisp);
      return transformPROJJSON(projjson);
    }
    var type = lisp[0];
    var obj = {};
    sExpr(lisp, obj);
    cleanWKT(obj);
    return obj[type];
  }

  function defs(name) {
    /*global console*/
    var that = this;
    if (arguments.length === 2) {
      var def = arguments[1];
      if (typeof def === 'string') {
        if (def.charAt(0) === '+') {
          defs[name] = projStr(arguments[1]);
        }
        else {
          defs[name] = wkt(arguments[1]);
        }
      } else {
        defs[name] = def;
      }
    }
    else if (arguments.length === 1) {
      if (Array.isArray(name)) {
        return name.map(function(v) {
          if (Array.isArray(v)) {
            defs.apply(that, v);
          }
          else {
            defs(v);
          }
        });
      }
      else if (typeof name === 'string') {
        if (name in defs) {
          return defs[name];
        }
      }
      else if ('EPSG' in name) {
        defs['EPSG:' + name.EPSG] = name;
      }
      else if ('ESRI' in name) {
        defs['ESRI:' + name.ESRI] = name;
      }
      else if ('IAU2000' in name) {
        defs['IAU2000:' + name.IAU2000] = name;
      }
      else {
        console.log(name);
      }
      return;
    }


  }
  globals(defs);

  function testObj(code){
    return typeof code === 'string';
  }
  function testDef(code){
    return code in defs;
  }
  var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS','GEOCCS','PROJCS','LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];
  function testWKT(code){
    return codeWords.some(function (word) {
      return code.indexOf(word) > -1;
    });
  }
  var codes = ['3857', '900913', '3785', '102113'];
  function checkMercator(item) {
    var auth = match(item, 'authority');
    if (!auth) {
      return;
    }
    var code = match(auth, 'epsg');
    return code && codes.indexOf(code) > -1;
  }
  function checkProjStr(item) {
    var ext = match(item, 'extension');
    if (!ext) {
      return;
    }
    return match(ext, 'proj4');
  }
  function testProj(code){
    return code[0] === '+';
  }
  function parse(code){
    if (testObj(code)) {
      //check to see if this is a WKT string
      if (testDef(code)) {
        return defs[code];
      }
      if (testWKT(code)) {
        var out = wkt(code);
        // test of spetial case, due to this being a very common and often malformed
        if (checkMercator(out)) {
          return defs['EPSG:3857'];
        }
        var maybeProjStr = checkProjStr(out);
        if (maybeProjStr) {
          return projStr(maybeProjStr);
        }
        return out;
      }
      if (testProj(code)) {
        return projStr(code);
      }
    }else {
      return code;
    }
  }

  function extend(destination, source) {
    destination = destination || {};
    var value, property;
    if (!source) {
      return destination;
    }
    for (property in source) {
      value = source[property];
      if (value !== undefined) {
        destination[property] = value;
      }
    }
    return destination;
  }

  function msfnz(eccent, sinphi, cosphi) {
    var con = eccent * sinphi;
    return cosphi / (Math.sqrt(1 - con * con));
  }

  function sign(x) {
    return x<0 ? -1 : 1;
  }

  function adjust_lon(x) {
    return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
  }

  function tsfnz(eccent, phi, sinphi) {
    var con = eccent * sinphi;
    var com = 0.5 * eccent;
    con = Math.pow(((1 - con) / (1 + con)), com);
    return (Math.tan(0.5 * (HALF_PI - phi)) / con);
  }

  function phi2z(eccent, ts) {
    var eccnth = 0.5 * eccent;
    var con, dphi;
    var phi = HALF_PI - 2 * Math.atan(ts);
    for (var i = 0; i <= 15; i++) {
      con = eccent * Math.sin(phi);
      dphi = HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
      phi += dphi;
      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    }
    //console.log("phi2z has NoConvergence");
    return -9999;
  }

  function init$x() {
    var con = this.b / this.a;
    this.es = 1 - con * con;
    if(!('x0' in this)){
      this.x0 = 0;
    }
    if(!('y0' in this)){
      this.y0 = 0;
    }
    this.e = Math.sqrt(this.es);
    if (this.lat_ts) {
      if (this.sphere) {
        this.k0 = Math.cos(this.lat_ts);
      }
      else {
        this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
      }
    }
    else {
      if (!this.k0) {
        if (this.k) {
          this.k0 = this.k;
        }
        else {
          this.k0 = 1;
        }
      }
    }
  }

  /* Mercator forward equations--mapping lat,long to x,y
    --------------------------------------------------*/

  function forward$v(p) {
    var lon = p.x;
    var lat = p.y;
    // convert to radians
    if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
      return null;
    }

    var x, y;
    if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
      return null;
    }
    else {
      if (this.sphere) {
        x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
        y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
      }
      else {
        var sinphi = Math.sin(lat);
        var ts = tsfnz(this.e, lat, sinphi);
        x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
        y = this.y0 - this.a * this.k0 * Math.log(ts);
      }
      p.x = x;
      p.y = y;
      return p;
    }
  }

  /* Mercator inverse equations--mapping x,y to lat/long
    --------------------------------------------------*/
  function inverse$v(p) {

    var x = p.x - this.x0;
    var y = p.y - this.y0;
    var lon, lat;

    if (this.sphere) {
      lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
    }
    else {
      var ts = Math.exp(-y / (this.a * this.k0));
      lat = phi2z(this.e, ts);
      if (lat === -9999) {
        return null;
      }
    }
    lon = adjust_lon(this.long0 + x / (this.a * this.k0));

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$x = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
  var merc = {
    init: init$x,
    forward: forward$v,
    inverse: inverse$v,
    names: names$x
  };

  function init$w() {
    //no-op for longlat
  }

  function identity(pt) {
    return pt;
  }
  var names$w = ["longlat", "identity"];
  var longlat = {
    init: init$w,
    forward: identity,
    inverse: identity,
    names: names$w
  };

  var projs = [merc, longlat];
  var names$v = {};
  var projStore = [];

  function add(proj, i) {
    var len = projStore.length;
    if (!proj.names) {
      console.log(i);
      return true;
    }
    projStore[len] = proj;
    proj.names.forEach(function(n) {
      names$v[n.toLowerCase()] = len;
    });
    return this;
  }

  function get(name) {
    if (!name) {
      return false;
    }
    var n = name.toLowerCase();
    if (typeof names$v[n] !== 'undefined' && projStore[names$v[n]]) {
      return projStore[names$v[n]];
    }
  }

  function start() {
    projs.forEach(add);
  }
  var projections = {
    start: start,
    add: add,
    get: get
  };

  var exports$1 = {};
  exports$1.MERIT = {
    a: 6378137.0,
    rf: 298.257,
    ellipseName: "MERIT 1983"
  };

  exports$1.SGS85 = {
    a: 6378136.0,
    rf: 298.257,
    ellipseName: "Soviet Geodetic System 85"
  };

  exports$1.GRS80 = {
    a: 6378137.0,
    rf: 298.257222101,
    ellipseName: "GRS 1980(IUGG, 1980)"
  };

  exports$1.IAU76 = {
    a: 6378140.0,
    rf: 298.257,
    ellipseName: "IAU 1976"
  };

  exports$1.airy = {
    a: 6377563.396,
    b: 6356256.910,
    ellipseName: "Airy 1830"
  };

  exports$1.APL4 = {
    a: 6378137,
    rf: 298.25,
    ellipseName: "Appl. Physics. 1965"
  };

  exports$1.NWL9D = {
    a: 6378145.0,
    rf: 298.25,
    ellipseName: "Naval Weapons Lab., 1965"
  };

  exports$1.mod_airy = {
    a: 6377340.189,
    b: 6356034.446,
    ellipseName: "Modified Airy"
  };

  exports$1.andrae = {
    a: 6377104.43,
    rf: 300.0,
    ellipseName: "Andrae 1876 (Den., Iclnd.)"
  };

  exports$1.aust_SA = {
    a: 6378160.0,
    rf: 298.25,
    ellipseName: "Australian Natl & S. Amer. 1969"
  };

  exports$1.GRS67 = {
    a: 6378160.0,
    rf: 298.2471674270,
    ellipseName: "GRS 67(IUGG 1967)"
  };

  exports$1.bessel = {
    a: 6377397.155,
    rf: 299.1528128,
    ellipseName: "Bessel 1841"
  };

  exports$1.bess_nam = {
    a: 6377483.865,
    rf: 299.1528128,
    ellipseName: "Bessel 1841 (Namibia)"
  };

  exports$1.clrk66 = {
    a: 6378206.4,
    b: 6356583.8,
    ellipseName: "Clarke 1866"
  };

  exports$1.clrk80 = {
    a: 6378249.145,
    rf: 293.4663,
    ellipseName: "Clarke 1880 mod."
  };

  exports$1.clrk80ign = {
    a: 6378249.2,
    b: 6356515,
    rf: 293.4660213,
    ellipseName: "Clarke 1880 (IGN)"
  };

  exports$1.clrk58 = {
    a: 6378293.645208759,
    rf: 294.2606763692654,
    ellipseName: "Clarke 1858"
  };

  exports$1.CPM = {
    a: 6375738.7,
    rf: 334.29,
    ellipseName: "Comm. des Poids et Mesures 1799"
  };

  exports$1.delmbr = {
    a: 6376428.0,
    rf: 311.5,
    ellipseName: "Delambre 1810 (Belgium)"
  };

  exports$1.engelis = {
    a: 6378136.05,
    rf: 298.2566,
    ellipseName: "Engelis 1985"
  };

  exports$1.evrst30 = {
    a: 6377276.345,
    rf: 300.8017,
    ellipseName: "Everest 1830"
  };

  exports$1.evrst48 = {
    a: 6377304.063,
    rf: 300.8017,
    ellipseName: "Everest 1948"
  };

  exports$1.evrst56 = {
    a: 6377301.243,
    rf: 300.8017,
    ellipseName: "Everest 1956"
  };

  exports$1.evrst69 = {
    a: 6377295.664,
    rf: 300.8017,
    ellipseName: "Everest 1969"
  };

  exports$1.evrstSS = {
    a: 6377298.556,
    rf: 300.8017,
    ellipseName: "Everest (Sabah & Sarawak)"
  };

  exports$1.fschr60 = {
    a: 6378166.0,
    rf: 298.3,
    ellipseName: "Fischer (Mercury Datum) 1960"
  };

  exports$1.fschr60m = {
    a: 6378155.0,
    rf: 298.3,
    ellipseName: "Fischer 1960"
  };

  exports$1.fschr68 = {
    a: 6378150.0,
    rf: 298.3,
    ellipseName: "Fischer 1968"
  };

  exports$1.helmert = {
    a: 6378200.0,
    rf: 298.3,
    ellipseName: "Helmert 1906"
  };

  exports$1.hough = {
    a: 6378270.0,
    rf: 297.0,
    ellipseName: "Hough"
  };

  exports$1.intl = {
    a: 6378388.0,
    rf: 297.0,
    ellipseName: "International 1909 (Hayford)"
  };

  exports$1.kaula = {
    a: 6378163.0,
    rf: 298.24,
    ellipseName: "Kaula 1961"
  };

  exports$1.lerch = {
    a: 6378139.0,
    rf: 298.257,
    ellipseName: "Lerch 1979"
  };

  exports$1.mprts = {
    a: 6397300.0,
    rf: 191.0,
    ellipseName: "Maupertius 1738"
  };

  exports$1.new_intl = {
    a: 6378157.5,
    b: 6356772.2,
    ellipseName: "New International 1967"
  };

  exports$1.plessis = {
    a: 6376523.0,
    rf: 6355863.0,
    ellipseName: "Plessis 1817 (France)"
  };

  exports$1.krass = {
    a: 6378245.0,
    rf: 298.3,
    ellipseName: "Krassovsky, 1942"
  };

  exports$1.SEasia = {
    a: 6378155.0,
    b: 6356773.3205,
    ellipseName: "Southeast Asia"
  };

  exports$1.walbeck = {
    a: 6376896.0,
    b: 6355834.8467,
    ellipseName: "Walbeck"
  };

  exports$1.WGS60 = {
    a: 6378165.0,
    rf: 298.3,
    ellipseName: "WGS 60"
  };

  exports$1.WGS66 = {
    a: 6378145.0,
    rf: 298.25,
    ellipseName: "WGS 66"
  };

  exports$1.WGS7 = {
    a: 6378135.0,
    rf: 298.26,
    ellipseName: "WGS 72"
  };

  var WGS84 = exports$1.WGS84 = {
    a: 6378137.0,
    rf: 298.257223563,
    ellipseName: "WGS 84"
  };

  exports$1.sphere = {
    a: 6370997.0,
    b: 6370997.0,
    ellipseName: "Normal Sphere (r=6370997)"
  };

  function eccentricity(a, b, rf, R_A) {
    var a2 = a * a; // used in geocentric
    var b2 = b * b; // used in geocentric
    var es = (a2 - b2) / a2; // e ^ 2
    var e = 0;
    if (R_A) {
      a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
      a2 = a * a;
      es = 0;
    } else {
      e = Math.sqrt(es); // eccentricity
    }
    var ep2 = (a2 - b2) / b2; // used in geocentric
    return {
      es: es,
      e: e,
      ep2: ep2
    };
  }
  function sphere(a, b, rf, ellps, sphere) {
    if (!a) { // do we have an ellipsoid?
      var ellipse = match(exports$1, ellps);
      if (!ellipse) {
        ellipse = WGS84;
      }
      a = ellipse.a;
      b = ellipse.b;
      rf = ellipse.rf;
    }

    if (rf && !b) {
      b = (1.0 - 1.0 / rf) * a;
    }
    if (rf === 0 || Math.abs(a - b) < EPSLN) {
      sphere = true;
      b = a;
    }
    return {
      a: a,
      b: b,
      rf: rf,
      sphere: sphere
    };
  }

  var datums = {
    wgs84: {
      towgs84: "0,0,0",
      ellipse: "WGS84",
      datumName: "WGS84"
    },
    ch1903: {
      towgs84: "674.374,15.056,405.346",
      ellipse: "bessel",
      datumName: "swiss"
    },
    ggrs87: {
      towgs84: "-199.87,74.79,246.62",
      ellipse: "GRS80",
      datumName: "Greek_Geodetic_Reference_System_1987"
    },
    nad83: {
      towgs84: "0,0,0",
      ellipse: "GRS80",
      datumName: "North_American_Datum_1983"
    },
    nad27: {
      nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
      ellipse: "clrk66",
      datumName: "North_American_Datum_1927"
    },
    potsdam: {
      towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
      ellipse: "bessel",
      datumName: "Potsdam Rauenberg 1950 DHDN"
    },
    carthage: {
      towgs84: "-263.0,6.0,431.0",
      ellipse: "clark80",
      datumName: "Carthage 1934 Tunisia"
    },
    hermannskogel: {
      towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
      ellipse: "bessel",
      datumName: "Hermannskogel"
    },
    militargeographische_institut: {
      towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
      ellipse: "bessel",
      datumName: "Militar-Geographische Institut",
    },
    osni52: {
      towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
      ellipse: "airy",
      datumName: "Irish National"
    },
    ire65: {
      towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
      ellipse: "mod_airy",
      datumName: "Ireland 1965"
    },
    rassadiran: {
      towgs84: "-133.63,-157.5,-158.62",
      ellipse: "intl",
      datumName: "Rassadiran"
    },
    nzgd49: {
      towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
      ellipse: "intl",
      datumName: "New Zealand Geodetic Datum 1949"
    },
    osgb36: {
      towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
      ellipse: "airy",
      datumName: "Ordnance Survey of Great Britain 1936"
    },
    s_jtsk: {
      towgs84: "589,76,480",
      ellipse: 'bessel',
      datumName: 'S-JTSK (Ferro)'
    },
    beduaram: {
      towgs84: '-106,-87,188',
      ellipse: 'clrk80',
      datumName: 'Beduaram'
    },
    gunung_segara: {
      towgs84: '-403,684,41',
      ellipse: 'bessel',
      datumName: 'Gunung Segara Jakarta'
    },
    rnb72: {
      towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
      ellipse: "intl",
      datumName: "Reseau National Belge 1972"
    }
  };

  for (var key in datums) {
    var datum$1 = datums[key];
    datums[datum$1.datumName] = datum$1;
  }

  function datum(datumCode, datum_params, a, b, es, ep2, nadgrids) {
    var out = {};

    if (datumCode === undefined || datumCode === 'none') {
      out.datum_type = PJD_NODATUM;
    } else {
      out.datum_type = PJD_WGS84;
    }

    if (datum_params) {
      out.datum_params = datum_params.map(parseFloat);
      if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
        out.datum_type = PJD_3PARAM;
      }
      if (out.datum_params.length > 3) {
        if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
          out.datum_type = PJD_7PARAM;
          out.datum_params[3] *= SEC_TO_RAD;
          out.datum_params[4] *= SEC_TO_RAD;
          out.datum_params[5] *= SEC_TO_RAD;
          out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
        }
      }
    }

    if (nadgrids) {
      out.datum_type = PJD_GRIDSHIFT;
      out.grids = nadgrids;
    }
    out.a = a; //datum object also uses these values
    out.b = b;
    out.es = es;
    out.ep2 = ep2;
    return out;
  }

  /**
   * Resources for details of NTv2 file formats:
   * - https://web.archive.org/web/20140127204822if_/http://www.mgs.gov.on.ca:80/stdprodconsume/groups/content/@mgs/@iandit/documents/resourcelist/stel02_047447.pdf
   * - http://mimaka.com/help/gs/html/004_NTV2%20Data%20Format.htm
   */

  var loadedNadgrids = {};

  /**
   * Load a binary NTv2 file (.gsb) to a key that can be used in a proj string like +nadgrids=<key>. Pass the NTv2 file
   * as an ArrayBuffer.
   */
  function nadgrid(key, data) {
    var view = new DataView(data);
    var isLittleEndian = detectLittleEndian(view);
    var header = readHeader(view, isLittleEndian);
    var subgrids = readSubgrids(view, header, isLittleEndian);
    var nadgrid = {header: header, subgrids: subgrids};
    loadedNadgrids[key] = nadgrid;
    return nadgrid;
  }

  /**
   * Given a proj4 value for nadgrids, return an array of loaded grids
   */
  function getNadgrids(nadgrids) {
    // Format details: http://proj.maptools.org/gen_parms.html
    if (nadgrids === undefined) { return null; }
    var grids = nadgrids.split(',');
    return grids.map(parseNadgridString);
  }

  function parseNadgridString(value) {
    if (value.length === 0) {
      return null;
    }
    var optional = value[0] === '@';
    if (optional) {
      value = value.slice(1);
    }
    if (value === 'null') {
      return {name: 'null', mandatory: !optional, grid: null, isNull: true};
    }
    return {
      name: value,
      mandatory: !optional,
      grid: loadedNadgrids[value] || null,
      isNull: false
    };
  }

  function secondsToRadians(seconds) {
    return (seconds / 3600) * Math.PI / 180;
  }

  function detectLittleEndian(view) {
    var nFields = view.getInt32(8, false);
    if (nFields === 11) {
      return false;
    }
    nFields = view.getInt32(8, true);
    if (nFields !== 11) {
      console.warn('Failed to detect nadgrid endian-ness, defaulting to little-endian');
    }
    return true;
  }

  function readHeader(view, isLittleEndian) {
    return {
      nFields: view.getInt32(8, isLittleEndian),
      nSubgridFields: view.getInt32(24, isLittleEndian),
      nSubgrids: view.getInt32(40, isLittleEndian),
      shiftType: decodeString(view, 56, 56 + 8).trim(),
      fromSemiMajorAxis: view.getFloat64(120, isLittleEndian),
      fromSemiMinorAxis: view.getFloat64(136, isLittleEndian),
      toSemiMajorAxis: view.getFloat64(152, isLittleEndian),
      toSemiMinorAxis: view.getFloat64(168, isLittleEndian),
    };
  }

  function decodeString(view, start, end) {
    return String.fromCharCode.apply(null, new Uint8Array(view.buffer.slice(start, end)));
  }

  function readSubgrids(view, header, isLittleEndian) {
    var gridOffset = 176;
    var grids = [];
    for (var i = 0; i < header.nSubgrids; i++) {
      var subHeader = readGridHeader(view, gridOffset, isLittleEndian);
      var nodes = readGridNodes(view, gridOffset, subHeader, isLittleEndian);
      var lngColumnCount = Math.round(
        1 + (subHeader.upperLongitude - subHeader.lowerLongitude) / subHeader.longitudeInterval);
      var latColumnCount = Math.round(
        1 + (subHeader.upperLatitude - subHeader.lowerLatitude) / subHeader.latitudeInterval);
      // Proj4 operates on radians whereas the coordinates are in seconds in the grid
      grids.push({
        ll: [secondsToRadians(subHeader.lowerLongitude), secondsToRadians(subHeader.lowerLatitude)],
        del: [secondsToRadians(subHeader.longitudeInterval), secondsToRadians(subHeader.latitudeInterval)],
        lim: [lngColumnCount, latColumnCount],
        count: subHeader.gridNodeCount,
        cvs: mapNodes(nodes)
      });
      gridOffset += 176 + subHeader.gridNodeCount * 16;
    }
    return grids;
  }

  function mapNodes(nodes) {
    return nodes.map(function (r) {return [secondsToRadians(r.longitudeShift), secondsToRadians(r.latitudeShift)];});
  }

  function readGridHeader(view, offset, isLittleEndian) {
    return {
      name: decodeString(view, offset + 8, offset + 16).trim(),
      parent: decodeString(view, offset + 24, offset + 24 + 8).trim(),
      lowerLatitude: view.getFloat64(offset + 72, isLittleEndian),
      upperLatitude: view.getFloat64(offset + 88, isLittleEndian),
      lowerLongitude: view.getFloat64(offset + 104, isLittleEndian),
      upperLongitude: view.getFloat64(offset + 120, isLittleEndian),
      latitudeInterval: view.getFloat64(offset + 136, isLittleEndian),
      longitudeInterval: view.getFloat64(offset + 152, isLittleEndian),
      gridNodeCount: view.getInt32(offset + 168, isLittleEndian)
    };
  }

  function readGridNodes(view, offset, gridHeader, isLittleEndian) {
    var nodesOffset = offset + 176;
    var gridRecordLength = 16;
    var gridShiftRecords = [];
    for (var i = 0; i < gridHeader.gridNodeCount; i++) {
      var record = {
        latitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength, isLittleEndian),
        longitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength + 4, isLittleEndian),
        latitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 8, isLittleEndian),
        longitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 12, isLittleEndian),
      };
      gridShiftRecords.push(record);
    }
    return gridShiftRecords;
  }

  function Projection(srsCode,callback) {
    if (!(this instanceof Projection)) {
      return new Projection(srsCode);
    }
    callback = callback || function(error){
      if(error){
        throw error;
      }
    };
    var json = parse(srsCode);
    if(typeof json !== 'object'){
      callback('Could not parse to valid json: ' + srsCode);
      return;
    }
    var ourProj = Projection.projections.get(json.projName);
    if(!ourProj){
      callback('Could not get projection name from: ' + srsCode);
      return;
    }
    if (json.datumCode && json.datumCode !== 'none') {
      var datumDef = match(datums, json.datumCode);
      if (datumDef) {
        json.datum_params = json.datum_params || (datumDef.towgs84 ? datumDef.towgs84.split(',') : null);
        json.ellps = datumDef.ellipse;
        json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
      }
    }
    json.k0 = json.k0 || 1.0;
    json.axis = json.axis || 'enu';
    json.ellps = json.ellps || 'wgs84';
    json.lat1 = json.lat1 || json.lat0; // Lambert_Conformal_Conic_1SP, for example, needs this

    var sphere_ = sphere(json.a, json.b, json.rf, json.ellps, json.sphere);
    var ecc = eccentricity(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
    var nadgrids = getNadgrids(json.nadgrids);
    var datumObj = json.datum || datum(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2,
      nadgrids);

    extend(this, json); // transfer everything over from the projection because we don't know what we'll need
    extend(this, ourProj); // transfer all the methods from the projection

    // copy the 4 things over we calculated in deriveConstants.sphere
    this.a = sphere_.a;
    this.b = sphere_.b;
    this.rf = sphere_.rf;
    this.sphere = sphere_.sphere;

    // copy the 3 things we calculated in deriveConstants.eccentricity
    this.es = ecc.es;
    this.e = ecc.e;
    this.ep2 = ecc.ep2;

    // add in the datum object
    this.datum = datumObj;

    // init the projection
    this.init();

    // legecy callback from back in the day when it went to spatialreference.org
    callback(null, this);

  }
  Projection.projections = projections;
  Projection.projections.start();

  function compareDatums(source, dest) {
    if (source.datum_type !== dest.datum_type) {
      return false; // false, datums are not equal
    } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
      // the tolerance for es is to ensure that GRS80 and WGS84
      // are considered identical
      return false;
    } else if (source.datum_type === PJD_3PARAM) {
      return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
    } else if (source.datum_type === PJD_7PARAM) {
      return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
    } else {
      return true; // datums are equal
    }
  } // cs_compare_datums()

  /*
   * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
   * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
   * according to the current ellipsoid parameters.
   *
   *    Latitude  : Geodetic latitude in radians                     (input)
   *    Longitude : Geodetic longitude in radians                    (input)
   *    Height    : Geodetic height, in meters                       (input)
   *    X         : Calculated Geocentric X coordinate, in meters    (output)
   *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
   *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
   *
   */
  function geodeticToGeocentric(p, es, a) {
    var Longitude = p.x;
    var Latitude = p.y;
    var Height = p.z ? p.z : 0; //Z value not always supplied

    var Rn; /*  Earth radius at location  */
    var Sin_Lat; /*  Math.sin(Latitude)  */
    var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
    var Cos_Lat; /*  Math.cos(Latitude)  */

    /*
     ** Don't blow up if Latitude is just a little out of the value
     ** range as it may just be a rounding issue.  Also removed longitude
     ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
     */
    if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
      Latitude = -HALF_PI;
    } else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
      Latitude = HALF_PI;
    } else if (Latitude < -HALF_PI) {
      /* Latitude out of range */
      //..reportError('geocent:lat out of range:' + Latitude);
      return { x: -Infinity, y: -Infinity, z: p.z };
    } else if (Latitude > HALF_PI) {
      /* Latitude out of range */
      return { x: Infinity, y: Infinity, z: p.z };
    }

    if (Longitude > Math.PI) {
      Longitude -= (2 * Math.PI);
    }
    Sin_Lat = Math.sin(Latitude);
    Cos_Lat = Math.cos(Latitude);
    Sin2_Lat = Sin_Lat * Sin_Lat;
    Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
    return {
      x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
      y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
      z: ((Rn * (1 - es)) + Height) * Sin_Lat
    };
  } // cs_geodetic_to_geocentric()

  function geocentricToGeodetic(p, es, a, b) {
    /* local defintions and variables */
    /* end-criterium of loop, accuracy of sin(Latitude) */
    var genau = 1e-12;
    var genau2 = (genau * genau);
    var maxiter = 30;

    var P; /* distance between semi-minor axis and location */
    var RR; /* distance between center and location */
    var CT; /* sin of geocentric latitude */
    var ST; /* cos of geocentric latitude */
    var RX;
    var RK;
    var RN; /* Earth radius at location */
    var CPHI0; /* cos of start or old geodetic latitude in iterations */
    var SPHI0; /* sin of start or old geodetic latitude in iterations */
    var CPHI; /* cos of searched geodetic latitude */
    var SPHI; /* sin of searched geodetic latitude */
    var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
    var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0.0; //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    P = Math.sqrt(X * X + Y * Y);
    RR = Math.sqrt(X * X + Y * Y + Z * Z);

    /*      special cases for latitude and longitude */
    if (P / a < genau) {

      /*  special case, if P=0. (X=0., Y=0.) */
      Longitude = 0.0;

      /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
       *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
      if (RR / a < genau) {
        Latitude = HALF_PI;
        Height = -b;
        return {
          x: p.x,
          y: p.y,
          z: p.z
        };
      }
    } else {
      /*  ellipsoidal (geodetic) longitude
       *  interval: -PI < Longitude <= +PI */
      Longitude = Math.atan2(Y, X);
    }

    /* --------------------------------------------------------------
     * Following iterative algorithm was developped by
     * "Institut for Erdmessung", University of Hannover, July 1988.
     * Internet: www.ife.uni-hannover.de
     * Iterative computation of CPHI,SPHI and Height.
     * Iteration of CPHI and SPHI to 10**-12 radian resp.
     * 2*10**-7 arcsec.
     * --------------------------------------------------------------
     */
    CT = Z / RR;
    ST = P / RR;
    RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
    CPHI0 = ST * (1.0 - es) * RX;
    SPHI0 = CT * RX;
    iter = 0;

    /* loop to find sin(Latitude) resp. Latitude
     * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
    do {
      iter++;
      RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

      /*  ellipsoidal (geodetic) height */
      Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

      RK = es * RN / (RN + Height);
      RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
      CPHI = ST * (1.0 - RK) * RX;
      SPHI = CT * RX;
      SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
      CPHI0 = CPHI;
      SPHI0 = SPHI;
    }
    while (SDPHI * SDPHI > genau2 && iter < maxiter);

    /*      ellipsoidal (geodetic) latitude */
    Latitude = Math.atan(SPHI / Math.abs(CPHI));
    return {
      x: Longitude,
      y: Latitude,
      z: Height
    };
  } // cs_geocentric_to_geodetic()

  /****************************************************************/
  // pj_geocentic_to_wgs84( p )
  //  p = point to transform in geocentric coordinates (x,y,z)


  /** point object, nothing fancy, just allows values to be
      passed back and forth by reference rather than by value.
      Other point classes may be used as long as they have
      x and y properties, which will get modified in the transform method.
  */
  function geocentricToWgs84(p, datum_type, datum_params) {

    if (datum_type === PJD_3PARAM) {
      // if( x[io] === HUGE_VAL )
      //    continue;
      return {
        x: p.x + datum_params[0],
        y: p.y + datum_params[1],
        z: p.z + datum_params[2],
      };
    } else if (datum_type === PJD_7PARAM) {
      var Dx_BF = datum_params[0];
      var Dy_BF = datum_params[1];
      var Dz_BF = datum_params[2];
      var Rx_BF = datum_params[3];
      var Ry_BF = datum_params[4];
      var Rz_BF = datum_params[5];
      var M_BF = datum_params[6];
      // if( x[io] === HUGE_VAL )
      //    continue;
      return {
        x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
        y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
        z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
      };
    }
  } // cs_geocentric_to_wgs84

  /****************************************************************/
  // pj_geocentic_from_wgs84()
  //  coordinate system definition,
  //  point to transform in geocentric coordinates (x,y,z)
  function geocentricFromWgs84(p, datum_type, datum_params) {

    if (datum_type === PJD_3PARAM) {
      //if( x[io] === HUGE_VAL )
      //    continue;
      return {
        x: p.x - datum_params[0],
        y: p.y - datum_params[1],
        z: p.z - datum_params[2],
      };

    } else if (datum_type === PJD_7PARAM) {
      var Dx_BF = datum_params[0];
      var Dy_BF = datum_params[1];
      var Dz_BF = datum_params[2];
      var Rx_BF = datum_params[3];
      var Ry_BF = datum_params[4];
      var Rz_BF = datum_params[5];
      var M_BF = datum_params[6];
      var x_tmp = (p.x - Dx_BF) / M_BF;
      var y_tmp = (p.y - Dy_BF) / M_BF;
      var z_tmp = (p.z - Dz_BF) / M_BF;
      //if( x[io] === HUGE_VAL )
      //    continue;

      return {
        x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
        y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
        z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
      };
    } //cs_geocentric_from_wgs84()
  }

  function checkParams(type) {
    return (type === PJD_3PARAM || type === PJD_7PARAM);
  }

  function datum_transform(source, dest, point) {
    // Short cut if the datums are identical.
    if (compareDatums(source, dest)) {
      return point; // in this case, zero is sucess,
      // whereas cs_compare_datums returns 1 to indicate TRUE
      // confusing, should fix this
    }

    // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
    if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
      return point;
    }

    // If this datum requires grid shifts, then apply it to geodetic coordinates.
    var source_a = source.a;
    var source_es = source.es;
    if (source.datum_type === PJD_GRIDSHIFT) {
      var gridShiftCode = applyGridShift(source, false, point);
      if (gridShiftCode !== 0) {
        return undefined;
      }
      source_a = SRS_WGS84_SEMIMAJOR;
      source_es = SRS_WGS84_ESQUARED;
    }

    var dest_a = dest.a;
    var dest_b = dest.b;
    var dest_es = dest.es;
    if (dest.datum_type === PJD_GRIDSHIFT) {
      dest_a = SRS_WGS84_SEMIMAJOR;
      dest_b = SRS_WGS84_SEMIMINOR;
      dest_es = SRS_WGS84_ESQUARED;
    }

    // Do we need to go through geocentric coordinates?
    if (source_es === dest_es && source_a === dest_a && !checkParams(source.datum_type) &&  !checkParams(dest.datum_type)) {
      return point;
    }

    // Convert to geocentric coordinates.
    point = geodeticToGeocentric(point, source_es, source_a);
    // Convert between datums
    if (checkParams(source.datum_type)) {
      point = geocentricToWgs84(point, source.datum_type, source.datum_params);
    }
    if (checkParams(dest.datum_type)) {
      point = geocentricFromWgs84(point, dest.datum_type, dest.datum_params);
    }
    point = geocentricToGeodetic(point, dest_es, dest_a, dest_b);

    if (dest.datum_type === PJD_GRIDSHIFT) {
      var destGridShiftResult = applyGridShift(dest, true, point);
      if (destGridShiftResult !== 0) {
        return undefined;
      }
    }

    return point;
  }

  function applyGridShift(source, inverse, point) {
    if (source.grids === null || source.grids.length === 0) {
      console.log('Grid shift grids not found');
      return -1;
    }
    var input = {x: -point.x, y: point.y};
    var output = {x: Number.NaN, y: Number.NaN};
    var attemptedGrids = [];
    outer:
    for (var i = 0; i < source.grids.length; i++) {
      var grid = source.grids[i];
      attemptedGrids.push(grid.name);
      if (grid.isNull) {
        output = input;
        break;
      }
      grid.mandatory;
      if (grid.grid === null) {
        if (grid.mandatory) {
          console.log("Unable to find mandatory grid '" + grid.name + "'");
          return -1;
        }
        continue;
      }
      var subgrids = grid.grid.subgrids;
      for (var j = 0, jj = subgrids.length; j < jj; j++) {
        var subgrid = subgrids[j];
        // skip tables that don't match our point at all
        var epsilon = (Math.abs(subgrid.del[1]) + Math.abs(subgrid.del[0])) / 10000.0;
        var minX = subgrid.ll[0] - epsilon;
        var minY = subgrid.ll[1] - epsilon;
        var maxX = subgrid.ll[0] + (subgrid.lim[0] - 1) * subgrid.del[0] + epsilon;
        var maxY = subgrid.ll[1] + (subgrid.lim[1] - 1) * subgrid.del[1] + epsilon;
        if (minY > input.y || minX > input.x || maxY < input.y || maxX < input.x ) {
          continue;
        }
        output = applySubgridShift(input, inverse, subgrid);
        if (!isNaN(output.x)) {
          break outer;
        }
      }
    }
    if (isNaN(output.x)) {
      console.log("Failed to find a grid shift table for location '"+
        -input.x * R2D + " " + input.y * R2D + " tried: '" + attemptedGrids + "'");
      return -1;
    }
    point.x = -output.x;
    point.y = output.y;
    return 0;
  }

  function applySubgridShift(pin, inverse, ct) {
    var val = {x: Number.NaN, y: Number.NaN};
    if (isNaN(pin.x)) { return val; }
    var tb = {x: pin.x, y: pin.y};
    tb.x -= ct.ll[0];
    tb.y -= ct.ll[1];
    tb.x = adjust_lon(tb.x - Math.PI) + Math.PI;
    var t = nadInterpolate(tb, ct);
    if (inverse) {
      if (isNaN(t.x)) {
        return val;
      }
      t.x = tb.x - t.x;
      t.y = tb.y - t.y;
      var i = 9, tol = 1e-12;
      var dif, del;
      do {
        del = nadInterpolate(t, ct);
        if (isNaN(del.x)) {
          console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
          break;
        }
        dif = {x: tb.x - (del.x + t.x), y: tb.y - (del.y + t.y)};
        t.x += dif.x;
        t.y += dif.y;
      } while (i-- && Math.abs(dif.x) > tol && Math.abs(dif.y) > tol);
      if (i < 0) {
        console.log("Inverse grid shift iterator failed to converge.");
        return val;
      }
      val.x = adjust_lon(t.x + ct.ll[0]);
      val.y = t.y + ct.ll[1];
    } else {
      if (!isNaN(t.x)) {
        val.x = pin.x + t.x;
        val.y = pin.y + t.y;
      }
    }
    return val;
  }

  function nadInterpolate(pin, ct) {
    var t = {x: pin.x / ct.del[0], y: pin.y / ct.del[1]};
    var indx = {x: Math.floor(t.x), y: Math.floor(t.y)};
    var frct = {x: t.x - 1.0 * indx.x, y: t.y - 1.0 * indx.y};
    var val= {x: Number.NaN, y: Number.NaN};
    var inx;
    if (indx.x < 0 || indx.x >= ct.lim[0]) {
      return val;
    }
    if (indx.y < 0 || indx.y >= ct.lim[1]) {
      return val;
    }
    inx = (indx.y * ct.lim[0]) + indx.x;
    var f00 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
    inx++;
    var f10= {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
    inx += ct.lim[0];
    var f11 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
    inx--;
    var f01 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
    var m11 = frct.x * frct.y, m10 = frct.x * (1.0 - frct.y),
      m00 = (1.0 - frct.x) * (1.0 - frct.y), m01 = (1.0 - frct.x) * frct.y;
    val.x = (m00 * f00.x + m10 * f10.x + m01 * f01.x + m11 * f11.x);
    val.y = (m00 * f00.y + m10 * f10.y + m01 * f01.y + m11 * f11.y);
    return val;
  }

  function adjust_axis(crs, denorm, point) {
    var xin = point.x,
      yin = point.y,
      zin = point.z || 0.0;
    var v, t, i;
    var out = {};
    for (i = 0; i < 3; i++) {
      if (denorm && i === 2 && point.z === undefined) {
        continue;
      }
      if (i === 0) {
        v = xin;
        if ("ew".indexOf(crs.axis[i]) !== -1) {
          t = 'x';
        } else {
          t = 'y';
        }

      }
      else if (i === 1) {
        v = yin;
        if ("ns".indexOf(crs.axis[i]) !== -1) {
          t = 'y';
        } else {
          t = 'x';
        }
      }
      else {
        v = zin;
        t = 'z';
      }
      switch (crs.axis[i]) {
      case 'e':
        out[t] = v;
        break;
      case 'w':
        out[t] = -v;
        break;
      case 'n':
        out[t] = v;
        break;
      case 's':
        out[t] = -v;
        break;
      case 'u':
        if (point[t] !== undefined) {
          out.z = v;
        }
        break;
      case 'd':
        if (point[t] !== undefined) {
          out.z = -v;
        }
        break;
      default:
        //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
        return null;
      }
    }
    return out;
  }

  function common (array){
    var out = {
      x: array[0],
      y: array[1]
    };
    if (array.length>2) {
      out.z = array[2];
    }
    if (array.length>3) {
      out.m = array[3];
    }
    return out;
  }

  function checkSanity (point) {
    checkCoord(point.x);
    checkCoord(point.y);
  }
  function checkCoord(num) {
    if (typeof Number.isFinite === 'function') {
      if (Number.isFinite(num)) {
        return;
      }
      throw new TypeError('coordinates must be finite numbers');
    }
    if (typeof num !== 'number' || num !== num || !isFinite(num)) {
      throw new TypeError('coordinates must be finite numbers');
    }
  }

  function checkNotWGS(source, dest) {
    return (
      (source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM || source.datum.datum_type === PJD_GRIDSHIFT) && dest.datumCode !== 'WGS84') ||
      ((dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM || dest.datum.datum_type === PJD_GRIDSHIFT) && source.datumCode !== 'WGS84');
  }

  function transform(source, dest, point, enforceAxis) {
    var wgs84;
    if (Array.isArray(point)) {
      point = common(point);
    } else {
      // Clone the point object so inputs don't get modified
      point = {
        x: point.x,
        y: point.y,
        z: point.z,
        m: point.m
      };
    }
    var hasZ = point.z !== undefined;
    checkSanity(point);
    // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
    if (source.datum && dest.datum && checkNotWGS(source, dest)) {
      wgs84 = new Projection('WGS84');
      point = transform(source, wgs84, point, enforceAxis);
      source = wgs84;
    }
    // DGR, 2010/11/12
    if (enforceAxis && source.axis !== 'enu') {
      point = adjust_axis(source, false, point);
    }
    // Transform source points to long/lat, if they aren't already.
    if (source.projName === 'longlat') {
      point = {
        x: point.x * D2R$1,
        y: point.y * D2R$1,
        z: point.z || 0
      };
    } else {
      if (source.to_meter) {
        point = {
          x: point.x * source.to_meter,
          y: point.y * source.to_meter,
          z: point.z || 0
        };
      }
      point = source.inverse(point); // Convert Cartesian to longlat
      if (!point) {
        return;
      }
    }
    // Adjust for the prime meridian if necessary
    if (source.from_greenwich) {
      point.x += source.from_greenwich;
    }

    // Convert datums if needed, and if possible.
    point = datum_transform(source.datum, dest.datum, point);
    if (!point) {
      return;
    }

    // Adjust for the prime meridian if necessary
    if (dest.from_greenwich) {
      point = {
        x: point.x - dest.from_greenwich,
        y: point.y,
        z: point.z || 0
      };
    }

    if (dest.projName === 'longlat') {
      // convert radians to decimal degrees
      point = {
        x: point.x * R2D,
        y: point.y * R2D,
        z: point.z || 0
      };
    } else { // else project
      point = dest.forward(point);
      if (dest.to_meter) {
        point = {
          x: point.x / dest.to_meter,
          y: point.y / dest.to_meter,
          z: point.z || 0
        };
      }
    }

    // DGR, 2010/11/12
    if (enforceAxis && dest.axis !== 'enu') {
      return adjust_axis(dest, true, point);
    }

    if (point && !hasZ) {
      delete point.z;
    }
    return point;
  }

  var wgs84 = Projection('WGS84');

  function transformer(from, to, coords, enforceAxis) {
    var transformedArray, out, keys;
    if (Array.isArray(coords)) {
      transformedArray = transform(from, to, coords, enforceAxis) || {x: NaN, y: NaN};
      if (coords.length > 2) {
        if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
          if (typeof transformedArray.z === 'number') {
            return [transformedArray.x, transformedArray.y, transformedArray.z].concat(coords.slice(3));
          } else {
            return [transformedArray.x, transformedArray.y, coords[2]].concat(coords.slice(3));
          }
        } else {
          return [transformedArray.x, transformedArray.y].concat(coords.slice(2));
        }
      } else {
        return [transformedArray.x, transformedArray.y];
      }
    } else {
      out = transform(from, to, coords, enforceAxis);
      keys = Object.keys(coords);
      if (keys.length === 2) {
        return out;
      }
      keys.forEach(function (key) {
        if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
          if (key === 'x' || key === 'y' || key === 'z') {
            return;
          }
        } else {
          if (key === 'x' || key === 'y') {
            return;
          }
        }
        out[key] = coords[key];
      });
      return out;
    }
  }

  function checkProj(item) {
    if (item instanceof Projection) {
      return item;
    }
    if (item.oProj) {
      return item.oProj;
    }
    return Projection(item);
  }

  function proj4(fromProj, toProj, coord) {
    fromProj = checkProj(fromProj);
    var single = false;
    var obj;
    if (typeof toProj === 'undefined') {
      toProj = fromProj;
      fromProj = wgs84;
      single = true;
    } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
      coord = toProj;
      toProj = fromProj;
      fromProj = wgs84;
      single = true;
    }
    toProj = checkProj(toProj);
    if (coord) {
      return transformer(fromProj, toProj, coord);
    } else {
      obj = {
        forward: function (coords, enforceAxis) {
          return transformer(fromProj, toProj, coords, enforceAxis);
        },
        inverse: function (coords, enforceAxis) {
          return transformer(toProj, fromProj, coords, enforceAxis);
        }
      };
      if (single) {
        obj.oProj = toProj;
      }
      return obj;
    }
  }

  /**
   * UTM zones are grouped, and assigned to one of a group of 6
   * sets.
   *
   * {int} @private
   */
  var NUM_100K_SETS = 6;

  /**
   * The column letters (for easting) of the lower left value, per
   * set.
   *
   * {string} @private
   */
  var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

  /**
   * The row letters (for northing) of the lower left value, per
   * set.
   *
   * {string} @private
   */
  var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

  var A = 65; // A
  var I = 73; // I
  var O = 79; // O
  var V = 86; // V
  var Z = 90; // Z
  var mgrs = {
    forward: forward$u,
    inverse: inverse$u,
    toPoint: toPoint
  };
  /**
   * Conversion of lat/lon to MGRS.
   *
   * @param {object} ll Object literal with lat and lon properties on a
   *     WGS84 ellipsoid.
   * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
   *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
   * @return {string} the MGRS string for the given location and accuracy.
   */
  function forward$u(ll, accuracy) {
    accuracy = accuracy || 5; // default accuracy 1m
    return encode(LLtoUTM({
      lat: ll[1],
      lon: ll[0]
    }), accuracy);
  }
  /**
   * Conversion of MGRS to lat/lon.
   *
   * @param {string} mgrs MGRS string.
   * @return {array} An array with left (longitude), bottom (latitude), right
   *     (longitude) and top (latitude) values in WGS84, representing the
   *     bounding box for the provided MGRS reference.
   */
  function inverse$u(mgrs) {
    var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
    if (bbox.lat && bbox.lon) {
      return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
    }
    return [bbox.left, bbox.bottom, bbox.right, bbox.top];
  }
  function toPoint(mgrs) {
    var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
    if (bbox.lat && bbox.lon) {
      return [bbox.lon, bbox.lat];
    }
    return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
  }/**
   * Conversion from degrees to radians.
   *
   * @private
   * @param {number} deg the angle in degrees.
   * @return {number} the angle in radians.
   */
  function degToRad(deg) {
    return (deg * (Math.PI / 180.0));
  }

  /**
   * Conversion from radians to degrees.
   *
   * @private
   * @param {number} rad the angle in radians.
   * @return {number} the angle in degrees.
   */
  function radToDeg(rad) {
    return (180.0 * (rad / Math.PI));
  }

  /**
   * Converts a set of Longitude and Latitude co-ordinates to UTM
   * using the WGS84 ellipsoid.
   *
   * @private
   * @param {object} ll Object literal with lat and lon properties
   *     representing the WGS84 coordinate to be converted.
   * @return {object} Object literal containing the UTM value with easting,
   *     northing, zoneNumber and zoneLetter properties, and an optional
   *     accuracy property in digits. Returns null if the conversion failed.
   */
  function LLtoUTM(ll) {
    var Lat = ll.lat;
    var Long = ll.lon;
    var a = 6378137.0; //ellip.radius;
    var eccSquared = 0.00669438; //ellip.eccsq;
    var k0 = 0.9996;
    var LongOrigin;
    var eccPrimeSquared;
    var N, T, C, A, M;
    var LatRad = degToRad(Lat);
    var LongRad = degToRad(Long);
    var LongOriginRad;
    var ZoneNumber;
    // (int)
    ZoneNumber = Math.floor((Long + 180) / 6) + 1;

    //Make sure the longitude 180.00 is in Zone 60
    if (Long === 180) {
      ZoneNumber = 60;
    }

    // Special zone for Norway
    if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
      ZoneNumber = 32;
    }

    // Special zones for Svalbard
    if (Lat >= 72.0 && Lat < 84.0) {
      if (Long >= 0.0 && Long < 9.0) {
        ZoneNumber = 31;
      }
      else if (Long >= 9.0 && Long < 21.0) {
        ZoneNumber = 33;
      }
      else if (Long >= 21.0 && Long < 33.0) {
        ZoneNumber = 35;
      }
      else if (Long >= 33.0 && Long < 42.0) {
        ZoneNumber = 37;
      }
    }

    LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
    // in middle of
    // zone
    LongOriginRad = degToRad(LongOrigin);

    eccPrimeSquared = (eccSquared) / (1 - eccSquared);

    N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
    T = Math.tan(LatRad) * Math.tan(LatRad);
    C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
    A = Math.cos(LatRad) * (LongRad - LongOriginRad);

    M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

    var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

    var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
    if (Lat < 0.0) {
      UTMNorthing += 10000000.0; //10000000 meter offset for
      // southern hemisphere
    }

    return {
      northing: Math.round(UTMNorthing),
      easting: Math.round(UTMEasting),
      zoneNumber: ZoneNumber,
      zoneLetter: getLetterDesignator(Lat)
    };
  }

  /**
   * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
   * class where the Zone can be specified as a single string eg."60N" which
   * is then broken down into the ZoneNumber and ZoneLetter.
   *
   * @private
   * @param {object} utm An object literal with northing, easting, zoneNumber
   *     and zoneLetter properties. If an optional accuracy property is
   *     provided (in meters), a bounding box will be returned instead of
   *     latitude and longitude.
   * @return {object} An object literal containing either lat and lon values
   *     (if no accuracy was provided), or top, right, bottom and left values
   *     for the bounding box calculated according to the provided accuracy.
   *     Returns null if the conversion failed.
   */
  function UTMtoLL(utm) {

    var UTMNorthing = utm.northing;
    var UTMEasting = utm.easting;
    var zoneLetter = utm.zoneLetter;
    var zoneNumber = utm.zoneNumber;
    // check the ZoneNummber is valid
    if (zoneNumber < 0 || zoneNumber > 60) {
      return null;
    }

    var k0 = 0.9996;
    var a = 6378137.0; //ellip.radius;
    var eccSquared = 0.00669438; //ellip.eccsq;
    var eccPrimeSquared;
    var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
    var N1, T1, C1, R1, D, M;
    var LongOrigin;
    var mu, phi1Rad;

    // remove 500,000 meter offset for longitude
    var x = UTMEasting - 500000.0;
    var y = UTMNorthing;

    // We must know somehow if we are in the Northern or Southern
    // hemisphere, this is the only time we use the letter So even
    // if the Zone letter isn't exactly correct it should indicate
    // the hemisphere correctly
    if (zoneLetter < 'N') {
      y -= 10000000.0; // remove 10,000,000 meter offset used
      // for southern hemisphere
    }

    // There are 60 zones with zone 1 being at West -180 to -174
    LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
    // in middle of
    // zone

    eccPrimeSquared = (eccSquared) / (1 - eccSquared);

    M = y / k0;
    mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

    phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
    // double phi1 = ProjMath.radToDeg(phi1Rad);

    N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
    D = x / (N1 * k0);

    var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
    lat = radToDeg(lat);

    var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
    lon = LongOrigin + radToDeg(lon);

    var result;
    if (utm.accuracy) {
      var topRight = UTMtoLL({
        northing: utm.northing + utm.accuracy,
        easting: utm.easting + utm.accuracy,
        zoneLetter: utm.zoneLetter,
        zoneNumber: utm.zoneNumber
      });
      result = {
        top: topRight.lat,
        right: topRight.lon,
        bottom: lat,
        left: lon
      };
    }
    else {
      result = {
        lat: lat,
        lon: lon
      };
    }
    return result;
  }

  /**
   * Calculates the MGRS letter designator for the given latitude.
   *
   * @private
   * @param {number} lat The latitude in WGS84 to get the letter designator
   *     for.
   * @return {char} The letter designator.
   */
  function getLetterDesignator(lat) {
    //This is here as an error flag to show that the Latitude is
    //outside MGRS limits
    var LetterDesignator = 'Z';

    if ((84 >= lat) && (lat >= 72)) {
      LetterDesignator = 'X';
    }
    else if ((72 > lat) && (lat >= 64)) {
      LetterDesignator = 'W';
    }
    else if ((64 > lat) && (lat >= 56)) {
      LetterDesignator = 'V';
    }
    else if ((56 > lat) && (lat >= 48)) {
      LetterDesignator = 'U';
    }
    else if ((48 > lat) && (lat >= 40)) {
      LetterDesignator = 'T';
    }
    else if ((40 > lat) && (lat >= 32)) {
      LetterDesignator = 'S';
    }
    else if ((32 > lat) && (lat >= 24)) {
      LetterDesignator = 'R';
    }
    else if ((24 > lat) && (lat >= 16)) {
      LetterDesignator = 'Q';
    }
    else if ((16 > lat) && (lat >= 8)) {
      LetterDesignator = 'P';
    }
    else if ((8 > lat) && (lat >= 0)) {
      LetterDesignator = 'N';
    }
    else if ((0 > lat) && (lat >= -8)) {
      LetterDesignator = 'M';
    }
    else if ((-8 > lat) && (lat >= -16)) {
      LetterDesignator = 'L';
    }
    else if ((-16 > lat) && (lat >= -24)) {
      LetterDesignator = 'K';
    }
    else if ((-24 > lat) && (lat >= -32)) {
      LetterDesignator = 'J';
    }
    else if ((-32 > lat) && (lat >= -40)) {
      LetterDesignator = 'H';
    }
    else if ((-40 > lat) && (lat >= -48)) {
      LetterDesignator = 'G';
    }
    else if ((-48 > lat) && (lat >= -56)) {
      LetterDesignator = 'F';
    }
    else if ((-56 > lat) && (lat >= -64)) {
      LetterDesignator = 'E';
    }
    else if ((-64 > lat) && (lat >= -72)) {
      LetterDesignator = 'D';
    }
    else if ((-72 > lat) && (lat >= -80)) {
      LetterDesignator = 'C';
    }
    return LetterDesignator;
  }

  /**
   * Encodes a UTM location as MGRS string.
   *
   * @private
   * @param {object} utm An object literal with easting, northing,
   *     zoneLetter, zoneNumber
   * @param {number} accuracy Accuracy in digits (1-5).
   * @return {string} MGRS string for the given UTM location.
   */
  function encode(utm, accuracy) {
    // prepend with leading zeroes
    var seasting = "00000" + utm.easting,
      snorthing = "00000" + utm.northing;

    return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
  }

  /**
   * Get the two letter 100k designator for a given UTM easting,
   * northing and zone number value.
   *
   * @private
   * @param {number} easting
   * @param {number} northing
   * @param {number} zoneNumber
   * @return the two letter 100k designator for the given UTM location.
   */
  function get100kID(easting, northing, zoneNumber) {
    var setParm = get100kSetForZone(zoneNumber);
    var setColumn = Math.floor(easting / 100000);
    var setRow = Math.floor(northing / 100000) % 20;
    return getLetter100kID(setColumn, setRow, setParm);
  }

  /**
   * Given a UTM zone number, figure out the MGRS 100K set it is in.
   *
   * @private
   * @param {number} i An UTM zone number.
   * @return {number} the 100k set the UTM zone is in.
   */
  function get100kSetForZone(i) {
    var setParm = i % NUM_100K_SETS;
    if (setParm === 0) {
      setParm = NUM_100K_SETS;
    }

    return setParm;
  }

  /**
   * Get the two-letter MGRS 100k designator given information
   * translated from the UTM northing, easting and zone number.
   *
   * @private
   * @param {number} column the column index as it relates to the MGRS
   *        100k set spreadsheet, created from the UTM easting.
   *        Values are 1-8.
   * @param {number} row the row index as it relates to the MGRS 100k set
   *        spreadsheet, created from the UTM northing value. Values
   *        are from 0-19.
   * @param {number} parm the set block, as it relates to the MGRS 100k set
   *        spreadsheet, created from the UTM zone. Values are from
   *        1-60.
   * @return two letter MGRS 100k code.
   */
  function getLetter100kID(column, row, parm) {
    // colOrigin and rowOrigin are the letters at the origin of the set
    var index = parm - 1;
    var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
    var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

    // colInt and rowInt are the letters to build to return
    var colInt = colOrigin + column - 1;
    var rowInt = rowOrigin + row;
    var rollover = false;

    if (colInt > Z) {
      colInt = colInt - Z + A - 1;
      rollover = true;
    }

    if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
      colInt++;
    }

    if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
      colInt++;

      if (colInt === I) {
        colInt++;
      }
    }

    if (colInt > Z) {
      colInt = colInt - Z + A - 1;
    }

    if (rowInt > V) {
      rowInt = rowInt - V + A - 1;
      rollover = true;
    }
    else {
      rollover = false;
    }

    if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
      rowInt++;
    }

    if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
      rowInt++;

      if (rowInt === I) {
        rowInt++;
      }
    }

    if (rowInt > V) {
      rowInt = rowInt - V + A - 1;
    }

    var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
    return twoLetter;
  }

  /**
   * Decode the UTM parameters from a MGRS string.
   *
   * @private
   * @param {string} mgrsString an UPPERCASE coordinate string is expected.
   * @return {object} An object literal with easting, northing, zoneLetter,
   *     zoneNumber and accuracy (in meters) properties.
   */
  function decode(mgrsString) {

    if (mgrsString && mgrsString.length === 0) {
      throw ("MGRSPoint coverting from nothing");
    }

    var length = mgrsString.length;

    var hunK = null;
    var sb = "";
    var testChar;
    var i = 0;

    // get Zone number
    while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
      if (i >= 2) {
        throw ("MGRSPoint bad conversion from: " + mgrsString);
      }
      sb += testChar;
      i++;
    }

    var zoneNumber = parseInt(sb, 10);

    if (i === 0 || i + 3 > length) {
      // A good MGRS string has to be 4-5 digits long,
      // ##AAA/#AAA at least.
      throw ("MGRSPoint bad conversion from: " + mgrsString);
    }

    var zoneLetter = mgrsString.charAt(i++);

    // Should we check the zone letter here? Why not.
    if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
      throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
    }

    hunK = mgrsString.substring(i, i += 2);

    var set = get100kSetForZone(zoneNumber);

    var east100k = getEastingFromChar(hunK.charAt(0), set);
    var north100k = getNorthingFromChar(hunK.charAt(1), set);

    // We have a bug where the northing may be 2000000 too low.
    // How
    // do we know when to roll over?

    while (north100k < getMinNorthing(zoneLetter)) {
      north100k += 2000000;
    }

    // calculate the char index for easting/northing separator
    var remainder = length - i;

    if (remainder % 2 !== 0) {
      throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
    }

    var sep = remainder / 2;

    var sepEasting = 0.0;
    var sepNorthing = 0.0;
    var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
    if (sep > 0) {
      accuracyBonus = 100000.0 / Math.pow(10, sep);
      sepEastingString = mgrsString.substring(i, i + sep);
      sepEasting = parseFloat(sepEastingString) * accuracyBonus;
      sepNorthingString = mgrsString.substring(i + sep);
      sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
    }

    easting = sepEasting + east100k;
    northing = sepNorthing + north100k;

    return {
      easting: easting,
      northing: northing,
      zoneLetter: zoneLetter,
      zoneNumber: zoneNumber,
      accuracy: accuracyBonus
    };
  }

  /**
   * Given the first letter from a two-letter MGRS 100k zone, and given the
   * MGRS table set for the zone number, figure out the easting value that
   * should be added to the other, secondary easting value.
   *
   * @private
   * @param {char} e The first letter from a two-letter MGRS 100´k zone.
   * @param {number} set The MGRS table set for the zone number.
   * @return {number} The easting value for the given letter and set.
   */
  function getEastingFromChar(e, set) {
    // colOrigin is the letter at the origin of the set for the
    // column
    var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
    var eastingValue = 100000.0;
    var rewindMarker = false;

    while (curCol !== e.charCodeAt(0)) {
      curCol++;
      if (curCol === I) {
        curCol++;
      }
      if (curCol === O) {
        curCol++;
      }
      if (curCol > Z) {
        if (rewindMarker) {
          throw ("Bad character: " + e);
        }
        curCol = A;
        rewindMarker = true;
      }
      eastingValue += 100000.0;
    }

    return eastingValue;
  }

  /**
   * Given the second letter from a two-letter MGRS 100k zone, and given the
   * MGRS table set for the zone number, figure out the northing value that
   * should be added to the other, secondary northing value. You have to
   * remember that Northings are determined from the equator, and the vertical
   * cycle of letters mean a 2000000 additional northing meters. This happens
   * approx. every 18 degrees of latitude. This method does *NOT* count any
   * additional northings. You have to figure out how many 2000000 meters need
   * to be added for the zone letter of the MGRS coordinate.
   *
   * @private
   * @param {char} n Second letter of the MGRS 100k zone
   * @param {number} set The MGRS table set number, which is dependent on the
   *     UTM zone number.
   * @return {number} The northing value for the given letter and set.
   */
  function getNorthingFromChar(n, set) {

    if (n > 'V') {
      throw ("MGRSPoint given invalid Northing " + n);
    }

    // rowOrigin is the letter at the origin of the set for the
    // column
    var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
    var northingValue = 0.0;
    var rewindMarker = false;

    while (curRow !== n.charCodeAt(0)) {
      curRow++;
      if (curRow === I) {
        curRow++;
      }
      if (curRow === O) {
        curRow++;
      }
      // fixing a bug making whole application hang in this loop
      // when 'n' is a wrong character
      if (curRow > V) {
        if (rewindMarker) { // making sure that this loop ends
          throw ("Bad character: " + n);
        }
        curRow = A;
        rewindMarker = true;
      }
      northingValue += 100000.0;
    }

    return northingValue;
  }

  /**
   * The function getMinNorthing returns the minimum northing value of a MGRS
   * zone.
   *
   * Ported from Geotrans' c Lattitude_Band_Value structure table.
   *
   * @private
   * @param {char} zoneLetter The MGRS zone to get the min northing for.
   * @return {number}
   */
  function getMinNorthing(zoneLetter) {
    var northing;
    switch (zoneLetter) {
    case 'C':
      northing = 1100000.0;
      break;
    case 'D':
      northing = 2000000.0;
      break;
    case 'E':
      northing = 2800000.0;
      break;
    case 'F':
      northing = 3700000.0;
      break;
    case 'G':
      northing = 4600000.0;
      break;
    case 'H':
      northing = 5500000.0;
      break;
    case 'J':
      northing = 6400000.0;
      break;
    case 'K':
      northing = 7300000.0;
      break;
    case 'L':
      northing = 8200000.0;
      break;
    case 'M':
      northing = 9100000.0;
      break;
    case 'N':
      northing = 0.0;
      break;
    case 'P':
      northing = 800000.0;
      break;
    case 'Q':
      northing = 1700000.0;
      break;
    case 'R':
      northing = 2600000.0;
      break;
    case 'S':
      northing = 3500000.0;
      break;
    case 'T':
      northing = 4400000.0;
      break;
    case 'U':
      northing = 5300000.0;
      break;
    case 'V':
      northing = 6200000.0;
      break;
    case 'W':
      northing = 7000000.0;
      break;
    case 'X':
      northing = 7900000.0;
      break;
    default:
      northing = -1;
    }
    if (northing >= 0.0) {
      return northing;
    }
    else {
      throw ("Invalid zone letter: " + zoneLetter);
    }

  }

  function Point(x, y, z) {
    if (!(this instanceof Point)) {
      return new Point(x, y, z);
    }
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2] || 0.0;
    } else if(typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z || 0.0;
    } else if (typeof x === 'string' && typeof y === 'undefined') {
      var coords = x.split(',');
      this.x = parseFloat(coords[0], 10);
      this.y = parseFloat(coords[1], 10);
      this.z = parseFloat(coords[2], 10) || 0.0;
    } else {
      this.x = x;
      this.y = y;
      this.z = z || 0.0;
    }
    console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
  }

  Point.fromMGRS = function(mgrsStr) {
    return new Point(toPoint(mgrsStr));
  };
  Point.prototype.toMGRS = function(accuracy) {
    return forward$u([this.x, this.y], accuracy);
  };

  var C00 = 1;
  var C02 = 0.25;
  var C04 = 0.046875;
  var C06 = 0.01953125;
  var C08 = 0.01068115234375;
  var C22 = 0.75;
  var C44 = 0.46875;
  var C46 = 0.01302083333333333333;
  var C48 = 0.00712076822916666666;
  var C66 = 0.36458333333333333333;
  var C68 = 0.00569661458333333333;
  var C88 = 0.3076171875;

  function pj_enfn(es) {
    var en = [];
    en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
    en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
    var t = es * es;
    en[2] = t * (C44 - es * (C46 + es * C48));
    t *= es;
    en[3] = t * (C66 - es * C68);
    en[4] = t * es * C88;
    return en;
  }

  function pj_mlfn(phi, sphi, cphi, en) {
    cphi *= sphi;
    sphi *= sphi;
    return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
  }

  var MAX_ITER$3 = 20;

  function pj_inv_mlfn(arg, es, en) {
    var k = 1 / (1 - es);
    var phi = arg;
    for (var i = MAX_ITER$3; i; --i) { /* rarely goes over 2 iterations */
      var s = Math.sin(phi);
      var t = 1 - es * s * s;
      //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
      //phi -= t * (t * Math.sqrt(t)) * k;
      t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
      phi -= t;
      if (Math.abs(t) < EPSLN) {
        return phi;
      }
    }
    //..reportError("cass:pj_inv_mlfn: Convergence error");
    return phi;
  }

  // Heavily based on this tmerc projection implementation
  // https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/tmerc.js


  function init$v() {
    this.x0 = this.x0 !== undefined ? this.x0 : 0;
    this.y0 = this.y0 !== undefined ? this.y0 : 0;
    this.long0 = this.long0 !== undefined ? this.long0 : 0;
    this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

    if (this.es) {
      this.en = pj_enfn(this.es);
      this.ml0 = pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
    }
  }

  /**
      Transverse Mercator Forward  - long/lat to x/y
      long/lat in radians
    */
  function forward$t(p) {
    var lon = p.x;
    var lat = p.y;

    var delta_lon = adjust_lon(lon - this.long0);
    var con;
    var x, y;
    var sin_phi = Math.sin(lat);
    var cos_phi = Math.cos(lat);

    if (!this.es) {
      var b = cos_phi * Math.sin(delta_lon);

      if ((Math.abs(Math.abs(b) - 1)) < EPSLN) {
        return (93);
      }
      else {
        x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
        y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
        b = Math.abs(y);

        if (b >= 1) {
          if ((b - 1) > EPSLN) {
            return (93);
          }
          else {
            y = 0;
          }
        }
        else {
          y = Math.acos(y);
        }

        if (lat < 0) {
          y = -y;
        }

        y = this.a * this.k0 * (y - this.lat0) + this.y0;
      }
    }
    else {
      var al = cos_phi * delta_lon;
      var als = Math.pow(al, 2);
      var c = this.ep2 * Math.pow(cos_phi, 2);
      var cs = Math.pow(c, 2);
      var tq = Math.abs(cos_phi) > EPSLN ? Math.tan(lat) : 0;
      var t = Math.pow(tq, 2);
      var ts = Math.pow(t, 2);
      con = 1 - this.es * Math.pow(sin_phi, 2);
      al = al / Math.sqrt(con);
      var ml = pj_mlfn(lat, sin_phi, cos_phi, this.en);

      x = this.a * (this.k0 * al * (1 +
        als / 6 * (1 - t + c +
        als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c +
        als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) +
        this.x0;

      y = this.a * (this.k0 * (ml - this.ml0 +
        sin_phi * delta_lon * al / 2 * (1 +
        als / 12 * (5 - t + 9 * c + 4 * cs +
        als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c +
        als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) +
        this.y0;
    }

    p.x = x;
    p.y = y;

    return p;
  }

  /**
      Transverse Mercator Inverse  -  x/y to long/lat
    */
  function inverse$t(p) {
    var con, phi;
    var lat, lon;
    var x = (p.x - this.x0) * (1 / this.a);
    var y = (p.y - this.y0) * (1 / this.a);

    if (!this.es) {
      var f = Math.exp(x / this.k0);
      var g = 0.5 * (f - 1 / f);
      var temp = this.lat0 + y / this.k0;
      var h = Math.cos(temp);
      con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
      lat = Math.asin(con);

      if (y < 0) {
        lat = -lat;
      }

      if ((g === 0) && (h === 0)) {
        lon = 0;
      }
      else {
        lon = adjust_lon(Math.atan2(g, h) + this.long0);
      }
    }
    else { // ellipsoidal form
      con = this.ml0 + y / this.k0;
      phi = pj_inv_mlfn(con, this.es, this.en);

      if (Math.abs(phi) < HALF_PI) {
        var sin_phi = Math.sin(phi);
        var cos_phi = Math.cos(phi);
        var tan_phi = Math.abs(cos_phi) > EPSLN ? Math.tan(phi) : 0;
        var c = this.ep2 * Math.pow(cos_phi, 2);
        var cs = Math.pow(c, 2);
        var t = Math.pow(tan_phi, 2);
        var ts = Math.pow(t, 2);
        con = 1 - this.es * Math.pow(sin_phi, 2);
        var d = x * Math.sqrt(con) / this.k0;
        var ds = Math.pow(d, 2);
        con = con * tan_phi;

        lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1 -
          ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs -
          ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c -
          ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

        lon = adjust_lon(this.long0 + (d * (1 -
          ds / 6 * (1 + 2 * t + c -
          ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c -
          ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi));
      }
      else {
        lat = HALF_PI * sign(y);
        lon = 0;
      }
    }

    p.x = lon;
    p.y = lat;

    return p;
  }

  var names$u = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
  var tmerc = {
    init: init$v,
    forward: forward$t,
    inverse: inverse$t,
    names: names$u
  };

  function sinh(x) {
    var r = Math.exp(x);
    r = (r - 1 / r) / 2;
    return r;
  }

  function hypot(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    var a = Math.max(x, y);
    var b = Math.min(x, y) / (a ? a : 1);

    return a * Math.sqrt(1 + Math.pow(b, 2));
  }

  function log1py(x) {
    var y = 1 + x;
    var z = y - 1;

    return z === 0 ? x : x * Math.log(y) / z;
  }

  function asinhy(x) {
    var y = Math.abs(x);
    y = log1py(y * (1 + y / (hypot(1, y) + 1)));

    return x < 0 ? -y : y;
  }

  function gatg(pp, B) {
    var cos_2B = 2 * Math.cos(2 * B);
    var i = pp.length - 1;
    var h1 = pp[i];
    var h2 = 0;
    var h;

    while (--i >= 0) {
      h = -h2 + cos_2B * h1 + pp[i];
      h2 = h1;
      h1 = h;
    }

    return (B + h * Math.sin(2 * B));
  }

  function clens(pp, arg_r) {
    var r = 2 * Math.cos(arg_r);
    var i = pp.length - 1;
    var hr1 = pp[i];
    var hr2 = 0;
    var hr;

    while (--i >= 0) {
      hr = -hr2 + r * hr1 + pp[i];
      hr2 = hr1;
      hr1 = hr;
    }

    return Math.sin(arg_r) * hr;
  }

  function cosh(x) {
    var r = Math.exp(x);
    r = (r + 1 / r) / 2;
    return r;
  }

  function clens_cmplx(pp, arg_r, arg_i) {
    var sin_arg_r = Math.sin(arg_r);
    var cos_arg_r = Math.cos(arg_r);
    var sinh_arg_i = sinh(arg_i);
    var cosh_arg_i = cosh(arg_i);
    var r = 2 * cos_arg_r * cosh_arg_i;
    var i = -2 * sin_arg_r * sinh_arg_i;
    var j = pp.length - 1;
    var hr = pp[j];
    var hi1 = 0;
    var hr1 = 0;
    var hi = 0;
    var hr2;
    var hi2;

    while (--j >= 0) {
      hr2 = hr1;
      hi2 = hi1;
      hr1 = hr;
      hi1 = hi;
      hr = -hr2 + r * hr1 - i * hi1 + pp[j];
      hi = -hi2 + i * hr1 + r * hi1;
    }

    r = sin_arg_r * cosh_arg_i;
    i = cos_arg_r * sinh_arg_i;

    return [r * hr - i * hi, r * hi + i * hr];
  }

  // Heavily based on this etmerc projection implementation
  // https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/etmerc.js


  function init$u() {
    if (!this.approx && (isNaN(this.es) || this.es <= 0)) {
      throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
    }
    if (this.approx) {
      // When '+approx' is set, use tmerc instead
      tmerc.init.apply(this);
      this.forward = tmerc.forward;
      this.inverse = tmerc.inverse;
    }

    this.x0 = this.x0 !== undefined ? this.x0 : 0;
    this.y0 = this.y0 !== undefined ? this.y0 : 0;
    this.long0 = this.long0 !== undefined ? this.long0 : 0;
    this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

    this.cgb = [];
    this.cbg = [];
    this.utg = [];
    this.gtu = [];

    var f = this.es / (1 + Math.sqrt(1 - this.es));
    var n = f / (2 - f);
    var np = n;

    this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675 ))))));
    this.cbg[0] = n * (-2 + n * ( 2 / 3 + n * ( 4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

    np = np * n;
    this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
    this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * ( -13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

    np = np * n;
    this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
    this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

    np = np * n;
    this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
    this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * ( -24832 / 14175)));

    np = np * n;
    this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
    this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

    np = np * n;
    this.cgb[5] = np * (601676 / 22275);
    this.cbg[5] = np * (444337 / 155925);

    np = Math.pow(n, 2);
    this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

    this.utg[0] = n * (-0.5 + n * ( 2 / 3 + n * (-37 / 96 + n * ( 1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
    this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

    this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
    this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

    np = np * n;
    this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720 ))));
    this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

    np = np * n;
    this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
    this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

    np = np * n;
    this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
    this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

    np = np * n;
    this.utg[5] = np * (-20648693 / 638668800);
    this.gtu[5] = np * (212378941 / 319334400);

    var Z = gatg(this.cbg, this.lat0);
    this.Zb = -this.Qn * (Z + clens(this.gtu, 2 * Z));
  }

  function forward$s(p) {
    var Ce = adjust_lon(p.x - this.long0);
    var Cn = p.y;

    Cn = gatg(this.cbg, Cn);
    var sin_Cn = Math.sin(Cn);
    var cos_Cn = Math.cos(Cn);
    var sin_Ce = Math.sin(Ce);
    var cos_Ce = Math.cos(Ce);

    Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
    Ce = Math.atan2(sin_Ce * cos_Cn, hypot(sin_Cn, cos_Cn * cos_Ce));
    Ce = asinhy(Math.tan(Ce));

    var tmp = clens_cmplx(this.gtu, 2 * Cn, 2 * Ce);

    Cn = Cn + tmp[0];
    Ce = Ce + tmp[1];

    var x;
    var y;

    if (Math.abs(Ce) <= 2.623395162778) {
      x = this.a * (this.Qn * Ce) + this.x0;
      y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
    }
    else {
      x = Infinity;
      y = Infinity;
    }

    p.x = x;
    p.y = y;

    return p;
  }

  function inverse$s(p) {
    var Ce = (p.x - this.x0) * (1 / this.a);
    var Cn = (p.y - this.y0) * (1 / this.a);

    Cn = (Cn - this.Zb) / this.Qn;
    Ce = Ce / this.Qn;

    var lon;
    var lat;

    if (Math.abs(Ce) <= 2.623395162778) {
      var tmp = clens_cmplx(this.utg, 2 * Cn, 2 * Ce);

      Cn = Cn + tmp[0];
      Ce = Ce + tmp[1];
      Ce = Math.atan(sinh(Ce));

      var sin_Cn = Math.sin(Cn);
      var cos_Cn = Math.cos(Cn);
      var sin_Ce = Math.sin(Ce);
      var cos_Ce = Math.cos(Ce);

      Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
      Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

      lon = adjust_lon(Ce + this.long0);
      lat = gatg(this.cgb, Cn);
    }
    else {
      lon = Infinity;
      lat = Infinity;
    }

    p.x = lon;
    p.y = lat;

    return p;
  }

  var names$t = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "Gauss Kruger", "Gauss_Kruger", "tmerc"];
  var etmerc = {
    init: init$u,
    forward: forward$s,
    inverse: inverse$s,
    names: names$t
  };

  function adjust_zone(zone, lon) {
    if (zone === undefined) {
      zone = Math.floor((adjust_lon(lon) + Math.PI) * 30 / Math.PI) + 1;

      if (zone < 0) {
        return 0;
      } else if (zone > 60) {
        return 60;
      }
    }
    return zone;
  }

  var dependsOn = 'etmerc';


  function init$t() {
    var zone = adjust_zone(this.zone, this.long0);
    if (zone === undefined) {
      throw new Error('unknown utm zone');
    }
    this.lat0 = 0;
    this.long0 =  ((6 * Math.abs(zone)) - 183) * D2R$1;
    this.x0 = 500000;
    this.y0 = this.utmSouth ? 10000000 : 0;
    this.k0 = 0.9996;

    etmerc.init.apply(this);
    this.forward = etmerc.forward;
    this.inverse = etmerc.inverse;
  }

  var names$s = ["Universal Transverse Mercator System", "utm"];
  var utm = {
    init: init$t,
    names: names$s,
    dependsOn: dependsOn
  };

  function srat(esinp, exp) {
    return (Math.pow((1 - esinp) / (1 + esinp), exp));
  }

  var MAX_ITER$2 = 20;

  function init$s() {
    var sphi = Math.sin(this.lat0);
    var cphi = Math.cos(this.lat0);
    cphi *= cphi;
    this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
    this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
    this.phic0 = Math.asin(sphi / this.C);
    this.ratexp = 0.5 * this.C * this.e;
    this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
  }

  function forward$r(p) {
    var lon = p.x;
    var lat = p.y;

    p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
    p.x = this.C * lon;
    return p;
  }

  function inverse$r(p) {
    var DEL_TOL = 1e-14;
    var lon = p.x / this.C;
    var lat = p.y;
    var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);
    for (var i = MAX_ITER$2; i > 0; --i) {
      lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), -0.5 * this.e)) - HALF_PI;
      if (Math.abs(lat - p.y) < DEL_TOL) {
        break;
      }
      p.y = lat;
    }
    /* convergence failed */
    if (!i) {
      return null;
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
  var gauss = {
    init: init$s,
    forward: forward$r,
    inverse: inverse$r};

  function init$r() {
    gauss.init.apply(this);
    if (!this.rc) {
      return;
    }
    this.sinc0 = Math.sin(this.phic0);
    this.cosc0 = Math.cos(this.phic0);
    this.R2 = 2 * this.rc;
    if (!this.title) {
      this.title = "Oblique Stereographic Alternative";
    }
  }

  function forward$q(p) {
    var sinc, cosc, cosl, k;
    p.x = adjust_lon(p.x - this.long0);
    gauss.forward.apply(this, [p]);
    sinc = Math.sin(p.y);
    cosc = Math.cos(p.y);
    cosl = Math.cos(p.x);
    k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
    p.x = k * cosc * Math.sin(p.x);
    p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
    p.x = this.a * p.x + this.x0;
    p.y = this.a * p.y + this.y0;
    return p;
  }

  function inverse$q(p) {
    var sinc, cosc, lon, lat, rho;
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;

    p.x /= this.k0;
    p.y /= this.k0;
    if ((rho = hypot(p.x, p.y))) {
      var c = 2 * Math.atan2(rho, this.R2);
      sinc = Math.sin(c);
      cosc = Math.cos(c);
      lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
      lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
    }
    else {
      lat = this.phic0;
      lon = 0;
    }

    p.x = lon;
    p.y = lat;
    gauss.inverse.apply(this, [p]);
    p.x = adjust_lon(p.x + this.long0);
    return p;
  }

  var names$r = ["Stereographic_North_Pole", "Oblique_Stereographic", "sterea","Oblique Stereographic Alternative","Double_Stereographic"];
  var sterea = {
    init: init$r,
    forward: forward$q,
    inverse: inverse$q,
    names: names$r
  };

  function ssfn_(phit, sinphi, eccen) {
    sinphi *= eccen;
    return (Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
  }

  function init$q() {

    // setting default parameters
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.lat0 = this.lat0 || 0;
    this.long0 = this.long0 || 0;

    this.coslat0 = Math.cos(this.lat0);
    this.sinlat0 = Math.sin(this.lat0);
    if (this.sphere) {
      if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
        this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
      }
    }
    else {
      if (Math.abs(this.coslat0) <= EPSLN) {
        if (this.lat0 > 0) {
          //North pole
          //trace('stere:north pole');
          this.con = 1;
        }
        else {
          //South pole
          //trace('stere:south pole');
          this.con = -1;
        }
      }
      this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
      if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN && Math.abs(Math.cos(this.lat_ts)) > EPSLN) {
        // When k0 is 1 (default value) and lat_ts is a vaild number and lat0 is at a pole and lat_ts is not at a pole
        // Recalculate k0 using formula 21-35 from p161 of Snyder, 1987
        this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
      }
      this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
      this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
      this.cosX0 = Math.cos(this.X0);
      this.sinX0 = Math.sin(this.X0);
    }
  }

  // Stereographic forward equations--mapping lat,long to x,y
  function forward$p(p) {
    var lon = p.x;
    var lat = p.y;
    var sinlat = Math.sin(lat);
    var coslat = Math.cos(lat);
    var A, X, sinX, cosX, ts, rh;
    var dlon = adjust_lon(lon - this.long0);

    if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
      //case of the origine point
      //trace('stere:this is the origin point');
      p.x = NaN;
      p.y = NaN;
      return p;
    }
    if (this.sphere) {
      //trace('stere:sphere case');
      A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
      p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
      p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
      return p;
    }
    else {
      X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
      cosX = Math.cos(X);
      sinX = Math.sin(X);
      if (Math.abs(this.coslat0) <= EPSLN) {
        ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
        rh = 2 * this.a * this.k0 * ts / this.cons;
        p.x = this.x0 + rh * Math.sin(lon - this.long0);
        p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
        //trace(p.toString());
        return p;
      }
      else if (Math.abs(this.sinlat0) < EPSLN) {
        //Eq
        //trace('stere:equateur');
        A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
        p.y = A * sinX;
      }
      else {
        //other case
        //trace('stere:normal case');
        A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
        p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
      }
      p.x = A * cosX * Math.sin(dlon) + this.x0;
    }
    //trace(p.toString());
    return p;
  }

  //* Stereographic inverse equations--mapping x,y to lat/long
  function inverse$p(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var lon, lat, ts, ce, Chi;
    var rh = Math.sqrt(p.x * p.x + p.y * p.y);
    if (this.sphere) {
      var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
      lon = this.long0;
      lat = this.lat0;
      if (rh <= EPSLN) {
        p.x = lon;
        p.y = lat;
        return p;
      }
      lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
      if (Math.abs(this.coslat0) < EPSLN) {
        if (this.lat0 > 0) {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, -1 * p.y));
        }
        else {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
        }
      }
      else {
        lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
      }
      p.x = lon;
      p.y = lat;
      return p;
    }
    else {
      if (Math.abs(this.coslat0) <= EPSLN) {
        if (rh <= EPSLN) {
          lat = this.lat0;
          lon = this.long0;
          p.x = lon;
          p.y = lat;
          //trace(p.toString());
          return p;
        }
        p.x *= this.con;
        p.y *= this.con;
        ts = rh * this.cons / (2 * this.a * this.k0);
        lat = this.con * phi2z(this.e, ts);
        lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, -1 * p.y));
      }
      else {
        ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
        lon = this.long0;
        if (rh <= EPSLN) {
          Chi = this.X0;
        }
        else {
          Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
          lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
        }
        lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
      }
    }
    p.x = lon;
    p.y = lat;

    //trace(p.toString());
    return p;

  }

  var names$q = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)", "Polar_Stereographic"];
  var stere = {
    init: init$q,
    forward: forward$p,
    inverse: inverse$p,
    names: names$q,
    ssfn_: ssfn_
  };

  /*
    references:
      Formules et constantes pour le Calcul pour la
      projection cylindrique conforme à axe oblique et pour la transformation entre
      des systèmes de référence.
      http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
    */

  function init$p() {
    var phy0 = this.lat0;
    this.lambda0 = this.long0;
    var sinPhy0 = Math.sin(phy0);
    var semiMajorAxis = this.a;
    var invF = this.rf;
    var flattening = 1 / invF;
    var e2 = 2 * flattening - Math.pow(flattening, 2);
    var e = this.e = Math.sqrt(e2);
    this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
    this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
    this.b0 = Math.asin(sinPhy0 / this.alpha);
    var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
    var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
    var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
    this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
  }

  function forward$o(p) {
    var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
    var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
    var S = -this.alpha * (Sa1 + Sa2) + this.K;

    // spheric latitude
    var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

    // spheric longitude
    var I = this.alpha * (p.x - this.lambda0);

    // psoeudo equatorial rotation
    var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

    var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

    p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
    p.x = this.R * rotI + this.x0;
    return p;
  }

  function inverse$o(p) {
    var Y = p.x - this.x0;
    var X = p.y - this.y0;

    var rotI = Y / this.R;
    var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

    var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
    var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

    var lambda = this.lambda0 + I / this.alpha;

    var S = 0;
    var phy = b;
    var prevPhy = -1e3;
    var iteration = 0;
    while (Math.abs(phy - prevPhy) > 0.0000001) {
      if (++iteration > 20) {
        //...reportError("omercFwdInfinity");
        return;
      }
      //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
      S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
      prevPhy = phy;
      phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
    }

    p.x = lambda;
    p.y = phy;
    return p;
  }

  var names$p = ["somerc"];
  var somerc = {
    init: init$p,
    forward: forward$o,
    inverse: inverse$o,
    names: names$p
  };

  var TOL = 1e-7;

  function isTypeA(P) {
    var typeAProjections = ['Hotine_Oblique_Mercator','Hotine_Oblique_Mercator_Azimuth_Natural_Origin'];
    var projectionName = typeof P.PROJECTION === "object" ? Object.keys(P.PROJECTION)[0] : P.PROJECTION;

    return 'no_uoff' in P || 'no_off' in P || typeAProjections.indexOf(projectionName) !== -1;
  }


  /* Initialize the Oblique Mercator  projection
      ------------------------------------------*/
  function init$o() {
    var con, com, cosph0, D, F, H, L, sinph0, p, J, gamma = 0,
      gamma0, lamc = 0, lam1 = 0, lam2 = 0, phi1 = 0, phi2 = 0, alpha_c = 0;

    // only Type A uses the no_off or no_uoff property
    // https://github.com/OSGeo/proj.4/issues/104
    this.no_off = isTypeA(this);
    this.no_rot = 'no_rot' in this;

    var alp = false;
    if ("alpha" in this) {
      alp = true;
    }

    var gam = false;
    if ("rectified_grid_angle" in this) {
      gam = true;
    }

    if (alp) {
      alpha_c = this.alpha;
    }

    if (gam) {
      gamma = (this.rectified_grid_angle * D2R$1);
    }

    if (alp || gam) {
      lamc = this.longc;
    } else {
      lam1 = this.long1;
      phi1 = this.lat1;
      lam2 = this.long2;
      phi2 = this.lat2;

      if (Math.abs(phi1 - phi2) <= TOL || (con = Math.abs(phi1)) <= TOL ||
          Math.abs(con - HALF_PI) <= TOL || Math.abs(Math.abs(this.lat0) - HALF_PI) <= TOL ||
          Math.abs(Math.abs(phi2) - HALF_PI) <= TOL) {
        throw new Error();
      }
    }

    var one_es = 1.0 - this.es;
    com = Math.sqrt(one_es);

    if (Math.abs(this.lat0) > EPSLN) {
      sinph0 = Math.sin(this.lat0);
      cosph0 = Math.cos(this.lat0);
      con = 1 - this.es * sinph0 * sinph0;
      this.B = cosph0 * cosph0;
      this.B = Math.sqrt(1 + this.es * this.B * this.B / one_es);
      this.A = this.B * this.k0 * com / con;
      D = this.B * com / (cosph0 * Math.sqrt(con));
      F = D * D -1;

      if (F <= 0) {
        F = 0;
      } else {
        F = Math.sqrt(F);
        if (this.lat0 < 0) {
          F = -F;
        }
      }

      this.E = F += D;
      this.E *= Math.pow(tsfnz(this.e, this.lat0, sinph0), this.B);
    } else {
      this.B = 1 / com;
      this.A = this.k0;
      this.E = D = F = 1;
    }

    if (alp || gam) {
      if (alp) {
        gamma0 = Math.asin(Math.sin(alpha_c) / D);
        if (!gam) {
          gamma = alpha_c;
        }
      } else {
        gamma0 = gamma;
        alpha_c = Math.asin(D * Math.sin(gamma0));
      }
      this.lam0 = lamc - Math.asin(0.5 * (F - 1 / F) * Math.tan(gamma0)) / this.B;
    } else {
      H = Math.pow(tsfnz(this.e, phi1, Math.sin(phi1)), this.B);
      L = Math.pow(tsfnz(this.e, phi2, Math.sin(phi2)), this.B);
      F = this.E / H;
      p = (L - H) / (L + H);
      J = this.E * this.E;
      J = (J - L * H) / (J + L * H);
      con = lam1 - lam2;

      if (con < -Math.pi) {
        lam2 -=TWO_PI;
      } else if (con > Math.pi) {
        lam2 += TWO_PI;
      }

      this.lam0 = adjust_lon(0.5 * (lam1 + lam2) - Math.atan(J * Math.tan(0.5 * this.B * (lam1 - lam2)) / p) / this.B);
      gamma0 = Math.atan(2 * Math.sin(this.B * adjust_lon(lam1 - this.lam0)) / (F - 1 / F));
      gamma = alpha_c = Math.asin(D * Math.sin(gamma0));
    }

    this.singam = Math.sin(gamma0);
    this.cosgam = Math.cos(gamma0);
    this.sinrot = Math.sin(gamma);
    this.cosrot = Math.cos(gamma);

    this.rB = 1 / this.B;
    this.ArB = this.A * this.rB;
    this.BrA = 1 / this.ArB;
    this.A * this.B;

    if (this.no_off) {
      this.u_0 = 0;
    } else {
      this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(D * D - 1) / Math.cos(alpha_c)));

      if (this.lat0 < 0) {
        this.u_0 = - this.u_0;
      }
    }

    F = 0.5 * gamma0;
    this.v_pole_n = this.ArB * Math.log(Math.tan(FORTPI - F));
    this.v_pole_s = this.ArB * Math.log(Math.tan(FORTPI + F));
  }


  /* Oblique Mercator forward equations--mapping lat,long to x,y
      ----------------------------------------------------------*/
  function forward$n(p) {
    var coords = {};
    var S, T, U, V, W, temp, u, v;
    p.x = p.x - this.lam0;

    if (Math.abs(Math.abs(p.y) - HALF_PI) > EPSLN) {
      W = this.E / Math.pow(tsfnz(this.e, p.y, Math.sin(p.y)), this.B);

      temp = 1 / W;
      S = 0.5 * (W - temp);
      T = 0.5 * (W + temp);
      V = Math.sin(this.B * p.x);
      U = (S * this.singam - V * this.cosgam) / T;

      if (Math.abs(Math.abs(U) - 1.0) < EPSLN) {
        throw new Error();
      }

      v = 0.5 * this.ArB * Math.log((1 - U)/(1 + U));
      temp = Math.cos(this.B * p.x);

      if (Math.abs(temp) < TOL) {
        u = this.A * p.x;
      } else {
        u = this.ArB * Math.atan2((S * this.cosgam + V * this.singam), temp);
      }
    } else {
      v = p.y > 0 ? this.v_pole_n : this.v_pole_s;
      u = this.ArB * p.y;
    }

    if (this.no_rot) {
      coords.x = u;
      coords.y = v;
    } else {
      u -= this.u_0;
      coords.x = v * this.cosrot + u * this.sinrot;
      coords.y = u * this.cosrot - v * this.sinrot;
    }

    coords.x = (this.a * coords.x + this.x0);
    coords.y = (this.a * coords.y + this.y0);

    return coords;
  }

  function inverse$n(p) {
    var u, v, Qp, Sp, Tp, Vp, Up;
    var coords = {};

    p.x = (p.x - this.x0) * (1.0 / this.a);
    p.y = (p.y - this.y0) * (1.0 / this.a);

    if (this.no_rot) {
      v = p.y;
      u = p.x;
    } else {
      v = p.x * this.cosrot - p.y * this.sinrot;
      u = p.y * this.cosrot + p.x * this.sinrot + this.u_0;
    }

    Qp = Math.exp(-this.BrA * v);
    Sp = 0.5 * (Qp - 1 / Qp);
    Tp = 0.5 * (Qp + 1 / Qp);
    Vp = Math.sin(this.BrA * u);
    Up = (Vp * this.cosgam + Sp * this.singam) / Tp;

    if (Math.abs(Math.abs(Up) - 1) < EPSLN) {
      coords.x = 0;
      coords.y = Up < 0 ? -HALF_PI : HALF_PI;
    } else {
      coords.y = this.E / Math.sqrt((1 + Up) / (1 - Up));
      coords.y = phi2z(this.e, Math.pow(coords.y, 1 / this.B));

      if (coords.y === Infinity) {
        throw new Error();
      }

      coords.x = -this.rB * Math.atan2((Sp * this.cosgam - Vp * this.singam), Math.cos(this.BrA * u));
    }

    coords.x += this.lam0;

    return coords;
  }

  var names$o = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
  var omerc = {
    init: init$o,
    forward: forward$n,
    inverse: inverse$n,
    names: names$o
  };

  function init$n() {

    //double lat0;                    /* the reference latitude               */
    //double long0;                   /* the reference longitude              */
    //double lat1;                    /* first standard parallel              */
    //double lat2;                    /* second standard parallel             */
    //double r_maj;                   /* major axis                           */
    //double r_min;                   /* minor axis                           */
    //double false_east;              /* x offset in meters                   */
    //double false_north;             /* y offset in meters                   */

    //the above value can be set with proj4.defs
    //example: proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    if (!this.lat2) {
      this.lat2 = this.lat1;
    } //if lat2 is not defined
    if (!this.k0) {
      this.k0 = 1;
    }
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    // Standard Parallels cannot be equal and on opposite sides of the equator
    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }

    var temp = this.b / this.a;
    this.e = Math.sqrt(1 - temp * temp);

    var sin1 = Math.sin(this.lat1);
    var cos1 = Math.cos(this.lat1);
    var ms1 = msfnz(this.e, sin1, cos1);
    var ts1 = tsfnz(this.e, this.lat1, sin1);

    var sin2 = Math.sin(this.lat2);
    var cos2 = Math.cos(this.lat2);
    var ms2 = msfnz(this.e, sin2, cos2);
    var ts2 = tsfnz(this.e, this.lat2, sin2);

    var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

    if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
      this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
    }
    else {
      this.ns = sin1;
    }
    if (isNaN(this.ns)) {
      this.ns = sin1;
    }
    this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
    this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
    if (!this.title) {
      this.title = "Lambert Conformal Conic";
    }
  }

  // Lambert Conformal conic forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------
  function forward$m(p) {

    var lon = p.x;
    var lat = p.y;

    // singular cases :
    if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
      lat = sign(lat) * (HALF_PI - 2 * EPSLN);
    }

    var con = Math.abs(Math.abs(lat) - HALF_PI);
    var ts, rh1;
    if (con > EPSLN) {
      ts = tsfnz(this.e, lat, Math.sin(lat));
      rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
    }
    else {
      con = lat * this.ns;
      if (con <= 0) {
        return null;
      }
      rh1 = 0;
    }
    var theta = this.ns * adjust_lon(lon - this.long0);
    p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
    p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

    return p;
  }

  // Lambert Conformal Conic inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  function inverse$m(p) {

    var rh1, con, ts;
    var lat, lon;
    var x = (p.x - this.x0) / this.k0;
    var y = (this.rh - (p.y - this.y0) / this.k0);
    if (this.ns > 0) {
      rh1 = Math.sqrt(x * x + y * y);
      con = 1;
    }
    else {
      rh1 = -Math.sqrt(x * x + y * y);
      con = -1;
    }
    var theta = 0;
    if (rh1 !== 0) {
      theta = Math.atan2((con * x), (con * y));
    }
    if ((rh1 !== 0) || (this.ns > 0)) {
      con = 1 / this.ns;
      ts = Math.pow((rh1 / (this.a * this.f0)), con);
      lat = phi2z(this.e, ts);
      if (lat === -9999) {
        return null;
      }
    }
    else {
      lat = -HALF_PI;
    }
    lon = adjust_lon(theta / this.ns + this.long0);

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$n = [
    "Lambert Tangential Conformal Conic Projection",
    "Lambert_Conformal_Conic",
    "Lambert_Conformal_Conic_1SP",
    "Lambert_Conformal_Conic_2SP",
    "lcc",
    "Lambert Conic Conformal (1SP)",
    "Lambert Conic Conformal (2SP)"
  ];

  var lcc = {
    init: init$n,
    forward: forward$m,
    inverse: inverse$m,
    names: names$n
  };

  function init$m() {
    this.a = 6377397.155;
    this.es = 0.006674372230614;
    this.e = Math.sqrt(this.es);
    if (!this.lat0) {
      this.lat0 = 0.863937979737193;
    }
    if (!this.long0) {
      this.long0 = 0.7417649320975901 - 0.308341501185665;
    }
    /* if scale not set default to 0.9999 */
    if (!this.k0) {
      this.k0 = 0.9999;
    }
    this.s45 = 0.785398163397448; /* 45 */
    this.s90 = 2 * this.s45;
    this.fi0 = this.lat0;
    this.e2 = this.es;
    this.e = Math.sqrt(this.e2);
    this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
    this.uq = 1.04216856380474;
    this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
    this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
    this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
    this.k1 = this.k0;
    this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
    this.s0 = 1.37008346281555;
    this.n = Math.sin(this.s0);
    this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
    this.ad = this.s90 - this.uq;
  }

  /* ellipsoid */
  /* calculate xy from lat/lon */
  /* Constants, identical to inverse transform function */
  function forward$l(p) {
    var gfi, u, deltav, s, d, eps, ro;
    var lon = p.x;
    var lat = p.y;
    var delta_lon = adjust_lon(lon - this.long0);
    /* Transformation */
    gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
    u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
    deltav = -delta_lon * this.alfa;
    s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
    d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
    eps = this.n * d;
    ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
    p.y = ro * Math.cos(eps) / 1;
    p.x = ro * Math.sin(eps) / 1;

    if (!this.czech) {
      p.y *= -1;
      p.x *= -1;
    }
    return (p);
  }

  /* calculate lat/lon from xy */
  function inverse$l(p) {
    var u, deltav, s, d, eps, ro, fi1;
    var ok;

    /* Transformation */
    /* revert y, x*/
    var tmp = p.x;
    p.x = p.y;
    p.y = tmp;
    if (!this.czech) {
      p.y *= -1;
      p.x *= -1;
    }
    ro = Math.sqrt(p.x * p.x + p.y * p.y);
    eps = Math.atan2(p.y, p.x);
    d = eps / Math.sin(this.s0);
    s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
    u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
    deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
    p.x = this.long0 - deltav / this.alfa;
    fi1 = u;
    ok = 0;
    var iter = 0;
    do {
      p.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
      if (Math.abs(fi1 - p.y) < 0.0000000001) {
        ok = 1;
      }
      fi1 = p.y;
      iter += 1;
    } while (ok === 0 && iter < 15);
    if (iter >= 15) {
      return null;
    }

    return (p);
  }

  var names$m = ["Krovak", "krovak"];
  var krovak = {
    init: init$m,
    forward: forward$l,
    inverse: inverse$l,
    names: names$m
  };

  function mlfn(e0, e1, e2, e3, phi) {
    return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
  }

  function e0fn(x) {
    return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
  }

  function e1fn(x) {
    return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
  }

  function e2fn(x) {
    return (0.05859375 * x * x * (1 + 0.75 * x));
  }

  function e3fn(x) {
    return (x * x * x * (35 / 3072));
  }

  function gN(a, e, sinphi) {
    var temp = e * sinphi;
    return a / Math.sqrt(1 - temp * temp);
  }

  function adjust_lat(x) {
    return (Math.abs(x) < HALF_PI) ? x : (x - (sign(x) * Math.PI));
  }

  function imlfn(ml, e0, e1, e2, e3) {
    var phi;
    var dphi;

    phi = ml / e0;
    for (var i = 0; i < 15; i++) {
      dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
      phi += dphi;
      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    }

    //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
    return NaN;
  }

  function init$l() {
    if (!this.sphere) {
      this.e0 = e0fn(this.es);
      this.e1 = e1fn(this.es);
      this.e2 = e2fn(this.es);
      this.e3 = e3fn(this.es);
      this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    }
  }

  /* Cassini forward equations--mapping lat,long to x,y
    -----------------------------------------------------------------------*/
  function forward$k(p) {

    /* Forward equations
        -----------------*/
    var x, y;
    var lam = p.x;
    var phi = p.y;
    lam = adjust_lon(lam - this.long0);

    if (this.sphere) {
      x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
      y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
    }
    else {
      //ellipsoid
      var sinphi = Math.sin(phi);
      var cosphi = Math.cos(phi);
      var nl = gN(this.a, this.e, sinphi);
      var tl = Math.tan(phi) * Math.tan(phi);
      var al = lam * Math.cos(phi);
      var asq = al * al;
      var cl = this.es * cosphi * cosphi / (1 - this.es);
      var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);

      x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
      y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


    }

    p.x = x + this.x0;
    p.y = y + this.y0;
    return p;
  }

  /* Inverse equations
    -----------------*/
  function inverse$k(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x / this.a;
    var y = p.y / this.a;
    var phi, lam;

    if (this.sphere) {
      var dd = y + this.lat0;
      phi = Math.asin(Math.sin(dd) * Math.cos(x));
      lam = Math.atan2(Math.tan(x), Math.cos(dd));
    }
    else {
      /* ellipsoid */
      var ml1 = this.ml0 / this.a + y;
      var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);
      if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
        p.x = this.long0;
        p.y = HALF_PI;
        if (y < 0) {
          p.y *= -1;
        }
        return p;
      }
      var nl1 = gN(this.a, this.e, Math.sin(phi1));

      var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
      var tl1 = Math.pow(Math.tan(phi1), 2);
      var dl = x * this.a / nl1;
      var dsq = dl * dl;
      phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
      lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

    }

    p.x = adjust_lon(lam + this.long0);
    p.y = adjust_lat(phi);
    return p;

  }

  var names$l = ["Cassini", "Cassini_Soldner", "cass"];
  var cass = {
    init: init$l,
    forward: forward$k,
    inverse: inverse$k,
    names: names$l
  };

  function qsfnz(eccent, sinphi) {
    var con;
    if (eccent > 1.0e-7) {
      con = eccent * sinphi;
      return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
    }
    else {
      return (2 * sinphi);
    }
  }

  /*
    reference
      "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
      The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
    */

  var S_POLE = 1;

  var N_POLE = 2;
  var EQUIT = 3;
  var OBLIQ = 4;

  /* Initialize the Lambert Azimuthal Equal Area projection
    ------------------------------------------------------*/
  function init$k() {
    var t = Math.abs(this.lat0);
    if (Math.abs(t - HALF_PI) < EPSLN) {
      this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
    }
    else if (Math.abs(t) < EPSLN) {
      this.mode = this.EQUIT;
    }
    else {
      this.mode = this.OBLIQ;
    }
    if (this.es > 0) {
      var sinphi;

      this.qp = qsfnz(this.e, 1);
      this.mmf = 0.5 / (1 - this.es);
      this.apa = authset(this.es);
      switch (this.mode) {
      case this.N_POLE:
        this.dd = 1;
        break;
      case this.S_POLE:
        this.dd = 1;
        break;
      case this.EQUIT:
        this.rq = Math.sqrt(0.5 * this.qp);
        this.dd = 1 / this.rq;
        this.xmf = 1;
        this.ymf = 0.5 * this.qp;
        break;
      case this.OBLIQ:
        this.rq = Math.sqrt(0.5 * this.qp);
        sinphi = Math.sin(this.lat0);
        this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
        this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
        this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
        this.ymf = (this.xmf = this.rq) / this.dd;
        this.xmf *= this.dd;
        break;
      }
    }
    else {
      if (this.mode === this.OBLIQ) {
        this.sinph0 = Math.sin(this.lat0);
        this.cosph0 = Math.cos(this.lat0);
      }
    }
  }

  /* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
    -----------------------------------------------------------------------*/
  function forward$j(p) {

    /* Forward equations
        -----------------*/
    var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
    var lam = p.x;
    var phi = p.y;

    lam = adjust_lon(lam - this.long0);
    if (this.sphere) {
      sinphi = Math.sin(phi);
      cosphi = Math.cos(phi);
      coslam = Math.cos(lam);
      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
        if (y <= EPSLN) {
          return null;
        }
        y = Math.sqrt(2 / y);
        x = y * cosphi * Math.sin(lam);
        y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
      }
      else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
        if (this.mode === this.N_POLE) {
          coslam = -coslam;
        }
        if (Math.abs(phi + this.lat0) < EPSLN) {
          return null;
        }
        y = FORTPI - phi * 0.5;
        y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
        x = y * Math.sin(lam);
        y *= coslam;
      }
    }
    else {
      sinb = 0;
      cosb = 0;
      b = 0;
      coslam = Math.cos(lam);
      sinlam = Math.sin(lam);
      sinphi = Math.sin(phi);
      q = qsfnz(this.e, sinphi);
      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        sinb = q / this.qp;
        cosb = Math.sqrt(1 - sinb * sinb);
      }
      switch (this.mode) {
      case this.OBLIQ:
        b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
        break;
      case this.EQUIT:
        b = 1 + cosb * coslam;
        break;
      case this.N_POLE:
        b = HALF_PI + phi;
        q = this.qp - q;
        break;
      case this.S_POLE:
        b = phi - HALF_PI;
        q = this.qp + q;
        break;
      }
      if (Math.abs(b) < EPSLN) {
        return null;
      }
      switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        b = Math.sqrt(2 / b);
        if (this.mode === this.OBLIQ) {
          y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
        }
        else {
          y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
        }
        x = this.xmf * b * cosb * sinlam;
        break;
      case this.N_POLE:
      case this.S_POLE:
        if (q >= 0) {
          x = (b = Math.sqrt(q)) * sinlam;
          y = coslam * ((this.mode === this.S_POLE) ? b : -b);
        }
        else {
          x = y = 0;
        }
        break;
      }
    }

    p.x = this.a * x + this.x0;
    p.y = this.a * y + this.y0;
    return p;
  }

  /* Inverse equations
    -----------------*/
  function inverse$j(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x / this.a;
    var y = p.y / this.a;
    var lam, phi, cCe, sCe, q, rho, ab;
    if (this.sphere) {
      var cosz = 0,
        rh, sinz = 0;

      rh = Math.sqrt(x * x + y * y);
      phi = rh * 0.5;
      if (phi > 1) {
        return null;
      }
      phi = 2 * Math.asin(phi);
      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        sinz = Math.sin(phi);
        cosz = Math.cos(phi);
      }
      switch (this.mode) {
      case this.EQUIT:
        phi = (Math.abs(rh) <= EPSLN) ? 0 : Math.asin(y * sinz / rh);
        x *= sinz;
        y = cosz * rh;
        break;
      case this.OBLIQ:
        phi = (Math.abs(rh) <= EPSLN) ? this.lat0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
        x *= sinz * this.cosph0;
        y = (cosz - Math.sin(phi) * this.sinph0) * rh;
        break;
      case this.N_POLE:
        y = -y;
        phi = HALF_PI - phi;
        break;
      case this.S_POLE:
        phi -= HALF_PI;
        break;
      }
      lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
    }
    else {
      ab = 0;
      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        x /= this.dd;
        y *= this.dd;
        rho = Math.sqrt(x * x + y * y);
        if (rho < EPSLN) {
          p.x = this.long0;
          p.y = this.lat0;
          return p;
        }
        sCe = 2 * Math.asin(0.5 * rho / this.rq);
        cCe = Math.cos(sCe);
        x *= (sCe = Math.sin(sCe));
        if (this.mode === this.OBLIQ) {
          ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
          q = this.qp * ab;
          y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
        }
        else {
          ab = y * sCe / rho;
          q = this.qp * ab;
          y = rho * cCe;
        }
      }
      else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
        if (this.mode === this.N_POLE) {
          y = -y;
        }
        q = (x * x + y * y);
        if (!q) {
          p.x = this.long0;
          p.y = this.lat0;
          return p;
        }
        ab = 1 - q / this.qp;
        if (this.mode === this.S_POLE) {
          ab = -ab;
        }
      }
      lam = Math.atan2(x, y);
      phi = authlat(Math.asin(ab), this.apa);
    }

    p.x = adjust_lon(this.long0 + lam);
    p.y = phi;
    return p;
  }

  /* determine latitude from authalic latitude */
  var P00 = 0.33333333333333333333;

  var P01 = 0.17222222222222222222;
  var P02 = 0.10257936507936507936;
  var P10 = 0.06388888888888888888;
  var P11 = 0.06640211640211640211;
  var P20 = 0.01641501294219154443;

  function authset(es) {
    var t;
    var APA = [];
    APA[0] = es * P00;
    t = es * es;
    APA[0] += t * P01;
    APA[1] = t * P10;
    t *= es;
    APA[0] += t * P02;
    APA[1] += t * P11;
    APA[2] = t * P20;
    return APA;
  }

  function authlat(beta, APA) {
    var t = beta + beta;
    return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
  }

  var names$k = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
  var laea = {
    init: init$k,
    forward: forward$j,
    inverse: inverse$j,
    names: names$k,
    S_POLE: S_POLE,
    N_POLE: N_POLE,
    EQUIT: EQUIT,
    OBLIQ: OBLIQ
  };

  function asinz(x) {
    if (Math.abs(x) > 1) {
      x = (x > 1) ? 1 : -1;
    }
    return Math.asin(x);
  }

  function init$j() {

    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }
    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2);
    this.e3 = Math.sqrt(this.es);

    this.sin_po = Math.sin(this.lat1);
    this.cos_po = Math.cos(this.lat1);
    this.t1 = this.sin_po;
    this.con = this.sin_po;
    this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
    this.qs1 = qsfnz(this.e3, this.sin_po);

    this.sin_po = Math.sin(this.lat2);
    this.cos_po = Math.cos(this.lat2);
    this.t2 = this.sin_po;
    this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
    this.qs2 = qsfnz(this.e3, this.sin_po);

    this.sin_po = Math.sin(this.lat0);
    this.cos_po = Math.cos(this.lat0);
    this.t3 = this.sin_po;
    this.qs0 = qsfnz(this.e3, this.sin_po);

    if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
      this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
    }
    else {
      this.ns0 = this.con;
    }
    this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
    this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
  }

  /* Albers Conical Equal Area forward equations--mapping lat,long to x,y
    -------------------------------------------------------------------*/
  function forward$i(p) {

    var lon = p.x;
    var lat = p.y;

    this.sin_phi = Math.sin(lat);
    this.cos_phi = Math.cos(lat);

    var qs = qsfnz(this.e3, this.sin_phi);
    var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
    var theta = this.ns0 * adjust_lon(lon - this.long0);
    var x = rh1 * Math.sin(theta) + this.x0;
    var y = this.rh - rh1 * Math.cos(theta) + this.y0;

    p.x = x;
    p.y = y;
    return p;
  }

  function inverse$i(p) {
    var rh1, qs, con, theta, lon, lat;

    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;
    if (this.ns0 >= 0) {
      rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
      con = 1;
    }
    else {
      rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
      con = -1;
    }
    theta = 0;
    if (rh1 !== 0) {
      theta = Math.atan2(con * p.x, con * p.y);
    }
    con = rh1 * this.ns0 / this.a;
    if (this.sphere) {
      lat = Math.asin((this.c - con * con) / (2 * this.ns0));
    }
    else {
      qs = (this.c - con * con) / this.ns0;
      lat = this.phi1z(this.e3, qs);
    }

    lon = adjust_lon(theta / this.ns0 + this.long0);
    p.x = lon;
    p.y = lat;
    return p;
  }

  /* Function to compute phi1, the latitude for the inverse of the
     Albers Conical Equal-Area projection.
  -------------------------------------------*/
  function phi1z(eccent, qs) {
    var sinphi, cosphi, con, com, dphi;
    var phi = asinz(0.5 * qs);
    if (eccent < EPSLN) {
      return phi;
    }

    var eccnts = eccent * eccent;
    for (var i = 1; i <= 25; i++) {
      sinphi = Math.sin(phi);
      cosphi = Math.cos(phi);
      con = eccent * sinphi;
      com = 1 - con * con;
      dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
      phi = phi + dphi;
      if (Math.abs(dphi) <= 1e-7) {
        return phi;
      }
    }
    return null;
  }

  var names$j = ["Albers_Conic_Equal_Area", "Albers", "aea"];
  var aea = {
    init: init$j,
    forward: forward$i,
    inverse: inverse$i,
    names: names$j,
    phi1z: phi1z
  };

  /*
    reference:
      Wolfram Mathworld "Gnomonic Projection"
      http://mathworld.wolfram.com/GnomonicProjection.html
      Accessed: 12th November 2009
    */
  function init$i() {

    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.sin_p14 = Math.sin(this.lat0);
    this.cos_p14 = Math.cos(this.lat0);
    // Approximation for projecting points to the horizon (infinity)
    this.infinity_dist = 1000 * this.a;
    this.rc = 1;
  }

  /* Gnomonic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/
  function forward$h(p) {
    var sinphi, cosphi; /* sin and cos value        */
    var dlon; /* delta longitude value      */
    var coslon; /* cos of longitude        */
    var ksp; /* scale factor          */
    var g;
    var x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/
    dlon = adjust_lon(lon - this.long0);

    sinphi = Math.sin(lat);
    cosphi = Math.cos(lat);

    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1;
    if ((g > 0) || (Math.abs(g) <= EPSLN)) {
      x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
      y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
    }
    else {

      // Point is in the opposing hemisphere and is unprojectable
      // We still need to return a reasonable point, so we project
      // to infinity, on a bearing
      // equivalent to the northern hemisphere equivalent
      // This is a reasonable approximation for short shapes and lines that
      // straddle the horizon.

      x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
      y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

    }
    p.x = x;
    p.y = y;
    return p;
  }

  function inverse$h(p) {
    var rh; /* Rho */
    var sinc, cosc;
    var c;
    var lon, lat;

    /* Inverse equations
        -----------------*/
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;

    p.x /= this.k0;
    p.y /= this.k0;

    if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
      c = Math.atan2(rh, this.rc);
      sinc = Math.sin(c);
      cosc = Math.cos(c);

      lat = asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
      lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
      lon = adjust_lon(this.long0 + lon);
    }
    else {
      lat = this.phic0;
      lon = 0;
    }

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$i = ["gnom"];
  var gnom = {
    init: init$i,
    forward: forward$h,
    inverse: inverse$h,
    names: names$i
  };

  function iqsfnz(eccent, q) {
    var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
    if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
      if (q < 0) {
        return (-1 * HALF_PI);
      }
      else {
        return HALF_PI;
      }
    }
    //var phi = 0.5* q/(1-eccent*eccent);
    var phi = Math.asin(0.5 * q);
    var dphi;
    var sin_phi;
    var cos_phi;
    var con;
    for (var i = 0; i < 30; i++) {
      sin_phi = Math.sin(phi);
      cos_phi = Math.cos(phi);
      con = eccent * sin_phi;
      dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
      phi += dphi;
      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    }

    //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
    return NaN;
  }

  /*
    reference:
      "Cartographic Projection Procedures for the UNIX Environment-
      A User's Manual" by Gerald I. Evenden,
      USGS Open File Report 90-284and Release 4 Interim Reports (2003)
  */
  function init$h() {
    //no-op
    if (!this.sphere) {
      this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
    }
  }

  /* Cylindrical Equal Area forward equations--mapping lat,long to x,y
      ------------------------------------------------------------*/
  function forward$g(p) {
    var lon = p.x;
    var lat = p.y;
    var x, y;
    /* Forward equations
        -----------------*/
    var dlon = adjust_lon(lon - this.long0);
    if (this.sphere) {
      x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
      y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
    }
    else {
      var qs = qsfnz(this.e, Math.sin(lat));
      x = this.x0 + this.a * this.k0 * dlon;
      y = this.y0 + this.a * qs * 0.5 / this.k0;
    }

    p.x = x;
    p.y = y;
    return p;
  }

  /* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
      ------------------------------------------------------------*/
  function inverse$g(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var lon, lat;

    if (this.sphere) {
      lon = adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
      lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
    }
    else {
      lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
      lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
    }

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$h = ["cea"];
  var cea = {
    init: init$h,
    forward: forward$g,
    inverse: inverse$g,
    names: names$h
  };

  function init$g() {

    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.lat0 = this.lat0 || 0;
    this.long0 = this.long0 || 0;
    this.lat_ts = this.lat_ts || 0;
    this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

    this.rc = Math.cos(this.lat_ts);
  }

  // forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------
  function forward$f(p) {

    var lon = p.x;
    var lat = p.y;

    var dlon = adjust_lon(lon - this.long0);
    var dlat = adjust_lat(lat - this.lat0);
    p.x = this.x0 + (this.a * dlon * this.rc);
    p.y = this.y0 + (this.a * dlat);
    return p;
  }

  // inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  function inverse$f(p) {

    var x = p.x;
    var y = p.y;

    p.x = adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
    p.y = adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
    return p;
  }

  var names$g = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
  var eqc = {
    init: init$g,
    forward: forward$f,
    inverse: inverse$f,
    names: names$g
  };

  var MAX_ITER$1 = 20;

  function init$f() {
    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
    this.e = Math.sqrt(this.es);
    this.e0 = e0fn(this.es);
    this.e1 = e1fn(this.es);
    this.e2 = e2fn(this.es);
    this.e3 = e3fn(this.es);
    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
  }

  /* Polyconic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/
  function forward$e(p) {
    var lon = p.x;
    var lat = p.y;
    var x, y, el;
    var dlon = adjust_lon(lon - this.long0);
    el = dlon * Math.sin(lat);
    if (this.sphere) {
      if (Math.abs(lat) <= EPSLN) {
        x = this.a * dlon;
        y = -1 * this.a * this.lat0;
      }
      else {
        x = this.a * Math.sin(el) / Math.tan(lat);
        y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
      }
    }
    else {
      if (Math.abs(lat) <= EPSLN) {
        x = this.a * dlon;
        y = -1 * this.ml0;
      }
      else {
        var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
        x = nl * Math.sin(el);
        y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
      }

    }
    p.x = x + this.x0;
    p.y = y + this.y0;
    return p;
  }

  /* Inverse equations
    -----------------*/
  function inverse$e(p) {
    var lon, lat, x, y, i;
    var al, bl;
    var phi, dphi;
    x = p.x - this.x0;
    y = p.y - this.y0;

    if (this.sphere) {
      if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
        lon = adjust_lon(x / this.a + this.long0);
        lat = 0;
      }
      else {
        al = this.lat0 + y / this.a;
        bl = x * x / this.a / this.a + al * al;
        phi = al;
        var tanphi;
        for (i = MAX_ITER$1; i; --i) {
          tanphi = Math.tan(phi);
          dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
          phi += dphi;
          if (Math.abs(dphi) <= EPSLN) {
            lat = phi;
            break;
          }
        }
        lon = adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
      }
    }
    else {
      if (Math.abs(y + this.ml0) <= EPSLN) {
        lat = 0;
        lon = adjust_lon(this.long0 + x / this.a);
      }
      else {

        al = (this.ml0 + y) / this.a;
        bl = x * x / this.a / this.a + al * al;
        phi = al;
        var cl, mln, mlnp, ma;
        var con;
        for (i = MAX_ITER$1; i; --i) {
          con = this.e * Math.sin(phi);
          cl = Math.sqrt(1 - con * con) * Math.tan(phi);
          mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
          mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
          ma = mln / this.a;
          dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
          phi -= dphi;
          if (Math.abs(dphi) <= EPSLN) {
            lat = phi;
            break;
          }
        }

        //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
        cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
        lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$f = ["Polyconic", "poly"];
  var poly = {
    init: init$f,
    forward: forward$e,
    inverse: inverse$e,
    names: names$f
  };

  function init$e() {
    this.A = [];
    this.A[1] = 0.6399175073;
    this.A[2] = -0.1358797613;
    this.A[3] = 0.063294409;
    this.A[4] = -0.02526853;
    this.A[5] = 0.0117879;
    this.A[6] = -55161e-7;
    this.A[7] = 0.0026906;
    this.A[8] = -1333e-6;
    this.A[9] = 0.00067;
    this.A[10] = -34e-5;

    this.B_re = [];
    this.B_im = [];
    this.B_re[1] = 0.7557853228;
    this.B_im[1] = 0;
    this.B_re[2] = 0.249204646;
    this.B_im[2] = 0.003371507;
    this.B_re[3] = -1541739e-9;
    this.B_im[3] = 0.041058560;
    this.B_re[4] = -0.10162907;
    this.B_im[4] = 0.01727609;
    this.B_re[5] = -0.26623489;
    this.B_im[5] = -0.36249218;
    this.B_re[6] = -0.6870983;
    this.B_im[6] = -1.1651967;

    this.C_re = [];
    this.C_im = [];
    this.C_re[1] = 1.3231270439;
    this.C_im[1] = 0;
    this.C_re[2] = -0.577245789;
    this.C_im[2] = -7809598e-9;
    this.C_re[3] = 0.508307513;
    this.C_im[3] = -0.112208952;
    this.C_re[4] = -0.15094762;
    this.C_im[4] = 0.18200602;
    this.C_re[5] = 1.01418179;
    this.C_im[5] = 1.64497696;
    this.C_re[6] = 1.9660549;
    this.C_im[6] = 2.5127645;

    this.D = [];
    this.D[1] = 1.5627014243;
    this.D[2] = 0.5185406398;
    this.D[3] = -0.03333098;
    this.D[4] = -0.1052906;
    this.D[5] = -0.0368594;
    this.D[6] = 0.007317;
    this.D[7] = 0.01220;
    this.D[8] = 0.00394;
    this.D[9] = -13e-4;
  }

  /**
      New Zealand Map Grid Forward  - long/lat to x/y
      long/lat in radians
    */
  function forward$d(p) {
    var n;
    var lon = p.x;
    var lat = p.y;

    var delta_lat = lat - this.lat0;
    var delta_lon = lon - this.long0;

    // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
    // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
    var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
    var d_lambda = delta_lon;
    var d_phi_n = 1; // d_phi^0

    var d_psi = 0;
    for (n = 1; n <= 10; n++) {
      d_phi_n = d_phi_n * d_phi;
      d_psi = d_psi + this.A[n] * d_phi_n;
    }

    // 2. Calculate theta
    var th_re = d_psi;
    var th_im = d_lambda;

    // 3. Calculate z
    var th_n_re = 1;
    var th_n_im = 0; // theta^0
    var th_n_re1;
    var th_n_im1;

    var z_re = 0;
    var z_im = 0;
    for (n = 1; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
      z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
    }

    // 4. Calculate easting and northing
    p.x = (z_im * this.a) + this.x0;
    p.y = (z_re * this.a) + this.y0;

    return p;
  }

  /**
      New Zealand Map Grid Inverse  -  x/y to long/lat
    */
  function inverse$d(p) {
    var n;
    var x = p.x;
    var y = p.y;

    var delta_x = x - this.x0;
    var delta_y = y - this.y0;

    // 1. Calculate z
    var z_re = delta_y / this.a;
    var z_im = delta_x / this.a;

    // 2a. Calculate theta - first approximation gives km accuracy
    var z_n_re = 1;
    var z_n_im = 0; // z^0
    var z_n_re1;
    var z_n_im1;

    var th_re = 0;
    var th_im = 0;
    for (n = 1; n <= 6; n++) {
      z_n_re1 = z_n_re * z_re - z_n_im * z_im;
      z_n_im1 = z_n_im * z_re + z_n_re * z_im;
      z_n_re = z_n_re1;
      z_n_im = z_n_im1;
      th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
      th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
    }

    // 2b. Iterate to refine the accuracy of the calculation
    //        0 iterations gives km accuracy
    //        1 iteration gives m accuracy -- good enough for most mapping applications
    //        2 iterations bives mm accuracy
    for (var i = 0; i < this.iterations; i++) {
      var th_n_re = th_re;
      var th_n_im = th_im;
      var th_n_re1;
      var th_n_im1;

      var num_re = z_re;
      var num_im = z_im;
      for (n = 2; n <= 6; n++) {
        th_n_re1 = th_n_re * th_re - th_n_im * th_im;
        th_n_im1 = th_n_im * th_re + th_n_re * th_im;
        th_n_re = th_n_re1;
        th_n_im = th_n_im1;
        num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
        num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
      }

      th_n_re = 1;
      th_n_im = 0;
      var den_re = this.B_re[1];
      var den_im = this.B_im[1];
      for (n = 2; n <= 6; n++) {
        th_n_re1 = th_n_re * th_re - th_n_im * th_im;
        th_n_im1 = th_n_im * th_re + th_n_re * th_im;
        th_n_re = th_n_re1;
        th_n_im = th_n_im1;
        den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
        den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
      }

      // Complex division
      var den2 = den_re * den_re + den_im * den_im;
      th_re = (num_re * den_re + num_im * den_im) / den2;
      th_im = (num_im * den_re - num_re * den_im) / den2;
    }

    // 3. Calculate d_phi              ...                                    // and d_lambda
    var d_psi = th_re;
    var d_lambda = th_im;
    var d_psi_n = 1; // d_psi^0

    var d_phi = 0;
    for (n = 1; n <= 9; n++) {
      d_psi_n = d_psi_n * d_psi;
      d_phi = d_phi + this.D[n] * d_psi_n;
    }

    // 4. Calculate latitude and longitude
    // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
    var lat = this.lat0 + (d_phi * SEC_TO_RAD * 1E5);
    var lon = this.long0 + d_lambda;

    p.x = lon;
    p.y = lat;

    return p;
  }

  var names$e = ["New_Zealand_Map_Grid", "nzmg"];
  var nzmg = {
    init: init$e,
    forward: forward$d,
    inverse: inverse$d,
    names: names$e
  };

  /*
    reference
      "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
      The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
    */


  /* Initialize the Miller Cylindrical projection
    -------------------------------------------*/
  function init$d() {
    //no-op
  }

  /* Miller Cylindrical forward equations--mapping lat,long to x,y
      ------------------------------------------------------------*/
  function forward$c(p) {
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/
    var dlon = adjust_lon(lon - this.long0);
    var x = this.x0 + this.a * dlon;
    var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

    p.x = x;
    p.y = y;
    return p;
  }

  /* Miller Cylindrical inverse equations--mapping x,y to lat/long
      ------------------------------------------------------------*/
  function inverse$c(p) {
    p.x -= this.x0;
    p.y -= this.y0;

    var lon = adjust_lon(this.long0 + p.x / this.a);
    var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$d = ["Miller_Cylindrical", "mill"];
  var mill = {
    init: init$d,
    forward: forward$c,
    inverse: inverse$c,
    names: names$d
  };

  var MAX_ITER = 20;


  function init$c() {
    /* Place parameters in static storage for common use
      -------------------------------------------------*/


    if (!this.sphere) {
      this.en = pj_enfn(this.es);
    }
    else {
      this.n = 1;
      this.m = 0;
      this.es = 0;
      this.C_y = Math.sqrt((this.m + 1) / this.n);
      this.C_x = this.C_y / (this.m + 1);
    }

  }

  /* Sinusoidal forward equations--mapping lat,long to x,y
    -----------------------------------------------------*/
  function forward$b(p) {
    var x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
      -----------------*/
    lon = adjust_lon(lon - this.long0);

    if (this.sphere) {
      if (!this.m) {
        lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
      }
      else {
        var k = this.n * Math.sin(lat);
        for (var i = MAX_ITER; i; --i) {
          var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
          lat -= V;
          if (Math.abs(V) < EPSLN) {
            break;
          }
        }
      }
      x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
      y = this.a * this.C_y * lat;

    }
    else {

      var s = Math.sin(lat);
      var c = Math.cos(lat);
      y = this.a * pj_mlfn(lat, s, c, this.en);
      x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
    }

    p.x = x;
    p.y = y;
    return p;
  }

  function inverse$b(p) {
    var lat, temp, lon, s;

    p.x -= this.x0;
    lon = p.x / this.a;
    p.y -= this.y0;
    lat = p.y / this.a;

    if (this.sphere) {
      lat /= this.C_y;
      lon = lon / (this.C_x * (this.m + Math.cos(lat)));
      if (this.m) {
        lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
      }
      else if (this.n !== 1) {
        lat = asinz(Math.sin(lat) / this.n);
      }
      lon = adjust_lon(lon + this.long0);
      lat = adjust_lat(lat);
    }
    else {
      lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
      s = Math.abs(lat);
      if (s < HALF_PI) {
        s = Math.sin(lat);
        temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
        //temp = this.long0 + p.x / (this.a * Math.cos(lat));
        lon = adjust_lon(temp);
      }
      else if ((s - EPSLN) < HALF_PI) {
        lon = this.long0;
      }
    }
    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$c = ["Sinusoidal", "sinu"];
  var sinu = {
    init: init$c,
    forward: forward$b,
    inverse: inverse$b,
    names: names$c
  };

  function init$b() {}
  /* Mollweide forward equations--mapping lat,long to x,y
      ----------------------------------------------------*/
  function forward$a(p) {

    /* Forward equations
        -----------------*/
    var lon = p.x;
    var lat = p.y;

    var delta_lon = adjust_lon(lon - this.long0);
    var theta = lat;
    var con = Math.PI * Math.sin(lat);

    /* Iterate using the Newton-Raphson method to find theta
        -----------------------------------------------------*/
    while (true) {
      var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
      theta += delta_theta;
      if (Math.abs(delta_theta) < EPSLN) {
        break;
      }
    }
    theta /= 2;

    /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
         this is done here because of precision problems with "cos(theta)"
         --------------------------------------------------------------------------*/
    if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
      delta_lon = 0;
    }
    var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
    var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

    p.x = x;
    p.y = y;
    return p;
  }

  function inverse$a(p) {
    var theta;
    var arg;

    /* Inverse equations
        -----------------*/
    p.x -= this.x0;
    p.y -= this.y0;
    arg = p.y / (1.4142135623731 * this.a);

    /* Because of division by zero problems, 'arg' can not be 1.  Therefore
         a number very close to one is used instead.
         -------------------------------------------------------------------*/
    if (Math.abs(arg) > 0.999999999999) {
      arg = 0.999999999999;
    }
    theta = Math.asin(arg);
    var lon = adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
    if (lon < (-Math.PI)) {
      lon = -Math.PI;
    }
    if (lon > Math.PI) {
      lon = Math.PI;
    }
    arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
    if (Math.abs(arg) > 1) {
      arg = 1;
    }
    var lat = Math.asin(arg);

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$b = ["Mollweide", "moll"];
  var moll = {
    init: init$b,
    forward: forward$a,
    inverse: inverse$a,
    names: names$b
  };

  function init$a() {

    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    // Standard Parallels cannot be equal and on opposite sides of the equator
    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }
    this.lat2 = this.lat2 || this.lat1;
    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2);
    this.e = Math.sqrt(this.es);
    this.e0 = e0fn(this.es);
    this.e1 = e1fn(this.es);
    this.e2 = e2fn(this.es);
    this.e3 = e3fn(this.es);

    this.sinphi = Math.sin(this.lat1);
    this.cosphi = Math.cos(this.lat1);

    this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
    this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

    if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
      this.ns = this.sinphi;
    }
    else {
      this.sinphi = Math.sin(this.lat2);
      this.cosphi = Math.cos(this.lat2);
      this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
      this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
      this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
    }
    this.g = this.ml1 + this.ms1 / this.ns;
    this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    this.rh = this.a * (this.g - this.ml0);
  }

  /* Equidistant Conic forward equations--mapping lat,long to x,y
    -----------------------------------------------------------*/
  function forward$9(p) {
    var lon = p.x;
    var lat = p.y;
    var rh1;

    /* Forward equations
        -----------------*/
    if (this.sphere) {
      rh1 = this.a * (this.g - lat);
    }
    else {
      var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
      rh1 = this.a * (this.g - ml);
    }
    var theta = this.ns * adjust_lon(lon - this.long0);
    var x = this.x0 + rh1 * Math.sin(theta);
    var y = this.y0 + this.rh - rh1 * Math.cos(theta);
    p.x = x;
    p.y = y;
    return p;
  }

  /* Inverse equations
    -----------------*/
  function inverse$9(p) {
    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;
    var con, rh1, lat, lon;
    if (this.ns >= 0) {
      rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
      con = 1;
    }
    else {
      rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
      con = -1;
    }
    var theta = 0;
    if (rh1 !== 0) {
      theta = Math.atan2(con * p.x, con * p.y);
    }

    if (this.sphere) {
      lon = adjust_lon(this.long0 + theta / this.ns);
      lat = adjust_lat(this.g - rh1 / this.a);
      p.x = lon;
      p.y = lat;
      return p;
    }
    else {
      var ml = this.g - rh1 / this.a;
      lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
      lon = adjust_lon(this.long0 + theta / this.ns);
      p.x = lon;
      p.y = lat;
      return p;
    }

  }

  var names$a = ["Equidistant_Conic", "eqdc"];
  var eqdc = {
    init: init$a,
    forward: forward$9,
    inverse: inverse$9,
    names: names$a
  };

  /* Initialize the Van Der Grinten projection
    ----------------------------------------*/
  function init$9() {
    //this.R = 6370997; //Radius of earth
    this.R = this.a;
  }

  function forward$8(p) {

    var lon = p.x;
    var lat = p.y;

    /* Forward equations
      -----------------*/
    var dlon = adjust_lon(lon - this.long0);
    var x, y;

    if (Math.abs(lat) <= EPSLN) {
      x = this.x0 + this.R * dlon;
      y = this.y0;
    }
    var theta = asinz(2 * Math.abs(lat / Math.PI));
    if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN)) {
      x = this.x0;
      if (lat >= 0) {
        y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
      }
      else {
        y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
      }
      //  return(OK);
    }
    var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
    var asq = al * al;
    var sinth = Math.sin(theta);
    var costh = Math.cos(theta);

    var g = costh / (sinth + costh - 1);
    var gsq = g * g;
    var m = g * (2 / sinth - 1);
    var msq = m * m;
    var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
    if (dlon < 0) {
      con = -con;
    }
    x = this.x0 + con;
    //con = Math.abs(con / (Math.PI * this.R));
    var q = asq + g;
    con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
    if (lat >= 0) {
      //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
      y = this.y0 + con;
    }
    else {
      //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
      y = this.y0 - con;
    }
    p.x = x;
    p.y = y;
    return p;
  }

  /* Van Der Grinten inverse equations--mapping x,y to lat/long
    ---------------------------------------------------------*/
  function inverse$8(p) {
    var lon, lat;
    var xx, yy, xys, c1, c2, c3;
    var a1;
    var m1;
    var con;
    var th1;
    var d;

    /* inverse equations
      -----------------*/
    p.x -= this.x0;
    p.y -= this.y0;
    con = Math.PI * this.R;
    xx = p.x / con;
    yy = p.y / con;
    xys = xx * xx + yy * yy;
    c1 = -Math.abs(yy) * (1 + xys);
    c2 = c1 - 2 * yy * yy + xx * xx;
    c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
    d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
    a1 = (c1 - c2 * c2 / 3 / c3) / c3;
    m1 = 2 * Math.sqrt(-a1 / 3);
    con = ((3 * d) / a1) / m1;
    if (Math.abs(con) > 1) {
      if (con >= 0) {
        con = 1;
      }
      else {
        con = -1;
      }
    }
    th1 = Math.acos(con) / 3;
    if (p.y >= 0) {
      lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
    }
    else {
      lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
    }

    if (Math.abs(xx) < EPSLN) {
      lon = this.long0;
    }
    else {
      lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
    }

    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$9 = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
  var vandg = {
    init: init$9,
    forward: forward$8,
    inverse: inverse$8,
    names: names$9
  };

  function init$8() {
    this.sin_p12 = Math.sin(this.lat0);
    this.cos_p12 = Math.cos(this.lat0);
  }

  function forward$7(p) {
    var lon = p.x;
    var lat = p.y;
    var sinphi = Math.sin(p.y);
    var cosphi = Math.cos(p.y);
    var dlon = adjust_lon(lon - this.long0);
    var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
    if (this.sphere) {
      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North Pole case
        p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
        p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
        return p;
      }
      else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South Pole case
        p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
        p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
        return p;
      }
      else {
        //default case
        cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
        c = Math.acos(cos_c);
        kp = c ? c / Math.sin(c) : 1;
        p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
        p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
        return p;
      }
    }
    else {
      e0 = e0fn(this.es);
      e1 = e1fn(this.es);
      e2 = e2fn(this.es);
      e3 = e3fn(this.es);
      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North Pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        Ml = this.a * mlfn(e0, e1, e2, e3, lat);
        p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
        p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
        return p;
      }
      else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South Pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        Ml = this.a * mlfn(e0, e1, e2, e3, lat);
        p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
        p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
        return p;
      }
      else {
        //Default case
        tanphi = sinphi / cosphi;
        Nl1 = gN(this.a, this.e, this.sin_p12);
        Nl = gN(this.a, this.e, sinphi);
        psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
        Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
        if (Az === 0) {
          s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
        }
        else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
          s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
        }
        else {
          s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
        }
        G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
        H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
        GH = G * H;
        Hs = H * H;
        s2 = s * s;
        s3 = s2 * s;
        s4 = s3 * s;
        s5 = s4 * s;
        c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
        p.x = this.x0 + c * Math.sin(Az);
        p.y = this.y0 + c * Math.cos(Az);
        return p;
      }
    }


  }

  function inverse$7(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F, sinpsi;
    if (this.sphere) {
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      if (rh > (2 * HALF_PI * this.a)) {
        return;
      }
      z = rh / this.a;

      sinz = Math.sin(z);
      cosz = Math.cos(z);

      lon = this.long0;
      if (Math.abs(rh) <= EPSLN) {
        lat = this.lat0;
      }
      else {
        lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
        con = Math.abs(this.lat0) - HALF_PI;
        if (Math.abs(con) <= EPSLN) {
          if (this.lat0 >= 0) {
            lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
          }
          else {
            lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
          }
        }
        else {
          /*con = cosz - this.sin_p12 * Math.sin(lat);
          if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
            //no-op, just keep the lon value as is
          } else {
            var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
            lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
          }*/
          lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
        }
      }

      p.x = lon;
      p.y = lat;
      return p;
    }
    else {
      e0 = e0fn(this.es);
      e1 = e1fn(this.es);
      e2 = e2fn(this.es);
      e3 = e3fn(this.es);
      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        M = Mlp - rh;
        lat = imlfn(M / this.a, e0, e1, e2, e3);
        lon = adjust_lon(this.long0 + Math.atan2(p.x, -1 * p.y));
        p.x = lon;
        p.y = lat;
        return p;
      }
      else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        M = rh - Mlp;

        lat = imlfn(M / this.a, e0, e1, e2, e3);
        lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
        p.x = lon;
        p.y = lat;
        return p;
      }
      else {
        //default case
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        Az = Math.atan2(p.x, p.y);
        N1 = gN(this.a, this.e, this.sin_p12);
        cosAz = Math.cos(Az);
        tmp = this.e * this.cos_p12 * cosAz;
        A = -tmp * tmp / (1 - this.es);
        B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
        D = rh / N1;
        Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
        F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
        psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
        lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
        sinpsi = Math.sin(psi);
        lat = Math.atan2((sinpsi - this.es * F * this.sin_p12) * Math.tan(psi), sinpsi * (1 - this.es));
        p.x = lon;
        p.y = lat;
        return p;
      }
    }

  }

  var names$8 = ["Azimuthal_Equidistant", "aeqd"];
  var aeqd = {
    init: init$8,
    forward: forward$7,
    inverse: inverse$7,
    names: names$8
  };

  function init$7() {
    //double temp;      /* temporary variable    */

    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.sin_p14 = Math.sin(this.lat0);
    this.cos_p14 = Math.cos(this.lat0);
  }

  /* Orthographic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/
  function forward$6(p) {
    var sinphi, cosphi; /* sin and cos value        */
    var dlon; /* delta longitude value      */
    var coslon; /* cos of longitude        */
    var ksp; /* scale factor          */
    var g, x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/
    dlon = adjust_lon(lon - this.long0);

    sinphi = Math.sin(lat);
    cosphi = Math.cos(lat);

    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1;
    if ((g > 0) || (Math.abs(g) <= EPSLN)) {
      x = this.a * ksp * cosphi * Math.sin(dlon);
      y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
    }
    p.x = x;
    p.y = y;
    return p;
  }

  function inverse$6(p) {
    var rh; /* height above ellipsoid      */
    var z; /* angle          */
    var sinz, cosz; /* sin of z and cos of z      */
    var con;
    var lon, lat;
    /* Inverse equations
        -----------------*/
    p.x -= this.x0;
    p.y -= this.y0;
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    z = asinz(rh / this.a);

    sinz = Math.sin(z);
    cosz = Math.cos(z);

    lon = this.long0;
    if (Math.abs(rh) <= EPSLN) {
      lat = this.lat0;
      p.x = lon;
      p.y = lat;
      return p;
    }
    lat = asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
    con = Math.abs(this.lat0) - HALF_PI;
    if (Math.abs(con) <= EPSLN) {
      if (this.lat0 >= 0) {
        lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
      }
      else {
        lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
      }
      p.x = lon;
      p.y = lat;
      return p;
    }
    lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
    p.x = lon;
    p.y = lat;
    return p;
  }

  var names$7 = ["ortho"];
  var ortho = {
    init: init$7,
    forward: forward$6,
    inverse: inverse$6,
    names: names$7
  };

  // QSC projection rewritten from the original PROJ4
  // https://github.com/OSGeo/proj.4/blob/master/src/PJ_qsc.c


  /* constants */
  var FACE_ENUM = {
      FRONT: 1,
      RIGHT: 2,
      BACK: 3,
      LEFT: 4,
      TOP: 5,
      BOTTOM: 6
  };

  var AREA_ENUM = {
      AREA_0: 1,
      AREA_1: 2,
      AREA_2: 3,
      AREA_3: 4
  };

  function init$6() {

    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.lat0 = this.lat0 || 0;
    this.long0 = this.long0 || 0;
    this.lat_ts = this.lat_ts || 0;
    this.title = this.title || "Quadrilateralized Spherical Cube";

    /* Determine the cube face from the center of projection. */
    if (this.lat0 >= HALF_PI - FORTPI / 2.0) {
      this.face = FACE_ENUM.TOP;
    } else if (this.lat0 <= -(HALF_PI - FORTPI / 2.0)) {
      this.face = FACE_ENUM.BOTTOM;
    } else if (Math.abs(this.long0) <= FORTPI) {
      this.face = FACE_ENUM.FRONT;
    } else if (Math.abs(this.long0) <= HALF_PI + FORTPI) {
      this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
    } else {
      this.face = FACE_ENUM.BACK;
    }

    /* Fill in useful values for the ellipsoid <-> sphere shift
     * described in [LK12]. */
    if (this.es !== 0) {
      this.one_minus_f = 1 - (this.a - this.b) / this.a;
      this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
    }
  }

  // QSC forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------
  function forward$5(p) {
    var xy = {x: 0, y: 0};
    var lat, lon;
    var theta, phi;
    var t, mu;
    /* nu; */
    var area = {value: 0};

    // move lon according to projection's lon
    p.x -= this.long0;

    /* Convert the geodetic latitude to a geocentric latitude.
     * This corresponds to the shift from the ellipsoid to the sphere
     * described in [LK12]. */
    if (this.es !== 0) {//if (P->es != 0) {
      lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
    } else {
      lat = p.y;
    }

    /* Convert the input lat, lon into theta, phi as used by QSC.
     * This depends on the cube face and the area on it.
     * For the top and bottom face, we can compute theta and phi
     * directly from phi, lam. For the other faces, we must use
     * unit sphere cartesian coordinates as an intermediate step. */
    lon = p.x; //lon = lp.lam;
    if (this.face === FACE_ENUM.TOP) {
      phi = HALF_PI - lat;
      if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_0;
        theta = lon - HALF_PI;
      } else if (lon > HALF_PI + FORTPI || lon <= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_1;
        theta = (lon > 0.0 ? lon - SPI : lon + SPI);
      } else if (lon > -(HALF_PI + FORTPI) && lon <= -FORTPI) {
        area.value = AREA_ENUM.AREA_2;
        theta = lon + HALF_PI;
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta = lon;
      }
    } else if (this.face === FACE_ENUM.BOTTOM) {
      phi = HALF_PI + lat;
      if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_0;
        theta = -lon + HALF_PI;
      } else if (lon < FORTPI && lon >= -FORTPI) {
        area.value = AREA_ENUM.AREA_1;
        theta = -lon;
      } else if (lon < -FORTPI && lon >= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_2;
        theta = -lon - HALF_PI;
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta = (lon > 0.0 ? -lon + SPI : -lon - SPI);
      }
    } else {
      var q, r, s;
      var sinlat, coslat;
      var sinlon, coslon;

      if (this.face === FACE_ENUM.RIGHT) {
        lon = qsc_shift_lon_origin(lon, +HALF_PI);
      } else if (this.face === FACE_ENUM.BACK) {
        lon = qsc_shift_lon_origin(lon, +SPI);
      } else if (this.face === FACE_ENUM.LEFT) {
        lon = qsc_shift_lon_origin(lon, -HALF_PI);
      }
      sinlat = Math.sin(lat);
      coslat = Math.cos(lat);
      sinlon = Math.sin(lon);
      coslon = Math.cos(lon);
      q = coslat * coslon;
      r = coslat * sinlon;
      s = sinlat;

      if (this.face === FACE_ENUM.FRONT) {
        phi = Math.acos(q);
        theta = qsc_fwd_equat_face_theta(phi, s, r, area);
      } else if (this.face === FACE_ENUM.RIGHT) {
        phi = Math.acos(r);
        theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
      } else if (this.face === FACE_ENUM.BACK) {
        phi = Math.acos(-q);
        theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
      } else if (this.face === FACE_ENUM.LEFT) {
        phi = Math.acos(-r);
        theta = qsc_fwd_equat_face_theta(phi, s, q, area);
      } else {
        /* Impossible */
        phi = theta = 0;
        area.value = AREA_ENUM.AREA_0;
      }
    }

    /* Compute mu and nu for the area of definition.
     * For mu, see Eq. (3-21) in [OL76], but note the typos:
     * compare with Eq. (3-14). For nu, see Eq. (3-38). */
    mu = Math.atan((12 / SPI) * (theta + Math.acos(Math.sin(theta) * Math.cos(FORTPI)) - HALF_PI));
    t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

    /* Apply the result to the real area. */
    if (area.value === AREA_ENUM.AREA_1) {
      mu += HALF_PI;
    } else if (area.value === AREA_ENUM.AREA_2) {
      mu += SPI;
    } else if (area.value === AREA_ENUM.AREA_3) {
      mu += 1.5 * SPI;
    }

    /* Now compute x, y from mu and nu */
    xy.x = t * Math.cos(mu);
    xy.y = t * Math.sin(mu);
    xy.x = xy.x * this.a + this.x0;
    xy.y = xy.y * this.a + this.y0;

    p.x = xy.x;
    p.y = xy.y;
    return p;
  }

  // QSC inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------
  function inverse$5(p) {
    var lp = {lam: 0, phi: 0};
    var mu, nu, cosmu, tannu;
    var tantheta, theta, cosphi, phi;
    var t;
    var area = {value: 0};

    /* de-offset */
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;

    /* Convert the input x, y to the mu and nu angles as used by QSC.
     * This depends on the area of the cube face. */
    nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
    mu = Math.atan2(p.y, p.x);
    if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
      area.value = AREA_ENUM.AREA_0;
    } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
      area.value = AREA_ENUM.AREA_1;
      mu -= HALF_PI;
    } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
      area.value = AREA_ENUM.AREA_2;
      mu = (mu < 0.0 ? mu + SPI : mu - SPI);
    } else {
      area.value = AREA_ENUM.AREA_3;
      mu += HALF_PI;
    }

    /* Compute phi and theta for the area of definition.
     * The inverse projection is not described in the original paper, but some
     * good hints can be found here (as of 2011-12-14):
     * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
     * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
    t = (SPI / 12) * Math.tan(mu);
    tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
    theta = Math.atan(tantheta);
    cosmu = Math.cos(mu);
    tannu = Math.tan(nu);
    cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
    if (cosphi < -1) {
      cosphi = -1;
    } else if (cosphi > 1) {
      cosphi = 1;
    }

    /* Apply the result to the real area on the cube face.
     * For the top and bottom face, we can compute phi and lam directly.
     * For the other faces, we must use unit sphere cartesian coordinates
     * as an intermediate step. */
    if (this.face === FACE_ENUM.TOP) {
      phi = Math.acos(cosphi);
      lp.phi = HALF_PI - phi;
      if (area.value === AREA_ENUM.AREA_0) {
        lp.lam = theta + HALF_PI;
      } else if (area.value === AREA_ENUM.AREA_1) {
        lp.lam = (theta < 0.0 ? theta + SPI : theta - SPI);
      } else if (area.value === AREA_ENUM.AREA_2) {
        lp.lam = theta - HALF_PI;
      } else /* area.value == AREA_ENUM.AREA_3 */ {
        lp.lam = theta;
      }
    } else if (this.face === FACE_ENUM.BOTTOM) {
      phi = Math.acos(cosphi);
      lp.phi = phi - HALF_PI;
      if (area.value === AREA_ENUM.AREA_0) {
        lp.lam = -theta + HALF_PI;
      } else if (area.value === AREA_ENUM.AREA_1) {
        lp.lam = -theta;
      } else if (area.value === AREA_ENUM.AREA_2) {
        lp.lam = -theta - HALF_PI;
      } else /* area.value == AREA_ENUM.AREA_3 */ {
        lp.lam = (theta < 0.0 ? -theta - SPI : -theta + SPI);
      }
    } else {
      /* Compute phi and lam via cartesian unit sphere coordinates. */
      var q, r, s;
      q = cosphi;
      t = q * q;
      if (t >= 1) {
        s = 0;
      } else {
        s = Math.sqrt(1 - t) * Math.sin(theta);
      }
      t += s * s;
      if (t >= 1) {
        r = 0;
      } else {
        r = Math.sqrt(1 - t);
      }
      /* Rotate q,r,s into the correct area. */
      if (area.value === AREA_ENUM.AREA_1) {
        t = r;
        r = -s;
        s = t;
      } else if (area.value === AREA_ENUM.AREA_2) {
        r = -r;
        s = -s;
      } else if (area.value === AREA_ENUM.AREA_3) {
        t = r;
        r = s;
        s = -t;
      }
      /* Rotate q,r,s into the correct cube face. */
      if (this.face === FACE_ENUM.RIGHT) {
        t = q;
        q = -r;
        r = t;
      } else if (this.face === FACE_ENUM.BACK) {
        q = -q;
        r = -r;
      } else if (this.face === FACE_ENUM.LEFT) {
        t = q;
        q = r;
        r = -t;
      }
      /* Now compute phi and lam from the unit sphere coordinates. */
      lp.phi = Math.acos(-s) - HALF_PI;
      lp.lam = Math.atan2(r, q);
      if (this.face === FACE_ENUM.RIGHT) {
        lp.lam = qsc_shift_lon_origin(lp.lam, -HALF_PI);
      } else if (this.face === FACE_ENUM.BACK) {
        lp.lam = qsc_shift_lon_origin(lp.lam, -SPI);
      } else if (this.face === FACE_ENUM.LEFT) {
        lp.lam = qsc_shift_lon_origin(lp.lam, +HALF_PI);
      }
    }

    /* Apply the shift from the sphere to the ellipsoid as described
     * in [LK12]. */
    if (this.es !== 0) {
      var invert_sign;
      var tanphi, xa;
      invert_sign = (lp.phi < 0 ? 1 : 0);
      tanphi = Math.tan(lp.phi);
      xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
      lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
      if (invert_sign) {
        lp.phi = -lp.phi;
      }
    }

    lp.lam += this.long0;
    p.x = lp.lam;
    p.y = lp.phi;
    return p;
  }

  /* Helper function for forward projection: compute the theta angle
   * and determine the area number. */
  function qsc_fwd_equat_face_theta(phi, y, x, area) {
    var theta;
    if (phi < EPSLN) {
      area.value = AREA_ENUM.AREA_0;
      theta = 0.0;
    } else {
      theta = Math.atan2(y, x);
      if (Math.abs(theta) <= FORTPI) {
        area.value = AREA_ENUM.AREA_0;
      } else if (theta > FORTPI && theta <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_1;
        theta -= HALF_PI;
      } else if (theta > HALF_PI + FORTPI || theta <= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_2;
        theta = (theta >= 0.0 ? theta - SPI : theta + SPI);
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta += HALF_PI;
      }
    }
    return theta;
  }

  /* Helper function: shift the longitude. */
  function qsc_shift_lon_origin(lon, offset) {
    var slon = lon + offset;
    if (slon < -SPI) {
      slon += TWO_PI;
    } else if (slon > +SPI) {
      slon -= TWO_PI;
    }
    return slon;
  }

  var names$6 = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
  var qsc = {
    init: init$6,
    forward: forward$5,
    inverse: inverse$5,
    names: names$6
  };

  // Robinson projection
  // Based on https://github.com/OSGeo/proj.4/blob/master/src/PJ_robin.c
  // Polynomial coeficients from http://article.gmane.org/gmane.comp.gis.proj-4.devel/6039


  var COEFS_X = [
      [1.0000, 2.2199e-17, -715515e-10, 3.1103e-06],
      [0.9986, -482243e-9, -24897e-9, -13309e-10],
      [0.9954, -83103e-8, -448605e-10, -9.86701e-7],
      [0.9900, -135364e-8, -59661e-9, 3.6777e-06],
      [0.9822, -167442e-8, -449547e-11, -572411e-11],
      [0.9730, -214868e-8, -903571e-10, 1.8736e-08],
      [0.9600, -305085e-8, -900761e-10, 1.64917e-06],
      [0.9427, -382792e-8, -653386e-10, -26154e-10],
      [0.9216, -467746e-8, -10457e-8, 4.81243e-06],
      [0.8962, -536223e-8, -323831e-10, -543432e-11],
      [0.8679, -609363e-8, -113898e-9, 3.32484e-06],
      [0.8350, -698325e-8, -640253e-10, 9.34959e-07],
      [0.7986, -755338e-8, -500009e-10, 9.35324e-07],
      [0.7597, -798324e-8, -35971e-9, -227626e-11],
      [0.7186, -851367e-8, -701149e-10, -86303e-10],
      [0.6732, -986209e-8, -199569e-9, 1.91974e-05],
      [0.6213, -0.010418, 8.83923e-05, 6.24051e-06],
      [0.5722, -906601e-8, 0.000182, 6.24051e-06],
      [0.5322, -677797e-8, 0.000275608, 6.24051e-06]
  ];

  var COEFS_Y = [
      [-520417e-23, 0.0124, 1.21431e-18, -845284e-16],
      [0.0620, 0.0124, -1.26793e-9, 4.22642e-10],
      [0.1240, 0.0124, 5.07171e-09, -1.60604e-9],
      [0.1860, 0.0123999, -1.90189e-8, 6.00152e-09],
      [0.2480, 0.0124002, 7.10039e-08, -2.24e-8],
      [0.3100, 0.0123992, -2.64997e-7, 8.35986e-08],
      [0.3720, 0.0124029, 9.88983e-07, -3.11994e-7],
      [0.4340, 0.0123893, -369093e-11, -4.35621e-7],
      [0.4958, 0.0123198, -102252e-10, -3.45523e-7],
      [0.5571, 0.0121916, -154081e-10, -5.82288e-7],
      [0.6176, 0.0119938, -241424e-10, -5.25327e-7],
      [0.6769, 0.011713, -320223e-10, -5.16405e-7],
      [0.7346, 0.0113541, -397684e-10, -6.09052e-7],
      [0.7903, 0.0109107, -489042e-10, -104739e-11],
      [0.8435, 0.0103431, -64615e-9, -1.40374e-9],
      [0.8936, 0.00969686, -64636e-9, -8547e-9],
      [0.9394, 0.00840947, -192841e-9, -42106e-10],
      [0.9761, 0.00616527, -256e-6, -42106e-10],
      [1.0000, 0.00328947, -319159e-9, -42106e-10]
  ];

  var FXC = 0.8487;
  var FYC = 1.3523;
  var C1 = R2D/5; // rad to 5-degree interval
  var RC1 = 1/C1;
  var NODES = 18;

  var poly3_val = function(coefs, x) {
      return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
  };

  var poly3_der = function(coefs, x) {
      return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
  };

  function newton_rapshon(f_df, start, max_err, iters) {
      var x = start;
      for (; iters; --iters) {
          var upd = f_df(x);
          x -= upd;
          if (Math.abs(upd) < max_err) {
              break;
          }
      }
      return x;
  }

  function init$5() {
      this.x0 = this.x0 || 0;
      this.y0 = this.y0 || 0;
      this.long0 = this.long0 || 0;
      this.es = 0;
      this.title = this.title || "Robinson";
  }

  function forward$4(ll) {
      var lon = adjust_lon(ll.x - this.long0);

      var dphi = Math.abs(ll.y);
      var i = Math.floor(dphi * C1);
      if (i < 0) {
          i = 0;
      } else if (i >= NODES) {
          i = NODES - 1;
      }
      dphi = R2D * (dphi - RC1 * i);
      var xy = {
          x: poly3_val(COEFS_X[i], dphi) * lon,
          y: poly3_val(COEFS_Y[i], dphi)
      };
      if (ll.y < 0) {
          xy.y = -xy.y;
      }

      xy.x = xy.x * this.a * FXC + this.x0;
      xy.y = xy.y * this.a * FYC + this.y0;
      return xy;
  }

  function inverse$4(xy) {
      var ll = {
          x: (xy.x - this.x0) / (this.a * FXC),
          y: Math.abs(xy.y - this.y0) / (this.a * FYC)
      };

      if (ll.y >= 1) { // pathologic case
          ll.x /= COEFS_X[NODES][0];
          ll.y = xy.y < 0 ? -HALF_PI : HALF_PI;
      } else {
          // find table interval
          var i = Math.floor(ll.y * NODES);
          if (i < 0) {
              i = 0;
          } else if (i >= NODES) {
              i = NODES - 1;
          }
          for (;;) {
              if (COEFS_Y[i][0] > ll.y) {
                  --i;
              } else if (COEFS_Y[i+1][0] <= ll.y) {
                  ++i;
              } else {
                  break;
              }
          }
          // linear interpolation in 5 degree interval
          var coefs = COEFS_Y[i];
          var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i+1][0] - coefs[0]);
          // find t so that poly3_val(coefs, t) = ll.y
          t = newton_rapshon(function(x) {
              return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
          }, t, EPSLN, 100);

          ll.x /= poly3_val(COEFS_X[i], t);
          ll.y = (5 * i + t) * D2R$1;
          if (xy.y < 0) {
              ll.y = -ll.y;
          }
      }

      ll.x = adjust_lon(ll.x + this.long0);
      return ll;
  }

  var names$5 = ["Robinson", "robin"];
  var robin = {
    init: init$5,
    forward: forward$4,
    inverse: inverse$4,
    names: names$5
  };

  function init$4() {
      this.name = 'geocent';

  }

  function forward$3(p) {
      var point = geodeticToGeocentric(p, this.es, this.a);
      return point;
  }

  function inverse$3(p) {
      var point = geocentricToGeodetic(p, this.es, this.a, this.b);
      return point;
  }

  var names$4 = ["Geocentric", 'geocentric', "geocent", "Geocent"];
  var geocent = {
      init: init$4,
      forward: forward$3,
      inverse: inverse$3,
      names: names$4
  };

  var mode = {
    N_POLE: 0,
    S_POLE: 1,
    EQUIT: 2,
    OBLIQ: 3
  };

  var params = {
    h:     { def: 100000, num: true },           // default is Karman line, no default in PROJ.7
    azi:   { def: 0, num: true, degrees: true }, // default is North
    tilt:  { def: 0, num: true, degrees: true }, // default is Nadir
    long0: { def: 0, num: true },                // default is Greenwich, conversion to rad is automatic
    lat0:  { def: 0, num: true }                 // default is Equator, conversion to rad is automatic
  };

  function init$3() {
    Object.keys(params).forEach(function (p) {
      if (typeof this[p] === "undefined") {
        this[p] = params[p].def;
      } else if (params[p].num && isNaN(this[p])) {
        throw new Error("Invalid parameter value, must be numeric " + p + " = " + this[p]);
      } else if (params[p].num) {
        this[p] = parseFloat(this[p]);
      }
      if (params[p].degrees) {
        this[p] = this[p] * D2R$1;
      }
    }.bind(this));

    if (Math.abs((Math.abs(this.lat0) - HALF_PI)) < EPSLN) {
      this.mode = this.lat0 < 0 ? mode.S_POLE : mode.N_POLE;
    } else if (Math.abs(this.lat0) < EPSLN) {
      this.mode = mode.EQUIT;
    } else {
      this.mode = mode.OBLIQ;
      this.sinph0 = Math.sin(this.lat0);
      this.cosph0 = Math.cos(this.lat0);
    }

    this.pn1 = this.h / this.a;  // Normalize relative to the Earth's radius

    if (this.pn1 <= 0 || this.pn1 > 1e10) {
      throw new Error("Invalid height");
    }

    this.p = 1 + this.pn1;
    this.rp = 1 / this.p;
    this.h1 = 1 / this.pn1;
    this.pfact = (this.p + 1) * this.h1;
    this.es = 0;

    var omega = this.tilt;
    var gamma = this.azi;
    this.cg = Math.cos(gamma);
    this.sg = Math.sin(gamma);
    this.cw = Math.cos(omega);
    this.sw = Math.sin(omega);
  }

  function forward$2(p) {
    p.x -= this.long0;
    var sinphi = Math.sin(p.y);
    var cosphi = Math.cos(p.y);
    var coslam = Math.cos(p.x);
    var x, y;
    switch (this.mode) {
      case mode.OBLIQ:
        y = this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
        break;
      case mode.EQUIT:
        y = cosphi * coslam;
        break;
      case mode.S_POLE:
        y = -sinphi;
        break;
      case mode.N_POLE:
        y = sinphi;
        break;
    }
    y = this.pn1 / (this.p - y);
    x = y * cosphi * Math.sin(p.x);

    switch (this.mode) {
      case mode.OBLIQ:
        y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
        break;
      case mode.EQUIT:
        y *= sinphi;
        break;
      case mode.N_POLE:
        y *= -(cosphi * coslam);
        break;
      case mode.S_POLE:
        y *= cosphi * coslam;
        break;
    }

    // Tilt
    var yt, ba;
    yt = y * this.cg + x * this.sg;
    ba = 1 / (yt * this.sw * this.h1 + this.cw);
    x = (x * this.cg - y * this.sg) * this.cw * ba;
    y = yt * ba;

    p.x = x * this.a;
    p.y = y * this.a;
    return p;
  }

  function inverse$2(p) {
    p.x /= this.a;
    p.y /= this.a;
    var r = { x: p.x, y: p.y };

    // Un-Tilt
    var bm, bq, yt;
    yt = 1 / (this.pn1 - p.y * this.sw);
    bm = this.pn1 * p.x * yt;
    bq = this.pn1 * p.y * this.cw * yt;
    p.x = bm * this.cg + bq * this.sg;
    p.y = bq * this.cg - bm * this.sg;

    var rh = hypot(p.x, p.y);
    if (Math.abs(rh) < EPSLN) {
      r.x = 0;
      r.y = p.y;
    } else {
      var cosz, sinz;
      sinz = 1 - rh * rh * this.pfact;
      sinz = (this.p - Math.sqrt(sinz)) / (this.pn1 / rh + rh / this.pn1);
      cosz = Math.sqrt(1 - sinz * sinz);
      switch (this.mode) {
        case mode.OBLIQ:
          r.y = Math.asin(cosz * this.sinph0 + p.y * sinz * this.cosph0 / rh);
          p.y = (cosz - this.sinph0 * Math.sin(r.y)) * rh;
          p.x *= sinz * this.cosph0;
          break;
        case mode.EQUIT:
          r.y = Math.asin(p.y * sinz / rh);
          p.y = cosz * rh;
          p.x *= sinz;
          break;
        case mode.N_POLE:
          r.y = Math.asin(cosz);
          p.y = -p.y;
          break;
        case mode.S_POLE:
          r.y = -Math.asin(cosz);
          break;
      }
      r.x = Math.atan2(p.x, p.y);
    }

    p.x = r.x + this.long0;
    p.y = r.y;
    return p;
  }

  var names$3 = ["Tilted_Perspective", "tpers"];
  var tpers = {
    init: init$3,
    forward: forward$2,
    inverse: inverse$2,
    names: names$3
  };

  function init$2() {
      this.flip_axis = (this.sweep === 'x' ? 1 : 0);
      this.h = Number(this.h);
      this.radius_g_1 = this.h / this.a;

      if (this.radius_g_1 <= 0 || this.radius_g_1 > 1e10) {
          throw new Error();
      }

      this.radius_g = 1.0 + this.radius_g_1;
      this.C = this.radius_g * this.radius_g - 1.0;

      if (this.es !== 0.0) {
          var one_es = 1.0 - this.es;
          var rone_es = 1 / one_es;

          this.radius_p = Math.sqrt(one_es);
          this.radius_p2 = one_es;
          this.radius_p_inv2 = rone_es;

          this.shape = 'ellipse'; // Use as a condition in the forward and inverse functions.
      } else {
          this.radius_p = 1.0;
          this.radius_p2 = 1.0;
          this.radius_p_inv2 = 1.0;

          this.shape = 'sphere';  // Use as a condition in the forward and inverse functions.
      }

      if (!this.title) {
          this.title = "Geostationary Satellite View";
      }
  }

  function forward$1(p) {
      var lon = p.x;
      var lat = p.y;
      var tmp, v_x, v_y, v_z;
      lon = lon - this.long0;

      if (this.shape === 'ellipse') {
          lat = Math.atan(this.radius_p2 * Math.tan(lat));
          var r = this.radius_p / hypot(this.radius_p * Math.cos(lat), Math.sin(lat));

          v_x = r * Math.cos(lon) * Math.cos(lat);
          v_y = r * Math.sin(lon) * Math.cos(lat);
          v_z = r * Math.sin(lat);

          if (((this.radius_g - v_x) * v_x - v_y * v_y - v_z * v_z * this.radius_p_inv2) < 0.0) {
              p.x = Number.NaN;
              p.y = Number.NaN;
              return p;
          }

          tmp = this.radius_g - v_x;
          if (this.flip_axis) {
              p.x = this.radius_g_1 * Math.atan(v_y / hypot(v_z, tmp));
              p.y = this.radius_g_1 * Math.atan(v_z / tmp);
          } else {
              p.x = this.radius_g_1 * Math.atan(v_y / tmp);
              p.y = this.radius_g_1 * Math.atan(v_z / hypot(v_y, tmp));
          }
      } else if (this.shape === 'sphere') {
          tmp = Math.cos(lat);
          v_x = Math.cos(lon) * tmp;
          v_y = Math.sin(lon) * tmp;
          v_z = Math.sin(lat);
          tmp = this.radius_g - v_x;

          if (this.flip_axis) {
              p.x = this.radius_g_1 * Math.atan(v_y / hypot(v_z, tmp));
              p.y = this.radius_g_1 * Math.atan(v_z / tmp);
          } else {
              p.x = this.radius_g_1 * Math.atan(v_y / tmp);
              p.y = this.radius_g_1 * Math.atan(v_z / hypot(v_y, tmp));
          }
      }
      p.x = p.x * this.a;
      p.y = p.y * this.a;
      return p;
  }

  function inverse$1(p) {
      var v_x = -1;
      var v_y = 0.0;
      var v_z = 0.0;
      var a, b, det, k;

      p.x = p.x / this.a;
      p.y = p.y / this.a;

      if (this.shape === 'ellipse') {
          if (this.flip_axis) {
              v_z = Math.tan(p.y / this.radius_g_1);
              v_y = Math.tan(p.x / this.radius_g_1) * hypot(1.0, v_z);
          } else {
              v_y = Math.tan(p.x / this.radius_g_1);
              v_z = Math.tan(p.y / this.radius_g_1) * hypot(1.0, v_y);
          }

          var v_zp = v_z / this.radius_p;
          a = v_y * v_y + v_zp * v_zp + v_x * v_x;
          b = 2 * this.radius_g * v_x;
          det = (b * b) - 4 * a * this.C;

          if (det < 0.0) {
              p.x = Number.NaN;
              p.y = Number.NaN;
              return p;
          }

          k = (-b - Math.sqrt(det)) / (2.0 * a);
          v_x = this.radius_g + k * v_x;
          v_y *= k;
          v_z *= k;

          p.x = Math.atan2(v_y, v_x);
          p.y = Math.atan(v_z * Math.cos(p.x) / v_x);
          p.y = Math.atan(this.radius_p_inv2 * Math.tan(p.y));
      } else if (this.shape === 'sphere') {
          if (this.flip_axis) {
              v_z = Math.tan(p.y / this.radius_g_1);
              v_y = Math.tan(p.x / this.radius_g_1) * Math.sqrt(1.0 + v_z * v_z);
          } else {
              v_y = Math.tan(p.x / this.radius_g_1);
              v_z = Math.tan(p.y / this.radius_g_1) * Math.sqrt(1.0 + v_y * v_y);
          }

          a = v_y * v_y + v_z * v_z + v_x * v_x;
          b = 2 * this.radius_g * v_x;
          det = (b * b) - 4 * a * this.C;
          if (det < 0.0) {
              p.x = Number.NaN;
              p.y = Number.NaN;
              return p;
          }

          k = (-b - Math.sqrt(det)) / (2.0 * a);
          v_x = this.radius_g + k * v_x;
          v_y *= k;
          v_z *= k;

          p.x = Math.atan2(v_y, v_x);
          p.y = Math.atan(v_z * Math.cos(p.x) / v_x);
      }
      p.x = p.x + this.long0;
      return p;
  }

  var names$2 = ["Geostationary Satellite View", "Geostationary_Satellite", "geos"];
  var geos = {
      init: init$2,
      forward: forward$1,
      inverse: inverse$1,
      names: names$2,
  };

  /**
   * Copyright 2018 Bernie Jenny, Monash University, Melbourne, Australia.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Equal Earth is a projection inspired by the Robinson projection, but unlike
   * the Robinson projection retains the relative size of areas. The projection
   * was designed in 2018 by Bojan Savric, Tom Patterson and Bernhard Jenny.
   *
   * Publication:
   * Bojan Savric, Tom Patterson & Bernhard Jenny (2018). The Equal Earth map
   * projection, International Journal of Geographical Information Science,
   * DOI: 10.1080/13658816.2018.1504949
   *
   * Code released August 2018
   * Ported to JavaScript and adapted for mapshaper-proj by Matthew Bloch August 2018
   * Modified for proj4js by Andreas Hocevar by Andreas Hocevar March 2024
   */


  var A1 = 1.340264,
      A2 = -0.081106,
      A3 = 0.000893,
      A4 = 0.003796,
      M = Math.sqrt(3) / 2.0;

  function init$1() {
    this.es = 0;
    this.long0 = this.long0 !== undefined ? this.long0 : 0;
  }

  function forward(p) {
    var lam = adjust_lon(p.x - this.long0);
    var phi = p.y;
    var paramLat = Math.asin(M * Math.sin(phi)),
    paramLatSq = paramLat * paramLat,
    paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
    p.x = lam * Math.cos(paramLat) /
    (M * (A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq)));
    p.y = paramLat * (A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq));

    p.x = this.a * p.x + this.x0;
    p.y = this.a * p.y + this.y0;
    return p;
  }

  function inverse(p) {
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;

    var EPS = 1e-9,
        NITER = 12,
        paramLat = p.y,
        paramLatSq, paramLatPow6, fy, fpy, dlat, i;

    for (i = 0; i < NITER; ++i) {
      paramLatSq = paramLat * paramLat;
      paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
      fy = paramLat * (A1 + A2 * paramLatSq + paramLatPow6 * (A3 + A4 * paramLatSq)) - p.y;
      fpy = A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq);
      paramLat -= dlat = fy / fpy;
      if (Math.abs(dlat) < EPS) {
          break;
      }
    }
    paramLatSq = paramLat * paramLat;
    paramLatPow6 = paramLatSq * paramLatSq * paramLatSq;
    p.x = M * p.x * (A1 + 3 * A2 * paramLatSq + paramLatPow6 * (7 * A3 + 9 * A4 * paramLatSq)) /
            Math.cos(paramLat);
    p.y = Math.asin(Math.sin(paramLat) / M);

    p.x = adjust_lon(p.x + this.long0);
    return p;
  }

  var names$1 = ["eqearth", "Equal Earth", "Equal_Earth"];
  var eqearth = {
    init: init$1,
    forward: forward,
    inverse: inverse,
    names: names$1
  };

  var EPS10 = 1e-10;

  function init() {
    var c;

    this.phi1 = this.lat1;
    if (Math.abs(this.phi1) < EPS10) {
      throw new Error();
    }
    if (this.es) {
      this.en = pj_enfn(this.es);
      this.m1 = pj_mlfn(this.phi1, this.am1 = Math.sin(this.phi1),
        c = Math.cos(this.phi1), this.en);
      this.am1 = c / (Math.sqrt(1 - this.es * this.am1 * this.am1) * this.am1);
      this.inverse = e_inv;
      this.forward = e_fwd;
    } else {
      if (Math.abs(this.phi1) + EPS10 >= HALF_PI) {
        this.cphi1 = 0;
      }
      else {
        this.cphi1 = 1 / Math.tan(this.phi1);
      }
      this.inverse = s_inv;
      this.forward = s_fwd;
    }
  }

  function e_fwd(p) {
    var lam = adjust_lon(p.x - (this.long0 || 0));
    var phi = p.y;
    var rh, E, c;
    rh = this.am1 + this.m1 - pj_mlfn(phi, E = Math.sin(phi), c = Math.cos(phi), this.en);
    E = c * lam / (rh * Math.sqrt(1 - this.es * E * E));
    p.x = rh * Math.sin(E);
    p.y = this.am1 - rh * Math.cos(E);

    p.x = this.a * p.x + (this.x0 || 0);
    p.y = this.a * p.y + (this.y0 || 0);
    return p;
  }

  function e_inv(p) {
    p.x = (p.x - (this.x0 || 0)) / this.a;
    p.y = (p.y - (this.y0 || 0)) / this.a;

    var s, rh, lam, phi;
    rh = hypot(p.x, p.y = this.am1 - p.y);
    phi = pj_inv_mlfn(this.am1 + this.m1 - rh, this.es, this.en);
    if ((s = Math.abs(phi)) < HALF_PI) {
      s = Math.sin(phi);
      lam = rh * Math.atan2(p.x, p.y) * Math.sqrt(1 - this.es * s * s) / Math.cos(phi);
    } else if (Math.abs(s - HALF_PI) <= EPS10) {
      lam = 0;
    }
    else {
      throw new Error();
    }
    p.x = adjust_lon(lam + (this.long0 || 0));
    p.y = adjust_lat(phi);
    return p;
  }

  function s_fwd(p) {
    var lam = adjust_lon(p.x - (this.long0 || 0));
    var phi = p.y;
    var E, rh;
    rh = this.cphi1 + this.phi1 - phi;
    if (Math.abs(rh) > EPS10) {
      p.x = rh * Math.sin(E = lam * Math.cos(phi) / rh);
      p.y = this.cphi1 - rh * Math.cos(E);
    } else {
      p.x = p.y = 0;
    }

    p.x = this.a * p.x + (this.x0 || 0);
    p.y = this.a * p.y + (this.y0 || 0);
    return p;
  }

  function s_inv(p) {
    p.x = (p.x - (this.x0 || 0)) / this.a;
    p.y = (p.y - (this.y0 || 0)) / this.a;

    var lam, phi;
    var rh = hypot(p.x, p.y = this.cphi1 - p.y);
    phi = this.cphi1 + this.phi1 - rh;
    if (Math.abs(phi) > HALF_PI) {
      throw new Error();
    }
    if (Math.abs(Math.abs(phi) - HALF_PI) <= EPS10) {
      lam = 0;
    } else {
      lam = rh * Math.atan2(p.x, p.y) / Math.cos(phi);
    }
    p.x = adjust_lon(lam + (this.long0 || 0));
    p.y = adjust_lat(phi);
    return p;
  }

  var names = ["bonne", "Bonne (Werner lat_1=90)"];
  var bonne = {
    init: init,
    names: names
  };

  function includedProjections(proj4){
    proj4.Proj.projections.add(tmerc);
    proj4.Proj.projections.add(etmerc);
    proj4.Proj.projections.add(utm);
    proj4.Proj.projections.add(sterea);
    proj4.Proj.projections.add(stere);
    proj4.Proj.projections.add(somerc);
    proj4.Proj.projections.add(omerc);
    proj4.Proj.projections.add(lcc);
    proj4.Proj.projections.add(krovak);
    proj4.Proj.projections.add(cass);
    proj4.Proj.projections.add(laea);
    proj4.Proj.projections.add(aea);
    proj4.Proj.projections.add(gnom);
    proj4.Proj.projections.add(cea);
    proj4.Proj.projections.add(eqc);
    proj4.Proj.projections.add(poly);
    proj4.Proj.projections.add(nzmg);
    proj4.Proj.projections.add(mill);
    proj4.Proj.projections.add(sinu);
    proj4.Proj.projections.add(moll);
    proj4.Proj.projections.add(eqdc);
    proj4.Proj.projections.add(vandg);
    proj4.Proj.projections.add(aeqd);
    proj4.Proj.projections.add(ortho);
    proj4.Proj.projections.add(qsc);
    proj4.Proj.projections.add(robin);
    proj4.Proj.projections.add(geocent);
    proj4.Proj.projections.add(tpers);
    proj4.Proj.projections.add(geos);
    proj4.Proj.projections.add(eqearth);
    proj4.Proj.projections.add(bonne);
  }

  proj4.defaultDatum = 'WGS84'; //default datum
  proj4.Proj = Projection;
  proj4.WGS84 = new proj4.Proj('WGS84');
  proj4.Point = Point;
  proj4.toPoint = common;
  proj4.defs = defs;
  proj4.nadgrid = nadgrid;
  proj4.transform = transform;
  proj4.mgrs = mgrs;
  proj4.version = '__VERSION__';
  includedProjections(proj4);

  const WME_LAYER_NAMES = {
      NODES: "nodes",
      SEGMENTS: "segments",
      VENUES: "venues"
  };
  const sScriptName = GM_info.script.name;
  GM_info.script.version;
  let wmeSDK;
  let _settings = {};
  const _SETTINGS_STORAGE_NAME = "wme-ut-kadastrs";
  const mDefaultScriptSettings = {
      checkOutdoorsFeatures: false,
      validateKorpussInHN: true
  };
  const aExcludedFeatures = [
      "PARK",
      "PLAYGROUND",
      "BEACH",
      "SPORTS_COURT",
      "GOLF_COURSE",
      "PLAZA",
      "PROMENADE",
      "POOL",
      "SCENIC_LOOKOUT_VIEWPOINT",
      "SKI_AREA",
      "ISLAND",
      "SEA_LAKE_POOL",
      "RIVER_STREAM",
      "FOREST_GROVE",
      "FARM",
      "CANAL",
      "SWAMP_MARSH",
      "DAM"
  ];
  let aFeaturesForLayerNewSDK = [];
  let aSDKWazeHouseNumbers = [];
  let aGreenHighlightVenues = [];
  let aGreenDashedHighlightVenues = [];
  let aYellowHighlightVenues = [];
  let aYellowDashedHighlightVenues = [];
  let aRedHighlightVenues = [];
  let aRedDashedHighlightVenues = [];
  let aAllFetchedWazeVenues;
  let aInvalidWazeVenues;
  let aInvalidWazeVenues2;
  let aAllKadastrsFetchedAddresses_11 = [];
  let aWMEValidAddressVenues = [];
  let aWMEPolygonHighlightBlueFeatures = [];
  let aFetchedAddressesNotPresentInWME_21 = [];
  let iPopupTimeout;
  let $KadastrsMenuPopupDiv;
  let aVasarnicas = [];
  let mKadastrsFeaturesData = {};
  function fetchSheetData() {
      const SHEET_ID = "1W230EX3e0ECeF44Ls0GtvI_Iwn9tceidJYT7T4vjJJw";
      const SHEET_NAME = "Sheet1";
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
      GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: response => {
              if (response.status === 200) {
                  const csvData = response.responseText;
                  const aRows = csvData.trim().split("\n");
                  const aParsedResult = aRows.slice(1).map(row => {
                      const aCols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                      return {
                          name: aCols[0].replace(/^"(.*)"$/, "$1").trim(),
                          parent: aCols[1].replace(/^"(.*)"$/, "$1").trim()
                      };
                  });
                  aVasarnicas = aParsedResult;
              }
              else {
                  console.error("Failed to fetch data:", response);
              }
          }
      });
  }
  function createElem(type, attrs = {}, eventListener = {}) {
      const oElement = document.createElement(type);
      for (const [sKey, vValue] of Object.entries(attrs)) {
          if (sKey in oElement) {
              oElement[sKey] = vValue;
          }
          else if (sKey === "classList" && Array.isArray(vValue)) {
              oElement.classList.add(...vValue);
          }
          else {
              oElement.setAttribute(sKey, vValue);
          }
      }
      for (const [sEventType, fnHandler] of Object.entries(eventListener)) {
          if (fnHandler) {
              oElement.addEventListener(sEventType, fnHandler);
          }
      }
      return oElement;
  }
  function getOLMapExtent() {
      let extent = W.map.getExtent();
      if (Array.isArray(extent)) {
          extent = new OpenLayers.Bounds(extent);
      }
      return extent;
  }
  function addKFetchButton() {
      const divOverlayMain = document.getElementById("overlay-buttons-region");
      if (!divOverlayMain) {
          return;
      }
      const mStyle = {
          position: "absolute",
          top: "0px",
          right: "60px",
          width: "44px",
          zIndex: "1"
      };
      let mainDiv = document.getElementById("ursusButtonsMenu");
      let btnDiv = mainDiv?.querySelector("div");
      if (!btnDiv) {
          btnDiv = createElem("div", {
              classList: ["overlay-buttons-container top"]
          });
      }
      if (!mainDiv) {
          mainDiv = createElem("div", { id: "ursusButtonsMenu" });
          Object.assign(mainDiv.style, mStyle);
          mainDiv.appendChild(btnDiv);
          divOverlayMain.appendChild(mainDiv);
      }
      const owz = createElem("wz-button", {
          color: "clear-icon",
          classList: ["overlay-button"],
          disabled: "false"
      }, { click: fetchKadastrsData });
      const h6 = createElem("h6", {
          classList: ["w-icon"],
          textContent: "K"
      });
      h6.style["font-family"] = "Waze Boing Medium";
      h6.style["line-height"] = "24px";
      owz.appendChild(h6);
      btnDiv.appendChild(owz);
  }
  function generateDomElements(aLayersConfig, oDOMContainer) {
      aLayersConfig.forEach((mLayerConfig) => {
          mLayerConfig.elements.forEach((item) => {
              const $HTMLElement = createElem(item.type, item.attributes, item.events || []);
              oDOMContainer.appendChild($HTMLElement);
              if (item.triggerChangeEvent) {
                  $HTMLElement.dispatchEvent(new Event("change"));
              }
          });
          console.log(`Elements for '${mLayerConfig.id}' created. URL: ${mLayerConfig.url}`);
          const br = createElem("br");
          oDOMContainer.append(br);
      });
  }
  async function saveSettingsToStorage() {
      if (localStorage) {
          _settings.lastSaved = Date.now();
          localStorage.setItem(_SETTINGS_STORAGE_NAME, JSON.stringify(_settings));
      }
  }
  function cbLayerChange(oEvent) {
      if (oEvent.target instanceof HTMLInputElement) {
          const sSetting = oEvent.target.getAttribute("boundSetting");
          if (sSetting) {
              _settings[sSetting] = oEvent.target.checked;
          }
          saveSettingsToStorage();
      }
  }
  async function initScriptTab() {
      const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
      tabLabel.innerText = "WME UT Kadastrs";
      tabLabel.title = "WME UT Kadastrs";
      const description = document.createElement("p");
      description.style.fontWeight = "bold";
      description.textContent = "WME UT Kadastrs";
      tabPane.appendChild(description);
      let buttonContainer = createElem("div", {
          class: "controls-container"
      });
      const aSettingsConfig = [
          {
              id: "utk-checkOutdoorsFeatures",
              elements: [
                  {
                      type: "input",
                      attributes: {
                          type: "checkbox",
                          id: "cbCheckOutdoorsFeatures",
                          title: "Check Outdoors and Natural Features",
                          checked: _settings.checkOutdoorsFeatures,
                          boundSetting: "checkOutdoorsFeatures"
                      },
                      events: {
                          change: cbLayerChange
                      },
                      triggerChangeEvent: false
                  },
                  {
                      type: "label",
                      attributes: {
                          for: "cbCheckOutdoorsFeatures",
                          textContent: "Check Outdoors and Natural Features"
                      }
                  }
              ]
          },
          {
              id: "utk-validateKorpussInHN",
              elements: [
                  {
                      type: "input",
                      attributes: {
                          type: "checkbox",
                          id: "cbValidateKorpussInHN",
                          title: "Check Outdoors and Natural Features",
                          checked: _settings.validateKorpussInHN,
                          boundSetting: "validateKorpussInHN"
                      },
                      events: {
                          change: cbLayerChange
                      },
                      triggerChangeEvent: false
                  },
                  {
                      type: "label",
                      attributes: {
                          for: "cbValidateKorpussInHN",
                          textContent: "Validate '-\\k-' in House Numbers"
                      }
                  }
              ]
          }
      ];
      generateDomElements(aSettingsConfig, buttonContainer);
      const fnUndoEvilClick = () => {
          wmeSDK.Editing.undoAll();
      };
      const fnEvilClick = async () => {
          let aAllStrangeVenues = [...aInvalidWazeVenues2, ...aInvalidWazeVenues];
          for (const oStrangeVenue of aAllStrangeVenues) {
              if (oStrangeVenue.geometry.type !== "Polygon")
                  continue;
              const oFoundKadastrsFeature = aFeaturesForLayerNewSDK.find(oKadastrsFeature => booleanWithin(oKadastrsFeature.geometry, oStrangeVenue.geometry));
              if (!oFoundKadastrsFeature)
                  continue;
              const WMEAddressParams = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[oFoundKadastrsFeature.id].kadastrs_data, "waze");
              if (!WMEAddressParams)
                  continue;
              let bShouldUpdatePolygon = !(oStrangeVenue.streetID === WMEAddressParams.streetID &&
                  oStrangeVenue.houseNumber === WMEAddressParams.houseNumber);
              const aFoundInvalidHN = aSDKWazeHouseNumbers.filter(oInvalidHN => {
                  const mSegStreet = wmeSDK.DataModel.Segments.getById({ segmentId: oInvalidHN.segmentId });
                  return (booleanWithin(oInvalidHN.geometry, oStrangeVenue.geometry) &&
                      (mSegStreet?.primaryStreetId !== WMEAddressParams.streetID ||
                          oInvalidHN.number !== WMEAddressParams.houseNumber));
              });
              if (aFoundInvalidHN.length === 1) {
                  const oExistingHNs = await wmeSDK.DataModel.HouseNumbers.fetchHouseNumbers({
                      segmentIds: [aFoundInvalidHN[0].segmentId]
                  });
                  let sHouseNumber = WMEAddressParams.houseNumber;
                  const bIsInUse = oExistingHNs.some(oExistingHN => oExistingHN.number === sHouseNumber);
                  if (bIsInUse) {
                      sHouseNumber += "utk";
                  }
                  await wmeSDK.DataModel.HouseNumbers.updateHouseNumber({
                      houseNumberId: aFoundInvalidHN[0].id,
                      number: sHouseNumber
                  });
                  WMEAddressParams.houseNumber = sHouseNumber;
                  WMEAddressParams.name = sHouseNumber;
              }
              const aFoundInvalidResidential = aAllStrangeVenues.filter(oInvalidWazeVenue => oInvalidWazeVenue.categories.length === 1 &&
                  oInvalidWazeVenue.categories[0] === "RESIDENCE_HOME" &&
                  booleanWithin(oInvalidWazeVenue.geometry, oStrangeVenue.geometry) &&
                  (oInvalidWazeVenue.segmentId !== WMEAddressParams.streetID ||
                      oInvalidWazeVenue.houseNumber !== WMEAddressParams.houseNumber));
              if (aFoundInvalidResidential.length === 1) {
                  updateVenue(aFoundInvalidResidential[0].id, WMEAddressParams);
              }
              if (bShouldUpdatePolygon) {
                  updateVenue(oStrangeVenue.id, WMEAddressParams);
              }
          }
          aInvalidWazeVenues = [];
          aAllStrangeVenues = [];
      };
      const oEvilButton = createElem("button", {
          classList: ["btn", "btn-default"],
          title: "Evil Mode",
          textContent: "Evil Mode"
      }, { click: fnEvilClick });
      buttonContainer.append(oEvilButton);
      const oUndoButton = createElem("button", {
          classList: ["btn", "btn-default"],
          title: "Undo Changes",
          textContent: "Undo"
      }, { click: fnUndoEvilClick });
      buttonContainer.append(oUndoButton);
      tabPane.appendChild(buttonContainer);
      wmeSDK.Map.addStyleRuleToLayer({
          layerName: WME_LAYER_NAMES.VENUES,
          styleRules: [
              {
                  predicate: venue => aGreenHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "green",
                      strokeWidth: 3
                  }
              },
              {
                  predicate: venue => aGreenDashedHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "green",
                      strokeWidth: 3,
                      strokeDashstyle: "dashdot"
                  }
              },
              {
                  predicate: venue => aYellowHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "orange",
                      strokeWidth: 3
                  }
              },
              {
                  predicate: venue => aYellowDashedHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "orange",
                      strokeWidth: 3,
                      strokeDashstyle: "dashdot"
                  }
              },
              {
                  predicate: venue => aRedHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "red",
                      strokeWidth: 3
                  }
              },
              {
                  predicate: venue => aRedDashedHighlightVenues.includes(venue.id),
                  style: {
                      strokeColor: "red",
                      strokeWidth: 3,
                      strokeDashstyle: "dashdot"
                  }
              }
          ]
      });
  }
  function readLocalSettings() {
      const sStorageItem = localStorage.getItem(_SETTINGS_STORAGE_NAME);
      if (sStorageItem) {
          const loadedSettings = JSON.parse(sStorageItem);
          _settings = { ...mDefaultScriptSettings, ...loadedSettings };
      }
      else {
          _settings = mDefaultScriptSettings;
          saveSettingsToStorage();
      }
  }
  function initScript() {
      if (!unsafeWindow.getWmeSdk) {
          throw new Error("SDK not available");
      }
      wmeSDK = unsafeWindow.getWmeSdk({
          scriptId: "wmeUTKadastrs",
          scriptName: "UrSuS Tools: Kadastrs"
      });
      void readLocalSettings();
      void initScriptTab();
      if (typeof proj4 === "undefined") {
          const oScript = document.createElement("script");
          oScript.type = "text/javascript";
          oScript.src = "https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js";
          document.getElementsByTagName("head")[0].appendChild(oScript);
      }
      addKFetchButton();
      fetchSheetData();
      wmeSDK.Map.addLayer({
          layerName: "wme-ut-kadastrs-hover",
          styleContext: {
              getLabel: ({ feature }) => feature?.properties.label ?? "",
              getXOffset: ({ feature }) => feature?.properties.xOffset ?? 0,
              getYOffset: ({ feature }) => feature?.properties.yOffset ?? 0
          },
          styleRules: [
              {
                  style: {
                      fillColor: "#00695C",
                      fillOpacity: 0.5,
                      strokeWidth: 9,
                      strokeDashstyle: "longdashdot",
                      strokeColor: "red",
                      label: "",
                      labelYOffset: 45,
                      fontColor: "#FF0",
                      fontWeight: "bold",
                      labelOutlineColor: "#000",
                      labelOutlineWidth: 4,
                      fontSize: "18"
                  }
              }
          ],
          zIndexing: true
      });
      wmeSDK.Map.addLayer({
          layerName: "wme-ut-kadastrs",
          styleContext: {
              getLabel: ({ feature }) => feature?.properties.label ?? "",
              getXOffset: ({ feature }) => feature?.properties.xOffset ?? 0,
              getYOffset: ({ feature }) => feature?.properties.yOffset ?? 0
          },
          styleRules: [
              {
                  style: {
                      label: "K",
                      pointRadius: 12,
                      fillColor: "#00695C",
                      fillOpacity: 0.8,
                      fontColor: "black",
                      labelOutlineColor: "white",
                      labelOutlineWidth: 3,
                      strokeColor: "white"
                  }
              }
          ],
          zIndexing: true
      });
      wmeSDK.Map.addLayer({
          layerName: "wme-ut-kadastrs-lines",
          styleContext: {
              getLabel: ({ feature }) => feature?.properties.label ?? "",
              getXOffset: ({ feature }) => feature?.properties.xOffset ?? 0,
              getYOffset: ({ feature }) => feature?.properties.yOffset ?? 0
          },
          styleRules: [
              {
                  style: {
                      fillColor: "#00695C",
                      fillOpacity: 0.5,
                      strokeWidth: 3,
                      strokeDashstyle: "longdashdot",
                      strokeColor: "blue",
                      label: "",
                      labelYOffset: 45,
                      fontColor: "#FF0",
                      fontWeight: "bold",
                      labelOutlineColor: "#000",
                      labelOutlineWidth: 4,
                      fontSize: "18"
                  }
              }
          ],
          zIndexing: true
      });
      wmeSDK.Map.addLayer({
          layerName: "wme-ut-kadastrs-highlights",
          styleContext: {
              getLabel: ({ feature }) => feature?.properties.label ?? "",
              getXOffset: ({ feature }) => feature?.properties.xOffset ?? 0,
              getYOffset: ({ feature }) => feature?.properties.yOffset ?? 0
          },
          styleRules: [
              {
                  style: {
                      fillColor: "#00695C",
                      fillOpacity: 0.5,
                      strokeWidth: 9,
                      strokeDashstyle: "solid",
                      label: "",
                      labelYOffset: 45,
                      fontColor: "#FF0",
                      fontWeight: "bold",
                      labelOutlineColor: "#000",
                      labelOutlineWidth: 4,
                      fontSize: "18"
                  }
              }
          ],
          zIndexing: true
      });
      wmeSDK.Map.setLayerVisibility({
          layerName: "wme-ut-kadastrs-hover",
          visibility: true
      });
      wmeSDK.Map.setLayerVisibility({
          layerName: "wme-ut-kadastrs-highlights",
          visibility: true
      });
      wmeSDK.Events.trackLayerEvents({ layerName: "wme-ut-kadastrs" });
      wmeSDK.Events.on({
          eventName: "wme-layer-feature-mouse-enter",
          eventHandler: onFeatureHoverEvent
      });
      wmeSDK.Events.on({
          eventName: "wme-layer-feature-mouse-leave",
          eventHandler: onFeatureUnHoverEvent
      });
  }
  void unsafeWindow.SDK_INITIALIZED.then(initScript);
  async function fetchKadastrsData() {
      wazedevtoastr.options = {
          closeButton: false,
          debug: false,
          newestOnTop: false,
          progressBar: false,
          rtl: false,
          positionClass: "toast-bottom-center",
          preventDuplicates: false,
          onclick: null,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut"
      };
      wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: "wme-ut-kadastrs-highlights" });
      if (wmeSDK.Map.getZoomLevel() < 17) {
          WazeWrap.Alerts.warning(sScriptName, `You are on ${wmeSDK.Map.getZoomLevel()} Zoom Level, HouseNumbers won't be fetched!`);
      }
      WazeWrap.Alerts.info(sScriptName, "KadastrsAddress Fetching started");
      aGreenHighlightVenues = [];
      aYellowHighlightVenues = [];
      aRedHighlightVenues = [];
      aGreenDashedHighlightVenues = [];
      aYellowDashedHighlightVenues = [];
      aRedDashedHighlightVenues = [];
      aInvalidWazeVenues = [];
      let sURL = "https://lvmgeoserver.lvm.lv/geoserver/publicwfs/wfs?layer=publicwfs&SERVICE=WFS&REQUEST=GetFeature";
      sURL +=
          "&VERSION=2.0.0&TYPENAMES=publicwfs:arisbuilding&STARTINDEX=0&COUNT=500&SRSNAME=urn:ogc:def:crs:EPSG::3059&BBOX=";
      sURL += getBBox3059();
      sURL += ",urn:ogc:def:crs:EPSG::3059&outputFormat=application/json";
      const sVenueResponseJSON = await makeGetRequest(sURL);
      processFetchedDataNewMode(sVenueResponseJSON);
  }
  async function processFetchedDataNewMode(responseText) {
      const oParser = new OpenLayers.Format.GeoJSON();
      aAllKadastrsFetchedAddresses_11 = oParser.read(responseText);
      WazeWrap.Alerts.info(sScriptName, `${aAllKadastrsFetchedAddresses_11.length} Kadastrs Address Fetched`);
      let sWazeVenueURL = `https://${window.location.hostname}/row-Descartes/app/Features?bbox=${getBBoxv2()}`;
      sWazeVenueURL += "&language=en-GB&v=2&venueLevel=4&venueFilter=1%2C1%2C0%2C0";
      const sVenueResponseJSON = await makeGetRequest(sWazeVenueURL);
      const oParsedObject = JSON.parse(sVenueResponseJSON);
      aAllFetchedWazeVenues = oParsedObject.venues.objects;
      aWMEValidAddressVenues = [];
      aInvalidWazeVenues2 = [];
      WazeWrap.Alerts.info(sScriptName, `${aAllFetchedWazeVenues.length} WME Venues Fetched`);
      aSDKWazeHouseNumbers = [];
      if (wmeSDK.Map.getZoomLevel() >= 17) {
          const aSegments = wmeSDK.DataModel.Segments.getAll().filter((oObject) => oObject.hasHouseNumbers);
          const mBBox = getOLMapExtent();
          const oMapPoly = polygon([
              [
                  [mBBox.left, mBBox.bottom],
                  [mBBox.right, mBBox.bottom],
                  [mBBox.right, mBBox.top],
                  [mBBox.left, mBBox.top],
                  [mBBox.left, mBBox.bottom]
              ]
          ]);
          const aSegmentsOnScreen = aSegments
              .filter(oSegment => booleanWithin(oSegment.geometry, oMapPoly) ||
              booleanIntersects(oSegment.geometry, oMapPoly))
              .map(oSegment => Number(oSegment.id));
          const oResults = await wmeSDK.DataModel.HouseNumbers.fetchHouseNumbers({
              segmentIds: aSegmentsOnScreen
          });
          aSDKWazeHouseNumbers = oResults;
      }
      aFetchedAddressesNotPresentInWME_21 = [];
      aFetchedAddressesNotPresentInWME_21 = [...aAllKadastrsFetchedAddresses_11];
      aAllFetchedWazeVenues.map((oVenue) => {
          let { name: sStreetName, city: sCity } = findStreetName(oVenue.streetID);
          let oAddressRegex;
          if (!oVenue.houseNumber && sStreetName === "") {
              if (oVenue.name) {
                  const sConverted = `"${oVenue.name.replace(", ", '", ')}${sCity !== "" ? '"' : ""}`;
                  oAddressRegex = getRegex([sConverted, sCity]);
              }
          }
          else if (!oVenue.houseNumber) {
              if (sStreetName.slice(-4) === "pag.") {
                  const aAddress = sStreetName.split(", ");
                  sStreetName = `"${aAddress[0]}", ${aAddress[1]}`;
              }
              else {
                  sStreetName = `"${sStreetName}"`;
              }
              oAddressRegex = getRegex([sStreetName, sCity]);
          }
          else {
              let sHouseNumber = oVenue.houseNumber;
              if (!_settings.validateKorpussInHN) {
                  sHouseNumber = oVenue.houseNumber.toUpperCase().replace("-", " k-");
              }
              const bIsVasarnica = aVasarnicas.some(mRecord => mRecord.name === sStreetName && mRecord.parent === sCity);
              if (bIsVasarnica) {
                  oAddressRegex = getRegex([`"${sStreetName} ${sHouseNumber}"`, sCity]);
              }
              else {
                  oAddressRegex = getRegex([`${sStreetName} ${sHouseNumber}`, sCity]);
              }
          }
          if (oAddressRegex) {
              excludeKadastrsAddressConsistentWithWME(oAddressRegex, oVenue);
          }
      });
      WazeWrap.Alerts.info(sScriptName, `${aFetchedAddressesNotPresentInWME_21.length} Kadastrs Addresses Not Present`);
      const aKadastrsAddressesTypes = [];
      const aConvertedAddresses = aAllKadastrsFetchedAddresses_11
          .map(mRowKadastrsAddress => {
          const mKadastrsAddress = convertKadastrsAddressStringToParts(mRowKadastrsAddress.attributes.std, "");
          if (!mKadastrsAddress) {
              return undefined;
          }
          aKadastrsAddressesTypes.push({
              id: mRowKadastrsAddress.id,
              is_vienseta: mKadastrsAddress.isVienseta,
              is_vasarnica: mKadastrsAddress.isVasarnica
          });
          return {
              cityName: mKadastrsAddress.cityName,
              streetName: mKadastrsAddress.streetName,
              houseNumber: mKadastrsAddress.houseNumber,
              name: mKadastrsAddress.name,
              cityId: "",
              streetID: ""
          };
      })
          .filter(oItem => !!oItem);
      const iFailedAddressIndex = populateIds(aConvertedAddresses);
      if (iFailedAddressIndex) {
          const mMissingAddress = aAllKadastrsFetchedAddresses_11[iFailedAddressIndex];
          const aLonLat = proj4("EPSG:3059", "EPSG:4326", [mMissingAddress.geometry.x, mMissingAddress.geometry.y]);
          wmeSDK.Map.setMapCenter({
              lonLat: { lon: aLonLat[0], lat: aLonLat[1] },
              zoomLevel: 19
          });
      }
      const aValidVenueIds = new Set(aWMEValidAddressVenues.map(v => v.id));
      aInvalidWazeVenues = aAllFetchedWazeVenues.filter(venue => !aValidVenueIds.has(venue.id));
      if (!_settings.validateKorpussInHN) {
          aInvalidWazeVenues = aInvalidWazeVenues.filter(mVenue => {
              return !aConvertedAddresses.some(mConvertedAddress => {
                  const sHN = mConvertedAddress.houseNumber.includes(" k-")
                      ? mConvertedAddress.houseNumber.replace(" k-", "-")
                      : mConvertedAddress.houseNumber;
                  return (mVenue.streetID === mConvertedAddress.streetID &&
                      mVenue.houseNumber?.toUpperCase() === sHN.toUpperCase());
              });
          });
      }
      WazeWrap.Alerts.info(sScriptName, `${aInvalidWazeVenues.length} WME Venues with incorrect or missing Addresses`);
      aSDKWazeHouseNumbers.map(oSDKWazeHouseNumber => {
          const mSegStreet = wmeSDK.DataModel.Segments.getById({ segmentId: oSDKWazeHouseNumber.segmentId });
          if (!mSegStreet?.primaryStreetId) {
              return;
          }
          const { name: sStreetName, city: sCity } = findStreetName(mSegStreet.primaryStreetId);
          const bIsVasarnica = aVasarnicas.some(mRecord => mRecord.name === sStreetName && mRecord.parent === sCity);
          let oAddressRegex;
          if (bIsVasarnica) {
              oAddressRegex = getRegex([`"${sStreetName} ${oSDKWazeHouseNumber.number.toUpperCase()}"`, sCity]);
          }
          else {
              oAddressRegex = getRegex([`${sStreetName} ${oSDKWazeHouseNumber.number.toUpperCase()}`, sCity]);
          }
          excludeKadastrsAddressConsistentWithWME(oAddressRegex, oSDKWazeHouseNumber);
      });
      addKadastrsLayerWithFeatures(aAllKadastrsFetchedAddresses_11, aKadastrsAddressesTypes);
      if (!_settings.checkOutdoorsFeatures) {
          aInvalidWazeVenues = aInvalidWazeVenues.filter(oVenue => !aExcludedFeatures.includes(oVenue.categories[0]));
      }
      const mBBox = getOLMapExtent();
      const oMapPoly = polygon([
          [
              [mBBox.left, mBBox.bottom],
              [mBBox.right, mBBox.bottom],
              [mBBox.right, mBBox.top],
              [mBBox.left, mBBox.top],
              [mBBox.left, mBBox.bottom]
          ]
      ]);
      const aInvalidVenuesFullyOnScreen = aInvalidWazeVenues.filter(oVenue => booleanWithin(oVenue.geometry, oMapPoly));
      aInvalidVenuesFullyOnScreen.forEach(oWazeVenue => {
          const id = oWazeVenue.id;
          const polygonArea = area(oWazeVenue.geometry);
          if (polygonArea > 510) {
              aRedHighlightVenues.push(id);
          }
          else {
              aRedDashedHighlightVenues.push(id);
          }
      });
      aWMEValidAddressVenues.forEach(oWazeVenue => {
          const oKadastrsFeature = Object.values(mKadastrsFeaturesData).find((mFeature) => mFeature.found_venues?.some(oVenue => oVenue.id === oWazeVenue.id));
          if (oKadastrsFeature.found_hn?.length === 1 && oKadastrsFeature.found_residential?.length === 1) {
              const polygonArea = area(oWazeVenue.geometry);
              if (polygonArea > 510) {
                  aGreenHighlightVenues.push(oWazeVenue.id);
              }
              else {
                  aGreenDashedHighlightVenues.push(oWazeVenue.id);
              }
          }
          else if (oKadastrsFeature.is_vienseta) {
              const polygonArea = area(oWazeVenue.geometry);
              if (polygonArea > 510) {
                  aGreenHighlightVenues.push(oWazeVenue.id);
              }
              else {
                  aGreenDashedHighlightVenues.push(oWazeVenue.id);
              }
          }
          else {
              const polygonArea = area(oWazeVenue.geometry);
              if (polygonArea > 510) {
                  aYellowHighlightVenues.push(oWazeVenue.id);
              }
              else {
                  aYellowDashedHighlightVenues.push(oWazeVenue.id);
              }
              aInvalidWazeVenues2.push(oWazeVenue);
          }
      });
      wmeSDK.Map.redrawLayer({ layerName: "venues" });
  }
  function addKadastrsLayerWithFeatures(aKadastrsFeatures, aKadastrsAddressesTypes) {
      aFeaturesForLayerNewSDK = [];
      mKadastrsFeaturesData = {};
      aKadastrsFeatures.forEach(mFeature => {
          const aCoords = proj4("EPSG:3059", "EPSG:900913", [mFeature.geometry.x, mFeature.geometry.y]);
          mFeature.geometry.x = aCoords[0];
          mFeature.geometry.y = aCoords[1];
          let convertedGeometry = W.userscripts.toGeoJSONGeometry(mFeature.geometry).coordinates;
          const mPointFeature = {
              type: "Feature",
              id: mFeature.id,
              geometry: {
                  type: "Point",
                  coordinates: [convertedGeometry[0], convertedGeometry[1]]
              }
          };
          aFeaturesForLayerNewSDK.push(mPointFeature);
          const mType = aKadastrsAddressesTypes.find(mKadastrsAddressesType => mKadastrsAddressesType.id === mFeature.id);
          mKadastrsFeaturesData[mPointFeature.id] = {
              kadastrs_data: mFeature.attributes.std,
              geometry: mPointFeature.geometry,
              found_venues: mFeature.data.Venues,
              found_residential: mFeature.data.Residential,
              found_hn: mFeature.data.HN,
              is_vienseta: mType.is_vienseta,
              is_vasarnica: mType.is_vasarnica
          };
      });
      wmeSDK.Map.addFeaturesToLayer({ features: aFeaturesForLayerNewSDK, layerName: "wme-ut-kadastrs" });
  }
  function checkTooltip() {
      window.clearTimeout(iPopupTimeout);
  }
  function onFeatureHoverEvent(e) {
      window.clearTimeout(iPopupTimeout);
      const mKadastrsAddress = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[e.featureId].kadastrs_data, "waze");
      if (!mKadastrsAddress) {
          return;
      }
      const placeGeom = mKadastrsFeaturesData[e.featureId].geometry;
      if (!$KadastrsMenuPopupDiv) {
          $KadastrsMenuPopupDiv = createElem("div", {
              id: "kadastrsMenuDiv",
              style: "z-index:9998; visibility:visible; position:absolute; margin: 0px; top: 0px; left: 0px;",
              "data-tippy-root": false
          }, { mouseenter: checkTooltip, mouseleave: hideTooltipAfterDelay });
          Object.assign($KadastrsMenuPopupDiv.style, {
              zIndex: 9998,
              visibility: "visible",
              position: "absolute",
              margin: "0px",
              top: "0px",
              left: "0px"
          });
          W.map.getEl()[0].appendChild($KadastrsMenuPopupDiv);
      }
      const divElemRoot = createElem("div", {
          id: "kadastrsMenuDiv-tooltip",
          classList: ["tippy-box"],
          "data-state": "hidden",
          tabindex: "-1",
          "data-theme": "light-border",
          "data-animation": "fade",
          role: "tooltip",
          "data-placement": "top",
          style: "max-width: 350px; transition-duration:300ms;"
      });
      const divTippyContent = createElem("div", {
          id: "kadastrsMenuDiv-content",
          classList: ["tippy-content"],
          "data-state": "hidden",
          style: "transition-duration: 300ms;"
      });
      const oAddressTextDiv = createElem("div", {
          classList: ["coordinates-wrapper"]
      });
      const oVenuesTextDiv = createElem("div", {
          classList: ["coordinates-wrapper"],
          style: "white-space: pre-wrap;"
      });
      let sVenues = "❌";
      if (mKadastrsFeaturesData[e.featureId].found_venues) {
          sVenues = mKadastrsFeaturesData[e.featureId].found_venues
              .map((oVenue) => {
              const oVenueActual = wmeSDK.DataModel.Venues.getById({ venueId: oVenue.id });
              let sArea = "";
              if (oVenueActual) {
                  sArea = area(oVenueActual.geometry).toFixed(2);
              }
              return `${oVenue.name} (${sArea === "" ? area(oVenue.geometry).toFixed(2) : sArea}m2)`;
          })
              .join("\r\n&bull;");
          if (mKadastrsFeaturesData[e.featureId].found_venues.length > 1) {
              sVenues = "\r\n&bull;" + sVenues + "\r\n";
          }
      }
      oVenuesTextDiv.innerHTML = `Venues: ${sVenues} \n Residential: ${(mKadastrsFeaturesData[e.featureId].found_residential ?? []).length === 1
        ? "✅"
        : mKadastrsFeaturesData[e.featureId].found_residential ?? "❌"} HN: ${(mKadastrsFeaturesData[e.featureId].found_hn ?? []).length === 1
        ? "✅"
        : mKadastrsFeaturesData[e.featureId].found_hn ?? "❌"}`;
      divTippyContent.appendChild(oVenuesTextDiv);
      const oInputForm = createElem("div", {
          classList: ["wz-text-input-inner-container"]
      });
      const oInputInput = createElem("wz-text-input", {
          value: mKadastrsFeaturesData[e.featureId].kadastrs_data
      });
      oInputInput.appendChild(oInputForm);
      oAddressTextDiv.appendChild(oInputInput);
      divTippyContent.appendChild(oAddressTextDiv);
      const mSDKSelection = wmeSDK.Editing.getSelection();
      if (mSDKSelection?.ids.length === 1) {
          const oApplyAddressForm = createElem("div", {
              classList: ["external-providers-control", "form-group"]
          });
          divTippyContent.appendChild(oApplyAddressForm);
          const oApplyAddressFormLabel = createElem("wz-label", {
              "html-for": ""
          });
          oApplyAddressFormLabel.innerText = "Apply Address to selected Venue:";
          oApplyAddressForm.appendChild(oApplyAddressFormLabel);
          const fnFullyApplyToSelectedClick = () => applyAddress(e, "full");
          const oWZButtonFullyApplyToSelectedPlace = createElem("wz-button", {
              color: "secondary",
              size: "sm",
              classList: ["overlay-button"],
              disabled: "false",
              textContent: "Full"
          }, { click: fnFullyApplyToSelectedClick });
          const oWZIconFullyApplyToSelectedPlace = createElem("i", {
              classList: ["w-icon w-icon-location-check-fill"],
              style: "font-size:18px;"
          });
          oWZButtonFullyApplyToSelectedPlace.prepend(oWZIconFullyApplyToSelectedPlace);
          oApplyAddressForm.appendChild(oWZButtonFullyApplyToSelectedPlace);
          const bIsVienseta = mKadastrsFeaturesData[e.featureId].is_vienseta;
          if (bIsVienseta) {
              const fnPasteViensetaAddressClick = () => applyAddress(e, "vienseta");
              const oWZButtonApplyAsViensetaToSelectedPlace = createElem("wz-button", {
                  color: "secondary",
                  size: "sm",
                  classList: ["overlay-button"],
                  disabled: "false",
                  textContent: "Keep Name adding Vienseta"
              }, { click: fnPasteViensetaAddressClick });
              const oWZIconApplyAsViensetaToSelectedPlace = createElem("i", {
                  classList: ["w-icon w-icon-home"],
                  style: "font-size: 18px;"
              });
              oWZButtonApplyAsViensetaToSelectedPlace.prepend(oWZIconApplyAsViensetaToSelectedPlace);
              oApplyAddressForm.appendChild(oWZButtonApplyAsViensetaToSelectedPlace);
          }
          else {
              const fnApplyKeepingNameToSelectedClick = () => applyAddress(e, "");
              const oWZButtonApplyKeepingNameToSelectedPlace = createElem("wz-button", {
                  color: "secondary",
                  size: "sm",
                  classList: ["overlay-button"],
                  disabled: "false",
                  textContent: "Keep Name"
              }, { click: fnApplyKeepingNameToSelectedClick });
              const oWZIconApplyKeepingNameToSelectedPlace = createElem("i", {
                  classList: ["w-icon w-icon-location-fill"],
                  style: "font-size: 18px;"
              });
              oWZButtonApplyKeepingNameToSelectedPlace.prepend(oWZIconApplyKeepingNameToSelectedPlace);
              oApplyAddressForm.appendChild(oWZButtonApplyKeepingNameToSelectedPlace);
          }
      }
      const oCreateVenueForm = createElem("div", {
          classList: ["external-providers-control", "form-group"]
      });
      divTippyContent.appendChild(oCreateVenueForm);
      const oCreateVenueFormLabel = createElem("wz-label", {
          "html-for": ""
      });
      oCreateVenueFormLabel.innerText = "Create Venue:";
      oCreateVenueForm.appendChild(oCreateVenueFormLabel);
      if (!mKadastrsFeaturesData[e.featureId].found_residential) {
          const fnCreateResidentialClick = () => createResidential(e);
          const oWZIconCreateResidential = createElem("i", {
              classList: ["w-icon w-icon-navigation-now-fill"],
              style: "font-size:18px;"
          });
          const oWZButtonCreateResidential = createElem("wz-button", {
              color: "secondary",
              size: "sm",
              classList: ["overlay-button"],
              disabled: "false",
              textContent: "Residential"
          }, { click: fnCreateResidentialClick });
          oWZButtonCreateResidential.prepend(oWZIconCreateResidential);
          oCreateVenueForm.appendChild(oWZButtonCreateResidential);
      }
      if (!mKadastrsFeaturesData[e.featureId].found_hn) {
          const fnCreateHNClick = () => createHN(e);
          const oWZButtonCreateHN = createElem("wz-button", {
              color: "secondary",
              size: "sm",
              classList: ["overlay-button"],
              disabled: "false",
              textContent: "HN"
          }, { click: fnCreateHNClick });
          const oWZIconCreateHN = createElem("i", {
              classList: ["w-icon w-icon-home"],
              style: "font-size:18px;"
          });
          oWZButtonCreateHN.prepend(oWZIconCreateHN);
          oCreateVenueForm.appendChild(oWZButtonCreateHN);
      }
      const fnForceCreateClick = () => createVenue(e);
      const oWZButtonCreatePlace = createElem("wz-button", {
          color: "secondary",
          size: "sm",
          classList: ["overlay-button"],
          disabled: "false",
          textContent: `${mKadastrsFeaturesData[e.featureId].found_venues ? "Force Create Place" : "Place"}`
      }, { click: fnForceCreateClick });
      const oWZIconCreatePlace = createElem("i", {
          classList: ["w-icon w-icon-polygon"],
          style: "font-size:18px;"
      });
      oWZButtonCreatePlace.prepend(oWZIconCreatePlace);
      oCreateVenueForm.appendChild(oWZButtonCreatePlace);
      divElemRoot.appendChild(divTippyContent);
      $KadastrsMenuPopupDiv.replaceChildren(divElemRoot);
      const mPopupPixelPosition = wmeSDK.Map.getMapPixelFromLonLat({
          lonLat: { lon: placeGeom.coordinates[0], lat: placeGeom.coordinates[1] }
      });
      const dataPlacement = "right";
      $KadastrsMenuPopupDiv.style.transform = `translate(${Math.round(mPopupPixelPosition.x + 24)}px, ${Math.round(mPopupPixelPosition.y - 24)}px)`;
      $KadastrsMenuPopupDiv.querySelector("#kadastrsMenuDiv-tooltip")?.setAttribute("data-placement", dataPlacement);
      $KadastrsMenuPopupDiv.querySelector("#kadastrsMenuDiv-tooltip")?.setAttribute("data-state", "visible");
      $KadastrsMenuPopupDiv.querySelector("#kadastrsMenuDiv-content")?.setAttribute("data-state", "visible");
      let aFoundVenues = [];
      if (mKadastrsFeaturesData[e.featureId].found_venues) {
          aFoundVenues = [...aFoundVenues, ...mKadastrsFeaturesData[e.featureId].found_venues];
      }
      if (mKadastrsFeaturesData[e.featureId].found_residential) {
          aFoundVenues = [...aFoundVenues, ...mKadastrsFeaturesData[e.featureId].found_residential];
      }
      if (mKadastrsFeaturesData[e.featureId].found_hn) {
          aFoundVenues = [...aFoundVenues, ...mKadastrsFeaturesData[e.featureId].found_hn];
      }
      const placePoint = placeGeom;
      aFoundVenues.forEach(sFoundVenueKey => {
          highlightVenue2(sFoundVenueKey, "blue");
      });
      aFoundVenues.forEach(sFoundVenueKey => {
          drawConnectionLines(sFoundVenueKey, placePoint);
      });
      setTimeout(() => W.map.getLayerByUniqueName("wme-ut-kadastrs-hover").redraw(), 0);
  }
  function createGeometry(e) {
      const vertex = 0.000196;
      const placeGeom = mKadastrsFeaturesData[e.featureId].geometry;
      const [lon, lat] = placeGeom.coordinates;
      const oRectangle = polygon([
          [
              [lon - vertex, lat - vertex / 2],
              [lon - vertex, lat + vertex / 2],
              [lon + vertex, lat + vertex / 2],
              [lon + vertex, lat - vertex / 2],
              [lon - vertex, lat - vertex / 2]
          ]
      ]);
      const oRotatedRectangle = transformRotate(oRectangle, 10, {
          pivot: centroid(oRectangle).geometry.coordinates
      });
      return oRotatedRectangle;
  }
  function applyAddress(e, sMode) {
      const mAddressBuffer = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[e.featureId].kadastrs_data, "waze");
      if (!mAddressBuffer) {
          return;
      }
      const selection = wmeSDK.Editing.getSelection();
      if (!selection || selection.objectType !== "venue") {
          return;
      }
      if (selection.ids.length > 0) {
          if (sMode === "vienseta") {
              let oStreet = findStreetId(mAddressBuffer.cityName, mAddressBuffer.name);
              if (!oStreet) {
                  oStreet = findStreetId(`${mAddressBuffer.cityName}, ${mAddressBuffer.pagastsName}`, mAddressBuffer.name);
              }
              if (!oStreet) {
                  const oNewStreet = wmeSDK.DataModel.Streets.addStreet({
                      cityId: mAddressBuffer.cityID,
                      streetName: mAddressBuffer.name
                  });
                  updateVenue(selection.ids[0].toString(), { streetID: oNewStreet.id });
              }
              else {
                  updateVenue(selection.ids[0].toString(), { streetID: oStreet.attributes.id });
              }
          }
          else {
              let sStreetID = mAddressBuffer.streetID;
              if (!sStreetID) {
                  let oStreet = findStreetId(mAddressBuffer.cityName, mAddressBuffer.streetName ?? "");
                  if (!oStreet) {
                      oStreet = findStreetId(`${mAddressBuffer.cityName}, ${mAddressBuffer.pagastsName}`, mAddressBuffer.name);
                  }
                  if (oStreet) {
                      sStreetID = oStreet.attributes.id;
                  }
              }
              if (!sStreetID) {
                  const oNewStreet = wmeSDK.DataModel.Streets.addStreet({
                      cityId: mAddressBuffer.cityID,
                      streetName: mAddressBuffer.name
                  });
                  sStreetID = oNewStreet.id;
              }
              if (!sStreetID) {
                  console.log("Error: no Street!");
              }
              updateVenue(selection.ids[0].toString(), {
                  houseNumber: mAddressBuffer.houseNumber,
                  streetID: sStreetID,
                  name: sMode === "full" ? mAddressBuffer.name : undefined
              });
          }
      }
  }
  function updateVenue(sVenueId, mAddressData) {
      if (mAddressData.streetID) {
          wmeSDK.DataModel.Venues.updateAddress({
              venueId: sVenueId,
              houseNumber: mAddressData.houseNumber,
              streetId: mAddressData.streetID
          });
      }
      if (mAddressData.name) {
          try {
              wmeSDK.DataModel.Venues.updateVenue({
                  venueId: sVenueId,
                  name: mAddressData.name,
                  lockRank: 2
              });
          }
          catch (oError) {
          }
      }
  }
  function createResidential(e) {
      const WMEAddressParams = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[e.featureId].kadastrs_data, "waze");
      if (!WMEAddressParams) {
          return;
      }
      const oGeometry = createGeometry(e);
      const addressPoi = centroid(oGeometry.geometry);
      const mAddressPoiPixelPosition = wmeSDK.Map.getMapPixelFromLonLat({
          lonLat: { lon: addressPoi.geometry.coordinates[0], lat: addressPoi.geometry.coordinates[1] }
      });
      mAddressPoiPixelPosition.x += 20;
      mAddressPoiPixelPosition.y -= 20;
      const mMovedcoordinates = wmeSDK.Map.getLonLatFromMapPixel(mAddressPoiPixelPosition);
      const poi = point([mMovedcoordinates.lon, mMovedcoordinates.lat]);
      const sVenueId = wmeSDK.DataModel.Venues.addVenue({
          category: "RESIDENTIAL",
          geometry: poi.geometry
      }).toString();
      updateVenue(sVenueId, WMEAddressParams);
      wmeSDK.Editing.setSelection({
          selection: {
              ids: [sVenueId],
              objectType: "venue"
          }
      });
  }
  function createHN(e) {
      const WMEAddressParams = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[e.featureId].kadastrs_data, "waze");
      if (!WMEAddressParams) {
          return;
      }
      const oGeometry = createGeometry(e);
      const addressPoi = centroid(oGeometry.geometry);
      const mAddressPoiPixelPosition = wmeSDK.Map.getMapPixelFromLonLat({
          lonLat: { lon: addressPoi.geometry.coordinates[0], lat: addressPoi.geometry.coordinates[1] }
      });
      mAddressPoiPixelPosition.x += 20;
      mAddressPoiPixelPosition.y += 20;
      const mMovedcoordinates = wmeSDK.Map.getLonLatFromMapPixel(mAddressPoiPixelPosition);
      const poi = point([mMovedcoordinates.lon, mMovedcoordinates.lat]);
      const aSegmentsWithStreetId = wmeSDK.DataModel.Segments.getAll().filter((oHouseNumber) => oHouseNumber.primaryStreetId === WMEAddressParams.streetID);
      const mBBox = getOLMapExtent();
      const oMapPoly = polygon([
          [
              [mBBox.left, mBBox.bottom],
              [mBBox.right, mBBox.bottom],
              [mBBox.right, mBBox.top],
              [mBBox.left, mBBox.top],
              [mBBox.left, mBBox.bottom]
          ]
      ]);
      const aSegmentsOnScreen = aSegmentsWithStreetId.filter(oSegment => booleanWithin(oSegment.geometry, oMapPoly) || booleanIntersects(oSegment.geometry, oMapPoly));
      const closestSegment = aSegmentsOnScreen.reduce((oClosestSegment, oSegment) => {
          const distA = pointToLineDistance(poi, lineString(oSegment.geometry.coordinates), {
              units: "meters"
          });
          const distB = pointToLineDistance(poi, lineString(oClosestSegment.geometry.coordinates), {
              units: "meters"
          });
          return distA < distB ? oSegment : oClosestSegment;
      });
      wmeSDK.DataModel.HouseNumbers.addHouseNumber({
          segmentId: closestSegment.id,
          number: WMEAddressParams.houseNumber,
          point: poi.geometry
      });
  }
  function createVenue(e) {
      const WMEAddressParams = convertKadastrsAddressStringToParts(mKadastrsFeaturesData[e.featureId].kadastrs_data, "waze");
      if (!WMEAddressParams) {
          alert(`Street  not found on map. Please check if it actually exist ${mKadastrsFeaturesData[e.featureId].kadastrs_data}`);
          return;
      }
      const oGeometry = createGeometry(e);
      const sVenueId = wmeSDK.DataModel.Venues.addVenue({
          category: "OTHER",
          geometry: oGeometry.geometry
      }).toString();
      updateVenue(sVenueId, WMEAddressParams);
      wmeSDK.Editing.setSelection({
          selection: {
              ids: [sVenueId],
              objectType: "venue"
          }
      });
  }
  function drawConnectionLines(foundVenueKey, placePt) {
      var placeGeomTarget = centroid(foundVenueKey.geometry);
      wmeSDK.Map.addFeatureToLayer({
          layerName: "wme-ut-kadastrs-lines",
          feature: {
              id: "line",
              type: "Feature",
              geometry: {
                  type: "LineString",
                  coordinates: [placePt.coordinates, placeGeomTarget.geometry.coordinates]
              }
          }
      });
  }
  function hideTooltipAfterDelay() {
      iPopupTimeout = window.setTimeout(hideCustomPopup, 300);
  }
  function onFeatureUnHoverEvent(e) {
      hideTooltipAfterDelay();
      wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: "wme-ut-kadastrs-lines" });
      wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: "wme-ut-kadastrs-hover" });
      aWMEPolygonHighlightBlueFeatures.forEach(feature => {
          feature.style = null;
      });
      aWMEPolygonHighlightBlueFeatures = [];
  }
  function highlightVenue2(foundVenue, sColor) {
      if (foundVenue.geometry.type === "Polygon") {
          wmeSDK.DataModel.Venues.getById({ venueId: foundVenue.id });
          const oVenue = W.model.venues.getByIds([foundVenue.id]).at(0);
          if (oVenue) {
              const poly = W.userscripts.getFeatureElementByDataModel(oVenue);
              poly?.setAttribute("stroke", sColor );
              poly?.setAttribute("stroke-dasharray", "12 8");
              poly?.setAttribute("stroke-width", "3");
              poly?.setAttribute("fill", "#00695C");
          }
      }
  }
  function hideCustomPopup() {
      if ($KadastrsMenuPopupDiv) {
          $KadastrsMenuPopupDiv.querySelector("#kadastrsMenuDiv-content")?.setAttribute("data-state", "hidden");
          $KadastrsMenuPopupDiv.querySelector("#kadastrsMenuDiv-tooltip")?.setAttribute("data-state", "hidden");
          $KadastrsMenuPopupDiv.replaceChildren();
      }
  }
  function findStreetId(sCityName, sStreetName, bVienseta) {
      return Object.values(W.model.streets.objects).find((street) => {
          if (!W.model.cities.objects[street.attributes.cityID]) {
              console.log("Error: no City");
          }
          if (street.attributes.name === sStreetName &&
              W.model.cities.objects[street.attributes.cityID].attributes.name.includes(sCityName)) {
              return true;
          }
      });
  }
  function populateIds(addresses) {
      const streetCache = {};
      for (const [index, address] of addresses.entries()) {
          if (!streetCache[address.streetName]) {
              const oStreet = findStreetId(address.cityName, address.streetName);
              if (!oStreet && address.streetName !== "") {
                  const sErrorMsg = "Error: Can't find street: " + address.streetName + " in City: " + address.cityName;
                  console.log(sErrorMsg);
                  alert(sErrorMsg);
                  return index;
              }
              if (oStreet) {
                  streetCache[address.streetName] = oStreet.attributes.id;
              }
          }
          address.streetID = streetCache[address.streetName];
      }
      return undefined;
  }
  function convertKadastrsAddressStringToParts(sAddress, sMode) {
      const aAddress = sAddress.split(", ");
      const bNoCity = aAddress[1].slice(-4) === "pag.";
      let sCityName = bNoCity ? "" : aAddress[1];
      const sPagastsName = bNoCity ? aAddress[1] : aAddress[2];
      bNoCity ? aAddress[2] : aAddress[3];
      bNoCity ? aAddress[3] : aAddress[4];
      const sStreetNameOrHN = aAddress[0];
      let sName = "";
      let sHN = "";
      let bVienseta = false;
      let bVasarnica = false;
      if (bNoCity) {
          bVienseta = true;
          sName = `${sStreetNameOrHN.slice(1, -1)}, ${sPagastsName}`;
          const sStreetName = "";
          return {
              cityName: sCityName,
              streetName: sStreetName,
              houseNumber: sHN,
              name: sName,
              isVienseta: bVienseta
          };
      }
      else {
          if (sStreetNameOrHN.startsWith('"') && sStreetNameOrHN.endsWith('"')) {
              sName = sStreetNameOrHN.slice(1, -1);
              const aVasarnica = sName.split(" ");
              const sLast = aVasarnica.pop();
              const sVasarnicaName = aVasarnica.join(" ");
              let bIsVasarnica = aVasarnicas.some(mRecord => mRecord.name === sVasarnicaName && mRecord.parent === aAddress[1]);
              if (!bIsVasarnica) {
                  const sCombinedParent = `${aAddress[1]}, ${aAddress[2]}`;
                  bIsVasarnica = aVasarnicas.some(mRecord => mRecord.name === sVasarnicaName && mRecord.parent === sCombinedParent);
                  if (bIsVasarnica) {
                      sCityName = sCombinedParent;
                  }
              }
              if (bIsVasarnica) {
                  bVasarnica = true;
                  sHN = aVasarnica.length > 0 ? sLast ?? "" : "";
                  sName = sHN;
              }
              else {
                  bVienseta = true;
              }
          }
          else {
              const aStreetNameAndHN = sStreetNameOrHN.split(" ");
              sName = "";
              sHN = aStreetNameAndHN.pop() ?? "";
              if (sHN.includes("k-")) {
                  sHN = `${aStreetNameAndHN.pop()} ${sHN}`;
              }
              sName = sHN;
          }
          const iLastIndex = sStreetNameOrHN.lastIndexOf(" " + sName);
          const sStreetName = sHN === ""
              ? ""
              : iLastIndex === -1
                  ? sStreetNameOrHN
                  : bVasarnica
                      ? sStreetNameOrHN.substring(1, iLastIndex)
                      : sStreetNameOrHN.substring(0, iLastIndex);
          if (sMode !== "waze") {
              return {
                  cityName: sCityName,
                  streetName: bVienseta ? "" : sStreetName,
                  houseNumber: sHN,
                  name: sName,
                  isVienseta: bVienseta,
                  isVasarnica: bVasarnica
              };
          }
          else {
              const oStreet = Object.values(W.model.streets.objects).find((street) => {
                  if (street.attributes.name === sStreetName &&
                      W.model.cities.objects[street.attributes.cityID].attributes.name.includes(sCityName)) {
                      return true;
                  }
              });
              let oCity;
              if (!oStreet) {
                  oCity = Object.values(W.model.cities.objects).find((oCity) => {
                      return oCity.attributes.name === sCityName;
                  });
              }
              return {
                  cityID: oStreet ? oStreet.attributes.cityID : oCity ? oCity.attributes.id : undefined,
                  streetID: oStreet ? oStreet.attributes.id : undefined,
                  houseNumber: sHN,
                  name: sName,
                  cityName: sCityName,
                  pagastsName: sPagastsName
              };
          }
      }
  }
  function makeGetRequest(sURL) {
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: "GET",
              url: sURL,
              onload: response => resolve(response.responseText),
              onerror: error => reject(error)
          });
      });
  }
  function excludeKadastrsAddressConsistentWithWME(oAddressRegex, oVenueOrHouseNumber) {
      const indexToRemove = aFetchedAddressesNotPresentInWME_21.findIndex(mFetchedAddresses => oAddressRegex.test(mFetchedAddresses.attributes.std));
      if (indexToRemove > -1) {
          aFetchedAddressesNotPresentInWME_21.splice(indexToRemove, 1);
      }
      const indexToUpdate = aAllKadastrsFetchedAddresses_11.findIndex(mFetchedAddresses => oAddressRegex.test(mFetchedAddresses.attributes.std));
      if (indexToUpdate > -1) {
          if (oVenueOrHouseNumber.geometry.type === "Point") {
              if (oVenueOrHouseNumber.categories?.[0] === "RESIDENCE_HOME") {
                  if (!aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Residential) {
                      aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Residential = [];
                  }
                  aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Residential.push(oVenueOrHouseNumber);
              }
              else if (oVenueOrHouseNumber.categories) {
                  if (!aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues) {
                      aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues = [];
                  }
                  aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues.push(oVenueOrHouseNumber);
              }
              else {
                  if (!aAllKadastrsFetchedAddresses_11[indexToUpdate].data.HN) {
                      aAllKadastrsFetchedAddresses_11[indexToUpdate].data.HN = [];
                  }
                  aAllKadastrsFetchedAddresses_11[indexToUpdate].data.HN.push(oVenueOrHouseNumber);
              }
          }
          else {
              aWMEValidAddressVenues.push(oVenueOrHouseNumber);
              if (!aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues) {
                  aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues = [];
              }
              aAllKadastrsFetchedAddresses_11[indexToUpdate].data.Venues.push(oVenueOrHouseNumber);
          }
      }
  }
  function getRegex(aStrings) {
      const regexPattern = aStrings.map(v => v).join("\\s*,\\s*");
      return new RegExp(regexPattern);
  }
  function findStreetName(iStreetId) {
      if (!W.model.streets.objects[iStreetId]) {
          return {
              name: "",
              city: ""
          };
      }
      const sName = W.model.streets.objects[iStreetId].attributes.name;
      const iCity = W.model.streets.objects[iStreetId].attributes.cityID;
      const sCity = W.model.cities.objects[iCity].attributes.countryID === 123 ? W.model.cities.objects[iCity].attributes.name : "";
      return {
          name: sName,
          city: sCity
      };
  }
  function getBBoxv2() {
      const mapExtent = W.map.getExtent();
      return mapExtent.toString();
  }
  function getBBox3059() {
      const extent = W.map.getExtent();
      if (Array.isArray(extent)) {
          proj4.defs("EPSG:3059", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
          const aConvertedPoints = [
              ...proj4("EPSG:4326", "EPSG:3059", extent.slice(0, 2)).reverse(),
              ...proj4("EPSG:4326", "EPSG:3059", extent.slice(2, 4)).reverse()
          ];
          const string = aConvertedPoints.join();
          return string;
      }
  }

  exports.WME_LAYER_NAMES = WME_LAYER_NAMES;

  return exports;

})({});
