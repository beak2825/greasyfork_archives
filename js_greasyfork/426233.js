class EventEmitter {
    constructor() {
        this.registry = {}
    }
    addListener(e, r) {
        return this.registry[e] || (this.registry[e] = []), this.registry[e].push(r), {
            remove: () => this.removeListener(e, r)
        }
    }
    once(e, r, t) {
        const s = this.addListener(e, (...e) => {
            s.remove(), r.apply(t, e)
        });
        return s
    }
    removeAllListeners(e) {
        this.registry[e] = []
    }
    removeSubscription(e) {
        e.remove()
    }
    listeners(e) {
        return this.registry[e]
    }
    emit(e, ...r) {
        const t = this.registry[e];
        t && t.forEach(e => e(...r))
    }
    removeListener(e, r) {
        const t = this.registry[e];
        if (!t) return;
        const s = t.indexOf(r); - 1 !== s && (t.splice(s, 1), 0 === t.length && delete this.registry[e])
    }
}