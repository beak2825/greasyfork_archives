// ==UserScript==
// @name         Movement particles
// @namespace    -
// @version      0.1.2
// @description  Adds particles when walking
// @author       Devil D. Nudo#7346
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456925/Movement%20particles.user.js
// @updateURL https://update.greasyfork.org/scripts/456925/Movement%20particles.meta.js
// ==/UserScript==

(function() {
    function particles() {
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        function getRandomRGBA(alpha) {
            const r = Math.round(255 * Math.random())
            const g = Math.round(255 * Math.random())
            const b = Math.round(255 * Math.random())
            const a = alpha ?? 1

            return `rgba(${r}, ${g}, ${b}, ${a})`
        }

        let lastX = 0
        let lastY = 0

        class Vector {
            constructor(x = 0, y = 0) {
                this.x = x
                this.y = y
            }

            static random2D(angle, length = 1) {
                return new Vector(length * Math.cos(angle), length * Math.sin(angle))
            }

            get magnitude() {
                return Math.sqrt(this.x ** 2 + this.y ** 2)
            }

            setMag(length) {
                return this.normalize().mult(length)
            }

            add(x, y) {
                const vector = new Vector(x, y)

                this.x += vector.x
                this.y += vector.y

                return this
            }

            sub(vector) {
                this.x -= vector.x
                this.y -= vector.y

                return this
            }

            mult(scalar) {
                this.x *= scalar
                this.y *= scalar

                return this
            }

            div(divisor) {
                this.x /= divisor
                this.y /= divisor

                return this
            }

            normalize() {
                const mag = this.magnitude

                if (mag > 0) {
                    this.div(mag)
                }

                return this
            }
        }

        class Physics {
            constructor(x, y, mass = 5, time = 0.9) {
                this.mass = mass
                this.time = time

                this.position = new Vector(x, y)
                this.velocity = new Vector()
                this.acceleration = new Vector()
                this.force = new Vector()
            }

            updatePhysics() {
                this.force.div(this.mass)

                this.acceleration.add(this.force.x, this.force.y)
                this.acceleration.mult(this.time)

                this.velocity.add(this.acceleration.x, this.acceleration.y)
                this.velocity.mult(this.time)

                this.position.add(this.velocity.x, this.velocity.y)
            }
        }

        class Particle extends Physics {
            constructor({ id, scale, color }, context, xOffset, yOffset, myPlayer) {
                super(myPlayer.x, myPlayer.y)

                this.id = id
                this.maxScale = scale
                this.color = color
                this.context = context
                this.xOffset = xOffset
                this.yOffset = yOffset

                this.scale = 0

                this.alpha = 0
                this.maxAlpha = 1

                this.liveTime = getRandom(350, 600)
                this.liveDate = Date.now()

                let mag = getRandom(1, 10)

                const speed = Math.hypot(lastY - myPlayer.y, lastX - myPlayer.x)
                const direction = Math.atan2(lastY - myPlayer.y, lastX - myPlayer.x)
                const point = new Physics(myPlayer.x, myPlayer.y)

                point.velocity.add(speed * Math.cos(direction), speed * Math.sin(direction))

                point.updatePhysics()

                this.moveDir = Math.atan2(point.position.y - myPlayer.y, point.position.x - myPlayer.x)

                if (speed <= 0.15) {
                    mag = 0

                    this.moveDir = 0
                }

                this.velocity = Vector.random2D((this.moveDir - Math.PI / 6) + Math.random() * Math.PI * .35).setMag(mag)

                lastX = myPlayer.x
                lastY = myPlayer.y
            }

            get liveTimer() {
                return Date.now() - this.liveDate
            }

            render() {
                this.context.save()
                this.context.fillStyle = this.color
                this.context.globalAlpha = this.alpha
                this.context.beginPath()
                this.context.arc(this.position.x - this.xOffset, this.position.y - this.yOffset, this.scale, 0, 2 * Math.PI)
                this.context.fill()
                this.context.restore()
            }

            update() {
                this.updatePhysics()

                this.scale = (this.liveTimer / this.liveTime) * this.maxScale
                this.alpha = (this.liveTimer / this.liveTime) * this.maxAlpha

                this.render()

                if (this.liveTimer >= this.liveTime) {
                    _particles.remove(this.id)
                }
            }
        }

        class Particles {
            constructor() {
                this.particles = {}
            }

            get list() {
                return Object.values(this.particles)
            }

            create(be, f, d, R) {
                const id = Date.now() / 111

                this.particles[id] = new Particle({
                    id: id,
                    scale: getRandom(5, 12),
                    color: getRandomRGBA()
                }, be, f, d, R)
            }

            remove(id) {
                delete this.particles[id]
            }

            update(be, f, d, R) {
                this.create(be, f, d, R)

                let i = this.list.length

                while (i--) {
                    this.list[i].update()
                }
            }
        }

        return new Particles()
    }

    function applyRegex(code) {
        code = code.replace(/\,._blank.\)\}/, `,"_blank")};\n${particles.toString()};\n const _particles = particles();\n`)

        const { index } = code.match(/\.drawImage\(\w+\.skull\,/)
        const contextVariable = code.slice(index - 2, index)

        code = code.replace(/\_\.health\>\d/, `;_particles.update(${contextVariable}, f, d, R);_.health>0`)

        return code
    }

    async function loadScript(script) {
        const response = await fetch(script.src)

        let code = await response.text()

        code = applyRegex(code)

        eval(code)
    }


    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT" && /bundle\.js$/.test(node.src)) {
                    observer.disconnect()

                    loadScript(node)

                    node.remove()
                }
            }
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true
    })
})()