// ==UserScript==
// @name         WME Base
// @version      0.3.1
// @description  Base class for Greasy Fork plugins for Waze Map Editor
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
/* global jQuery */
/* global Settings */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */

class WMEBase {
  /**
   *
   * @param {String} name
   * @param {Object} settings
   */
  constructor (name, settings = null) {
    this.id = name.toLowerCase().replace(' ', '-')
    this.name = name

    /** @type {WmeSDK} */
    this.wmeSDK = getWmeSdk(
      {
        scriptId: this.id,
        scriptName: this.name
      }
    )

    if (settings && settings instanceof Settings) {
      this.settings = settings
    } else if (settings) {
      this.settings = new Settings(name, settings)
    } else {
      this.settings = null
    }

    jQuery(document)
      .on('none.wme', (e) => this.onNone(e))
      .on('segment.wme', (e, el, t) => this.onSegment(e, el, t))
      .on('segments.wme', (e, el, t) => this.onSegments(e, el, t))
      .on('node.wme', (e, el, t) => this.onNode(e, el, t))
      .on('nodes.wme', (e, el, t) => this.onNodes(e, el, t))
      .on('venue.wme', (e, el, t) => this.onVenue(e, el, t))
      .on('venues.wme', (e, el, t) => this.onVenues(e, el, t))
      .on('point.wme', (e, el, t) => this.onPoint(e, el, t))
      .on('place.wme', (e, el, t) => this.onPlace(e, el, t))
      .on('residential.wme', (e, el, t) => this.onResidential(e, el, t))

    jQuery(window).on('beforeunload', (e) => this.onBeforeUnload(e))
  }

  /**
   * Log message with prefix
   * @param {String} message
   * @param {Array} args
   */
  log (message, ...args) {
    console.log(
      '%c' + this.name + ': %c' + message,
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  /**
   * Collapsed group message with prefix
   * @param {String} message
   * @param {Array} args
   */
  group (message, ...args) {
    console.groupCollapsed(
      '%c' + this.name + ': %c' + message,
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  /**
   * Just wrapper for console.groupEnd()
   */
  groupEnd() {
    console.groupEnd()
  }

  /**
   * Handler for window `beforeunload` event
   * @param {jQuery.Event} event
   * @return {void}
   */
  onBeforeUnload (event) {
    if (this.settings) {
      this.settings.save()
    }
  }

  /**
   * Handler for `none.wme` event
   * @param {jQuery.Event} event
   * @return {void}
   */
  onNone (event) {
  }

  /**
   * Handler for `segment.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Segment} model
   * @return {void}
   */
  onSegment (event, element, model) {
  }

  /**
   * Handler for `segments.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array<Segment>} models
   * @return {void}
   */
  onSegments (event, element, models) {
  }

  /**
   * Handler for `node.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Node} model
   * @return {void}
   */
  onNode (event, element, model) {
  }

  /**
   * Handler for `nodes.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array<Node>} models
   * @return {void}
   */
  onNodes (event, element, models) {
  }

  /**
   * Handler for `venue.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onVenue (event, element, model) {
  }

  /**
   * Handler for `venues.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array<Venue>} models
   * @return {void}
   */
  onVenues (event, element, models) {
  }

  /**
   * Handler for `place.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onPlace (event, element, model) {
  }

  /**
   * Handler for `point.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onPoint (event, element, model) {
  }

  /**
   * Handler for `residential.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onResidential (event, element, model) {
  }

  /**
   * Get all available POI except selected categories
   * @param {Array} except
   * @return {Venue[]}
   */
  getAllVenues (except = []) {
    let selected = this.wmeSDK.DataModel.Venues.getAll()
    let rank = this.wmeSDK.State.getUserInfo().rank
    // filter by lock rank
    selected = selected.filter(venue => venue.lockRank <= rank)
    // filter by main category
    if (except.length) {
      selected = selected.filter(venue => except.indexOf(venue.categories[0]) === -1)
    }
    return selected
  }

  /**
   * Get selected Area POI
   * @return {Venue}
   */
  getSelectedVenue (){
    return this.getSelectedVenues()?.[0] ?? null;
  }

  /**
   * Get selected Area POI(s)
   * @return {Venue[]}
   */
  getSelectedVenues () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'venue') {
      return []
    }
    return selection.ids.map((id) => this.wmeSDK.DataModel.Venues.getById( { venueId: id } ))
  }

  /**
   * Get the address of the selected Venue
   * @return {VenueAddress}
   */
  getSelectedVenueAddress () {
    let venue = this.getSelectedVenue()
    if (!venue) {
      return null
    }
    return this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })
  }

  /**
   * Get all available segments except selected road types
   * @param {Array} except
   * @return {Segment[]}
   */
  getAllSegments (except = []) {
    let selected = this.wmeSDK.DataModel.Segments.getAll()
    let rank = this.wmeSDK.State.getUserInfo().rank
    // filter by lock rank
    selected = selected.filter(segment => segment.lockRank <= rank)
    // filter by road type
    if (except.length) {
      selected = selected.filter(segment => except.indexOf(segment.roadType) === -1)
    }
    return selected
  }

  /**
   * Get selected Segment
   * @return {Segment}
   */
  getSelectedSegment () {
    return this.getSelectedSegments()?.[0] ?? null;
  }

  /**
   * Get selected Segments
   * @return {Segment[]}
   */
  getSelectedSegments () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'segment') {
      return []
    }
    return selection.ids.map((id) => this.wmeSDK.DataModel.Segments.getById( { segmentId: id } ))
  }

  /**
   * Get all available nodes
   * @return {Node$1[]}
   */
  getAllNodes (except = []) {
    return this.wmeSDK.DataModel.Nodes.getAll()
  }

  /**
   * Get selected Nodes
   * @return {Node$1}
   */
  getSelectedNode () {
    return this.getSelectedNodes()?.[0] ?? null;
  }

  /**
   * Get selected Nodes
   * @return {Node$1[]}
   */
  getSelectedNodes () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'node') {
      return []
    }
    return selection.ids.map((id) => this.wmeSDK.DataModel.Nodes.getById( { nodeId: id } ))
  }
}
