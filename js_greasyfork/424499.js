// ==UserScript==
// @name         Brazen Paginator
// @namespace    brazenvoid
// @version      3.0.0
// @author       brazenvoid
// @license      GPL-3.0-only
// @description  Helper for client side customized pagination
// ==/UserScript==

class BrazenPaginator
{
  /**
   * @typedef {{itemListSelector: JQuery.Selector, itemSelectors?: JQuery.Selector, lastPageUrl: string,
   *            onGetPageNoFromUrl: PaginatorGetPageNoFromUrlHandler, onGetPageUrlFromPageNo: PaginatorGetPageUrlFromPageNoHandler,
   *            onGetPaginationElementForPageNo: PaginatorGetPaginationElementForPageNoHandler, paginationWrapper: JQuery}} PaginatorConfiguration
   */

  /**
   * @callback PaginatorAfterPaginationEventHandler
   * @param {BrazenPaginator} paginator
   */

  /**
   * @callback PaginatorGetPageNoFromUrlHandler
   * @param {string} pageUrl
   * @param {BrazenPaginator} paginator
   */

  /**
   * @callback PaginatorGetPageUrlFromPageNoHandler
   * @param {number} pageNo
   * @param {BrazenPaginator} paginator
   */

  /**
   * @callback PaginatorGetPaginationElementForPageNoHandler
   * @param {number} pageNo
   * @param {BrazenPaginator} paginator
   */

  /**
   * @type {PaginatorConfiguration}
   * @private
   */
  _config

  /**
   * @type {number}
   * @private
   */
  _currentPageNo = 0

  /**
   * @type {number}
   * @private
   */
  _lastPageNo = 0

  /**
   * @type {PaginatorAfterPaginationEventHandler}
   * @private
   */
  _onAfterPagination = null

  /**
   * @type {boolean}
   * @private
   */
  _pageConcatenated = false

  /**
   * @type {number}
   * @private
   */
  _paginatedPageNo = 0

  /**
   * @type {JQuery}
   * @private
   */
  _targetElement = null

  /**
   * @param {PaginatorConfiguration} configuration
   */
  constructor(configuration)
  {
    this._config = configuration
  }

  _conformUIToNewPaginatedState()
  {
    if (this._pageConcatenated) {
      this._pageConcatenated = false

      let currentPageElement = this.getPaginationElementForPageNo(this._currentPageNo)
      let newSubsequentPageNo = this._paginatedPageNo + 1
      let newSubsequentPageNoUrl = this.getPageUrlFromPageNo(newSubsequentPageNo)

      // Mutate current page no element to show paginated page numbers

      currentPageElement.text(this._currentPageNo + '-' + this._paginatedPageNo)

      // Get next pages' pagination elements

      let currentNextPageElements = currentPageElement.nextAll()

      if (this._paginatedPageNo === this._lastPageNo) {

        // Delete all pagination elements if last page is paginated

        currentNextPageElements.remove()

      } else {

        // Determine whether the paginated page immediately precedes the last page

        if (newSubsequentPageNo !== this._lastPageNo) {

          // If not so, determine whether pagination element for the page following the paginated page exists

          let newSubsequentPageElement = this.getPaginationElementForPageNo(newSubsequentPageNo)
          if (!newSubsequentPageElement.length) {

            // If it does not exist then try getting the old next page no element

            let oldSubsequentPageElement = this.getPaginationElementForPageNo(this._currentPageNo + 1)
            if (oldSubsequentPageElement.length) {

              // If it does exist then mutate it for this purpose

              oldSubsequentPageElement.attr('href', newSubsequentPageNoUrl).text(newSubsequentPageNo)

            } else {

              // If even that does not exist, then clone the less desirable alternative; the last page element and mutate it to this use

              let lastPageElement = this.getPaginationElementForPageNo(this._lastPageNo)
              lastPageElement.clone().insertAfter(currentPageElement).attr('href', newSubsequentPageNoUrl).text(newSubsequentPageNo)

            }
          }

          // Remove any other pagination elements for already paginated pages

          currentNextPageElements.each((index, element) => {
            let paginationLink = $(element)
            let paginationLinkUrl = paginationLink.attr('href')
            if (paginationLinkUrl && this.getPageNoFromUrl(paginationLinkUrl) <= this._paginatedPageNo) {
              paginationLink.remove()
            }
          })
        }
      }
      Utilities.callEventHandler(this._onAfterPagination, [this])
    }
  }

  /**
   * @param {number} threshold
   * @param {number} limit
   * @private
   */
  _loadAndParseNextPage(threshold, limit)
  {
    let lastPageHasNotBeenReached = this._paginatedPageNo < this._lastPageNo
    let paginationLimitHasNotBeenMet = limit > 0 && (this._paginatedPageNo - this._currentPageNo) < limit

    let compliantItemsAreLessThanTheThreshold =
        this._targetElement.find(this._config.itemSelectors + ':not(.' + CLASS_NON_COMPLIANT_ITEM + ')').length < threshold

    if (lastPageHasNotBeenReached && paginationLimitHasNotBeenMet && compliantItemsAreLessThanTheThreshold) {

      this._sandbox.load(this.getPageUrlFromPageNo(++this._paginatedPageNo) + ' ' + this._config.itemListSelector, '', () => {
        this._pageConcatenated = true
        this._sandbox.find(this._config.itemSelectors).insertAfter(this._targetElement.find(this._config.itemSelectors + ':last'))
        this._sandbox.empty()
      })
    } else {
      this._conformUIToNewPaginatedState()
    }
  }

  getCurrentPageNo()
  {
    return this._currentPageNo
  }

  getItemListSelector()
  {
    return this._config.itemListSelector
  }

  getLastPageNo()
  {
    return this._lastPageNo
  }

  /**
   * @param {string} pageUrl
   * @return {number}
   */
  getPageNoFromUrl(pageUrl)
  {
    return this._config.onGetPageNoFromUrl(pageUrl, this)
  }

  /**
   * @param {number} pageNo
   * @return {string}
   */
  getPageUrlFromPageNo(pageNo)
  {
    return this._config.onGetPageUrlFromPageNo(pageNo, this)
  }

  getPaginatedPageNo()
  {
    return this._paginatedPageNo
  }

  /**
   * @param {number} pageNo
   * @return {JQuery}
   */
  getPaginationElementForPageNo(pageNo)
  {
    return this._config.onGetPaginationElementForPageNo(pageNo, this)
  }

  getPaginationWrapper()
  {
    return this._config.paginationWrapper
  }

  initialize()
  {
    this._currentPageNo = this.getPageNoFromUrl(window.location.href)
    this._lastPageNo = this.getPageNoFromUrl(this._config.lastPageUrl)
    this._paginatedPageNo = this._currentPageNo
    this._sandbox = $('<div id="brazen-paginator-sandbox" hidden/>').appendTo('body')
    this._targetElement = $(this._config.itemListSelector + ':first')
    return this
  }

  /**
   * @param {PaginatorAfterPaginationEventHandler} handler
   * @return {this}
   */
  onAfterPagination(handler)
  {
    this._onAfterPagination = handler
    return this
  }

  run(threshold, limit)
  {
    if (this._config.paginationWrapper.length && threshold) {
      this._loadAndParseNextPage(threshold, limit)
    }
    return this
  }
}