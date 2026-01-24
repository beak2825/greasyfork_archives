// ==UserScript==
// @name SearX: Link to proxified image
// @namespace -
// @version 1.1.0
// @description changes original href link of the image to proxified. Instances list updates automatically every 2 weeks
// @author NotYou
// @match *://*/*
// @grant GM.xmlHttpRequest
// @grant GM.setValue
// @grant GM.getValue
// @connect searx.space
// @run-at document-start
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/437299/SearX%3A%20Link%20to%20proxified%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/437299/SearX%3A%20Link%20to%20proxified%20image.meta.js
// ==/UserScript==

!async function () {
    'use strict';

    const getLinkNode = node => {
        if (node.tagName.toLowerCase() === 'a') {
            return node
        } else if (node.tagName.toLowerCase() === 'html' || !node.tagName) {
            return null
        }

        return getLinkNode(node.parentNode)
    }

    const getInstances = async () => {
        return new Promise(async (resolve, reject) => {
            const instances = await GM.getValue('instances', {})
            const instancesLastUpdate = await GM.getValue('instancesLastUpdate', '1970-01-01T00:00:00.000Z')
            const instancesLastUpdateDate = new Date(instancesLastUpdate)

            instancesLastUpdateDate.setDate(instancesLastUpdateDate.getDate() + 14)

            const currentDate = new Date()

            if (currentDate > instancesLastUpdateDate) {
                GM.xmlHttpRequest({
                    url: 'https://searx.space/data/instances.json',
                    responseType: 'json',
                    onload: async ({ response }) => {
                        const instances = Object.keys(response.instances)

                        await GM.setValue('instances', instances)
                        await GM.setValue('instancesLastUpdate', currentDate.toJSON())

                        resolve(instances)
                    },
                    onerror: reject
                })
            } else {
                return resolve(null)
            }
        })
    }

    const instances = await getInstances()

    if (instances === null) return

    const foundHost = instances.find(instance => instance.includes(location.host))

    if (typeof foundHost === 'undefined') return

    document.querySelectorAll('.img-thumbnail, .image-thumbnail, .image_thumbnail').forEach($imageThumb => {
        const $link = getLinkNode($imageThumb)

        if ($link === null) return

        $link.href = $imageThumb.src
    })
}()
