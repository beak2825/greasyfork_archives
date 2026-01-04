// ==UserScript==
// @name         Ray Tracer
// @namespace    http://tampermonkey.net/
// @description  A JavaScript implementation of a ray tracing engine
// @version      1.0
// @author       Psykos
// @match        https://tanktrouble.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530739/Ray%20Tracer.user.js
// @updateURL https://update.greasyfork.org/scripts/530739/Ray%20Tracer.meta.js
// ==/UserScript==
// Core raytracing classes

class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static unitVector(v) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return new Vector3D(v.x / length, v.y / length, v.z / length);
    }
}

class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = Vector3D.unitVector(direction);
    }
}

class Material {
    constructor() {
        this.diffuse = new Vector3D(0.8, 0.8, 0.8); // Default gray color
        this.specular = 0.2;
        this.shininess = 16;
        this.reflectivity = 0.0;
        this.transparency = 0.0;
    }
}

class Sphere {
    constructor(center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material || new Material();
    }

    intersect(ray) {
        const L = Vector3D.subtract(this.center, ray.origin);
        const tca = Vector3D.dotProduct(L, ray.direction);
        
        if (tca < 0) return null;
        
        const d2 = Vector3D.dotProduct(L, L) - tca * tca;
        if (d2 > this.radius * this.radius) return null;
        
        const thc = Math.sqrt(this.radius * this.radius - d2);
        const t0 = tca - thc;
        const t1 = tca + thc;
        
        return t0 < t1 ? t0 : t1;
    }
}

// Raytracing engine class
class RayTracer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.scene = [];
        this.lights = [];
        this.quality = QualityManager.RAYTRACING_QUALITY.high;
    }

    render() {
        const pixels = new Array(this.width * this.height);
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const ray = this.getPrimaryRay(x, y);
                pixels[y * this.width + x] = this.trace(ray, 0);
            }
        }
        
        return pixels;
    }

    getPrimaryRay(x, y) {
        const fovScale = Math.tan(UIConstants.CAMERA_FOV * Math.PI / 360);
        const filmX = (2 * ((x + 0.5) / this.width) - 1) * fovScale;
        const filmY = (1 - 2 * ((y + 0.5) / this.height)) * fovScale * (this.height / this.width);
        
        return new Ray(
            new Vector3D(0, 0, 0),
            new Vector3D(filmX, filmY, -1)
        );
    }

    trace(ray, depth) {
        if (depth >= this.quality.max_bounce_count) {
            return new Vector3D(0, 0, 0);
        }

        let closestHit = null;
        let closestDistance = Infinity;

        for (const object of this.scene) {
            const distance = object.intersect(ray);
            if (distance && distance < closestDistance) {
                closestDistance = distance;
                closestHit = object;
            }
        }

        if (!closestHit) {
            return new Vector3D(0.2, 0.3, 0.5); // Sky color
        }

        const hitPoint = Vector3D.add(
            ray.origin,
            Vector3D.scale(ray.direction, closestDistance)
        );
        
        const normal = this.getNormal(closestHit, hitPoint);
        const material = closestHit.material;
        
        let finalColor = new Vector3D(0, 0, 0);

        // Calculate lighting
        for (const light of this.lights) {
            const lightVector = Vector3D.subtract(light.position, hitPoint);
            const lightRay = new Ray(hitPoint, lightVector);
            
            const lightDistance = Vector3D.dotProduct(lightVector, lightVector);
            const shadowIntensity = this.calculateShadowIntensity(lightRay, lightDistance);
            
            if (shadowIntensity > 0) {
                const diffuse = Math.max(0, Vector3D.dotProduct(normal, lightRay.direction));
                const specular = Math.pow(Math.max(0, Vector3D.dotProduct(normal, lightRay.direction)), material.shininess);
                
                finalColor = Vector3D.add(finalColor, 
                    Vector3D.scale(Vector3D.add(
                        Vector3D.scale(material.diffuse, diffuse),
                        Vector3D.scale(new Vector3D(1, 1, 1), specular * material.specular)
                    ), shadowIntensity * this.quality.reflection_quality));
            }
        }

        // Add ambient light
        finalColor = Vector3D.add(finalColor, 
            Vector3D.scale(material.diffuse, 0.2));

        // Handle reflections
        if (material.reflectivity > 0 && depth < this.quality.max_bounce_count) {
            const reflectedDirection = Vector3D.subtract(
                ray.direction,
                Vector3D.scale(normal, 2 * Vector3D.dotProduct(ray.direction, normal))
            );
            
            const reflectedRay = new Ray(hitPoint, reflectedDirection);
            const reflectedColor = this.trace(reflectedRay, depth + 1);
            
            finalColor = Vector3D.add(
                finalColor,
                Vector3D.scale(reflectedColor, material.reflectivity * this.quality.reflection_quality)
            );
        }

        return finalColor;
    }

    calculateShadowIntensity(ray, lightDistanceSquared) {
        const shadowRay = ray;
        let occluderDistance = Infinity;

        for (const object of this.scene) {
            const distance = object.intersect(shadowRay);
            if (distance && distance < lightDistanceSquared && distance > 0.001) {
                occluderDistance = Math.min(occluderDistance, distance);
            }
        }

        return occluderDistance >= lightDistanceSquared ? 1 : 0;
    }

    getNormal(object, point) {
        return Vector3D.unitVector(Vector3D.subtract(point, object.center));
    }
}

// Usage example
const tracer = new RayTracer(800, 600);

// Add some spheres to the scene
tracer.scene.push(
    new Sphere(
        new Vector3D(0, 0, -5),
        1,
        new Material()
    )
);

// Add a light source
tracer.lights.push({
    position: new Vector3D(-3, 3, -3)
});

// Render the scene
const pixels = tracer.render();