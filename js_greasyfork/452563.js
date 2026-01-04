// ==UserScript==
// @name         WME
// @version      0.0.3
// @description  Helper class for Greasy Fork plugins for Waze Map Editor
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-base/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 8 */

/* global W */

class WME {
  /**
   * Get all available POI except selected categories
   * @param {Array} except
   * @return {Array}
   */
  static getVenues (except = []) {
    let selected = W.model.venues.getObjectArray()
    selected = selected.filter(x => x.isGeometryEditable())
    // filter by main category
    if (except.length) {
      selected = selected.filter(model => except.indexOf(model.getMainCategory()) === -1)
    }
    return selected
  }

  /**
   * Get all available segments except selected road types
   * @param {Array} except
   * @return {Array}
   */
  static getSegments (except = []) {
    let selected = W.model.segments.getObjectArray()
    selected = selected.filter(x => x.isGeometryEditable())
    // filter by road type
    if (except.length) {
      selected = selected.filter(segment => except.indexOf(segment.getRoadType()) === -1)
    }
    return selected
  }

  /**
   * Get selected features which you can(!) edit
   * @returns {Array}
   */
  static getSelected () {
    if (!W.selectionManager.hasSelectedFeatures()) {
      return []
    }
    return W.selectionManager.getSelectedDataModelObjects()
      .filter(x => x.isGeometryEditable())
  }

  /**
   * Get selected Area POI(s)
   * @return {Array}
   */
  static getSelectedVenues () {
    return WME.getSelected().filter(x => x.type === 'venue')
  }

  /**
   * Get selected Area POI
   * @return {Object|null}
   */
  static getSelectedVenue () {
    if (WME.getSelectedVenues().length) {
      return WME.getSelectedVenues()[0]
    }
    return null
  }

  /**
   * Get selected Segments
   * @return {Array}
   */
  static getSelectedSegments () {
    return WME.getSelected().filter(x => x.type === 'segment')
  }

  /**
   * Get selected Segment
   * @return {Object|null}
   */
  static getSelectedSegment () {
    if (WME.getSelectedSegments().length) {
      return WME.getSelectedSegments()[0]
    }
    return null
  }

  /**
   * Get selected Nodes
   * @return {Object}
   */
  static getSelectedNodes () {
    return WME.getSelected().filter(x => x.type === 'node')
  }

  /**
   * Get selected Node
   * @return {Object|null}
   */
  static getSelectedNode () {
    if (WME.getSelectedNodes().length) {
      return WME.getSelectedNodes()[0]
    }
    return null
  }
}
