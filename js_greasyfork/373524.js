/**
 * Simple Wait For Document Helper
 * by Jixun<https://jixun.moe/>
 */
var waitForDocument = (function () {
  var callbackQueue = []
  var ready = false

  function waitForDocument(callback) {
    if (ready) {
      requestAnimationFrame(callback)
      return
    }

    callbackQueue.push(callback)
  }

  function triggerCallbackQueue() {
    if (ready === true) {
      // Already processed
      return
    }

    ready = true

    // process callback queue
    callbackQueue.forEach(requestAnimationFrame)
    callbackQueue = null

    // remove those listeners
    document.removeEventListener('DOMContentLoaded', triggerCallbackQueue)
    document.removeEventListener('load', triggerCallbackQueue)
  }

  // listen for document loaded events
  document.addEventListener('DOMContentLoaded', triggerCallbackQueue)
  document.addEventListener('load', triggerCallbackQueue)

  // check if document is ready yet
  if (['interactive', 'complete'].indexOf(document.readyState) !== -1) {
    triggerCallbackQueue()
  }

  return waitForDocument
})()
